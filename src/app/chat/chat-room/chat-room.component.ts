import { Component, OnInit, inject } from '@angular/core';
import { Auth, User, user } from '@angular/fire/auth';
import {
  DocumentReference,
  Firestore,
  addDoc,
  collection,
  collectionData,
  limit,
  orderBy,
  query
} from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable, take } from 'rxjs';
import { ChatMessage } from '../models/chat.models';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit {
  constructor(
    private readonly firestore: Firestore,
    private readonly route: ActivatedRoute
  ) {}

  readonly chatId: string = this.route.snapshot.paramMap.get('id')!;
  private auth: Auth = inject(Auth);
  user$ = user(this.auth);
  private user: User | null = null;
  messages$!: Observable<ChatMessage[]>;

  ngOnInit() {
    this.messages$ = this.getChatMessages(this.chatId);
    this.user$.pipe(take(1)).subscribe((user) => (this.user = user));
  }

  public getChatMessages(chatId: string): Observable<ChatMessage[]> {
    const messagesQuery = query(
      collection(this.firestore, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc'),
      limit(100)
    );

    return collectionData(messagesQuery) as Observable<ChatMessage[]>;
  }

  sendMessage({ target }: Event) {
    const messageText = (target as HTMLInputElement).value;
    if (!messageText) return;
    const message: ChatMessage = {
      senderId: this.user!.uid,
      content: messageText,
      timestamp: Date.now()
    };

    const messagesCollection = collection(
      this.firestore,
      'chats',
      this.chatId,
      'messages'
    );
    return addDoc(messagesCollection, message);
  }
}
