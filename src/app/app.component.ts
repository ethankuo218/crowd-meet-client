import { UserService } from 'src/app/core/user.service';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HistoryHelperService } from './utils/history-helper.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { take } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: []
})
export class AppComponent {
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
      this.userService.login();
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
