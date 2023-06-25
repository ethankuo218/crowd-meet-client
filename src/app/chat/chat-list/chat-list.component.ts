import { UserService } from 'src/app/core/user.service';
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
import { ProfilePictureResponse } from 'src/app/core/models/core.model';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {
  constructor(
    private readonly firestore: Firestore,
    private readonly auth: Auth,
    private readonly userService: UserService
  ) {}

  chats$!: Observable<Chat[]>;
  user: User | null = null;
  profilePictureUrls: ProfilePictureResponse[] = [];

  async ngOnInit() {
    this.user = await this.getUser();
    if (!this.user) {
      throw new Error('User is not logged in');
    }
    this.chats$ = this.getUserChats(this.user.uid);
    this.profilePictureUrls = await this.getProfilePictureUrl(this.chats$);
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

  private async getProfilePictureUrl(chat$: Observable<Chat[]>) {
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
    return this.userService.getProfilePictureUrls(Array.from(userIds));
  }
}
