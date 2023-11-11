import { ReviewsService } from './reviews.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RatingComponent } from './rating/rating.component';
import { Participant } from '../../event/models/event.model';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  forkJoin,
  map,
  switchMap
} from 'rxjs';
import { EventService } from '../../core/event.service';
import { Review } from './models/reviews.model';
import { User } from 'src/app/core/+states/user-state/user.model';
import { UserStateFacade } from 'src/app/core/+states/user-state/user.state.facade';
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
  private userStateFacade = inject(UserStateFacade);

  canView: boolean = false;

  private eventId!: number;
  private readonly userId$ = this.userStateFacade
    .getUser()
    .pipe(map((user) => user.userId));
  private readonly reviewedSet = new Set<number>();

  eventData$: Observable<{
    host: User | null;
    participants: Participant[];
    canView: boolean;
  }> = combineLatest([this.route.params, this.userId$]).pipe(
    switchMap(([params, userId]) => {
      this.eventId = params['id'];
      const eventHost$ = this.eventService.getEventHost(this.eventId);
      const participants$ = this.eventService.getParticipants(this.eventId);

      return forkJoin({ host: eventHost$, participants: participants$ }).pipe(
        map(({ host, participants }) => {
          this.canView = participants.canView;
          return {
            host: host && host.userId !== userId ? host : null,
            participants: this.canView
              ? participants.participants.filter((p) => p.userId !== userId)
              : [],
            canView: this.canView
          };
        })
      );
    })
  );

  ionViewWillEnter() {
    this.reloadReview();
    this.reviewedSet.clear();
  }

  private reviewedListBehaviorSubject: BehaviorSubject<Review[]> =
    new BehaviorSubject<Review[]>([]);

  async writeReview(userDetail: Participant | User) {
    if (!userDetail.userId) return;
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
          eventId: this.eventId,
          ...data
        })
        .subscribe({
          next: () => {
            this.reviewedSet.add(userDetail.userId!);
          }
        });
    }
  }

  private reloadReview(): void {
    this.reviewsService.getReviewByEvent(this.eventId).subscribe({
      next: (result) => {
        this.reviewedListBehaviorSubject.next(result);
      }
    });
  }

  isReviewed(userId: number) {
    if (this.reviewedSet.has(userId)) {
      return true;
    }
    return this.reviewedListBehaviorSubject.value.find(
      (item) => item.revieweeId === userId
    );
  }
}
