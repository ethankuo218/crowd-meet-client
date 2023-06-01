import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HistoryHelperService } from './utils/history-helper.service';
import { SplashScreen } from '@capacitor/splash-screen';

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
  accountPages = [
    {
      title: 'Profile',
      url: '/auth/profile',
      ionicIcon: 'person-outline',
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
      title: 'Sign out',
      url: '/auth/sign-in/true',
      ionicIcon: 'log-out-outline',
    }
  ];

  textDir = 'ltr';

  // Inject HistoryHelperService in the app.components.ts so its available app-wide
  constructor(
    public translate: TranslateService,
    public historyHelper: HistoryHelperService
  ) {
    this.initializeApp();
    this.setLanguage();
  }

  async initializeApp() {
    try {
      await SplashScreen.hide();
    } catch (err) {
      console.log('This is normal in a browser', err);
    }
  }

  public setLanguage(): void {
    // this language will be used as a fallback when a translation isn't found in the current language
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
