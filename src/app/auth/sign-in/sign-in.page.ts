import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { UserStateFacade } from 'src/app/core/+states/user-state/user.state.facade';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./styles/sign-in.page.scss']
})
export class SignInPage {
  private authService = inject(AuthService);
  private userStateFacade = inject(UserStateFacade);

  ionViewWillEnter(): void {
    this.userStateFacade.storeUser({});
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
