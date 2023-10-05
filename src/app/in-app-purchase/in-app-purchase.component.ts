import { InAppPurchaseService } from './../core/in-app-purchase.service';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgZone,
  OnInit,
  inject
} from '@angular/core';
import SwiperCore, { Pagination, Swiper } from 'swiper';
import { PurchasesStoreProduct } from '@awesome-cordova-plugins/purchases/ngx';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IonicModule } from '@ionic/angular';
import { SwiperModule } from 'swiper/angular';
import { HeaderComponent } from '../header/header.component';
import { TranslateModule } from '@ngx-translate/core';

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
    TranslateModule
  ]
})
export class InAppPurchaseComponent implements OnInit {
  @Input() isModalMode = false;

  private inAppPurchaseService = inject(InAppPurchaseService);
  private zone = inject(NgZone);

  productList: PurchasesStoreProduct[] = [];

  currentIndex: number = 0;

  async ngOnInit() {
    this.productList = (await this.inAppPurchaseService.getProducts()).filter(
      (product) => !product.identifier.match('mega_boost')
    );
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
