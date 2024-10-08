import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryComponent } from './history.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTabsModule } from '@angular/material/tabs';
import { EventService } from '../core/event.service';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { EventDetailComponent } from '../event/event-detail/event-detail.component';
import { DirectivesModule } from '../directives/directives.module';

const routes: Routes = [
  {
    path: '',
    component: HistoryComponent
  },
  {
    path: 'reviews',
    loadChildren: () =>
      import('./reviews/reviews.module').then((m) => m.ReviewsModule)
  },
  {
    path: 'detail/:id',
    component: EventDetailComponent
  }
];

@NgModule({
  declarations: [HistoryComponent],
  imports: [
    IonicModule,
    FontAwesomeModule,
    CommonModule,
    RouterModule.forChild(routes),
    HeaderComponent,
    MatTabsModule,
    MatDialogModule,
    TranslateModule,
    EventDetailComponent,
    DirectivesModule
  ],
  providers: [EventService]
})
export class HistoryModule {}
