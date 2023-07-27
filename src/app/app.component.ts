import { AdmobService } from './core/admob.service';
import { Component, OnInit, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Geolocation } from '@capacitor/geolocation';
import { PushNotifications } from '@capacitor/push-notifications';
import { EventService } from './core/event.service';

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

  // Inject HistoryHelperService in the app.components.ts so its available app-wide
  constructor() {
    this.initializeApp();
    this.setLanguage();
  }

  ngOnInit(): void {
    this.platform.ready().then(async () => {
      this.storage.clear();
      const isDarkMode = await this.storage.get('isDarkMode');
      if (isDarkMode === null) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        document.body.classList.toggle('dark', prefersDark.matches);
      }
    });
  }

  async initializeApp() {
    try {
      const { receive } = await PushNotifications.checkPermissions();
      if (receive !== 'granted') {
        const { receive: receive2 } =
          await PushNotifications.requestPermissions();
        if (receive2 === 'granted') {
          // Register with Apple / Google to receive push via APNS/FCM
          try {
            await PushNotifications.register();
          } catch (err) {
            console.error(err);
          }
        } else {
          console.log('object');
          // Show some error
        }
      }

      await Geolocation.requestPermissions({
        permissions: ['location', 'coarseLocation']
      });
      this.eventService.getUserLocation();
      await this.admobService.initializeAdmob();
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
