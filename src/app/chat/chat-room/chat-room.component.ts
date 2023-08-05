import { ChatService } from '../chat.service';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject
} from '@angular/core';
import { Auth, User, user } from '@angular/fire/auth';
import {
  Firestore,
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
import { Observable, ReplaySubject, take, takeUntil, tap } from 'rxjs';
import { ChatMessage, ReadInfo, SendMessageDto } from '../models/chat.models';
import { ProfilePictures } from 'src/app/core/models/core.model';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit, OnDestroy {
  private readonly firestore = inject(Firestore);
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(Auth);
  private readonly chatService = inject(ChatService);

  @ViewChild('content') private content!: IonContent;
  @ViewChild('inputMessage') private inputMessage!: ElementRef;

  readonly chatId: string = this.route.snapshot.paramMap.get('id')!;
  user$ = user(this.auth);
  private user: User | null = null;
  private readInfos: ReadInfo = {};
  messages$!: Observable<ChatMessage[]>;
  private chatDoc = doc(this.firestore, 'chats', this.chatId);
  memberPictureUrls: ProfilePictures = {};
  private unsubscribe$ = new ReplaySubject<void>(1);

  async ngOnInit() {
    this.messages$ = this.getChatMessages(this.chatId).pipe(
      tap(() => {
        this.scrollToBottom(500);
      })
    );
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

  async sendMessage(): Promise<void> {
    const messageText = this.inputMessage.nativeElement.value;
    if (!messageText) return;
    const sentTime = Date.now();

    const messageBody: SendMessageDto = {
      senderId: this.user!.uid,
      content: messageText,
      sentTimeStamp: sentTime,
      chatId: this.chatId
    };
    await this.chatService.sendMessage(messageBody);

    // Clear the input
    this.inputMessage.nativeElement.value = '';
  }

  async updateReadTimeStamp() {
    if (!this.user) {
      return;
    }
    this.readInfos[this.user.uid].readTimestamp = Date.now();

    // Update the chat's readInfos with the new readTimestamp and unreadCount
    await updateDoc(this.chatDoc, { readInfos: this.readInfos });
  }

  scrollToBottom(delay: number): void {
    setTimeout(() => {
      this.content.scrollToBottom(300);
    }, delay);
  }

  get memberInfos() {
    return this.chatService.memberInfos;
  }
}
