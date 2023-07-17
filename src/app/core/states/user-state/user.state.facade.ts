import { storeUserState, storeUserEventsState } from './user.actions';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { getUserEventsState, getUserState } from './user.selector';
import { User, UserEvent } from './user.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserStateFacade {
  constructor(private readonly store: Store<User>) {}

  storeUser(userInfo: any) {
    this.store.dispatch(storeUserState({ userInfo }));
  }

  storeUserEvents(userEvents: UserEvent[]) {
    this.store.dispatch(storeUserEventsState({ userEvents }));
  }

  getUser(): Observable<User> {
    return this.store.select(getUserState());
  }

  getUserEvents(): Observable<UserEvent[]> {
    return this.store.select(getUserEventsState());
  }
}
