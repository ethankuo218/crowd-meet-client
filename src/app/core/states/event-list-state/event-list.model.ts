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
  interests: Category[];
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}
