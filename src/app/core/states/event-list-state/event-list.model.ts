export interface EventList {
  data: EventListData[];
  pagination: Pagination;
}

export interface EventListData {
  imageUrl: string;
  title: string;
  description: string;
  eventId: number;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}
