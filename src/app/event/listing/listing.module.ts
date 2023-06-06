import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../components/components.module';

import { HomeService } from '../home.service';
import { ListingPage } from './listing.page';
import { ListingResolver } from './listing.resolver';
import { ListingPlainResolver } from './listing.plain.resolver';
import { ListingCardComponent } from './listing-card/listing-card.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: ListingPage,
    resolve: {
      data: ListingResolver,
      // data: TravelListingPlainResolver
    },
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    ListingCardComponent
  ],
  declarations: [ListingPage],
  providers: [ListingResolver, ListingPlainResolver, HomeService],
})
export class ListingPageModule {}
