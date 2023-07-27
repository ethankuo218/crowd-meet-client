import { AdmobService } from './core/admob.service';
import { UserService } from 'src/app/core/user.service';
import { Component, OnInit, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Geolocation } from '@capacitor/geolocation';
import { PushNotifications } from '@capacitor/push-notifications';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit {
  private translate = inject(TranslateService);
  private userService = inject(UserService);
  private platform = inject(Platform);
  private storage = inject(Storage);
  private admobService = inject(AdmobService);

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
      await PushNotifications.requestPermissions().then(async (result) => {
        console.log(result);
        if (result.receive === 'granted') {
          // Register with Apple / Google to receive push via APNS/FCM
          try {
            await PushNotifications.register();
          } catch (err) {
            console.error(err);
          }
        } else {
          // Show some error
        }
      });
      await Geolocation.requestPermissions({
        permissions: ['location', 'coarseLocation']
      });
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
