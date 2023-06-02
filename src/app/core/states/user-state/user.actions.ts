import { createAction, props } from '@ngrx/store';
import { User } from './user.model';

export const storeUser = createAction('[USER STATE] Store User State', props<{ userInfo: User }>());
