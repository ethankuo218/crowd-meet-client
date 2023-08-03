import { Event, Participant } from './../models/event.model';
import { UserStateFacade } from '../../core/+states/user-state/user.state.facade';
import { EventService } from '../../core/event.service';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap, tap, map } from 'rxjs';
import { Browser } from '@capacitor/browser';
import { IonButton } from '@ionic/angular';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/components/alert-dialog/alert-dialog.component';

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
  private dialog = inject(MatDialog);

  @ViewChild('joinBtn') joinBtn!: IonButton;

  isLoading: boolean = true;
  canView: boolean = false;

  eventDetail$: Observable<Event> = this.route.params.pipe(
    switchMap((params) => {
      return this.eventService.getEventDetail(params['id']).pipe(
        tap(() => {
          setTimeout(() => {
            this.isLoading = false;
          }, 300);
        })
      );
    })
  );

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

  checkParticipants(isHost: boolean, eventId: number): void {
    if (isHost) {
      this.router.navigate(['/app/event/joiner-list', eventId]);
      return;
    }

    if (this.canView) {
      this.router.navigate(['/app/event/participants', eventId]);
      return;
    }

    const dialogDef = this.dialog.open(AlertDialogComponent, {
      data: {
        title: 'Do you want to check the participants ?',
        content: `Watch an ad to unlock`,
        enableCancelButton: true
      },
      panelClass: 'custom-dialog'
    });

    dialogDef.afterClosed().subscribe({
      next: (result) => {
        if (result === 'confirm') {
          try {
            this.eventService.unlockedParticipants(eventId).then(() => {
              this.router.navigate(['/app/event/participants', eventId]);
            });
          } catch (error) {
            console.error(error);
          }
        }
      }
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
