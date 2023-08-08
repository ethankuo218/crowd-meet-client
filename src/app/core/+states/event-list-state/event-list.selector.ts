import { createFeatureSelector, createSelector } from '@ngrx/store';
import { eventListFeatureKey, boostedEventsFeatureKey } from '../state.reducer';
import { BoostedEvent, EventList } from './event-list.model';

const eventListFeatureSelector =
  createFeatureSelector<EventList>(eventListFeatureKey);

const boostedEventsFeatureSelector = createFeatureSelector<{
  boostedEvents: BoostedEvent[];
}>(boostedEventsFeatureKey);

export const getEventListState = () =>
  createSelector(eventListFeatureSelector, (state) => state);

export const getBoostedEventsState = () =>
  createSelector(boostedEventsFeatureSelector, (state) => state.boostedEvents);
