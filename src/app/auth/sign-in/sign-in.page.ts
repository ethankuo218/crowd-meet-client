import { HttpClientService } from './../../core/http-client.service';
import { Component, NgZone } from '@angular/core';
import {
  Validators,
  UntypedFormGroup,
  UntypedFormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  AuthStateChange,
  SignInResult,
} from '@capacitor-firebase/authentication';

import { Subscription } from 'rxjs';

import { HistoryHelperService } from '../../utils/history-helper.service';
import { AuthService } from '../auth.service';
import { UserResponse } from './models/sign-in.model';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./styles/sign-in.page.scss'],
})
export class SignInPage {
  loginForm: UntypedFormGroup;
  submitError: string | null = null;
  authRedirectResult: Subscription;

  validation_messages = {
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' },
    ],
    password: [
      { type: 'required', message: 'Password is required.' },
      {
        type: 'minlength',
        message: 'Password must be at least 6 characters long.',
      },
    ],
  };

  constructor(
    public router: Router,
    public authService: AuthService,
    private ngZone: NgZone,
    public historyHelper: HistoryHelperService,
    private httpClientService: HttpClientService
  ) {
    this.loginForm = new UntypedFormGroup({
      email: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])
      ),
      password: new UntypedFormControl(
        '',
        Validators.compose([Validators.minLength(6), Validators.required])
      ),
    });

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

  public async signInWithEmail(): Promise<void> {
    this.resetSubmitError();

    try {
      await this.authService
        .signInWithEmail(
          this.loginForm.value['email'],
          this.loginForm.value['password']
        )
        .then((result) => {
          this.redirectLoggedUserToHomePage();
        })
        .catch((error) => {
          this.submitError = error.message;
        });
    } finally {
      // ? Termination code goes here
    }
  }

  // ? Once the auth provider finished the authentication flow, and the auth redirect completes, hide the loader and redirect the user to the home page
  private redirectLoggedUserToHomePage(): void {
    this.ngZone.run(() => {
      // Get previous URL from our custom History Helper
      // If there's no previous page, then redirect to profile
      // const previousUrl = this.historyHelper.previousUrl || 'app';
      const previousUrl = 'app';
      // check if isNewUser
      this.httpClientService.post<UserResponse>('user',{}).subscribe(result => {
        if (result.isNewUser) {
          this.router.navigate(['walkthrough'], { replaceUrl: true });
        }else {
          this.router.navigate(['app'], { replaceUrl: true });
        }
      });

      // No need to store in the navigation history the sign-in page with redirect params (it's just a a mandatory mid-step)
      // Navigate to profile and replace current url with profile
    });
  }

  private manageAuthWithProvidersErrors(errorMessage: string): void {
    this.submitError = errorMessage;
  }

  private resetSubmitError(): void {
    this.submitError = null;
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
