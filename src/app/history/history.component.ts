import { Component, OnInit } from '@angular/core';
import {
  ActionSheetController,
  ModalController,
  RefresherCustomEvent
} from '@ionic/angular';
import { UserService } from '../core/user.service';
import { UserEvent } from '../core/states/user-state/user.model';
import { map } from 'rxjs';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
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

  constructor(
    private actionSheetController: ActionSheetController,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.reloadUserEvents();
  }

  handleRefresh(event: Event) {
    this.userService.reloadUserEvents().then(() => {
      (event as RefresherCustomEvent).target.complete();
    });
  }

  async openMenu() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: 'Leave',
          role: 'leave',
          cssClass: 'leave_button',
          handler: () => {
            console.log('Leave clicked');
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
    });
    await actionSheet.present();
  }

  trackByIndex(index: number, item: UserEvent) {
    return index;
  }

  getIsOngoing(endTime: string): boolean {
    return Date.now() - new Date(endTime).getTime() < 0;
  }
}
