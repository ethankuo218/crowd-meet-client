import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NotificationsPage } from './notifications.page';
import { NotificationsResolver } from '../notifications/notifications.resolver';
import { NotificationsService } from '../notifications/notifications.service';
import { HeaderComponent } from '../header/header.component';

@NgModule({
  imports: [
    IonicModule,
    FontAwesomeModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: NotificationsPage,
        resolve: {
          data: NotificationsResolver
        }
      }
    ]),
    HeaderComponent
  ],
  declarations: [NotificationsPage],
  providers: [NotificationsResolver, NotificationsService]
})
export class NotificationsPageModule {}
