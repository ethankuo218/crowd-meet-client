import { Injectable, inject } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { HttpClientService } from './http-client.service';
import { Observable, firstValueFrom } from 'rxjs';
import { FcmToken } from './models/core.model';

@Injectable({
  providedIn: 'root'
})
export class FcmTokenService {
  private httpClientService = inject(HttpClientService);

  private fcmTokenId: number | undefined;

  constructor() {
    this.addListener();
  }

  async addListener(): Promise<void> {
    await PushNotifications.addListener('registration', async (token) => {
      const hasSameToken = await this.hasSameToken(token.value);
      if (!hasSameToken) {
        this.httpClientService
          .post<FcmToken>('fcm-token', { token: token.value })
          .subscribe((result) => {
            this.fcmTokenId = result.id;
          });
      }
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

  async unRegister(): Promise<void> {
    try {
      PushNotifications.unregister();
      PushNotifications.removeAllListeners();
      this.httpClientService.delete('fcm-token', this.fcmTokenId!).subscribe();
    } catch (err) {
      console.log(err);
    }
  }

  getFcmToken(): Observable<FcmToken[]> {
    return this.httpClientService.get<FcmToken[]>('fcm-token');
  }

  private async hasSameToken(token: string): Promise<boolean> {
    const userToken = await firstValueFrom(this.getFcmToken());
    return userToken.find((item) => item.token === token) ? true : false;
  }
}
