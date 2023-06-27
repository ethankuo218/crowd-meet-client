import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, map, switchMap, tap } from 'rxjs';
import { EventService } from '../core/event.service';
import { ProfilePictures } from '../core/models/core.model';
import { UserService } from '../core/user.service';
import { Chat, MemberInfo } from './models/chat.models';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private memberPictureUrls: ProfilePictures = {};
  private _memberInfos: { [firebaseUid: string]: MemberInfo } = {};
  private readonly recordedEventIds = new Set<number>();
  private _eventImages: { [eventId: number]: string } = {};
  private readonly recordedChatIds = new Set<string>();
  private readonly recordedServerIds = new Set<number>();
  private _memberPicturesSubject = new BehaviorSubject<ProfilePictures>({});
  private _eventImagesSubject = new BehaviorSubject<{
    [eventId: number]: string;
  }>({});

  constructor(
    private readonly userService: UserService,
    private readonly eventService: EventService
  ) {}

  getMemberPictures(
    chat$: Observable<Chat[]>,
    userId: string
  ): Observable<ProfilePictures> {
    return chat$.pipe(
      map((chats) => {
        const serverUids = new Set<number>();
        for (const chat of chats) {
          if (!this.recordedChatIds.has(chat.chatId)) {
            this.recordedChatIds.add(chat.chatId);
            for (const firebaseUid in chat.memberInfos) {
              if (firebaseUid === userId) continue;
              const serverUid = chat.memberInfos[firebaseUid].serverUid;
              if (!this.recordedServerIds.has(serverUid)) {
                serverUids.add(serverUid);
                this.recordedServerIds.add(serverUid);
              }
            }
          }
        }
        return Array.from(serverUids);
      }),
      filter((serverUids) => serverUids.length > 0),
      switchMap((serverUids) =>
        this.userService.getProfilePictureUrls(serverUids)
      ),
      tap((memberPictureUrls) => {
        this.memberPictureUrls = {
          ...this.memberPictureUrls,
          ...memberPictureUrls
        };
        this._memberPicturesSubject.next(this.memberPictureUrls);
      })
    );
  }

  getEventImages(
    chat$: Observable<Chat[]>
  ): Observable<{ [eventId: number]: string }> {
    return chat$.pipe(
      map((chats) => {
        const eventIds = new Set<number>();
        for (const chat of chats) {
          const eventId = chat.eventInfo?.eventId;
          if (eventId && !this.recordedEventIds.has(eventId)) {
            eventIds.add(eventId);
            this.recordedEventIds.add(eventId);
          }
        }
        return Array.from(eventIds);
      }),
      filter((eventIds) => eventIds.length > 0),
      switchMap((eventIds) => this.eventService.getEventImages(eventIds)),
      tap((eventImageResponses) => {
        eventImageResponses.forEach((res) => {
          this._eventImages[res.eventId] = res.imageUrl;
        });
        this._eventImagesSubject.next(this._eventImages);
      }),
      map(() => this._eventImages)
    );
  }

  set memberInfos(info: { [firebaseUid: string]: MemberInfo }) {
    this._memberInfos = { ...this._memberInfos, ...info };
  }

  get memberInfos() {
    return this._memberInfos;
  }

  get memberPictures$() {
    return this._memberPicturesSubject.asObservable();
  }

  get eventImages$() {
    return this._eventImagesSubject.asObservable();
  }
}
