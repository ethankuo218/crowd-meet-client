import { createFeatureSelector, createSelector } from '@ngrx/store';
import { userFeatureKey } from '../state.reducer';
import { User } from './user.model';

const userFeatureSelector = createFeatureSelector<User>(userFeatureKey);

export const getUserState = () =>
  createSelector(userFeatureSelector, (state) => state);
