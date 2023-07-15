import { ImgUploadService } from './img-upload.service';
import { EventListStateFacade } from './states/event-list-state/event-list.state.facade';
import { HttpClientService } from './http-client.service';
import { Injectable } from '@angular/core';
import {
  Event,
  EventComment,
  EventSetting,
  Participant
} from '../event/models/event.model';
import {
  Observable,
  ReplaySubject,
  firstValueFrom,
  from,
  switchMap,
  tap
} from 'rxjs';
import {
  EventAction,
  EventActionResponse,
  EventImageResponse
} from './models/core.model';
import { EventList } from './states/event-list-state/event-list.model';
import { Image } from './states/user-state/user.model';

@Injectable()
export class EventService {
  noMoreContent: boolean = false;
  private currentPage: number = 1;
  private commentSubject: ReplaySubject<EventComment[]> = new ReplaySubject(1);

  constructor(
    private httpClientService: HttpClientService,
    private eventListStateFacade: EventListStateFacade,
    private imgUploadService: ImgUploadService
  ) {}

  createEvent(eventSetting: EventSetting): Observable<Event> {
    return this.httpClientService.post<Event>('event', eventSetting).pipe(
      tap((result: Event) => {
        if (this.imgUploadService.uploadedImagesCount !== 0) {
          this.updateEventImage(result.eventId, 'post').subscribe();
        }
      })
    );
  }

  updateEvent(body: any): Observable<Event> {
    return this.httpClientService.patch<Event>('event', body).pipe(
      tap((result: Event) => {
        if (this.imgUploadService.uploadedImagesCount !== 0) {
          this.updateEventImage(result.eventId, 'put').subscribe();
        }
      })
    );
  }

  selectImage(): Promise<string> {
    return this.imgUploadService.selectImage();
  }

  private updateEventImage(id: number, mode: string): Observable<Image> {
    return from(this.imgUploadService.getUploadedImg()).pipe(
      switchMap((images: Blob[]): Observable<Image> => {
        const formData = new FormData();
        formData.append('file', images[0]);
        return mode === 'post'
          ? this.httpClientService.post<Image>(`event/${id}/image`, formData)
          : this.httpClientService.put<Image>(`event/${id}/image`, formData);
      })
    );
  }

  getEventDetail(id: number): Observable<Event> {
    this.reloadComment(id);
    return this.httpClientService.get<Event>(`event/${id}`);
  }

  getEventList(): Observable<EventList> {
    return this.eventListStateFacade.getEventList();
  }

  async reload(filter: any): Promise<void> {
    this.currentPage = 1;
    console.log({
      ...filter,
      page: this.currentPage,
      pageSize: 10
    });
    const result = await firstValueFrom(
      this.httpClientService.get<EventList>('event', {
        ...filter,
        page: this.currentPage,
        pageSize: 10
      })
    );

    this.eventListStateFacade.storeEventList(result);
  }

  async loadNextPage(filter: any): Promise<void> {
    const result = await firstValueFrom(
      this.httpClientService.get<EventList>('event', {
        ...filter,
        page: ++this.currentPage,
        pageSize: 10
      })
    );

    if (result.data.length === 0) {
      this.currentPage--;
      this.noMoreContent = true;
    } else {
      this.noMoreContent = false;
    }

    this.eventListStateFacade.addEventList(result);
  }

  getEventImages(eventIds: number[]): Observable<EventImageResponse[]> {
    return this.httpClientService.get<EventImageResponse[]>('event/images', {
      eventIds: eventIds.join(',')
    });
  }

  // event comment
  private reloadComment(id: number): void {
    this.httpClientService
      .get<EventComment[]>(`event/${id}/comment`)
      .subscribe({
        next: (result) => {
          this.commentSubject.next(result);
        }
      });
  }

  getComment(): Observable<EventComment[]> {
    return this.commentSubject;
  }

  leaveComment(id: number, content: string) {
    return this.httpClientService
      .post(`event/${id}/comment`, { content: content })
      .pipe(
        tap(() => {
          this.reloadComment(id);
        })
      );
  }

  //event participants
  getParticipants(id: number) {
    return this.httpClientService.get<Participant[]>(
      `event/${id}/participants`
    );
  }

  apply(id: number): Observable<EventActionResponse> {
    return this.httpClientService.post<EventActionResponse>(
      `event/${id}/participant`,
      {}
    );
  }

  leave(id: number): Observable<EventActionResponse> {
    return this.httpClientService.patch<EventActionResponse>(
      `event/${id}/participant/me`,
      {}
    );
  }

  accept(id: number, acceptUsers: number[]): Observable<EventActionResponse> {
    return this.httpClientService.patch<EventActionResponse>(
      `event/${id}/participant`,
      {
        status: EventAction.ACCEPT,
        participantIds: acceptUsers
      }
    );
  }

  decline(
    id: number,
    declinedUsers: number[]
  ): Observable<EventActionResponse> {
    return this.httpClientService.patch<EventActionResponse>(
      `event/${id}/participant`,
      {
        status: EventAction.DECLINE,
        participantIds: declinedUsers
      }
    );
  }

  kick(id: number, userId: number): Observable<EventActionResponse> {
    return this.httpClientService.patch<EventActionResponse>(
      `event/${id}/participant`,
      {
        status: EventAction.KICK,
        participantId: userId
      }
    );
  }
}
