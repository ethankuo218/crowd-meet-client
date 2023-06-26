import { Injectable } from '@angular/core';
import { Observable, filter, firstValueFrom, map, switchMap, tap } from 'rxjs';
import { EventService } from '../core/event.service';
import { EventImageResponse, ProfilePictures } from '../core/models/core.model';
import { UserService } from '../core/user.service';
import { Chat, MemberInfo } from './models/chat.models';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private memberPictureUrls: ProfilePictures = {};
  private eventImages: EventImageResponse[] = [];
  private _memberInfos: { [firebaseUid: string]: MemberInfo } = {};
  private readonly recordedChatIds = new Set<string>();
  private readonly recordedServerIds = new Set<number>();

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
        console.log(this.memberPictureUrls);
      })
    );
  }

  async getEventImages(chat$: Observable<Chat[]>) {
    if (this.eventImages.length === 0) {
      const chats = await firstValueFrom(chat$);
      const eventIds = new Set<number>();
      for (const chat of chats) {
        if (chat.eventInfo?.eventId) {
          eventIds.add(chat.eventInfo?.eventId);
        }
      }
      if (eventIds.size) {
        this.eventImages = await firstValueFrom(
          this.eventService.getEventImages(Array.from(eventIds))
        );
      }
    }

    return this.eventImages;
  }

  set memberInfos(info: { [firebaseUid: string]: MemberInfo }) {
    this._memberInfos = { ...this._memberInfos, ...info };
  }

  get memberInfos() {
    return this._memberInfos;
  }

  get memberPictures() {
    return this.memberPictureUrls ?? {};
  }
}
