import { InAppPurchaseService } from './../core/in-app-purchase.service';
import { Component, Input, OnInit, inject } from '@angular/core';
import SwiperCore, { Pagination } from 'swiper';
import { PurchasesStoreProduct } from '@awesome-cordova-plugins/purchases/ngx';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IonicModule } from '@ionic/angular';
import { SwiperModule } from 'swiper/angular';
import { HeaderComponent } from '../header/header.component';

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
    SwiperModule
  ]
})
export class InAppPurchaseComponent implements OnInit {
  private inAppPurchaseService = inject(InAppPurchaseService);

  @Input() isModalMode = false;

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
