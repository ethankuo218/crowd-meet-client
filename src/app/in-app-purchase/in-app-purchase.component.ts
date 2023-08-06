import { InAppPurchaseService } from './../core/in-app-purchase.service';
import { Component, OnInit, inject } from '@angular/core';
import SwiperCore, { Pagination } from 'swiper';
import { PurchasesStoreProduct } from '@awesome-cordova-plugins/purchases/ngx';

SwiperCore.use([Pagination]);

@Component({
  selector: 'app-in-app-purchase',
  templateUrl: './in-app-purchase.component.html',
  styleUrls: ['./in-app-purchase.component.scss']
})
export class InAppPurchaseComponent implements OnInit {
  private inAppPurchaseService = inject(InAppPurchaseService);
  productList!: PurchasesStoreProduct[];

  async ngOnInit() {
    this.productList = (await this.inAppPurchaseService.getProducts()).filter(
      (product) => !product.identifier.match('mega_boost')
    );
  }

  purchase(productIdentifier: string): void {
    this.inAppPurchaseService.purchase(productIdentifier);
  }
}
