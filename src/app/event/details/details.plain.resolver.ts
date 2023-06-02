import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { HomeService } from '../home.service';
import { DetailsModel } from './details.model';

@Injectable()
export class DetailsPlainResolver implements Resolve<DetailsModel> {
  constructor(private homeService: HomeService) {}

  resolve(): Observable<DetailsModel> {
    return this.homeService.getDetailsDataSource();
  }
}
