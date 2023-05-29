import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';

import { DataStore } from '../../shell/data-store';
import { HomeService } from '../home.service';
import { ListingModel } from './listing.model';
import { SeoDataModel } from '../../utils/seo/seo-data.model';

@Injectable()
export class ListingResolver implements Resolve<any> {
  constructor(private homeService: HomeService) {}

  resolve(): {
    dataStore: DataStore<ListingModel>;
    seo: Observable<SeoDataModel>;
  } {
    const dataSource: Observable<ListingModel> =
      this.homeService.getListingDataSource();
    const dataStore: DataStore<ListingModel> =
      this.homeService.getListingStore(dataSource);

    const seo = new SeoDataModel();
    seo.title = 'Listing Page';
    seo.description = 'Description';
    seo.keywords = 'keywords, ionic, angular';

    return { dataStore: dataStore, seo: of(seo) };
  }
}
