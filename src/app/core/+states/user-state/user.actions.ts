import { createAction, props } from '@ngrx/store';
import { User, UserEvent } from './user.model';

export const storeUserState = createAction(
  '[USER STATE] Store User State',
  props<{ userInfo: User }>()
);

export const storeUserEventsState = createAction(
  '[USER STATE] Store User Events State',
  props<{ userEvents: UserEvent[] }>()
);
