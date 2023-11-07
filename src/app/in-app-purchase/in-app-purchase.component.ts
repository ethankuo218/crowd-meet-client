import { InAppPurchaseService } from './../core/in-app-purchase.service';
import { Component, Input, NgZone, OnInit, inject } from '@angular/core';
import SwiperCore, { Pagination, Swiper } from 'swiper';
import { PurchasesStoreProduct } from '@awesome-cordova-plugins/purchases/ngx';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IonicModule, ModalController } from '@ionic/angular';
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
  private modalControl = inject(ModalController);

  buttonDisabled!: boolean;
  buttonText!: string;
  productList: PurchasesStoreProduct[] = [];
  activeSubscriptions: string[] = [];
  currentIndex: number = 0;

  async ngOnInit() {
    this.productList = (await this.inAppPurchaseService.getProducts()).filter(
      (product) => !product.identifier.match('mega_boost')
    );
    this.activeSubscriptions = (
      await this.inAppPurchaseService.getCustomerInfo()
    ).activeSubscriptions.map((subscription) =>
      this.formatIdentifier(subscription)
    );
    const freeProduct = {
      identifier: 'free',
      priceString: '$0.00'
    } as PurchasesStoreProduct;
    this.productList = [freeProduct, ...this.productList];
    // this.productList = [
    //   freeProduct,
    //   {
    //     identifier: 'crowdMeet_Influencer_1m',
    //     discounts: [],
    //     productType: 'NON_CONSUMABLE',
    //     title: '',
    //     introPrice: null,
    //     subscriptionPeriod: 'P1M',
    //     productCategory: 'SUBSCRIPTION',
    //     price: 6.99,
    //     description: '',
    //     currencyCode: 'USD',
    //     priceString: '$6.99'
    //   },
    //   {
    //     currencyCode: 'USD',
    //     introPrice: null,
    //     productType: 'NON_CONSUMABLE',
    //     priceString: '$4.99',
    //     productCategory: 'SUBSCRIPTION',
    //     description: '',
    //     title: '',
    //     subscriptionPeriod: 'P1M',
    //     discounts: [],
    //     price: 4.99,
    //     identifier: 'crowdMeet_social_spark_1m'
    //   },
    //   {
    //     discounts: [],
    //     identifier: 'crowdMeet_Lifestyle_1m',
    //     price: 10.99,
    //     productCategory: 'SUBSCRIPTION',
    //     productType: 'NON_CONSUMABLE',
    //     introPrice: null,
    //     description: '',
    //     currencyCode: 'USD',
    //     title: '',
    //     priceString: '$10.99',
    //     subscriptionPeriod: 'P1M'
    //   }
    // ] as any as PurchasesStoreProduct[];
    console.log(this.productList);
    this.updateButtonProperties();
  }

  updateButtonProperties() {
    const product = this.productList[this.currentIndex];
    this.buttonDisabled =
      product.identifier === 'free' ||
      this.hasSubscribed(product.identifier) ||
      this.hasLifeStyleSubscribed();
    this.buttonText = this.getButtonText(product);
  }

  getButtonText(product: PurchasesStoreProduct): string {
    if (this.hasLifeStyleSubscribed()) {
      return 'LifeStyle Bundle Subscribed';
    } else if (this.hasSubscribed(product.identifier)) {
      return 'Subscribed';
    } else {
      return product.priceString + ' / Month';
    }
  }

  async purchase(productIdentifier: string): Promise<void> {
    if (productIdentifier === 'free') return;
    const customerInfo = await this.inAppPurchaseService.purchase(
      productIdentifier
    );
    this.activeSubscriptions = customerInfo.activeSubscriptions.map(
      (subscription) => this.formatIdentifier(subscription)
    );
    this.updateButtonProperties();
  }

  onActiveIndexChange(swiper: Swiper[]): void {
    this.zone.run(() => {
      this.currentIndex = swiper[0].activeIndex;
      this.updateButtonProperties();
    });
  }

  hasSubscribed(identifier: string): boolean {
    const formattedIdentifier = this.formatIdentifier(identifier);
    const influencerAndSocialSpark = [
      'crowdmeet_influencer_1m',
      'crowdmeet_social_spark_1m'
    ];
    const activeSubscriptionsSet = new Set(this.activeSubscriptions);
    if (
      formattedIdentifier === 'crowdmeet_lifestyle_1m' &&
      influencerAndSocialSpark.every((identifier) =>
        activeSubscriptionsSet.has(identifier)
      )
    ) {
      return true;
    }
    return this.activeSubscriptions.includes(formattedIdentifier);
  }

  hasLifeStyleSubscribed(): boolean {
    const identifier = 'crowdMeet_Lifestyle_1m';
    return this.activeSubscriptions.includes(this.formatIdentifier(identifier));
  }

  cancel(): void {
    this.modalControl.dismiss(null, 'cancel');
  }

  private formatIdentifier(identifier: string): string {
    return identifier.split(':')[0].toLowerCase();
  }
}
