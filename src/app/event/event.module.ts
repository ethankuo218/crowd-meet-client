import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { ShellModule } from '../shell/shell.module';
import { EventListComponent } from './event-list/event-list.component';
import { ListingCardComponent } from './event-list/listing-card/listing-card.component';
import { HeaderComponent } from '../header/header.component';
import { SwiperModule } from 'swiper/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EventService } from '../core/event.service';
import { FormsModule } from '@angular/forms';
import { FilterComponent } from '../filter/filter.component';
import { ProfileComponent } from '../profile/profile.component';
import { ParticipantsComponent } from './participants/participants.component';
import { MatDialogModule } from '@angular/material/dialog';
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
        component: EventListComponent
      },
      {
        path: 'list/:id',
        component: EventDetailComponent
      },
      {
        path: 'profile/:id',
        component: ProfileComponent
      },
      {
        path: 'participants/:participants',
        component: ParticipantsComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    EventListComponent,
    EventDetailComponent,
    ListingCardComponent,
    ParticipantsComponent
  ],
  imports: [
    IonicModule,
    FontAwesomeModule,
    CommonModule,
    RouterModule.forChild(routes),
    ShellModule,
    HeaderComponent,
    SwiperModule,
    FormsModule,
    FilterComponent,
    ProfileComponent,
    MatDialogModule
  ],
  providers: [EventService]
})
export class EventModule {}
