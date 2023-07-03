import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Chat } from '../../models/chat.models';
import { User } from '@angular/fire/auth';
import { ProfilePictures } from 'src/app/core/models/core.model';
import { ChatService } from '../../chat.service';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-chat-card',
  templateUrl: './chat-card.component.html',
  styleUrls: ['./chat-card.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule]
})
export class ChatCardComponent implements OnInit, OnDestroy {
  constructor(
    private readonly router: Router,
    private readonly chatService: ChatService
  ) {}

  @Input() chat!: Chat;
  @Input() user!: User;
  @Input() memberPictureUrls$: Observable<ProfilePictures> | null = null;
  @Input() eventImageUrls$: Observable<{ [eventId: number]: string }> | null =
    null;
  roomName!: string;
  displayTimeHtml!: string;
  roomPictureUrl: string | null = null;
  private readonly destroy$ = new ReplaySubject<void>(1);

  ngOnInit() {
    this.roomName = this.getRoomName();
    this.displayTimeHtml = this.formatTimestamp(
      this.chat.latestMessage.timestamp
    );

    this.memberPictureUrls$
      ?.pipe(takeUntil(this.destroy$))
      .subscribe((memberPictureUrls) => {
        if (this.chat.type === 'private') {
          this.roomPictureUrl =
            this.getRoomPictureFromMember(memberPictureUrls);
        }
      });

    this.eventImageUrls$
      ?.pipe(takeUntil(this.destroy$))
      .subscribe((eventImageUrls) => {
        if (this.chat.type === 'event') {
          this.roomPictureUrl = eventImageUrls[this.chat.eventInfo!.eventId];
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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

  private getRoomPictureFromMember(
    memberPictureUrls: ProfilePictures
  ): string | null {
    const otherMemberFirebaseId = this.chat.members.find(
      (memberId) => memberId !== this.user.uid
    )!;

    const url = memberPictureUrls?.[otherMemberFirebaseId]?.profilePicture;
    return url || null;
  }
}
