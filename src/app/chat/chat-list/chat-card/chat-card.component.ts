import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Chat } from '../../models/chat.models';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-chat-card',
  templateUrl: './chat-card.component.html',
  styleUrls: ['./chat-card.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule]
})
export class ChatCardComponent implements OnInit {
  constructor() {}

  @Input() chat!: Chat;
  @Input() user!: User;
  roomName!: string;
  displayTimeHtml!: string;

  ngOnInit() {
    console.log(this.chat);
    this.roomName = this.getRoomName();
    this.displayTimeHtml = this.formatTimestamp(
      this.chat.latestMessage.timestamp
    );
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
      const myIndex = this.chat.members.indexOf(this.user.uid);
      return this.chat.memberNames![1 - myIndex];
    }
    return 'not implemented';
  }
}
