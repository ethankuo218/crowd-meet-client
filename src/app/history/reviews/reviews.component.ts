import { ReviewsService } from './reviews.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RatingComponent } from './rating/rating.component';
import { Participant } from '../../event/models/event.model';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
import { EventService } from '../../core/event.service';
import { Review } from './models/reviews.model';
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

  private eventId!: number;

  participants$: Observable<Participant[]> = this.route.params.pipe(
    switchMap((params) => {
      this.eventId = params['id'];
      this.reload();
      return this.eventService.getParticipants(params['id']).pipe(
        map((result) => {
          this.canView = result.canView;
          return result.canView ? result.participants : [];
        })
      );
    })
  );

  private reviewedListBehaviorSubject: BehaviorSubject<Review[]> =
    new BehaviorSubject<Review[]>([]);

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
          revieweeId: userDetail.userId,
          eventId: userDetail.eventId,
          ...data
        })
        .subscribe({
          next: () => {
            this.reload();
          }
        });
    }
  }

  private reload(): void {
    this.reviewsService.getReviewByEvent(this.eventId).subscribe({
      next: (result) => {
        this.reviewedListBehaviorSubject.next(result);
      }
    });
  }

  isReviewed(userId: number) {
    return this.reviewedListBehaviorSubject.value.find(
      (item) => item.revieweeId === userId
    );
  }
}
