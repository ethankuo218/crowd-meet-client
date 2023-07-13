import { ReviewsService } from './reviews.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RatingComponent } from './rating/rating.component';
import { Participant } from '../event/models/event.model';
import { Observable, switchMap } from 'rxjs';
import { EventService } from '../core/event.service';
@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {
  participants$: Observable<Participant[]> = this.route.params.pipe(
    // Extract data for this page
    switchMap((params) => {
      return this.eventService.getParticipants(params['id']);
    })
  );

  constructor(
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private eventService: EventService,
    private reviewsService: ReviewsComponent
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(() => {});
  }

  async writeReview(userDetail: Participant) {
    const modal = await this.modalCtrl.create({
      component: RatingComponent,
      componentProps: { userDetail: userDetail },
      initialBreakpoint: 0.65,
      breakpoints: [0, 0.65]
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'submit') {
      this.reviewsService.writeReview({
        revieweeId: userDetail.id,
        eventId: userDetail.eventId,
        ...data
      });
    }
  }
}
