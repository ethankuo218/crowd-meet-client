import { Purchases } from '@awesome-cordova-plugins/purchases/ngx';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InAppPurchaseComponent } from './in-app-purchase.component';
import { IonicModule } from '@ionic/angular';
declare let window: any;

const routes: Routes = [
  {
    path: '',
    component: InAppPurchaseComponent,
  },
];

@NgModule({
  declarations: [InAppPurchaseComponent],
  imports: [IonicModule, CommonModule, RouterModule.forChild(routes)],
})
export class InAppPurchaseModule {
  constructor(private purchases: Purchases) {
    document.addEventListener(
      'deviceready',
      () => {
        this.purchases.setDebugLogsEnabled(true);
        if (window.cordova.platformId === 'ios') {
          console.log('Enter in ios app');
          this.purchases.configureWith({
            apiKey: 'appl_pSXpxYdElyvkaGoluStFYFEeufZ',
          });
        } else if (window.cordova.platformId === 'android') {
          this.purchases.configureWith({
            apiKey: 'goog_zdLdwSKOtRgrUYVKcgrEgrNzzBj',
          });
        }
      },
      false
    );
  }
}
