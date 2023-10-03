import { AdmobService } from './core/admob.service';
import { Component, NgZone, OnInit, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Geolocation } from '@capacitor/geolocation';
import { EventService } from './core/event.service';
import { FcmTokenService } from './core/fcm-token.service';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Router } from '@angular/router';

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
  private eventService = inject(EventService);
  private fcmTokenService = inject(FcmTokenService);
  private zone = inject(NgZone);
  private router = inject(Router);

  // Inject HistoryHelperService in the app.components.ts so its available app-wide
  constructor() {
    this.initializeApp();
    this.setLanguage();
    this.storage.create();
  }

  ngOnInit(): void {
    this.platform.ready().then(async () => {
      const isDarkMode = await this.storage.get('isDarkMode');
      if (isDarkMode === null) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        document.body.classList.toggle('dark', prefersDark.matches);
      }
    });
  }

  async initializeApp() {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.zone.run(() => {
        // Example url: https://beerswift.app/tabs/tab2
        // slug = /tabs/tab2
        const slug = event.url.split('.app').pop();
        if (slug) {
          this.router.navigate(['app/history']);
        }
        // If no match, do nothing - let regular routing
        // logic take over
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

  public setLanguage(): void {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }
}
