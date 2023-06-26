import { ChatImageService } from './../chat-image.service';
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
    private readonly eventService: EventService,
    private readonly chatImageService: ChatImageService
  ) {}

  chats$!: Observable<Chat[]>;
  user: User | null = null;
  memberPictureUrls: ProfilePictureResponse | null = null; // TODO: use a service and cache this
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
    return await this.chatImageService.getMemberPictures(chat$, this.user!.uid);
  }

  private async getEventImages(chat$: Observable<Chat[]>) {
    return await this.chatImageService.getEventImages(chat$);
  }
}
