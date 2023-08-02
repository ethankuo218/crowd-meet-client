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
import { Observable, ReplaySubject, firstValueFrom } from 'rxjs';
import { EventActionResponse, EventImageResponse } from './models/core.model';
import { EventList } from './+states/event-list-state/event-list.model';
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

  // event list
  getEventList(): Observable<EventList> {
    return this.eventListStateFacade.getEventList();
  }

  async reload(): Promise<void> {
    this._isLoading = true;
    this.currentPage = 1;
    const result = await firstValueFrom(
      this.httpClientService.get<EventList>('event', {
        page: this.currentPage,
        pageSize: 10,
        startDate: new Date().toISOString(),
        ...this.userLocation,
        ...this._filter
      })
    );

    this._isLoading = false;
    this.eventListStateFacade.storeEventList(result);
  }

  async loadNextPage(): Promise<void> {
    const { latitude, longitude } = (await Geolocation.getCurrentPosition())
      .coords;
    const result = await firstValueFrom(
      this.httpClientService.get<EventList>('event', {
        page: ++this.currentPage,
        pageSize: 10,
        lat: latitude,
        lng: longitude,
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
    return this.httpClientService.get<Event>(`event/${id}`);
  }

  async createEvent(eventSetting: EventSetting): Promise<void> {
    this.admobService.showInterstitial();

    const eventCreateResult = await firstValueFrom(
      this.httpClientService.post<Event>('event', eventSetting)
    );

    if (this.imgUploadService.uploadedImagesCount !== 0) {
      this.updateEventImage(eventCreateResult.eventId, 'post');
    }

    this.reload();
  }

  async updateEvent(id: number, body: any): Promise<void> {
    this.admobService.showInterstitial();

    const eventPatchResult = await firstValueFrom(
      this.httpClientService.patch<Event>(`event/${id}`, body)
    );

    if (this.imgUploadService.uploadedImagesCount !== 0) {
      this.updateEventImage(eventPatchResult.eventId, 'put');
    }

    this.reload();
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

    this.router.navigate(['app/history']);
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

  async apply(id: number): Promise<void> {
    await this.loadingService.present();
    try {
      await this.admobService.showReward(AdOption.EVENT_JOIN);
      console.log('Get Reward');
      await firstValueFrom(
        this.httpClientService.post<EventActionResponse>(
          `event/${id}/participant`,
          {}
        )
      );
      this.router.navigate(['/app/history']);
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
    await this.admobService.showReward(AdOption.KICK);
    await firstValueFrom(
      this.httpClientService.patch<EventActionResponse>(
        `event/${id}/participant`,
        {
          status: EventStatus.kicked,
          participantId: userId
        }
      )
    );
    this.loadingService.dismiss();
  }

  // others
  getUserLocation(): void {
    Geolocation.getCurrentPosition().then((result) => {
      this.userLocation = {
        lat: result.coords.latitude,
        lng: result.coords.longitude
      };
    });
  }

  get noMoreContent(): boolean {
    return this._noMoreContent;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get filter() {
    return this._filter;
  }

  set filter(val: any) {
    this._filter = val;
  }
}
