import { Reference } from './reference-state/reference.model';
import { User } from './user-state/user.model';
import { createReducer, on } from '@ngrx/store';
import * as UserStateActions from './user-state/user.actions';
import * as ReferenceStateActions from './reference-state/reference.actions';

export const userFeatureKey = 'user';
export const referenceFeatureKey = 'reference';

export const initialState: State = {
  user: {
    userId: 0,
    email: '',
    name: '',
    profilePictureUrl: '',
    bio: '',
    interests: [],
  },
  reference: {
    categories: [],
  },
};

export const userReducer = createReducer(
  initialState,
  on(UserStateActions.storeUser, (state, { userInfo }) => ({
    ...state,
    userId: userInfo.userId,
    email: userInfo.email,
    name: userInfo.name,
    profilePictureUrl: userInfo.profilePictureUrl,
    bio: userInfo.bio,
    interests: userInfo.interests,
  }))
);

export const referenceReducer = createReducer(
  initialState,
  on(ReferenceStateActions.storeReferenceState, (state, { reference }) => ({
    ...state,
    categories: reference.categories,
  }))
);

interface State {
  user: User;
  reference: Reference;
}
