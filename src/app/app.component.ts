import { UserService } from 'src/app/core/user.service';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HistoryHelperService } from './utils/history-helper.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit {
  textDir = 'ltr';

  // Inject HistoryHelperService in the app.components.ts so its available app-wide
  constructor(
    public translate: TranslateService,
    public historyHelper: HistoryHelperService,
    private userService: UserService,
    private platform: Platform,
    private storage: Storage
  ) {
    this.initializeApp();
    this.setLanguage();
  }

  ngOnInit(): void {
    this.platform.ready().then(async () => {
      const isDarkMode = await this.storage.get('isDarkMode');
      if (isDarkMode === null) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

        this.toggleDarkTheme(prefersDark.matches);

        prefersDark.addEventListener('change', (mediaQuery) =>
          this.toggleDarkTheme(mediaQuery.matches)
        );
      }
    });
  }

  toggleDarkTheme(shouldAdd: boolean) {
    document.body.classList.toggle('dark', shouldAdd);
  }

  async initializeApp() {
    try {
      this.userService.login();
      await SplashScreen.hide();
    } catch (err) {
      console.log('This is normal in a browser', err);
    }
  }

  public setLanguage(): void {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }
}
