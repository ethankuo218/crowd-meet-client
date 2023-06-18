import { createFeatureSelector, createSelector } from '@ngrx/store';
import { eventListFeatureKey } from '../state.reducer';
import { EventList } from './event-list.model';

const eventListFeatureSelector = createFeatureSelector<EventList>(eventListFeatureKey);

export const getEventListState = () =>
  createSelector(eventListFeatureSelector, (state) => state);
