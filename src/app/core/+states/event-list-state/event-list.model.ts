import { Category } from '../reference-state/reference.model';

export interface EventList {
  data: EventListData[];
  pagination: Pagination;
}

export interface EventListData {
  imageUrl: string;
  title: string;
  description: string;
  eventId: number;
  startTime: string;
  categories: Category[];
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface BoostedEvent {
  imageUrl: string;
  title: string;
  description: string;
  startTime: string;
  eventId: number;
}
