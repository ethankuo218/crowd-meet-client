import { Injectable, inject } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { HttpClientService } from './http-client.service';
import { firstValueFrom } from 'rxjs';
import { FcmToken } from './models/core.model';
import { Capacitor } from '@capacitor/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FcmTokenService {
  private httpClientService = inject(HttpClientService);
  private router = inject(Router);

  private fcmToken: string | undefined;
  private fcmTokenId!: number;

  constructor() {
    this.addListener();
  }

  async addListener(): Promise<void> {
    await PushNotifications.addListener('registration', async (token) => {
      this.fcmToken = token.value;
    });

    await PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (result) => {
        console.log(result.notification.data);
        const type = result.notification.data.type;
        switch (type) {
          case NotificationType.EVENT_COMMENT:
            const eventId = result.notification.data.eventId;
            this.router.navigate(['app/event/list', eventId]);
            break;
          case NotificationType.CHAT:
            this.router.navigate(['app/chat/list']);
            break;
          case NotificationType.EVENT_STATUS:
            const isHost = result.notification.data.status;
            const joinerEventId = result.notification.data.eventId;
            if (isHost) {
              this.router.navigate(['app/event/joiner-list', joinerEventId]);
            } else {
              this.router.navigate(['app/history']);
            }
            break;
        }
      }
    );
  }

  async requestPermission(): Promise<void> {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }
    await PushNotifications.register();
  }

  async register(): Promise<void> {
    const hasSameToken = await this.hasSameToken(this.fcmToken!);
    if (!hasSameToken) {
      this.httpClientService
        .post<FcmToken>('fcm-token', { token: this.fcmToken })
        .subscribe({
          next: (result) => {
            this.fcmTokenId = result.id;
          }
        });
    } else {
      this.httpClientService.get<FcmToken[]>('fcm-token').subscribe({
        next: (result) => {
          this.fcmTokenId = result[0].id;
        }
      });
    }
  }

  async unRegister(): Promise<void> {
    try {
      await PushNotifications.unregister();
      await PushNotifications.removeAllListeners();
      if (this.fcmTokenId) {
        this.httpClientService
          .delete('fcm-token', this.fcmTokenId!)
          .subscribe();
      }
    } catch (error) {
      console.error(error);
    }
  }

  private async hasSameToken(token: string): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      return true;
    }

    const userToken = await firstValueFrom(
      this.httpClientService.get<FcmToken[]>('fcm-token')
    );

    return userToken.find((item) => item.token === token) ? true : false;
  }
}

enum NotificationType {
  EVENT_COMMENT = 'EVENT_COMMENT',
  EVENT_STATUS = 'EVENT_STATUS',
  CHAT = 'CHAT'
}
