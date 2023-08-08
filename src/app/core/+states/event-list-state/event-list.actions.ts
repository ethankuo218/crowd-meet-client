import { createAction, props } from '@ngrx/store';
import { BoostedEvent, EventList } from './event-list.model';

export const storeEventListState = createAction(
  '[EVENT LIST STATE] Store EventList State',
  props<{ eventList: EventList }>()
);

export const addEventListState = createAction(
  '[EVENT LIST STATE] Add EventList State',
  props<{ eventList: EventList }>()
);

export const storeBoostedEventsState = createAction(
  '[EVENT LIST STATE] Store boosted events State',
  props<{ boostedEvents: BoostedEvent[] }>()
);
