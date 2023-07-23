import { UserStateFacade } from '../core/+states/user-state/user.state.facade';
import { Component, OnInit, inject } from '@angular/core';
import { ActionSheetController, RefresherCustomEvent } from '@ionic/angular';
import { UserService } from '../core/user.service';
import { UserEvent } from '../core/+states/user-state/user.model';
import { firstValueFrom, map } from 'rxjs';
import { Router } from '@angular/router';
import { EventService } from '../core/event.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  private actionSheetController = inject(ActionSheetController);
  private userService = inject(UserService);
  private userStateFacade = inject(UserStateFacade);
  private router = inject(Router);
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
      return result.filter(
        (event: UserEvent) =>
          Date.now() - new Date(event.startTime).getTime() > 0
      );
    })
  );

  ngOnInit() {
    this.userService.reloadUserEvents();
  }

  handleRefresh(event: Event) {
    this.userService.reloadUserEvents().then(() => {
      (event as RefresherCustomEvent).target.complete();
    });
  }

  async openMenu(eventId: number, creatorId: number) {
    let buttonOptions = {
      buttons: [
        {
          text: 'Leave',
          role: 'leave',
          cssClass: 'leave_button',
          handler: () => {
            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                title: 'Do you want to leave this event ?',
                content: '',
                enableCancelButton: true
              },
              panelClass: 'custom-dialog'
            });
            dialogRef.afterClosed().subscribe((result) => {
              if (result === 'confirm') {
                this.eventService.leave(eventId).subscribe(() => {
                  this.userService.reloadUserEvents();
                });
              }
            });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    };

    const userId = (await firstValueFrom(this.userStateFacade.getUser()))
      .userId;
    if (userId === creatorId) {
      buttonOptions.buttons = [
        ...[
          {
            text: 'Manage Participants',
            role: 'manage',
            handler: () => {
              this.router.navigate(['/app/history/joiner-list', eventId]);
            }
          }
        ],
        ...buttonOptions.buttons
      ];
    }

    const actionSheet = await this.actionSheetController.create(buttonOptions);
    await actionSheet.present();
  }

  trackByIndex(index: number, item: UserEvent) {
    return index;
  }

  getIsOngoing(endTime: string): boolean {
    return Date.now() - new Date(endTime).getTime() < 0;
  }
}
