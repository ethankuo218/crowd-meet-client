import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { addEventListState, storeEventListState } from './event-list.actions';
import { Observable } from 'rxjs';
import { EventList } from './event-list.model';
import { getEventListState } from './event-list.selector';

@Injectable()
export class EventListStateFacade {
  constructor(private readonly store: Store<EventList>) {}

  storeEventList(eventList: EventList): void {
    this.store.dispatch(storeEventListState({ eventList }));
  }

  addEventList(eventList: EventList): void {
    this.store.dispatch(addEventListState({ eventList }));
  }

  getEventList(): Observable<EventList> {
    return this.store.select(getEventListState());
  }
}
