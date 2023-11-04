import { EventService } from '../core/event.service';
import { ReferenceStateFacade } from '../core/+states/reference-state/reference.state.facade';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import {
  Validators,
  FormControl,
  FormGroup,
  FormArray,
  AbstractControl
} from '@angular/forms';

import { counterRangeValidator } from '../components/counter-input/counter-input.component';
import { take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/core/+states/reference-state/reference.model';
import { Event } from '../event/models/event.model';
import { InputValidators } from '../validators/input-validators';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../components/alert-dialog/alert-dialog.component';
import * as Formatter from '../core/formatter';
import { MegaBoostComponent } from './mega-boost/mega-boost.component';
import { IonContent, ModalController } from '@ionic/angular';
import { LoadingService } from '../core/loading.service';

@Component({
  selector: 'app-create-page',
  templateUrl: './event-create.component.html',
  styleUrls: ['./styles/event-create.component.scss']
})
export class EventCreateComponent implements OnInit {
  private referenceStateFacade = inject(ReferenceStateFacade);
  private eventService = inject(EventService);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private modalCtrl = inject(ModalController);
  private loadingService = inject(LoadingService);

  @ViewChild('content') content!: IonContent;

  private eventId: number | undefined;
  mode: string = 'create';
  minDate: string = '';
  eventCoverPictureUrl: string | undefined;
  categoryList: Category[] = [];
  eventForm: FormGroup = new FormGroup(
    {
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      startTime: new FormControl('', [Validators.required]),
      endTime: new FormControl('', [Validators.required]),
      maxParticipants: new FormControl(1, counterRangeValidator(1, 15)),
      formattedAddress: new FormControl('', [Validators.required]),
      price: new FormControl(0, [
        Validators.required,
        Validators.max(1000000),
        Validators.min(0)
      ]),
      categories: new FormArray([], [Validators.required]),
      isOnline: new FormControl('', [Validators.required])
    },
    [
      InputValidators.startTimeValidate,
      InputValidators.endTimeValidate,
      InputValidators.categoriesValidate
    ]
  );

  isLoading: boolean = false;

  private selectLocation:
    | {
        placeId: string;
        lat: number;
        lng: number;
        formattedAddress: string;
      }
    | undefined;

  get categories(): FormArray {
    return <FormArray>this.eventForm.get('categories');
  }

  get location(): AbstractControl {
    return this.eventForm.get('formattedAddress')!;
  }

  ngOnInit(): void {
    this.referenceStateFacade
      .getCategories()
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.categoryList = result;
          this.categoryList.forEach(() => {
            this.categories.push(new FormControl());
          });
        }
      });
  }

  ionViewWillEnter() {
    this.resetForm();
    this.route.paramMap.pipe(take(1)).subscribe((params) => {
      this.initializeForm(params);
    });
  }

  private resetForm(): void {
    this.isLoading = false;
    this.content.scrollToTop(500);
    this.eventForm.reset();
    delete this.eventCoverPictureUrl;
    delete this.selectLocation;
    const today = new Date(new Date().getTime() + 10 * 60 * 1000).toISOString();
    this.minDate = today;
  }

  private initializeForm(params: any): void {
    this.mode = params.get('mode')!;
    if (this.mode === 'edit') {
      const eventInfo: Event = JSON.parse(params.get('eventInfo')!);
      this.setEditMode(eventInfo);
    } else {
      this.setDefaultFormValues();
    }
  }

  private setEditMode(eventInfo: Event): void {
    this.eventId = eventInfo.eventId;
    this.eventForm.patchValue(eventInfo);
    const eventCategoryIds = new Set(
      eventInfo.categories.map((cat) => cat.categoryId)
    );
    this.categoryList.forEach((category, index) => {
      this.categories
        .at(index)
        .setValue(eventCategoryIds.has(category.categoryId));
    });

    this.eventForm
      .get('startTime')
      ?.patchValue(Formatter.getFormatTimeString(eventInfo.startTime));
    this.eventForm
      .get('endTime')
      ?.patchValue(Formatter.getFormatTimeString(eventInfo.endTime));
    this.eventCoverPictureUrl = eventInfo.imageUrl;
    this.onIsOnlineChange(eventInfo.isOnline);

    if (!eventInfo.isOnline) {
      this.selectLocation = {
        placeId: eventInfo.placeId,
        lat: eventInfo.lat,
        lng: eventInfo.lng,
        formattedAddress: eventInfo.formattedAddress
      };
      this.eventForm
        .get('formattedAddress')
        ?.patchValue(eventInfo.formattedAddress);
    }
  }

  private setDefaultFormValues(): void {
    this.eventForm.get('maxParticipants')?.setValue(1);
    this.eventForm
      .get('startTime')
      ?.patchValue(Formatter.getFormatTimeString(this.minDate));
    this.eventForm
      .get('endTime')
      ?.patchValue(Formatter.getFormatTimeString(this.minDate));
    this.eventForm.get('price')?.patchValue(0);
  }

  onSubmit() {
    this.isLoading = true;
    const contentI18n =
      this.mode === 'edit'
        ? 'CREATE_EVENT.EDIT_CONFIRM'
        : 'CREATE_EVENT.CREATE_CONFIRM';

    const titleI18n =
      this.mode === 'edit'
        ? 'CREATE_EVENT.EDIT_TITLE'
        : 'CREATE_EVENT.CREATE_TITLE';
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        title: titleI18n,
        content: contentI18n,
        enableCancelButton: true
      },
      panelClass: 'custom-dialog'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.createEvent();
      } else {
        this.isLoading = false;
      }
    });
  }

  private async createEvent(): Promise<void> {
    if (!this.eventCoverPictureUrl) {
      this.showUploadImageAlert();
      return;
    }

    const selection = this.getSelectedCategories();

    if (this.isEditMode()) {
      await this.handleEventUpdate(selection);
    } else {
      await this.handleEventCreation(selection);
    }
  }

  private showUploadImageAlert(): void {
    this.dialog.open(AlertDialogComponent, {
      data: {
        title: 'Oops!',
        content: 'Please upload event image',
        enableCancelButton: true
      },
      panelClass: 'custom-dialog'
    });
  }

  private getSelectedCategories(): number[] {
    return this.categories.value
      .map((value: boolean, index: number) =>
        value ? this.categoryList[index].categoryId : null
      )
      .filter((categoryId: number) => categoryId !== null);
  }

  private isEditMode(): boolean {
    return !!(this.mode === 'edit' && this.eventId);
  }

  private async handleEventUpdate(selection: number[]): Promise<void> {
    this.loadingService.present();
    try {
      await this.eventService.updateEvent(
        this.eventId!,
        this.getEventPayload(selection)
      );
    } catch (error) {
      console.error(error);
    } finally {
      this.setLoading(false);
    }
  }

  private async handleEventCreation(selection: number[]): Promise<void> {
    const modal = await this.createMegaBoostModal(selection);
    modal.present();
    const { role } = await modal.onWillDismiss();

    if (role === 'cancel') {
      this.loadingService.present();
      try {
        await this.eventService.createEvent(this.getEventPayload(selection));
      } catch (error) {
        console.error(error);
      } finally {
        this.setLoading(false);
      }
    }
  }

  private createMegaBoostModal(
    selection: number[]
  ): Promise<HTMLIonModalElement> {
    return this.modalCtrl.create({
      component: MegaBoostComponent,
      initialBreakpoint: 1,
      breakpoints: [0, 1],
      componentProps: {
        eventId: this.eventId,
        endTime: new Date(this.eventForm.value.endTime).toISOString(),
        eventInfo: this.getEventPayload(selection)
      }
    });
  }

  private getEventPayload(selection: number[]): any {
    return {
      ...this.eventForm.value,
      startTime: new Date(this.eventForm.value.startTime).toISOString(),
      endTime: new Date(this.eventForm.value.endTime).toISOString(),
      categories: selection,
      ...this.selectLocation
    };
  }

  private setLoading(loading: boolean): void {
    this.isLoading = loading;
    if (loading) {
      this.loadingService.present();
    } else {
      this.loadingService.dismiss();
    }
  }

  selectImage(): void {
    this.eventService.selectImage().then((result) => {
      this.eventCoverPictureUrl = result;
    });
  }

  trackByIndex(index: number, item: Category): number {
    return index;
  }

  onIsOnlineChange(value: boolean) {
    if (value) {
      this.location.clearValidators();
      this.location.disable();
      this.location.updateValueAndValidity();
      delete this.selectLocation;
    } else {
      this.location.setValidators([Validators.required]);
      this.location.enable();
      this.location.updateValueAndValidity();
    }
  }

  onLocationChange(placeDetail: google.maps.places.PlaceResult): void {
    this.selectLocation = {
      placeId: placeDetail.place_id!,
      lat: placeDetail.geometry?.location?.lat()!,
      lng: placeDetail.geometry?.location?.lng()!,
      formattedAddress: placeDetail.formatted_address!
    };
  }

  get isValidLocation(): boolean {
    if (this.eventForm.get('isOnline')?.value) return true;
    return this.selectLocation?.placeId !== undefined;
  }
}
