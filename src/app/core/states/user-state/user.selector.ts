import { createFeatureSelector, createSelector } from '@ngrx/store';
import { userFeatureKey, userEventsFeatureKey } from '../state.reducer';
import { User, UserEvent } from './user.model';

const userFeatureSelector = createFeatureSelector<User>(userFeatureKey);
const userEventsFeatureSelector =
  createFeatureSelector<UserEvent[]>(userEventsFeatureKey);

export const getUserState = () =>
  createSelector(userFeatureSelector, (state) => state);

export const getUserEventsState = () =>
  createSelector(userEventsFeatureSelector, (state) => state);
