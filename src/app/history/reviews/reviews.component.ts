import { ReviewsService } from './reviews.service';
import { ActivatedRoute } from '@angular/router';
import { Component, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RatingComponent } from './rating/rating.component';
import { Participant } from '../../event/models/event.model';
import { Observable, map, switchMap } from 'rxjs';
import { EventService } from '../../core/event.service';
@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent {
  private modalCtrl = inject(ModalController);
  private route = inject(ActivatedRoute);
  private eventService = inject(EventService);
  private reviewsService = inject(ReviewsService);

  canView: boolean = false;

  participants$: Observable<Participant[]> = this.route.params.pipe(
    switchMap((params) => {
      return this.eventService.getParticipants(params['id']).pipe(
        map((result) => {
          this.canView = result.canView;
          return result.canView ? result.participants : [];
        })
      );
    })
  );

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
      this.reviewsService
        .review({
          revieweeId: userDetail.id,
          eventId: userDetail.eventId,
          ...data
        })
        .subscribe({ next: () => {} });
    }
  }
}
