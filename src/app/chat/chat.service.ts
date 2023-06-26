import { Injectable } from '@angular/core';
import { Observable, filter, firstValueFrom } from 'rxjs';
import { EventService } from '../core/event.service';
import {
  ProfilePictureResponse,
  EventImageResponse
} from '../core/models/core.model';
import { UserService } from '../core/user.service';
import { Chat, MemberInfo } from './models/chat.models';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private memberPictureUrls: ProfilePictureResponse | null = null;
  private eventImages: EventImageResponse[] = [];
  private _memberInfos: { [firebaseUid: string]: MemberInfo } = {};

  constructor(
    private readonly userService: UserService,
    private readonly eventService: EventService
  ) {}

  async getMemberPictures(chat$: Observable<Chat[]>, userId: string) {
    if (this.memberPictureUrls) return this.memberPictureUrls;
    const chats = await firstValueFrom(chat$);
    const serverUids = new Set<number>();
    for (const chat of chats) {
      const otherMemberFirebaseUids = chat.members.filter(
        (firebaseUid) => firebaseUid !== userId
      );
      for (const otherMemberFirebaseUid of otherMemberFirebaseUids) {
        serverUids.add(chat.memberInfos[otherMemberFirebaseUid].serverUid);
      }
    }
    if (serverUids.size) {
      this.memberPictureUrls = await this.userService.getProfilePictureUrls(
        Array.from(serverUids)
      );
    }

    return this.memberPictureUrls;
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
    return this.memberPictureUrls?.images;
  }
}
