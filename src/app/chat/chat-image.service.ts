import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { EventService } from '../core/event.service';
import {
  ProfilePictureResponse,
  EventImageResponse
} from '../core/models/core.model';
import { UserService } from '../core/user.service';
import { Chat } from './models/chat.models';

@Injectable({
  providedIn: 'root'
})
export class ChatImageService {
  private memberPictureUrls: ProfilePictureResponse[] = [];
  private eventImages: EventImageResponse[] = [];

  constructor(
    private readonly userService: UserService,
    private readonly eventService: EventService
  ) {}

  async getMemberPictures(chat$: Observable<Chat[]>, userId: string) {
    if (this.memberPictureUrls.length === 0) {
      const chats = await firstValueFrom(chat$);
      const userIds = new Set<number>();
      for (const chat of chats) {
        const otherMemberFirebaseUids = chat.members.filter(
          (firebaseUid) => firebaseUid !== userId
        );
        for (const otherMemberFirebaseUid of otherMemberFirebaseUids) {
          userIds.add(chat.memberInfos[otherMemberFirebaseUid].serverUid);
        }
      }
      if (userIds.size) {
        this.memberPictureUrls = await this.userService.getProfilePictureUrls(
          Array.from(userIds)
        );
      }
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
}
