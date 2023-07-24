import { Location } from '@angular/common';
import { UserService } from './../../core/user.service';
import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AuthStateChange,
  SignInResult
} from '@capacitor-firebase/authentication';
import {
  PushNotificationSchema,
  PushNotifications
} from '@capacitor/push-notifications';
import { Subscription } from 'rxjs';

import { HistoryHelperService } from '../../utils/history-helper.service';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./styles/sign-in.page.scss']
})
export class SignInPage implements OnInit {
  submitError: string | null = null;
  authRedirectResult: Subscription;

  constructor(
    public router: Router,
    public authService: AuthService,
    private ngZone: NgZone,
    public historyHelper: HistoryHelperService,
    private userService: UserService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    // ? Get firebase authentication redirect result invoked when using signInWithRedirect()
    // ? signInWithRedirect() is only used when client is in web but not desktop. For example a PWA
    this.authRedirectResult = this.authService.redirectResult$.subscribe(
      (result) => {
        if (result.error) {
          this.manageAuthWithProvidersErrors(result.error);
        } else {
          this.redirectLoggedUserToHomePage();
        }
      }
    );

    this.authService.authState$.subscribe((stateChange: AuthStateChange) => {
      if (!stateChange.user) {
        this.manageAuthWithProvidersErrors('No user logged in');
      } else {
        this.redirectLoggedUserToHomePage();
      }
    });
  }

  async ngOnInit(): Promise<void> {
    // await this.showBanner();
    this.route.params.subscribe((params) => {
      if (params['logout']) {
        this.authService.signOut().then(() => {
          this.location.replaceState('/auth/sign-in');
        });
      }
    });
  }

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

  public async doFacebookLogin(): Promise<void> {
    this.resetSubmitError();

    try {
      await this.authService
        .signInWithFacebook()
        .then((result: SignInResult) => {
          // ? This gives you a Facebook Access Token. You can use it to access the Facebook API.
          // const token = result.credential.accessToken;
          this.redirectLoggedUserToHomePage();
        })
        .catch((error) => {
          this.manageAuthWithProvidersErrors(error.message);
        });
    } finally {
      // ? Termination code goes here
    }
  }

  public async doGoogleLogin(): Promise<void> {
    this.resetSubmitError();

    try {
      await this.authService
        .signInWithGoogle()
        .then((result) => {
          // ? This gives you a Google Access Token. You can use it to access the Google API.
          // const token = result.credential.accessToken;
          this.redirectLoggedUserToHomePage();
        })
        .catch((error) => {
          this.manageAuthWithProvidersErrors(error.message);
        });
    } finally {
      // ? Termination code goes here
    }
  }

  public async doAppleLogin(): Promise<void> {
    this.resetSubmitError();

    try {
      await this.authService
        .signInWithApple()
        .then((result) => {
          this.redirectLoggedUserToHomePage();
        })
        .catch((error) => {
          this.manageAuthWithProvidersErrors(error.message);
        });
    } finally {
      // ? Termination code goes here
    }
  }

  private redirectLoggedUserToHomePage(): void {
    this.ngZone.run(() => {
      this.userService.login();
    });
  }

  private manageAuthWithProvidersErrors(errorMessage: string): void {
    this.submitError = errorMessage;
  }

  private resetSubmitError(): void {
    this.submitError = null;
  }
}
