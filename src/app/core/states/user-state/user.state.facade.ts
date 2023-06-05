import { storeUser } from './user.actions';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { getUserState } from './user.selector';
import { User } from './user.model';
import { Observable } from 'rxjs';

@Injectable()
export class UserStateFacade {
  constructor(private readonly store: Store<User>) {}

  storeUser(userInfo: any) {
    this.store.dispatch(storeUser({ userInfo }));
  }

  getUser(): Observable<User> {
    return this.store.select(getUserState());
  }
}
