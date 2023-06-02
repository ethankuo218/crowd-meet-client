import { User } from '@capacitor-firebase/authentication';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { userFeatureKey } from '../state.reducer';

const userFeatureSelector = createFeatureSelector<User>(userFeatureKey);

export const getUserState = () =>
  createSelector(userFeatureSelector, (state) => state);
