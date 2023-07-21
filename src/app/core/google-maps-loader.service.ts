import { Injectable, inject } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { environment } from 'src/environments/environment';
import { LanguageService } from '../language/language.service';
import { Geolocation } from '@capacitor/geolocation';
import { Subject, firstValueFrom, lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GoogleMapsLoaderService {
  private loader: Loader = new Loader({
    apiKey: environment.gooleMapsApiKey,
    version: 'weekly',
    libraries: ['places']
  });
  private language = inject(LanguageService).currentLanguage.toString();

  private userLocation: { lat: number; lng: number } | undefined;

  constructor() {
    this.loader.importLibrary('places');
    // Geolocation.requestPermissions({
    //   permissions: ['location', 'coarseLocation']
    // });
    Geolocation.getCurrentPosition().then((coordinates) => {
      this.userLocation = {
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude
      };
    });
  }

  public async loadPredictions(
    input: string
  ): Promise<google.maps.places.AutocompletePrediction[]> {
    // Create a LatLngBounds object centered around the user's location.
    const circle = new google.maps.Circle({
      center: this.userLocation,
      radius: 50000
    }); // 50000 meters = 50 km

    // Set the soft bounds of the Autocomplete object to the user's location.
    const locationBias: google.maps.places.LocationBias = circle.getBounds()!;

    const autoComplete = new google.maps.places.AutocompleteService();
    const request: google.maps.places.AutocompletionRequest = {
      input: input,
      language: this.language,
      ...(locationBias && { locationBias: locationBias })
    };

    return (await autoComplete.getPlacePredictions(request)).predictions;
  }

  async getPlacesDetail(
    placeId: string
  ): Promise<google.maps.places.PlaceResult> {
    const googleMapHelper = document.createElement('div');
    const placeService = new google.maps.places.PlacesService(googleMapHelper);
    const placeDetailSubject: Subject<google.maps.places.PlaceResult> =
      new Subject();

    placeService.getDetails(
      {
        placeId: placeId,
        fields: ['place_id', 'geometry.location', 'formatted_address'], // paid
        language: this.language
      },
      (placeDetail) => {
        placeDetailSubject.next(placeDetail!);
      }
    );

    return firstValueFrom(placeDetailSubject.asObservable());
  }
}
