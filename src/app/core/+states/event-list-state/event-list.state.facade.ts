import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addEventListState,
  storeBoostedEventsState,
  storeEventListState
} from './event-list.actions';
import { Observable, tap } from 'rxjs';
import { BoostedEvent, EventList } from './event-list.model';
import {
  getBoostedEventsState,
  getEventListState
} from './event-list.selector';

@Injectable({ providedIn: 'root' })
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

  storeBoostedEvents(boostedEvents: BoostedEvent[]): void {
    this.store.dispatch(storeBoostedEventsState({ boostedEvents }));
  }

  getBoostedEvents(): Observable<BoostedEvent[]> {
    return this.store.select(getBoostedEventsState());
  }
}
