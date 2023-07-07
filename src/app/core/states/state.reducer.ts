import { Reference } from './reference-state/reference.model';
import { User } from './user-state/user.model';
import { createReducer, on } from '@ngrx/store';
import * as UserStateActions from './user-state/user.actions';
import * as ReferenceStateActions from './reference-state/reference.actions';
import * as EventListStateActions from './event-list-state/event-list.actions';
import { EventList } from './event-list-state/event-list.model';

export const userFeatureKey = 'user';
export const referenceFeatureKey = 'reference';
export const eventListFeatureKey = 'eventList';

export const initialState: State = {
  user: {
    userId: 0,
    email: '',
    name: '',
    profilePictureUrl: '',
    bio: '',
    interests: [],
    images: [],
    gender: '',
    birthDate: ''
  },
  reference: {
    categories: []
  },
  eventList: {
    data: [],
    pagination: {
      page: 0,
      pageSize: 0,
      total: 0
    }
  }
};

export const userReducer = createReducer(
  initialState.user,
  on(UserStateActions.storeUserState, (state, { userInfo }) => ({
    ...state,
    ...userInfo
  }))
);

export const referenceReducer = createReducer(
  initialState.reference,
  on(ReferenceStateActions.storeReferenceState, (state, { reference }) => ({
    ...state,
    ...reference
  }))
);

export const eventListReducer = createReducer(
  initialState.eventList,
  on(EventListStateActions.storeEventListState, (state, { eventList }) => ({
    ...state,
    ...eventList
  })),
  on(EventListStateActions.addEventListState, (state, { eventList }) => ({
    ...state,
    data: [...state.data, ...eventList.data]
  }))
);

interface State {
  user: User;
  reference: Reference;
  eventList: EventList;
}
