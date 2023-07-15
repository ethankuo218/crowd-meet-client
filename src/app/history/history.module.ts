import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryComponent } from './history.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTabsModule } from '@angular/material/tabs';
import { JoinerListComponent } from './joiner-list/joiner-list.component';
import { EventService } from '../core/event.service';

const routes: Routes = [
  {
    path: '',
    component: HistoryComponent
  },
  {
    path: 'joiner-list/:id',
    component: JoinerListComponent
  }
];

@NgModule({
  declarations: [HistoryComponent, JoinerListComponent],
  imports: [
    IonicModule,
    FontAwesomeModule,
    CommonModule,
    RouterModule.forChild(routes),
    HeaderComponent,
    MatTabsModule
  ],
  providers: [EventService]
})
export class HistoryModule {}
