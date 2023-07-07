import { ImgUploadService } from './img-upload.service';
import { EventListStateFacade } from './states/event-list-state/event-list.state.facade';
import { HttpClientService } from './http-client.service';
import { Injectable } from '@angular/core';
import { Event, EventSetting } from '../event/models/event.model';
import { Observable, from, switchMap, tap } from 'rxjs';
import { EventImageResponse } from './models/core.model';
import { EventList } from './states/event-list-state/event-list.model';
import { Image } from './states/user-state/user.model';

@Injectable()
export class EventService {
  private currentPage: number = 1;

  constructor(
    private httpClientService: HttpClientService,
    private eventListStateFacade: EventListStateFacade,
    private imgUploadService: ImgUploadService
  ) {}

  createEvent(eventSetting: EventSetting): Observable<Event> {
    return this.httpClientService.post<Event>('event', eventSetting).pipe(
      tap((result: Event) => {
        if (this.imgUploadService.uploadedImagesCount !== 0) {
          this.updateEventImage(result.eventId).subscribe();
        }
      })
    );
  }

  updateEvent(body: any): Observable<Event> {
    return this.httpClientService.patch<Event>('event', body);
  }

  selectImage(): Promise<string> {
    return this.imgUploadService.selectImage();
  }

  private updateEventImage(id: number): Observable<Image> {
    return from(this.imgUploadService.getUploadedImg()).pipe(
      switchMap((images: Blob[]): Observable<Image> => {
        const formData = new FormData();
        formData.append('file', images[0]);
        console.log(formData.get('file'));
        return this.httpClientService.post<Image>(
          `event/${id}/image`,
          formData
        );
      })
    );
  }

  getEventDetail(id: number): Observable<Event> {
    return this.httpClientService.get<Event>(`event/${id}`);
  }

  getEventList(): Observable<EventList> {
    return this.eventListStateFacade.getEventList();
  }

  reloadEventList(): void {
    this.currentPage = 1;
    this.httpClientService
      .get<EventList>('event', { page: this.currentPage, pageSize: 10 })
      .subscribe({
        next: (result) => {
          this.eventListStateFacade.storeEventList(result);
        }
      });
  }

  loadNextPage(): void {
    this.httpClientService
      .get<EventList>('event', { page: ++this.currentPage, pageSize: 10 })
      .subscribe({
        next: (result) => {
          this.eventListStateFacade.addEventList(result);
        }
      });
  }

  getEventImages(eventIds: number[]): Observable<EventImageResponse[]> {
    return this.httpClientService.get<EventImageResponse[]>('event/images', {
      eventIds: eventIds.join(',')
    });
  }

  deleteEvent() {}
}
