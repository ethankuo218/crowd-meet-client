import { AdOption, AdmobService } from './admob.service';
import { ImgUploadService } from './img-upload.service';
import { EventListStateFacade } from './+states/event-list-state/event-list.state.facade';
import { HttpClientService } from './http-client.service';
import { Injectable, inject } from '@angular/core';
import {
  Event,
  EventComment,
  EventSetting,
  GetParticipantsResponse
} from '../event/models/event.model';
import { Observable, ReplaySubject, firstValueFrom, tap } from 'rxjs';
import { EventActionResponse, EventImageResponse } from './models/core.model';
import {
  BoostedEvent,
  EventList
} from './+states/event-list-state/event-list.model';
import { EventStatus, Image } from './+states/user-state/user.model';
import { Geolocation } from '@capacitor/geolocation';
import { LoadingService } from './loading.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class EventService {
  private httpClientService = inject(HttpClientService);
  private eventListStateFacade = inject(EventListStateFacade);
  private imgUploadService = inject(ImgUploadService);
  private admobService = inject(AdmobService);
  private loadingService = inject(LoadingService);
  private router = inject(Router);

  private currentPage: number = 1;
  private commentSubject: ReplaySubject<EventComment[]> = new ReplaySubject(1);
  private _noMoreContent: boolean = false;
  private _isLoading: boolean = false;
  private _filter: any;
  private userLocation: { lat: number; lng: number } | undefined;
  private _currentEventDetail: Event | undefined;

  // event list
  getEventList(): Observable<EventList> {
    return this.eventListStateFacade.getEventList();
  }

  getBoostedEvent(): Observable<BoostedEvent[]> {
    return this.eventListStateFacade.getBoostedEvents();
  }

  async reload(): Promise<void> {
    this._isLoading = true;
    this.currentPage = 1;

    const hasPermission =
      (await Geolocation.checkPermissions()).location !== 'denied';
    const { latitude, longitude } = hasPermission
      ? (await Geolocation.getCurrentPosition()).coords
      : { latitude: undefined, longitude: undefined };
    const eventList = await firstValueFrom(
      this.httpClientService.get<EventList>('event', {
        page: this.currentPage,
        pageSize: 10,
        startDate: new Date().toISOString(),
        ...(latitude && { lat: latitude }),
        ...(longitude && { lng: longitude }),
        ...this._filter
      })
    );
    const boostedEvents = await firstValueFrom(
      this.httpClientService.get<BoostedEvent[]>('event/boosted-events', {
        ...this.userLocation
      })
    );

    setTimeout(() => {
      this._isLoading = false;
    }, 300);

    if (eventList.data.length === 0) {
      this._noMoreContent = true;
    } else {
      this._noMoreContent = false;
    }

    this.eventListStateFacade.storeEventList(eventList);
    this.eventListStateFacade.storeBoostedEvents(boostedEvents);
  }

  async loadNextPage(): Promise<void> {
    const hasPermission =
      (await Geolocation.checkPermissions()).location !== 'denied';
    const { latitude, longitude } = hasPermission
      ? (await Geolocation.getCurrentPosition()).coords
      : { latitude: undefined, longitude: undefined };
    const result = await firstValueFrom(
      this.httpClientService.get<EventList>('event', {
        page: ++this.currentPage,
        pageSize: 10,
        ...(latitude && { lat: latitude }),
        ...(longitude && { lng: longitude }),
        startDate: new Date().toISOString(),
        ...this._filter
      })
    );

    if (result.data.length === 0) {
      this.currentPage--;
      this._noMoreContent = true;
    } else {
      this._noMoreContent = false;
    }

    this.eventListStateFacade.addEventList(result);
  }

  // event detail
  getEventDetail(id: number): Observable<Event> {
    this.reloadComment(id);
    return this.httpClientService.get<Event>(`event/${id}`).pipe(
      tap((result) => {
        this._currentEventDetail = result;
      })
    );
  }

  async createEvent(eventSetting: EventSetting): Promise<void> {
    try {
      await this.admobService.showReward(AdOption.CREATE_EVENT);
      const eventCreateResult = await firstValueFrom(
        this.httpClientService.post<Event>('event', eventSetting)
      );

      if (this.imgUploadService.uploadedImagesCount !== 0) {
        await this.updateEventImage(eventCreateResult.eventId, 'post');
      }
      this.reload();

      this.router.navigate(['app/history']);
    } catch (error) {
      // show no ad modal
      throw error;
    }
  }

  async updateEvent(id: number, body: any): Promise<void> {
    try {
      const eventPatchResult = await firstValueFrom(
        this.httpClientService.patch<Event>(`event/${id}`, body)
      );

      if (this.imgUploadService.uploadedImagesCount !== 0) {
        await this.updateEventImage(eventPatchResult.eventId, 'put');
      }

      this.reload();

      this.router.navigate(['app/history']);
    } catch (error) {
      throw error;
    }
  }

  // event image
  selectImage(): Promise<string> {
    return this.imgUploadService.selectImage();
  }

  private async updateEventImage(id: number, mode: string): Promise<void> {
    const formData = new FormData();
    formData.append('file', (await this.imgUploadService.getUploadedImg())[0]);

    if (mode === 'post') {
      await firstValueFrom(
        this.httpClientService.post<Image>(`event/${id}/image`, formData)
      );
    } else {
      await firstValueFrom(
        this.httpClientService.put<Image>(`event/${id}/image`, formData)
      );
    }
  }

  getEventImages(eventIds: number[]): Observable<EventImageResponse[]> {
    return this.httpClientService.get<EventImageResponse[]>('event/images', {
      eventIds: eventIds
    });
  }

  // event comment
  getComment(): Observable<EventComment[]> {
    return this.commentSubject;
  }

  leaveComment(id: number, content: string): void {
    this.httpClientService
      .post(`event/${id}/comment`, { content: content })
      .subscribe({
        next: () => {
          this.reloadComment(id);
        }
      });
  }

  private reloadComment(id: number): void {
    this.httpClientService
      .get<EventComment[]>(`event/${id}/comment`)
      .subscribe({
        next: (result) => {
          this.commentSubject.next(result);
        }
      });
  }

  //event participants
  getParticipants(id: number) {
    return this.httpClientService.get<GetParticipantsResponse>(
      `event/${id}/participants`
    );
  }

  async unlockedParticipants(id: number) {
    await this.loadingService.present();
    try {
      await this.admobService.showReward(AdOption.VIEW_PARTICIPANT);
      await firstValueFrom(
        this.httpClientService.post(`event/${id}/unlocked-participants`, {})
      );
    } catch (error) {
      throw error;
    } finally {
      this.loadingService.dismiss();
    }
  }

  async apply(id: number): Promise<void> {
    await this.loadingService.present();
    try {
      await this.admobService.showReward(AdOption.JOIN_EVENT);
      this.httpClientService
        .post<EventActionResponse>(`event/${id}/participant`, {})
        .subscribe(() => {
          this.router.navigate(['app/history']);
        });
    } catch (error) {
      throw error;
    } finally {
      this.loadingService.dismiss();
    }
  }

  async leave(id: number): Promise<void> {
    await firstValueFrom(
      this.httpClientService.patch<EventActionResponse>(
        `event/${id}/participant/me`,
        {}
      )
    );
  }

  async accept(id: number, acceptUsers: number[]): Promise<void> {
    await firstValueFrom(
      this.httpClientService.patch<EventActionResponse>(
        `event/${id}/participant`,
        {
          status: EventStatus.accepted,
          participantIds: acceptUsers
        }
      )
    );
  }

  async decline(id: number, declinedUsers: number[]): Promise<void> {
    await firstValueFrom(
      this.httpClientService.patch<EventActionResponse>(
        `event/${id}/participant`,
        {
          status: EventStatus.declined,
          participantIds: declinedUsers
        }
      )
    );
  }

  async kick(id: number, userId: number): Promise<void> {
    await this.loadingService.present();
    try {
      await this.admobService.showReward(AdOption.KICK_PARTICIPANT);
      await firstValueFrom(
        this.httpClientService.patch<EventActionResponse>(
          `event/${id}/participant`,
          {
            status: EventStatus.kicked,
            participantId: userId
          }
        )
      );
    } catch (error) {
      throw error;
    } finally {
      this.loadingService.dismiss();
    }
  }

  get noMoreContent(): boolean {
    return this._noMoreContent;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get currentEventDetail() {
    return this._currentEventDetail;
  }

  get filter() {
    return this._filter;
  }

  set filter(val: any) {
    this._filter = val;
  }
}
