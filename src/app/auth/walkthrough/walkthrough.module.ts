import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SwiperModule } from 'swiper/angular';

import { WalkthroughPage } from './walkthrough.page';
import { ShellModule } from 'src/app/shell/shell.module';

const routes: Routes = [
  {
    path: '',
    component: WalkthroughPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShellModule,
    RouterModule.forChild(routes),
    SwiperModule
  ],
  declarations: [WalkthroughPage],
  providers: []
})
export class WalkthroughPageModule {}
