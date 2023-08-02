import { Injectable, inject } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { HttpClientService } from './http-client.service';
import { Observable, firstValueFrom } from 'rxjs';
import { FcmToken } from './models/core.model';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class FcmTokenService {
  private httpClientService = inject(HttpClientService);

  private fcmToken: string | undefined;
  private fcmTokenId: number | undefined;

  constructor() {
    this.addListener();
  }

  async addListener(): Promise<void> {
    await PushNotifications.addListener('registration', async (token) => {
      this.fcmToken = token.value;
    });
  }

  async requetPermission(): Promise<void> {
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
        .subscribe((result) => {
          this.fcmTokenId = result.id;
        });
    }
  }

  async unRegister(): Promise<void> {
    try {
      PushNotifications.unregister();
      PushNotifications.removeAllListeners();
      if (this.fcmTokenId) {
        this.httpClientService
          .delete('fcm-token', this.fcmTokenId!)
          .subscribe();
      }
    } catch (err) {
      console.log(err);
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
