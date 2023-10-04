import {
  EmailComposer,
  EmailComposerOptions
} from '@awesome-cordova-plugins/email-composer/ngx';
import { LanguageService } from './../language/language.service';
import { Storage } from '@ionic/storage-angular';
import { UserStateFacade } from '../core/+states/user-state/user.state.facade';
import { Component, inject } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';
import { Language } from '../language/language.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  private storage = inject(Storage);
  private authService = inject(AuthService);
  private router = inject(Router);
  private languageService = inject(LanguageService);
  private emailComposer = inject(EmailComposer);

  user$ = inject(UserStateFacade).getUser();
  isDarkMode: boolean = document.body.classList.contains('dark');
  languages = this.languageService.getLanguages();

  async openEmail(): Promise<void> {
    const email: EmailComposerOptions = {
      to: 'support@crowdmeet.app'
    };
    this.emailComposer.open(email);
  }

  changeMode(): void {
    this.isDarkMode = !this.isDarkMode;
    this.storage.set('isDarkMode', this.isDarkMode);
    document.body.classList.toggle('dark', this.isDarkMode);
  }

  changeLanguage(event: any): void {
    this.languageService.setLanguage(event.target?.value);
  }

  logout(): void {
    try {
      this.authService.signOut().then(() => {
        this.router.navigate(['auth/sign-in']);
      });
    } catch (error) {
      console.error(error);
    }
  }
}
