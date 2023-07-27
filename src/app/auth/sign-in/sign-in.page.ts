import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import {
  PushNotificationSchema,
  PushNotifications
} from '@capacitor/push-notifications';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./styles/sign-in.page.scss']
})
export class SignInPage {
  private authService = inject(AuthService);

  async test() {
    PushNotifications.requestPermissions().then(async (result) => {
      console.log(result);
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        try {
          await PushNotifications.register();
        } catch (err) {
          console.error(err);
        }
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration', (token: any) => {
      console.log('Push registration success, token: ' + token.value);
    });

    // Some issue with your setup and push will not work
    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error on registration: ' + JSON.stringify(error));
    });

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: any) => {
        console.log('Push action performed: ' + JSON.stringify(notification));
      }
    );
  }

  async unregister() {
    try {
      await PushNotifications.unregister();
      await PushNotifications.removeAllListeners();
    } catch (err) {
      console.log(err);
    }
  }

  doFacebookLogin(): void {
    try {
      this.authService.signInWithFacebook();
    } catch (error) {
      console.error(error);
    }
  }

  doGoogleLogin(): void {
    try {
      this.authService.signInWithGoogle();
    } catch (error) {
      console.error(error);
    }
  }

  doAppleLogin(): void {
    try {
      this.authService.signInWithApple();
    } catch (error) {
      console.error(error);
    }
  }
}
