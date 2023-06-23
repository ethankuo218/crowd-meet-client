import { Component, OnInit } from '@angular/core';
import { Auth, User, user } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where
} from '@angular/fire/firestore';
import { Observable, firstValueFrom, take } from 'rxjs';
import { Chat } from '../models/chat.models';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {
  constructor(
    private readonly firestore: Firestore,
    private readonly auth: Auth
  ) {}

  chats$!: Observable<Chat[]>;
  user: User | null = null;

  async ngOnInit() {
    this.user = await this.getUser();
    if (!this.user) {
      throw new Error('User is not logged in');
    }
    this.chats$ = this.getUserChats(this.user.uid);
  }

  private async getUser(): Promise<User | null> {
    return firstValueFrom(user(this.auth));
  }

  private getUserChats(userId: string) {
    const chatsQuery = query(
      collection(this.firestore, 'chats'),
      where('members', 'array-contains', userId)
    );

    return collectionData(chatsQuery) as Observable<Chat[]>;
  }
}
