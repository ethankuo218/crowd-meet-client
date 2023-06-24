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
        path: ':id',
        component: EventDetailComponent
      }
    ]
  }
];

@NgModule({
  declarations: [EventListComponent, EventDetailComponent],
  imports: [
    IonicModule,
    FontAwesomeModule,
    CommonModule,
    RouterModule.forChild(routes),
    ShellModule,
    ListingCardComponent,
    HeaderComponent,
    SwiperModule,
    MatDialogModule
  ]
})
export class EventModule {}
