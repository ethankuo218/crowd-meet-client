import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../components/components.module';

import { HomeService } from '../home.service';
import { DetailsPage } from './details.page';
import { DetailsResolver } from './details.resolver';
import { DetailsPlainResolver } from './details.plain.resolver';

const routes: Routes = [
  {
    path: '',
    component: DetailsPage,
    resolve: {
      data: DetailsResolver,
      // data: DetailsPlainResolver
    },
  },
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
  ],
  declarations: [DetailsPage],
  providers: [DetailsResolver, DetailsPlainResolver, HomeService],
})
export class DetailsPageModule {}
