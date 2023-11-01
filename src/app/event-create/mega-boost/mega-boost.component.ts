import { UserService } from 'src/app/core/user.service';
import { InAppPurchaseService } from './../../core/in-app-purchase.service';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PURCHASE_TYPE,
  PurchasesStoreProduct
} from '@awesome-cordova-plugins/purchases/ngx';
import { IonicModule, ModalController } from '@ionic/angular';
import { take } from 'rxjs';
import { MegaBoost } from 'src/app/core/models/core.model';
import { EventService } from 'src/app/core/event.service';
import { LoadingService } from 'src/app/core/loading.service';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-mega-boost',
  templateUrl: './mega-boost.component.html',
  styleUrls: ['./mega-boost.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    TranslateModule,
    FontAwesomeModule
  ]
})
export class MegaBoostComponent implements OnInit {
  private inAppPurchaseService = inject(InAppPurchaseService);
  private modalController = inject(ModalController);
  private eventService = inject(EventService);
  private userService = inject(UserService);
  private loadingService = inject(LoadingService);
  private dialog = inject(MatDialog);

  @Input() eventId?: number;
  @Input() endTime!: string;
  @Input() eventInfo?: any;

  productList: PurchasesStoreProduct[] = [];

  private oneDayBoost: MegaBoost[] = [];
  private threeDayBoost: MegaBoost[] = [];
  private sevenDayBoost: MegaBoost[] = [];

  ngOnInit(): void {
    this.inAppPurchaseService.getProducts().then((productList) => {
      const oneDayBoostProduct = productList.find((product) =>
        product.identifier.match('mega_boost_1d')
      );
      this.productList.push(oneDayBoostProduct!);
      const threeDayBoostProduct = productList.find((product) =>
        product.identifier.match('mega_boost_3d')
      );
      this.productList.push(threeDayBoostProduct!);
      const sevenDayBoostProduct = productList.find((product) =>
        product.identifier.match('mega_boost_7d')
      );
      this.productList.push(sevenDayBoostProduct!);
    });

    this.userService
      .getMegaBoost()
      .pipe(take(1))
      .subscribe({
        next: (result: MegaBoost[]) => {
          result.forEach((boost) => {
            switch (boost.duration) {
              case 1:
                this.oneDayBoost.push(boost);
                break;
              case 3:
                this.threeDayBoost.push(boost);
                break;
              case 7:
                this.sevenDayBoost.push(boost);
                break;
            }
          });
        }
      });
  }

  async purchase(
    productIdentifier: string,
    isHistoryPurchase: boolean,
    boostType: number
  ): Promise<void> {
    let revenueCatId = '';

    if (isHistoryPurchase) {
      this.loadingService.present();
      try {
        switch (boostType) {
          case 1:
            revenueCatId = this.oneDayBoost.shift()?.revenueCatId!;
            break;
          case 3:
            revenueCatId = this.threeDayBoost.shift()?.revenueCatId!;
            break;
          case 7:
            revenueCatId = this.sevenDayBoost.shift()?.revenueCatId!;
            break;
        }

        await this.applyMegaBoost(revenueCatId);

        this.modalController.dismiss();
      } catch (error) {
        console.error(error);
      } finally {
        this.loadingService.dismiss();
      }
    } else {
      try {
        revenueCatId = (
          await this.inAppPurchaseService.purchase(
            productIdentifier,
            PURCHASE_TYPE.INAPP
          )
        ).nonSubscriptionTransactions.pop()?.transactionIdentifier!;

        await this.applyMegaBoost(revenueCatId);

        this.modalController.dismiss();
      } catch (error) {
        console.error('[MEGA BOOST]', error);
      } finally {
      }
    }
  }

  private async applyMegaBoost(revenueCatId: string): Promise<void> {
    try {
      if (this.eventInfo) {
        await this.eventService.createEvent({
          ...this.eventInfo,
          useMegaBoost: {
            revenueCatId: revenueCatId,
            isHistoryPurchase: false
          }
        });
      } else {
        await this.eventService.updateEvent(this.eventId!, {
          useMegaBoost: {
            revenueCatId: revenueCatId,
            isHistoryPurchase: false
          }
        });
      }
    } catch (error) {
      throw error;
    }
  }

  isLongerThanEvent(index: number): boolean {
    const boostTypeMap = [1, 3, 7];
    const current = new Date().getTime();
    const endTime = new Date(this.endTime).getTime();
    const duration = boostTypeMap[index] * 24 * 60 * 60 * 1000; // duration in millisecond

    return current + duration < endTime;
  }

  cancel(): void {
    this.modalController.dismiss({}, 'cancel');
  }

  get boostCount(): number[] {
    return [
      this.oneDayBoost.length,
      this.threeDayBoost.length,
      this.sevenDayBoost.length
    ];
  }
}
