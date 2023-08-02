import { Component, inject } from '@angular/core';
import {
  ActionSheetController,
  RefresherCustomEvent,
  IonItemSliding
} from '@ionic/angular';
import { UserService } from '../core/user.service';
import { EventStatus, UserEvent } from '../core/+states/user-state/user.model';
import { map } from 'rxjs';
import { EventService } from '../core/event.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent {
  private actionSheetController = inject(ActionSheetController);
  private userService = inject(UserService);
  private eventService = inject(EventService);
  private dialog = inject(MatDialog);

  upcoming$ = this.userService.getEvents().pipe(
    map((result: UserEvent[]): UserEvent[] => {
      return result.filter(
        (event: UserEvent) =>
          Date.now() - new Date(event.startTime).getTime() < 0
      );
    })
  );

  joined$ = this.userService.getEvents().pipe(
    map((result: UserEvent[]): UserEvent[] => {
      return result
        .filter(
          (event: UserEvent) =>
            Date.now() - new Date(event.startTime).getTime() > 0
        )
        .filter(
          (event: UserEvent) =>
            event.status === EventStatus.accepted || event.status === null
        );
    })
  );

  get isLoading(): boolean {
    return this.userService.isLoading;
  }

  ionViewWillEnter() {
    this.userService.reloadUserEvents();
  }

  handleRefresh(event: Event) {
    this.userService.reloadUserEvents().then(() => {
      (event as RefresherCustomEvent).target.complete();
    });
  }

  leave(slidingItem: IonItemSliding, eventId: number): void {
    slidingItem.close();
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        title: 'Do you want to leave this event ?',
        content: '',
        enableCancelButton: true
      },
      panelClass: 'custom-dialog'
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === 'confirm') {
        await this.eventService.leave(eventId);
        this.userService.reloadUserEvents();
      }
    });
  }

  trackByIndex(index: number, item: UserEvent) {
    return index;
  }

  getIsOngoing(endTime: string): boolean {
    return Date.now() - new Date(endTime).getTime() < 0;
  }

  get eventStatus(): typeof EventStatus {
    return EventStatus;
  }
}
