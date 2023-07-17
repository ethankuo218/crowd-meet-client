import { Injectable, inject } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { environment } from 'src/environments/environment';
import { LanguageService } from '../language/language.service';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({ providedIn: 'root' })
export class GoogleMapsLoaderService {
  private loader: Loader = new Loader({
    apiKey: environment.gooleMapsApiKey,
    version: 'weekly',
    libraries: ['places']
  });

  private language = inject(LanguageService).currentLanguage.toString();

  public async loadPredictions(
    input: string
  ): Promise<google.maps.places.AutocompletePrediction[]> {
    await this.loader.importLibrary('places');

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
}
