import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { ReviewsComponent } from './reviews.component';
import { HeaderComponent } from '../header/header.component';
import { SwiperModule } from 'swiper/angular';
import { RatingComponent } from './rating/rating.component';
import { RatingInputComponent } from '../components/rating-input/rating-input.component';

const routes: Routes = [
  {
    path: '',
    component: RatingComponent
  }
];

@NgModule({
  declarations: [ReviewsComponent, RatingComponent],
  imports: [
    CommonModule,
    IonicModule,
    FontAwesomeModule,
    RouterModule.forChild(routes),
    HeaderComponent,
    SwiperModule,
    RatingInputComponent
  ]
})
export class ReviewsModule {}
