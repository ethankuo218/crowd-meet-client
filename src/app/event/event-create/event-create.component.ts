import { EventService } from '../../core/event.service';
import { ReferenceStateFacade } from '../../core/states/reference-state/reference.state.facade';
import { Component, OnInit } from '@angular/core';
import {
  Validators,
  FormControl,
  FormGroup,
  FormArray,
  AbstractControl
} from '@angular/forms';

import { counterRangeValidator } from '../../components/counter-input/counter-input.component';
import { take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/core/states/reference-state/reference.model';
import { Event } from '../models/event.model';

@Component({
  selector: 'app-create-page',
  templateUrl: './event-create.component.html',
  styleUrls: ['./styles/event-create.component.scss']
})
export class EventCreateComponent implements OnInit {
  mode: string = 'create';
  eventCoverPictureUrl: string | undefined;

  eventForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    startTime: new FormControl(new Date().toISOString().split('.')[0], [
      Validators.required
    ]),
    endTime: new FormControl(new Date().toISOString().split('.')[0], [
      Validators.required
    ]),
    maxParticipants: new FormControl(1, counterRangeValidator(1, 15)),
    locationName: new FormControl('', [Validators.required]),
    price: new FormControl(0, [Validators.required]),
    categories: new FormArray([], [Validators.required]),
    isOnline: new FormControl('', [Validators.required])
  });

  categoryList: Category[] = [];

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
    return this.eventForm.get('locationName')!;
  }

  minDate: string = '';

  constructor(
    private referenceStateFacade: ReferenceStateFacade,
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

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
    this.route.paramMap.pipe(take(1)).subscribe((params) => {
      this.mode = params.get('mode')!;
      this.eventForm.reset();
      delete this.eventCoverPictureUrl;
      delete this.selectLocation;

      const today = new Date().toISOString().split('.')[0];
      this.minDate = today;

      if (this.mode === 'edit') {
        const eventInfo: Event = JSON.parse(params.get('eventInfo')!);
        this.eventForm.patchValue(eventInfo);
        this.eventForm
          .get('startTime')
          ?.patchValue(eventInfo.startTime.split('.')[0]);
        this.eventForm
          .get('endTime')
          ?.patchValue(eventInfo.endTime.split('.')[0]);
        this.eventCoverPictureUrl = eventInfo.imageUrl;
        this.onIsOnlineChange(eventInfo.isOnline);
      } else {
        this.eventForm.get('maxParticipants')?.setValue(1);
        this.eventForm.get('startTime')?.patchValue(today.split('.')[0]);
        this.eventForm.get('endTime')?.patchValue(today.split('.')[0]);
        this.eventForm.get('price')?.patchValue(0);
      }
    });
  }

  onSubmit() {
    const selection: number[] = [];
    this.categories.value.forEach((value: boolean, index: number) => {
      if (value) {
        selection.push(this.categoryList[index].categoryId);
      }
    });

    if (this.mode === 'edit') {
      this.eventService
        .updateEvent({
          ...this.eventForm.value,
          startTime: new Date(this.eventForm.value.startTime).toISOString(),
          endTime: new Date(this.eventForm.value.endTime).toISOString(),
          categories: selection,
          ...this.selectLocation
        })
        .subscribe({
          next: () => {
            this.router.navigate(['/app/event', { refresh: true }]);
          }
        });
    } else {
      this.eventService
        .createEvent({
          ...this.eventForm.value,
          startTime: new Date(this.eventForm.value.startTime).toISOString(),
          endTime: new Date(this.eventForm.value.endTime).toISOString(),
          categories: selection,
          ...this.selectLocation
        })
        .subscribe({
          next: () => {
            this.router.navigate(['/app/event', { refresh: true }]);
          }
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
    //TODO: clear
    if (value) {
      this.location.reset();
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
    console.log(placeDetail);
    this.selectLocation = {
      placeId: placeDetail.place_id!,
      lat: placeDetail.geometry?.location?.lat()!,
      lng: placeDetail.geometry?.location?.lng()!,
      formattedAddress: placeDetail.formatted_address!
    };
    console.log(this.selectLocation);
  }
}
