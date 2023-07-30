import { InAppPurchaseService } from './../core/in-app-purchase.service';
import { Component, OnInit, inject } from '@angular/core';
import SwiperCore, { Pagination } from 'swiper';
import { AdmobService } from '../core/admob.service';
import { PurchasesStoreProduct } from '@awesome-cordova-plugins/purchases/ngx';

SwiperCore.use([Pagination]);

@Component({
  selector: 'app-in-app-purchase',
  templateUrl: './in-app-purchase.component.html',
  styleUrls: ['./in-app-purchase.component.scss']
})
export class InAppPurchaseComponent implements OnInit {
  private admobService = inject(AdmobService);
  private inAppPurchaseService = inject(InAppPurchaseService);
  productList!: PurchasesStoreProduct[];

  async ngOnInit() {
    this.productList = await this.inAppPurchaseService.getProducts();
  }

  getReward(type: string): void {
    // this.admobService.showInterstitial();
    this.admobService.showReward().then((result) => {
      // this will call after reward get
      console.log(result.type);
    });
  }

  purchase(productIdentifier: string): void {
    this.inAppPurchaseService.purchase(productIdentifier);
  }
}
