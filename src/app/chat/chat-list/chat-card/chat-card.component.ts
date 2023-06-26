import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Chat } from '../../models/chat.models';
import { User } from '@angular/fire/auth';
import { EventImageResponse } from 'src/app/core/models/core.model';
import { ChatService } from '../../chat.service';

@Component({
  selector: 'app-chat-card',
  templateUrl: './chat-card.component.html',
  styleUrls: ['./chat-card.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule]
})
export class ChatCardComponent implements OnInit, OnChanges {
  constructor(
    private readonly router: Router,
    private readonly chatService: ChatService
  ) {}

  @Input() chat!: Chat;
  @Input() user!: User;
  @Input() memberPictureUrls: {
    [firebaseUid: string]: {
      userId: number;
      profilePicture: string | null;
    };
  } = {};
  @Input() eventImages: EventImageResponse[] = [];
  roomName!: string;
  displayTimeHtml!: string;
  roomPictureUrl: string | null = null;

  ngOnInit() {
    this.roomName = this.getRoomName();
    this.displayTimeHtml = this.formatTimestamp(
      this.chat.latestMessage.timestamp
    );
    // this.roomPictureUrl = this.getRoomPictureUrl();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['memberPictureUrls'] && this.chat.type === 'private') {
      this.roomPictureUrl = this.getRoomPictureFromMember();
    }
    if (changes['eventImages'] && this.chat.type === 'event') {
      this.roomPictureUrl = this.getRoomPictureFromEvent();
    }
  }

  navigateToChat() {
    this.chatService.memberInfos = this.chat.memberInfos;
    this.router.navigate(['/app/chat', this.chat.chatId]);
  }

  private formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);

    yesterday.setDate(today.getDate() - 1);

    // Reset hours for today and yesterday
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);

    let formattedDate: string;
    if (date.getTime() >= today.getTime()) {
      formattedDate = 'Today';
    } else if (date.getTime() >= yesterday.getTime()) {
      formattedDate = 'Yesterday';
    } else {
      formattedDate = new Intl.DateTimeFormat('en-US').format(date); // Adjust according to your locale
    }

    // Append time
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strTime = hours + ':' + ('0' + minutes).slice(-2) + ' ' + ampm;

    return `${formattedDate}<br />${strTime}`;
  }

  private getRoomName(): string {
    if (this.chat.type === 'private') {
      const otherMemberId = this.chat.members.find(
        (memberId) => memberId !== this.user.uid
      )!;
      return this.chat.memberInfos[otherMemberId].name;
    }
    return this.chat.eventInfo!.eventTitle;
  }

  private getRoomPictureFromMember(): string | null {
    const otherMemberFirebaseId = this.chat.members.find(
      (memberId) => memberId !== this.user.uid
    )!;

    const url = this.memberPictureUrls?.[otherMemberFirebaseId]?.profilePicture;
    return url ?? null;
  }

  private getRoomPictureFromEvent(): string | null {
    const eventImage = this.eventImages.find(
      (eventImage) => eventImage.eventId === this.chat.eventInfo?.eventId
    );
    return eventImage?.imageUrl ?? null;
  }
}
