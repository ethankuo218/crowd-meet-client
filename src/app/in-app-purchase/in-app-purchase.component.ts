import { Component, OnInit, inject } from '@angular/core';
import { Purchases } from '@awesome-cordova-plugins/purchases/ngx';
import SwiperCore, { Pagination } from 'swiper';
import { AdmobService } from '../core/admob.service';

SwiperCore.use([Pagination]);
declare let window: any;

@Component({
  selector: 'app-in-app-purchase',
  templateUrl: './in-app-purchase.component.html',
  styleUrls: ['./in-app-purchase.component.scss']
})
export class InAppPurchaseComponent implements OnInit {
  private purchases = inject(Purchases);
  private admobService = inject(AdmobService);

  offering: any | undefined;

  ngOnInit() {
    this.purchases.getOfferings().then((offerings) => {
      console.log('************');
      console.log(offerings);
      console.log('************');

      if (
        offerings.current !== null &&
        offerings.current.availablePackages.length !== 0
      ) {
        this.offering = offerings.current.availablePackages[0];
      }
    });
  }

  getReward(type: string): void {
    // this.admobService.showInterstitial();
    this.admobService.showReward().then((result) => {
      // this will call after reward get
      console.log(result.type);
    });
  }

  purchase() {
    this.purchases.purchasePackage(this.offering).then(() => {});
  }
}
