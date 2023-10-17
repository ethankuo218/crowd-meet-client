import { InAppPurchaseService } from './../core/in-app-purchase.service';
import { Component, Input, NgZone, OnInit, inject } from '@angular/core';
import SwiperCore, { Pagination, Swiper } from 'swiper';
import { PurchasesStoreProduct } from '@awesome-cordova-plugins/purchases/ngx';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IonicModule } from '@ionic/angular';
import { SwiperModule } from 'swiper/angular';
import { HeaderComponent } from '../header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { BundleWordingPipe } from './pipe/bundle-wording.pipe';

SwiperCore.use([Pagination]);

@Component({
  selector: 'app-in-app-purchase',
  templateUrl: './in-app-purchase.component.html',
  styleUrls: ['./in-app-purchase.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    HeaderComponent,
    FontAwesomeModule,
    SwiperModule,
    TranslateModule,
    BundleWordingPipe
  ]
})
export class InAppPurchaseComponent implements OnInit {
  @Input() isModalMode = false;

  private inAppPurchaseService = inject(InAppPurchaseService);
  private zone = inject(NgZone);

  productList: PurchasesStoreProduct[] = [];

  currentIndex: number = 0;

  async ngOnInit() {
    // this.productList = (await this.inAppPurchaseService.getProducts()).filter(
    //   (product) => !product.identifier.match('mega_boost')
    // );
    const freeProduct = {
      identifier: 'free',
      priceString: '$0.00'
      // ... add any other necessary default values
    } as PurchasesStoreProduct;
    this.productList = [
      freeProduct,
      {
        identifier: 'crowdMeet_Influencer_1m',
        discounts: [],
        productType: 'NON_CONSUMABLE',
        title: '',
        introPrice: null,
        subscriptionPeriod: 'P1M',
        productCategory: 'SUBSCRIPTION',
        price: 6.99,
        description: '',
        currencyCode: 'USD',
        priceString: '$6.99'
      },
      {
        currencyCode: 'USD',
        introPrice: null,
        productType: 'NON_CONSUMABLE',
        priceString: '$4.99',
        productCategory: 'SUBSCRIPTION',
        description: '',
        title: '',
        subscriptionPeriod: 'P1M',
        discounts: [],
        price: 4.99,
        identifier: 'crowdMeet_social_spark_1m'
      },
      {
        discounts: [],
        identifier: 'crowdMeet_Lifestyle_1m',
        price: 10.99,
        productCategory: 'SUBSCRIPTION',
        productType: 'NON_CONSUMABLE',
        introPrice: null,
        description: '',
        currencyCode: 'USD',
        title: '',
        priceString: '$10.99',
        subscriptionPeriod: 'P1M'
      }
    ] as any as PurchasesStoreProduct[];
    console.log(this.productList);
  }

  purchase(productIdentifier: string): void {
    this.inAppPurchaseService.purchase(productIdentifier);
  }

  onActiveIndexChange(swiper: Swiper[]): void {
    this.zone.run(() => {
      this.currentIndex = swiper[0].activeIndex;
    });
  }
}
