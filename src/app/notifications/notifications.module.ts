import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NotificationsPage } from './notifications.page';
import { NotificationsService } from '../notifications/notifications.service';
import { HeaderComponent } from '../header/header.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    IonicModule,
    FontAwesomeModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: NotificationsPage
      }
    ]),
    HeaderComponent,
    TranslateModule
  ],
  declarations: [NotificationsPage],
  providers: [NotificationsService]
})
export class NotificationsPageModule {}
