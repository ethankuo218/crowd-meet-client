import { ChatService } from '../chat.service';
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
import { EventImageResponse } from 'src/app/core/models/core.model';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {
  constructor(
    private readonly firestore: Firestore,
    private readonly auth: Auth,
    private readonly chatService: ChatService
  ) {}

  chats$!: Observable<Chat[]>;
  user: User | null = null;
  eventImages: EventImageResponse[] = [];

  async ngOnInit() {
    this.user = await this.getUser();
    if (!this.user) {
      throw new Error('User is not logged in');
    }
    this.chats$ = this.getUserChats(this.user.uid);
    this.chatService.getMemberPictures(this.chats$, this.user!.uid).subscribe();
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

  private async getEventImages(chat$: Observable<Chat[]>) {
    return await this.chatService.getEventImages(chat$);
  }

  get memberPictureUrls() {
    return this.chatService.memberPictures;
  }
}
