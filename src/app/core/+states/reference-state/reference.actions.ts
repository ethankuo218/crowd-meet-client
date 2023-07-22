import { createAction, props } from '@ngrx/store';
import { Reference } from './reference.model';

export const storeReferenceState = createAction('[REFERENCE STATE] Store Reference State', props<{ reference: Reference }>());
