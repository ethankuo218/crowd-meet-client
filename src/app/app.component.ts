import { AdmobService } from './core/admob.service';
import { Component, NgZone, OnInit, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Geolocation } from '@capacitor/geolocation';
import { FcmTokenService } from './core/fcm-token.service';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Router } from '@angular/router';
import { LanguageService } from './language/language.service';
import { Language } from './language/language.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit {
  private translate = inject(TranslateService);
  private platform = inject(Platform);
  private storage = inject(Storage);
  private admobService = inject(AdmobService);
  private fcmTokenService = inject(FcmTokenService);
  private zone = inject(NgZone);
  private router = inject(Router);
  private languageService = inject(LanguageService); // Inject the LanguageService

  // Inject HistoryHelperService in the app.components.ts so its available app-wide
  constructor() {
    this.initializeApp();
    this.storage.create();
  }

  ngOnInit(): void {
    this.platform.ready().then(async () => {
      await this.initializeDarkMode();
      await this.initializeLanguage();
    });
  }

  private async initializeDarkMode(): Promise<void> {
    const isDarkMode = await this.storage.get('isDarkMode');
    if (isDarkMode !== null) {
      document.body.classList.toggle('dark', isDarkMode);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      document.body.classList.toggle('dark', prefersDark.matches);
    }
  }

  private async initializeLanguage(): Promise<void> {
    const storedLanguage = await this.languageService.getStoredLanguage();
    if (storedLanguage) {
      this.languageService.setLanguage(storedLanguage);
    } else {
      let defaultLang: string = this.translate.getBrowserLang() ?? '';
      if (defaultLang === 'zh') defaultLang = 'zh-TW';

      const isKnownLang = Object.values(Language).includes(
        defaultLang as Language
      );
      const langToSet = isKnownLang ? defaultLang : Language.ENGLISH;
      this.languageService.setLanguage(langToSet as Language);
    }
  }

  async initializeApp() {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.zone.run(() => {
        const slug = event.url.split('.app').pop();
        if (slug) {
          this.router.navigate([slug]);
        }
      });
    });
    try {
      await this.fcmTokenService.requestPermission();

      await Geolocation.requestPermissions({
        permissions: ['location', 'coarseLocation']
      });

      await this.admobService.initializeAdmob();
    } catch (err) {
      console.log('This is normal in a browser', err);
    } finally {
      await SplashScreen.hide();
    }
  }
}
