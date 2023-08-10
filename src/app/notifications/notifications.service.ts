import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '../core/http-client.service';
import { Notification } from './models/notifications.models';

@Injectable()
export class NotificationsService {
  private httpClientService = inject(HttpClientService);

  public getNotifications(): Observable<Notification[]> {
    return this.httpClientService.get<Notification[]>('notification');
  }
}
