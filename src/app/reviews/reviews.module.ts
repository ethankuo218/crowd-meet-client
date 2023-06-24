import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { ReviewsComponent } from './reviews.component';
import { HeaderComponent } from '../header/header.component';
import { SwiperModule } from 'swiper/angular';

const routes: Routes = [
  {
    path: '',
    component: ReviewsComponent
  }
];

@NgModule({
  declarations: [ReviewsComponent],
  imports: [
    CommonModule,
    IonicModule,
    FontAwesomeModule,
    RouterModule.forChild(routes),
    HeaderComponent,
    SwiperModule
  ]
})
export class ReviewsModule {}
