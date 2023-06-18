import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../components/components.module';
import { ListingPage } from './listing.page';
import { ListingCardComponent } from './listing-card/listing-card.component';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../core/event.service';

const routes: Routes = [
  {
    path: '',
    component: ListingPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    ListingCardComponent,
  ],
  declarations: [ListingPage],
  providers: [EventService],
})
export class ListingPageModule {}
