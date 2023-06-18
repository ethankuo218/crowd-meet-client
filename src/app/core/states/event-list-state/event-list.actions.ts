import { createAction, props } from '@ngrx/store';
import { EventList } from './event-list.model';

export const storeEventListState = createAction('[EVENT LIST STATE] Store EventList State', props<{ eventList: EventList }>());
