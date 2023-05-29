import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { DataStore } from '../../shell/data-store';
import { HomeService } from '../home.service';
import { DetailsModel } from './details.model';
import { map } from 'rxjs/operators';
import { SeoDataModel } from '../../utils/seo/seo-data.model';

@Injectable()
export class DetailsResolver implements Resolve<any> {
  constructor(private homeService: HomeService) {}

  resolve(): {
    dataStore: DataStore<DetailsModel>;
    seo: Observable<SeoDataModel>;
  } {
    const dataSource: Observable<DetailsModel> =
      this.homeService.getDetailsDataSource();

    // Typically, SEO titles, descriptions, etc depend on the data being resolved for a specific route
    const seoObservable: Observable<SeoDataModel> = dataSource.pipe(
      map((data) => {
        const seo = new SeoDataModel();
        seo.title = data.name ? data.name : '';
        seo.description = data.fullDescription ? data.fullDescription : '';
        seo.keywords = data.category ? data.category : '';
        return seo;
      })
    );

    const dataStore: DataStore<DetailsModel> =
      this.homeService.getDetailsStore(dataSource);

    return { dataStore: dataStore, seo: seoObservable };
  }
}
