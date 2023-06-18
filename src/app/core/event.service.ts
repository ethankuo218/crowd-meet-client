import { EventListStateFacade } from './states/event-list-state/event-list.state.facade';
import { HttpClientService } from './http-client.service';
import { Injectable } from '@angular/core';
import { Event, EventSetting } from '../event/models/event.model';
import { Observable, tap } from 'rxjs';
import { FileResponse } from './models/core.model';
import { EventList } from './states/event-list-state/event-list.model';

@Injectable()
export class EventService {
  constructor(
    private httpClientService: HttpClientService,
    private eventListStateFacade: EventListStateFacade
  ) {}

  createEvent(eventSetting: EventSetting): Observable<Event> {
    return this.httpClientService.post<Event>('event', eventSetting);
  }

  updateEvent(body: any): Observable<Event> {
    return this.httpClientService.patch<Event>('event', body);
  }

  updateEventImage(id: number, file: FormData): Observable<FileResponse> {
    return this.httpClientService.post<FileResponse>(`event/${id}/image`, file);
  }

  getEventDetail(id: number): Observable<Event> {
    return this.httpClientService.get<Event>(`event/${id}`);
  }

  getEventList(): Observable<EventList> {
    return this.eventListStateFacade.getEventList();
  }

  reloadEventList(): void {
    this.httpClientService
      .get<EventList>('event', { pageSize: 999 })
      .subscribe({
        next: (result) => {
          this.eventListStateFacade.storeEventList(result);
        },
      });
  }

  deleteEvent() {}
}
