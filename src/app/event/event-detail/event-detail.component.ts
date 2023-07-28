import { LoadingService } from 'src/app/core/loading.service';
import { Event, Participant } from './../models/event.model';
import { UserStateFacade } from '../../core/+states/user-state/user.state.facade';
import { EventService } from '../../core/event.service';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Browser } from '@capacitor/browser';
import { IonButton } from '@ionic/angular';

@Component({
  selector: 'app-details',
  templateUrl: './event-detail.component.html',
  styleUrls: [
    './styles/event-detail.component.scss',
    './styles/event-detail.shell.scss'
  ]
})
export class EventDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private eventService = inject(EventService);
  private loadingService = inject(LoadingService);

  @ViewChild('joinBtn') joinBtn!: IonButton;

  isLoading = true;

  eventDetail$: Observable<Event> = this.route.params.pipe(
    switchMap((params) => {
      return this.eventService.getEventDetail(params['id']).pipe(
        tap(() => {
          this.isLoading = false;
        })
      );
    })
  );

  participants$: Observable<Participant[]> = this.route.params.pipe(
    switchMap((params) => {
      return this.eventService.getParticipants(params['id']);
    })
  );

  user$ = inject(UserStateFacade).getUser();

  comments$ = this.eventService.getComment();

  comment: string | undefined;

  ngOnInit(): void {}

  ionViewWillLeave(): void {}

  async openMap(eventDetail: Event): Promise<void> {
    // The following URL should open Google Maps on all platforms
    let url = `https://www.google.com/maps/search/?api=1&query=${eventDetail.lat},${eventDetail.lng}&query_place_id=${eventDetail.placeId}`;

    await Browser.open({ url });
  }

  leaveComment(id: number): void {
    this.eventService.leaveComment(id, this.comment!).subscribe();
    delete this.comment;
  }

  editEvent(eventDetail: Event): void {
    this.router.navigate([
      '/app/event-create',
      { mode: 'edit', eventInfo: JSON.stringify(eventDetail) }
    ]);
  }

  async joinEvent(id: number): Promise<void> {
    this.joinBtn.disabled = true;
    await this.loadingService.present();
    this.eventService.apply(id).subscribe(() => {
      this.loadingService.dismiss();
    });
  }

  getJsonString(input: any) {
    return JSON.stringify(input);
  }

  isEventStarted(startTime: string) {
    return new Date(startTime).getTime() < new Date().getTime();
  }

  isAllowJoin(participants: Participant[], userId: number): boolean {
    return participants.find((participant) => participant.userId === userId)
      ? false
      : true;
  }
}
