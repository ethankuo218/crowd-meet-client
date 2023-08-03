import { EventService } from '../core/event.service';
import { ReferenceStateFacade } from '../core/+states/reference-state/reference.state.facade';
import { Component, OnInit, inject } from '@angular/core';
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
      price: new FormControl(0, [Validators.required]),
      categories: new FormArray([], [Validators.required]),
      isOnline: new FormControl('', [Validators.required])
    },
    [InputValidators.endTimeValidate, InputValidators.categoriesValidate]
  );

  selectLocation:
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
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    this.route.paramMap.pipe(take(1)).subscribe((params) => {
      this.mode = params.get('mode')!;
      this.eventForm.reset();
      delete this.eventCoverPictureUrl;
      delete this.selectLocation;

      const today = new Date(
        new Date().getTime() + 10 * 60 * 1000
      ).toISOString();
      this.minDate = today;

      if (this.mode === 'edit') {
        const eventInfo: Event = JSON.parse(params.get('eventInfo')!);
        this.eventId = eventInfo.eventId;
        this.eventForm.patchValue(eventInfo);
        this.eventForm
          .get('startTime')
          ?.patchValue(Formatter.getFormatTimeString(eventInfo.startTime));
        this.eventForm
          .get('endTime')
          ?.patchValue(Formatter.getFormatTimeString(eventInfo.endTime));
        this.eventCoverPictureUrl = eventInfo.imageUrl;
        this.onIsOnlineChange(eventInfo.isOnline);
      } else {
        this.eventForm.get('maxParticipants')?.setValue(1);
        this.eventForm
          .get('startTime')
          ?.patchValue(Formatter.getFormatTimeString(today));
        this.eventForm
          .get('endTime')
          ?.patchValue(Formatter.getFormatTimeString(today));
        this.eventForm.get('price')?.patchValue(0);
      }
    });
  }

  onSubmit() {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        title: this.mode === 'edit' ? 'Edit Event' : 'Create Event',
        content: `Confirm to ${this.mode === 'edit' ? 'edit' : 'create'} event`,
        enableCancelButton: true
      },
      panelClass: 'custom-dialog'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.createEvent();
      }
    });
  }

  private createEvent() {
    if (this.eventCoverPictureUrl === null) {
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Oops!',
          content: `Please upload event image`,
          enableCancelButton: true
        },
        panelClass: 'custom-dialog'
      });
      return;
    }

    const selection: number[] = [];
    this.categories.value.forEach((value: boolean, index: number) => {
      if (value) {
        selection.push(this.categoryList[index].categoryId);
      }
    });

    if (this.mode === 'edit' && this.eventId) {
      this.eventService.updateEvent(this.eventId, {
        ...this.eventForm.value,
        startTime: new Date(this.eventForm.value.startTime).toISOString(),
        endTime: new Date(this.eventForm.value.endTime).toISOString(),
        categories: selection,
        ...this.selectLocation
      });
    } else {
      const dialogRef = this.dialog.open(MegaBoostComponent, {
        data: {
          title: 'Mega boost',
          content: `Confirm to boost your event`,
          enableCancelButton: true
        },
        panelClass: 'mega-boost-dialog'
      });
      dialogRef.afterClosed().subscribe((result) => {
        console.log(result);

        this.eventService.createEvent({
          ...this.eventForm.value,
          startTime: new Date(this.eventForm.value.startTime).toISOString(),
          endTime: new Date(this.eventForm.value.endTime).toISOString(),
          categories: selection,
          ...this.selectLocation
        });
      });
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
}
