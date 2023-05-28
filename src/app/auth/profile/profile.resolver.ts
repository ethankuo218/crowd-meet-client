import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { DataStore } from '../../shell/data-store';
import { ProfileModel } from './profile.model';

@Injectable()
export class ProfileResolver implements Resolve<any> {

  constructor(private authService: AuthService) {}

  resolve() {
    const dataSource: Observable<ProfileModel> = this.authService.getProfileDataSource();
    const dataStore: DataStore<ProfileModel> = this.authService.getProfileStore(dataSource);
    return dataStore;
  }
}
