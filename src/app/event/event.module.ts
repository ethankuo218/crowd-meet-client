import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { EventDetailComponent } from './event-detail/event-detail.component';
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
import { JoinerListComponent } from './joiner-list/joiner-list.component';
import { Calendar } from '@awesome-cordova-plugins/calendar/ngx';
import { TranslateModule } from '@ngx-translate/core';
import { DirectivesModule } from '../directives/directives.module';
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
        path: 'participants/:id',
        component: ParticipantsComponent
      },
      {
        path: 'joiner-list/:id',
        component: JoinerListComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    EventListComponent,
    ListingCardComponent,
    ParticipantsComponent,
    JoinerListComponent
  ],
  imports: [
    IonicModule,
    FontAwesomeModule,
    CommonModule,
    RouterModule.forChild(routes),
    HeaderComponent,
    SwiperModule,
    FormsModule,
    FilterComponent,
    ProfileComponent,
    MatDialogModule,
    TranslateModule,
    EventDetailComponent,
    DirectivesModule
  ],
  providers: [EventService, Calendar]
})
export class EventModule {}
