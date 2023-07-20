import { Purchases } from '@awesome-cordova-plugins/purchases/ngx';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InAppPurchaseComponent } from './in-app-purchase.component';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from '../header/header.component';
import { Auth, user } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';
declare let window: any;

const routes: Routes = [
  {
    path: '',
    component: InAppPurchaseComponent
  }
];

@NgModule({
  declarations: [InAppPurchaseComponent],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule.forChild(routes),
    HeaderComponent
  ]
})
export class InAppPurchaseModule {
  constructor(private purchases: Purchases, private readonly auth: Auth) {
    document.addEventListener(
      'deviceready',
      async () => {
        this.purchases.setDebugLogsEnabled(true);
        if (window.cordova.platformId === 'ios') {
          console.log('Enter in ios app');
          this.purchases.configureWith({
            apiKey: 'appl_pSXpxYdElyvkaGoluStFYFEeufZ'
          });
        } else if (window.cordova.platformId === 'android') {
          this.purchases.configureWith({
            apiKey: 'goog_zdLdwSKOtRgrUYVKcgrEgrNzzBj'
          });
        }
        this.purchases.logIn(await this.getUserId());
        this.purchases.setAttributes({ serverUid: '1' }); //TODO: use actual server uid
      },
      false
    );
  }

  private async getUserId() {
    const firebaseUser = await firstValueFrom(user(this.auth));
    if (!firebaseUser) {
      throw new Error('User is not logged in');
    }
    return firebaseUser.uid;
  }
}
