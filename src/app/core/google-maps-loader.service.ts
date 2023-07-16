import { Injectable } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class GoogleMapsLoaderService {
  private loader: Loader;

  constructor() {
    this.loader = new Loader({
      apiKey: environment.gooleMapsApiKey,
      version: 'weekly',
      libraries: ['places']
    });
  }

  public async loadPredictions(
    input: string
  ): Promise<google.maps.places.AutocompletePrediction[]> {
    await this.loader.importLibrary('places');
    const autoComplete = new google.maps.places.AutocompleteService();
    const request: google.maps.places.AutocompletionRequest = {
      input: input,
      language: 'en'
    };

    return (await autoComplete.getPlacePredictions(request)).predictions;
  }
}
