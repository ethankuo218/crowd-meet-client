import { EntitlementService } from './../core/entitlement.service';
import { AlertController } from '@ionic/angular';
import { UserService } from './../core/user.service';
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
import { Share } from '@capacitor/share';
import { TranslateService } from '@ngx-translate/core';
import { Language } from '../language/language.model';
import { environment } from 'src/environments/environment.dev';

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
  private translate = inject(TranslateService);

  user$ = inject(UserStateFacade).getUser();
  isDarkMode: boolean = document.body.classList.contains('dark');
  languages = this.languageService.getLanguages();
  selectedLanguage: Language = this.languageService.currentLanguage;

  constructor(
    private readonly userService: UserService,
    private readonly alertController: AlertController
  ) {}

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
    this.selectedLanguage = event.target.value as Language;
    this.languageService.setLanguage(this.selectedLanguage);
  }

  inviteFriends(): void {
    Share.share({
      title: this.translate.instant('SHARE.APP'),
      text: environment.appDomain,
      dialogTitle: 'Invite friends'
    });
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

  async deleteAccount(): Promise<void> {
    const firstResponse = await this.showAlert(
      this.translate.instant('DELETE_ACCOUNT.RETAIN_HINT'),
      this.translate.instant('DELETE_ACCOUNT.LEAVE'),
      this.translate.instant('DELETE_ACCOUNT.STAY')
    );

    if (firstResponse) {
      const secondResponse = await this.showAlert(
        this.translate.instant('DELETE_ACCOUNT.SUBSCRIPTION_HINT'),
        this.translate.instant('DELETE_ACCOUNT.SUBSCRIPTION_LEAVE'),
        this.translate.instant('DELETE_ACCOUNT.STAY')
      );

      if (secondResponse) {
        this.userService.deleteAccount().subscribe({
          next: () => {
            this.logout();
          },
          error: (err) => {
            console.error(err);
          }
        });
      }
    }
  }

  private async showAlert(
    message: string,
    confirmText: string,
    cancelText: string
  ): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alertController.create({
        message: message,
        buttons: [
          {
            text: cancelText,
            role: 'cancel',
            handler: () => resolve(false)
          },
          {
            text: confirmText,
            handler: () => resolve(true)
          }
        ]
      });
      await alert.present();
    });
  }
}
