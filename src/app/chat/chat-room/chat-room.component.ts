import { ChatService } from '../chat.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth, User, user } from '@angular/fire/auth';
import {
  Firestore,
  runTransaction,
  collection,
  collectionData,
  limit,
  orderBy,
  query,
  doc,
  getDoc,
  updateDoc
} from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable, ReplaySubject, take, takeUntil } from 'rxjs';
import { ChatMessage, ReadInfo, SendMessageDto } from '../models/chat.models';
import { ProfilePictures } from 'src/app/core/models/core.model';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit, OnDestroy {
  constructor(
    private readonly firestore: Firestore,
    private readonly route: ActivatedRoute,
    private readonly auth: Auth,
    private readonly chatService: ChatService
  ) {}

  readonly chatId: string = this.route.snapshot.paramMap.get('id')!;
  user$ = user(this.auth);
  private user: User | null = null;
  private readInfos: ReadInfo = {};
  messages$!: Observable<ChatMessage[]>;
  private chatDoc = doc(this.firestore, 'chats', this.chatId);
  memberPictureUrls: ProfilePictures = {};
  private unsubscribe$ = new ReplaySubject<void>(1);

  async ngOnInit() {
    this.messages$ = this.getChatMessages(this.chatId);
    this.user$.pipe(take(1)).subscribe(async (user) => {
      this.user = user;
      await this.setReadInfo();
      await this.updateReadTimeStamp();
    });
    this.chatService.memberPictures$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((memberPictures) => {
        this.memberPictureUrls = memberPictures;
      });
  }

  ngOnDestroy() {
    this.updateReadTimeStamp();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private async setReadInfo(): Promise<void> {
    const chatData = (await getDoc(this.chatDoc)).data();
    if (chatData) {
      this.readInfos = chatData['readInfos'];
    }
  }

  public getChatMessages(chatId: string): Observable<ChatMessage[]> {
    const messagesQuery = query(
      collection(this.firestore, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc'),
      limit(100)
    );

    return collectionData(messagesQuery) as Observable<ChatMessage[]>;
  }

  async sendMessage({ target }: Event) {
    const messageText = (target as HTMLInputElement).value;
    if (!messageText) return;
    const sentTime = Date.now();

    const messageBody: SendMessageDto = {
      senderId: this.user!.uid,
      content: messageText,
      sentTimeStamp: sentTime,
      chatId: this.chatId
    };
    this.chatService.sendMessage(messageBody);

    // Clear the input
    (target as HTMLInputElement).value = '';
  }

  async updateReadTimeStamp() {
    if (!this.user) {
      return;
    }
    this.readInfos[this.user.uid].readTimestamp = Date.now();

    // Update the chat's readInfos with the new readTimestamp and unreadCount
    await updateDoc(this.chatDoc, { readInfos: this.readInfos });
  }

  get memberInfos() {
    return this.chatService.memberInfos;
  }
}
