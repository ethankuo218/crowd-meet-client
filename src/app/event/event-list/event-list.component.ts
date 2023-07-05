import { Component, NgZone, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventListData } from 'src/app/core/states/event-list-state/event-list.model';
import { EventService } from '../../core/event.service';
import { GoogleMapsLoaderService } from 'src/app/core/google-maps-loader.service';
import { IonInput } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-listing',
  templateUrl: './event-list.component.html',
  styleUrls: [
    './styles/event-list.component.scss',
    './styles/event-list.shell.scss'
  ]
})
export class EventListComponent {
  listing$: Observable<EventListData[]> = this.eventService
    .getEventList()
    .pipe(map((result) => result?.data));

  @ViewChild('searchInput', { read: IonInput })
  public searchElementRef!: IonInput;
  public search: string = '';

  constructor(
    private eventService: EventService,
    private googleMapsLoaderService: GoogleMapsLoaderService,
    private ngZone: NgZone
  ) {}
  async ionViewWillEnter(): Promise<void> {
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
          this.search = place.formatted_address || '';
        });
      });
    });

    this.eventService.reloadEventList();
  }

  async openMap(): Promise<void> {
    // get the place details from server
    const mockPlaceDetails = {
      lat: 37.4220041,
      lng: -122.0862462,
      name: 'Googleplex',
      address: '1600 Amphitheatre Parkway, Mountain View, CA, USA',
      placeId: 'ChIJj61dQgK6j4AR4GeTYWZsKWw'
    };

    // The following URL should open Google Maps on all platforms
    let url = `https://www.google.com/maps/search/?api=1&query=${mockPlaceDetails.lat},${mockPlaceDetails.lng}&query_place_id=${mockPlaceDetails.placeId}`;

    await Browser.open({ url });
  }

  // NOTE: Ionic only calls ngOnDestroy if the page was popped (ex: when navigating back)
  // Since ngOnDestroy might not fire when you navigate from the current page, use ionViewWillLeave to cleanup Subscriptions
  ionViewWillLeave(): void {}
}
