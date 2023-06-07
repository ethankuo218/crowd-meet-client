import { HttpClientService } from '../core/http-client.service';
import { Injectable } from '@angular/core';
import { Event, EventList, EventSetting } from './models/event.model';
import { Observable, of } from 'rxjs';
import { FileResponse } from '../core/models/core.model';

@Injectable()
export class EventService {
  constructor(private httpClientService: HttpClientService) {}

  createEvent(eventSetting: EventSetting): Observable<Event> {
    return this.httpClientService.post<Event>('Event', eventSetting);
  }

  updateEvent(body: any): Observable<Event> {
    return this.httpClientService.patch<Event>('Event', body);
  }

  updateEventImage(id: number, file: string): Observable<FileResponse> {
    return this.httpClientService.post<FileResponse>(`event/${id}/image`, {
      file: file,
    });
  }

  getEventDetail(id: number): Observable<Event> {
    return this.httpClientService.get<Event>(`Event/${id}`);
  }

  getEventList(): Observable<EventList> {
    return this.httpClientService.get<EventList>('Event');
  }

  deleteEvent() {}
}
