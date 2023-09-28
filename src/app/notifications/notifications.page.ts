import { Component, inject } from '@angular/core';
import { NotificationsService } from './notifications.service';
import { Observable, ReplaySubject } from 'rxjs';
import { Notification } from './models/notifications.models';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: [
    './styles/notifications.page.scss',
    './styles/notifications.shell.scss'
  ]
})
export class NotificationsPage {
  private notificationService = inject(NotificationsService);
  notificationsReplaySubject: ReplaySubject<Notification[]> =
    new ReplaySubject();

  get notifications$(): Observable<Notification[]> {
    return this.notificationsReplaySubject;
  }

  ionViewWillEnter() {
    this.reload();
  }

  private reload(): void {
    this.notificationService.getNotifications().subscribe({
      next: (result) => {
        this.notificationsReplaySubject.next(result);
      }
    });
  }
}
