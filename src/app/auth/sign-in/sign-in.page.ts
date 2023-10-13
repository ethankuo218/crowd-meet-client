import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { UserStateFacade } from 'src/app/core/+states/user-state/user.state.facade';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./styles/sign-in.page.scss']
})
export class SignInPage {
  private authService = inject(AuthService);
  private userStateFacade = inject(UserStateFacade);
  private router = inject(Router);

  ionViewWillEnter(): void {
    this.userStateFacade.storeUser({});
  }

  async doFacebookLogin(): Promise<void> {
    try {
      await this.authService.signInWithFacebook();
      this.router.navigate(['app']);
    } catch (error) {
      console.error(error);
    }
  }

  async doGoogleLogin(): Promise<void> {
    try {
      await this.authService.signInWithGoogle();
      this.router.navigate(['app']);
    } catch (error) {
      console.error(error);
    }
  }

  async doAppleLogin(): Promise<void> {
    try {
      await this.authService.signInWithApple();
      this.router.navigate(['app']);
    } catch (error) {
      console.error(error);
    }
  }
}
