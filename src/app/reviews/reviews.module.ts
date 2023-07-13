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
import { ReactiveFormsModule } from '@angular/forms';
import { ReviewsService } from './reviews.service';
import { EventService } from '../core/event.service';

const routes: Routes = [
  {
    path: ':id',
    component: ReviewsComponent
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
    RatingInputComponent,
    ReactiveFormsModule
  ],
  providers: [ReviewsService, EventService]
})
export class ReviewsModule {}
