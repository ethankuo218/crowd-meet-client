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
import { Observable, take } from 'rxjs';
import { ChatMessage, ReadInfo } from '../models/chat.models';

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

  async ngOnInit() {
    this.messages$ = this.getChatMessages(this.chatId);
    this.user$.pipe(take(1)).subscribe(async (user) => {
      this.user = user;
      await this.setReadInfo();
      await this.updateReadTimeStamp();
    });
  }

  ngOnDestroy() {
    this.updateReadTimeStamp();
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
    const message: ChatMessage = {
      senderId: this.user!.uid,
      content: messageText,
      timestamp: sentTime
    };

    const messagesCollection = collection(
      this.firestore,
      'chats',
      this.chatId,
      'messages'
    );
    // Update the read timestamp within the sendMessage transaction
    this.readInfos[this.user!.uid].readTimestamp = sentTime;

    // Send the message and update the chat's readInfos in a batch
    await runTransaction(this.firestore, async (transaction) => {
      const newMessageRef = doc(messagesCollection);
      transaction.set(
        this.chatDoc,
        { latestMessage: message, readInfos: this.readInfos },
        { merge: true }
      );
      transaction.set(newMessageRef, message);
    });

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

  get memberPictureUrls() {
    return this.chatService.memberPictures;
  }
}
