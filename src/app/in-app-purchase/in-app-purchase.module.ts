import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InAppPurchaseComponent } from './in-app-purchase.component';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from '../header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SwiperModule } from 'swiper/angular';

const routes: Routes = [
  {
    path: '',
    component: InAppPurchaseComponent
  }
];

@NgModule({
  declarations: [InAppPurchaseComponent],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule.forChild(routes),
    HeaderComponent,
    FontAwesomeModule,
    SwiperModule
  ]
})
export class InAppPurchaseModule {}
