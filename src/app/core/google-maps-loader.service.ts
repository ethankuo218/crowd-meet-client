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

  public async load(): Promise<google.maps.places.AutocompleteService> {
    await this.loader.load();
    return new google.maps.places.AutocompleteService();
  }
}
