import { Event, Participant } from './../models/event.model';
import { UserStateFacade } from '../../core/+states/user-state/user.state.facade';
import { EventService } from '../../core/event.service';
import { Component, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, switchMap, tap, map } from 'rxjs';
import { Browser } from '@capacitor/browser';
import { IonButton, IonicModule } from '@ionic/angular';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/components/alert-dialog/alert-dialog.component';
import { Calendar } from '@awesome-cordova-plugins/calendar/ngx';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { Language } from 'src/app/language/language.model';
import { LanguageService } from 'src/app/language/language.service';

@Component({
  selector: 'app-details',
  templateUrl: './event-detail.component.html',
  styleUrls: [
    './styles/event-detail.component.scss',
    './styles/event-detail.shell.scss'
  ],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HeaderComponent,
    TranslateModule,
    FontAwesomeModule,
    RouterModule,
    DirectivesModule
  ],
  providers: [Calendar]
})
export class EventDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private eventService = inject(EventService);
  private dialog = inject(MatDialog);
  private calendar = inject(Calendar);
  private readonly languageService = inject(LanguageService);

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

  async openMap(eventDetail: Event): Promise<void> {
    if (!eventDetail.lat || !eventDetail.lng || !eventDetail.placeId) {
      return;
    }

    // The following URL should open Google Maps on all platforms
    let url = `https://www.google.com/maps/search/?api=1&query=${eventDetail.lat},${eventDetail.lng}&query_place_id=${eventDetail.placeId}`;

    await Browser.open({ url });
  }

  addToCalendar(event: Event): void {
    const dialogDef = this.dialog.open(AlertDialogComponent, {
      data: {
        title: 'DIALOG.TITLE.CALENDAR',
        content: '',
        enableCancelButton: true
      },
      panelClass: 'custom-dialog'
    });

    dialogDef.afterClosed().subscribe(async (result) => {
      if (result === 'confirm') {
        try {
          await this.calendar.createEvent(
            event.title,
            event.formattedAddress,
            event.description,
            new Date(event.startTime),
            new Date(event.endTime)
          );

          this.dialog.open(AlertDialogComponent, {
            data: {
              title: 'Add success !',
              content: '',
              enableCancelButton: false
            },
            panelClass: 'custom-dialog'
          });
        } catch (error) {
          console.error(error);
        }
      }
    });
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
        title: 'DIALOG.TITLE.CHECK_PARTICIPANT',
        content: 'DIALOG.CONTENT.CHECK_PARTICIPANT',
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

  isAllowJoin(
    participants: Participant[],
    maxParticipants: number,
    userId: number
  ): boolean {
    const meetMaxParticipants = participants.length === maxParticipants;
    const joined = participants.find(
      (participant) => participant.userId === userId
    );

    return joined || meetMaxParticipants ? false : true;
  }

  notAllowComment(time: string) {
    const today = new Date().getTime();
    const endTime = new Date(time).getTime();

    return today - endTime > 3 * 24 * 60 * 60 * 1000;
  }

  get currentLocale(): [string, string] {
    switch (this.languageService.currentLanguage) {
      case Language.THAI:
        return ['th', 'EEE dd MMM yyyy h:mm a z'];

      case Language.KOREAN:
        return ['ko', 'yyyy년 M월 d일 HH:mm'];

      case Language.CHINESE:
        return ['zh-Hant', 'y年M月d日 EEEE HH:mm zzzz'];

      default:
        return ['en', 'EEE, MMM dd, yyyy h:mm a z'];
    }
  }
}
