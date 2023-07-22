import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Reference } from './reference.model';
import { referenceFeatureKey } from '../state.reducer';

const referenceFeatureSelector = createFeatureSelector<Reference>(referenceFeatureKey);

export const getCategoriesState = () =>
  createSelector(referenceFeatureSelector, (state) => state.categories);
