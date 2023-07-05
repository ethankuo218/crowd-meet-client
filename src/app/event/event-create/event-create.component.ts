import { ImgUploadService } from '../../core/img-upload.service';
import { EventService } from '../../core/event.service';
import { ReferenceStateFacade } from '../../core/states/reference-state/reference.state.facade';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import {
  Validators,
  FormControl,
  FormGroup,
  FormArray,
  AbstractControl
} from '@angular/forms';

import { counterRangeValidator } from '../../components/counter-input/counter-input.component';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { Category } from 'src/app/core/states/reference-state/reference.model';
import { GoogleMapsLoaderService } from 'src/app/core/google-maps-loader.service';
import { Geolocation } from '@capacitor/geolocation';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-create-page',
  templateUrl: './event-create.component.html',
  styleUrls: ['./styles/event-create.component.scss']
})
export class EventCreateComponent implements OnInit {
  eventCoverPictureUrl: string | undefined;

  @ViewChild('searchInput', { read: IonInput })
  public searchElementRef!: IonInput;

  eventForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    startTime: new FormControl('', [Validators.required]),
    endTime: new FormControl('', [Validators.required]),
    maxParticipants: new FormControl(1, counterRangeValidator(1, 15)),
    locationName: new FormControl('', [Validators.required]),
    price: new FormControl(0, [Validators.required]),
    categories: new FormArray([], [Validators.required])
  });

  categoryList: Category[] = [];

  get categories(): FormArray {
    return <FormArray>this.eventForm.get('categories');
  }

  get location(): AbstractControl {
    return this.eventForm.get('locationName')!;
  }

  constructor(
    private referenceStateFacade: ReferenceStateFacade,
    private eventService: EventService,
    private router: Router,
    private imgUploadService: ImgUploadService,
    private googleMapsLoaderService: GoogleMapsLoaderService,
    private ngZone: NgZone
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

    this.googleMapsLoaderService.load().then(async (placesService) => {
      const coordinates = await Geolocation.getCurrentPosition();
      const userLocation = {
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude
      };
      // Create a LatLngBounds object centered around the user's location.
      const circle = new google.maps.Circle({
        center: userLocation,
        radius: 50000
      }); // 50000 meters = 50 km
      const bounds = circle.getBounds()!;

      // Set the bounds of the Autocomplete object to the user's location.
      const options: google.maps.places.AutocompleteOptions = {
        bounds: bounds
      };

      const inputElement = await this.searchElementRef.getInputElement();
      const autocomplete = new google.maps.places.Autocomplete(
        inputElement,
        options
      );
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          console.log(place);
          // store the data below
          console.log(place.place_id);
          console.log(place.geometry?.location?.lat());
          console.log(place.geometry?.location?.lng());
          console.log(place.formatted_address);
          this.location.setValue(place.formatted_address || '');
        });
      });
    });
  }

  onSubmit() {
    const selection: number[] = [];
    this.categories.value.forEach((value: boolean, index: number) => {
      if (value) {
        selection.push(this.categoryList[index].categoryId);
      }
    });

    this.eventService
      .createEvent({
        ...this.eventForm.value,
        startTime: this.formatDateToIsoString(this.eventForm.value.startTime),
        endTime: this.formatDateToIsoString(this.eventForm.value.endTime),
        categories: selection
      })
      .subscribe({
        next: (result) => {
          if (this.imgUploadService.uploadedImagesCount !== 0) {
            this.uploadEventImg(result.eventId);
          } else {
            this.router.navigate(['/app/event']);
          }
        }
      });
  }

  selectImage(): void {
    this.imgUploadService.selectImage().then();
  }

  private async uploadEventImg(id: number) {
    const formData = new FormData();
    const files = await this.imgUploadService.getUploadedImg();

    formData.append('file', files[0]);
    this.eventService.updateEventImage(id, formData).subscribe({
      next: () => {
        this.router.navigate(['/app/event']);
      }
    });
  }

  private formatDateToIsoString(date: string): string {
    return new Date(date).toISOString();
  }

  trackByIndex(index: number, item: Category): number {
    return index;
  }
}
