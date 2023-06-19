import { UserService } from 'src/app/core/user.service';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HistoryHelperService } from './utils/history-helper.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { take } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: [
    './app.component.scss',
    './side-menu/styles/side-menu.scss',
    './side-menu/styles/side-menu.shell.scss',
    './side-menu/styles/side-menu.responsive.scss',
  ],
})
export class AppComponent {
  readonly accountPages = [
    {
      title: 'Profile',
      url: '/app/user',
      ionicIcon: 'person-outline',
    },
    {
      title: 'Create Event',
      url: '/app/event/create',
      ionicIcon: 'add-circle-outline',
    },
    {
      title: 'Tutorial',
      url: 'auth/walkthrough',
      ionicIcon: 'school-outline',
    },
    {
      title: 'Getting Started',
      url: '/auth/getting-started',
      ionicIcon: 'rocket-outline',
    },
    {
      title: 'Purchase',
      url: '/app/purchase',
      ionicIcon: 'wallet-outline',
    },
    {
      title: 'Sign out',
      url: '/auth/sign-in/true',
      ionicIcon: 'log-out-outline',
    },
  ];

  textDir = 'ltr';

  // Inject HistoryHelperService in the app.components.ts so its available app-wide
  constructor(
    public translate: TranslateService,
    public historyHelper: HistoryHelperService,
    private userService: UserService
  ) {
    this.initializeApp();
    this.setLanguage();
  }

  async initializeApp() {
    try {
      await this.userService.login().pipe(take(1)).subscribe();
      await SplashScreen.hide();
    } catch (err) {
      console.log('This is normal in a browser', err);
    }
  }

  public setLanguage(): void {
    this.translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use('en');

    // this is to determine the text direction depending on the selected language
    // for the purpose of this example we determine that only arabic and hebrew are RTL.
    // this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
    //   this.textDir = (event.lang === 'ar' || event.lang === 'iw') ? 'rtl' : 'ltr';
    // });
  }
}
