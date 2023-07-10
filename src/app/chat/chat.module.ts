import { ChatService } from './chat.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { HeaderComponent } from '../header/header.component';
import { ChatCardComponent } from './chat-list/chat-card/chat-card.component';
import { EventService } from '../core/event.service';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: ChatListComponent
      },
      {
        path: 'list/:id',
        component: ChatRoomComponent
      }
    ]
  }
];

@NgModule({
  declarations: [ChatListComponent, ChatRoomComponent],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule.forChild(routes),
    HeaderComponent,
    ChatCardComponent
  ],
  providers: [EventService, ChatService]
})
export class ChatModule {}
