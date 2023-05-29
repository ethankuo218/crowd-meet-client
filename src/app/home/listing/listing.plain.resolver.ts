import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { HomeService } from '../home.service';
import { ListingModel } from './listing.model';

@Injectable()
export class ListingPlainResolver implements Resolve<ListingModel> {
  constructor(private homeService: HomeService) {}

  resolve(): Observable<ListingModel> {
    return this.homeService.getListingDataSource();
  }
}
