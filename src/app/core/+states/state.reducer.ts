import { Reference } from './reference-state/reference.model';
import { User, UserEvent } from './user-state/user.model';
import { createReducer, on } from '@ngrx/store';
import * as UserStateActions from './user-state/user.actions';
import * as ReferenceStateActions from './reference-state/reference.actions';
import * as EventListStateActions from './event-list-state/event-list.actions';
import { BoostedEvent, EventList } from './event-list-state/event-list.model';

export const userFeatureKey = 'user';
export const userEventsFeatureKey = 'userEvents';
export const referenceFeatureKey = 'reference';
export const eventListFeatureKey = 'eventList';
export const boostedEventsFeatureKey = 'boostedEvents';

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
  userEvents: [],
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
  },
  boostedEvents: []
};

export const userReducer = createReducer(
  initialState.user,
  on(UserStateActions.storeUserState, (state, { userInfo }) => ({
    ...state,
    ...userInfo
  }))
);

export const userEventsReducer = createReducer(
  initialState.userEvents,
  on(UserStateActions.storeUserEventsState, (state, { userEvents }) => [
    ...userEvents
  ])
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

export const boostedEventsReducer = createReducer(
  initialState.boostedEvents,
  on(
    EventListStateActions.storeBoostedEventsState,
    (state, { boostedEvents }) => ({
      ...state,
      boostedEvents: [...boostedEvents]
    })
  )
);

interface State {
  user: User;
  userEvents: UserEvent[];
  reference: Reference;
  eventList: EventList;
  boostedEvents: BoostedEvent[];
}
