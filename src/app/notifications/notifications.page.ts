import { Component } from '@angular/core';
import { NotificationsService } from './notifications.service';
import { BehaviorSubject, Subject, catchError } from 'rxjs';
import { Notification } from './models/notifications.models';
import { RefresherCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: [
    './styles/notifications.page.scss',
    './styles/notifications.shell.scss'
  ]
})
export class NotificationsPage {
  notifications$ = new BehaviorSubject<Notification[] | null>(null);
  isLoading$ = new BehaviorSubject<boolean>(true);
  private destroy$ = new Subject<void>();

  constructor(private notificationService: NotificationsService) {}

  ionViewWillEnter() {
    this.reload();
  }

  ionViewWillLeave() {
    this.destroy$.next();
  }

  private reload() {
    this.isLoading$.next(true);
    this.notificationService
      .getNotifications()
      .pipe(
        catchError((error) => {
          console.error(error);
          this.isLoading$.next(false);
          return [];
        })
      )
      .subscribe((notifications) => {
        this.notifications$.next(notifications);
        this.isLoading$.next(false);
      });
  }

  doRefresh(event: Event) {
    this.notificationService
      .getNotifications()
      .pipe(
        catchError((error) => {
          console.error(error);
          (event as RefresherCustomEvent).target.complete();
          return [];
        })
      )
      .subscribe((notifications) => {
        this.notifications$.next(notifications);
        this.isLoading$.next(false);
        (event as RefresherCustomEvent).target.complete();
      });
  }
}
