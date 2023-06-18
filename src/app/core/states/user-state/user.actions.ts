import { createAction, props } from '@ngrx/store';
import { User } from './user.model';

export const storeUserState = createAction('[USER STATE] Store User State', props<{ userInfo: User }>());
