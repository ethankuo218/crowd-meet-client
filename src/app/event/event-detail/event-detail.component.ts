import { Event, Participant } from './../models/event.model';
import { UserStateFacade } from '../../core/+states/user-state/user.state.facade';
import { EventService } from '../../core/event.service';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap, tap, map } from 'rxjs';
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
      return this.eventService.getParticipants(params['id']).pipe(
        map((result) => {
          return result.canView ? result.participants : [];
        })
      );
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
    this.eventService.leaveComment(id, this.comment!);
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
    try {
      await this.eventService.apply(id);
    } catch (err) {
      this.joinBtn.disabled = false;
    }
  }

  checkParticipants(isHost: boolean, parameter: number): void {
    this.router.navigate([
      isHost ? '/app/event/joiner-list' : '/app/event/participants',
      parameter
    ]);
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
