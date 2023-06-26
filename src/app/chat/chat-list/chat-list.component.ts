import { EventService } from './../../core/event.service';
import { UserService } from 'src/app/core/user.service';
import { Component, OnInit } from '@angular/core';
import { Auth, User, user } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  collectionData,
  orderBy,
  query,
  where
} from '@angular/fire/firestore';
import { Observable, firstValueFrom, take } from 'rxjs';
import { Chat } from '../models/chat.models';
import {
  EventImageResponse,
  ProfilePictureResponse
} from 'src/app/core/models/core.model';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {
  constructor(
    private readonly firestore: Firestore,
    private readonly auth: Auth,
    private readonly userService: UserService,
    private readonly eventService: EventService
  ) {}

  chats$!: Observable<Chat[]>;
  user: User | null = null;
  memberPictureUrls: ProfilePictureResponse[] = []; // TODO: use a service and cache this
  eventImages: EventImageResponse[] = []; // TODO: use a service and cache this

  async ngOnInit() {
    this.user = await this.getUser();
    if (!this.user) {
      throw new Error('User is not logged in');
    }
    this.chats$ = this.getUserChats(this.user.uid);
    this.memberPictureUrls = await this.getMembersProfilePictureUrl(
      this.chats$
    );
    this.eventImages = await this.getEventImages(this.chats$);
  }

  private async getUser(): Promise<User | null> {
    return firstValueFrom(user(this.auth));
  }

  private getUserChats(userId: string) {
    const chatsQuery = query(
      collection(this.firestore, 'chats'),
      where('members', 'array-contains', userId),
      orderBy('latestMessage.timestamp', 'desc') // sorting added here
    );

    return collectionData(chatsQuery) as Observable<Chat[]>;
  }

  private async getMembersProfilePictureUrl(chat$: Observable<Chat[]>) {
    const chats = await firstValueFrom(chat$);
    const userIds = new Set<number>();
    for (const chat of chats) {
      const otherMemberFirebaseUids = chat.members.filter(
        (firebaseUid) => firebaseUid !== this.user!.uid
      );
      for (const otherMemberFirebaseUid of otherMemberFirebaseUids) {
        userIds.add(chat.memberInfos[otherMemberFirebaseUid].serverUid);
      }
    }
    if (!userIds.size) return [];
    return this.userService.getProfilePictureUrls(Array.from(userIds));
  }

  private async getEventImages(chat$: Observable<Chat[]>) {
    const chats = await firstValueFrom(chat$);
    const eventIds = new Set<number>();
    for (const chat of chats) {
      if (chat.eventInfo?.eventId) {
        eventIds.add(chat.eventInfo?.eventId);
      }
    }
    if (!eventIds.size) return [];
    return firstValueFrom(
      this.eventService.getEventImages(Array.from(eventIds))
    );
  }
}
