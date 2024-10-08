import { firstValueFrom, from, map, of, switchMap } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import {
  CustomerInfo,
  PURCHASE_TYPE,
  Purchases,
  PurchasesStoreProduct
} from '@awesome-cordova-plugins/purchases/ngx';
import { Platform } from '@ionic/angular';
import { Auth, user } from '@angular/fire/auth';
import { environment } from 'src/environments/environment.dev';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class InAppPurchaseService {
  private purchases = inject(Purchases);
  private platform = inject(Platform);
  private auth = inject(Auth);
  private loadingService = inject(LoadingService);

  async initialInAppPurchase(userId: number): Promise<void> {
    this.purchases.setDebugLogsEnabled(false);
    if (this.platform.is('ios')) {
      this.purchases.configureWith({
        apiKey: environment.iosInAppPurchaseApiKey
      });
    } else if (this.platform.is('android')) {
      this.purchases.configureWith({
        apiKey: environment.androidInAppPurchaseApiKey
      });
    }

    const firebaseUid = (await firstValueFrom(user(this.auth)))?.uid;

    this.purchases.logIn(firebaseUid!);
    this.purchases.setAttributes({ serverUid: userId.toString() });
  }

  getProducts(): Promise<PurchasesStoreProduct[]> {
    return firstValueFrom(
      from(this.purchases.getOfferings()).pipe(
        map((offering) => offering.current?.availablePackages!),
        switchMap((packages) => {
          return of(packages.map((item) => item.product));
        })
      )
    );
  }

  async purchase(
    productIdentifier: string,
    type: PURCHASE_TYPE = PURCHASE_TYPE.SUBS
  ): Promise<CustomerInfo> {
    this.loadingService.present();

    try {
      const result = await this.purchases.purchaseProduct(
        productIdentifier,
        null,
        type
      );
      return result.customerInfo;
    } catch (error) {
      throw error;
    } finally {
      this.loadingService.dismiss();
    }
  }

  getCustomerInfo(): Promise<CustomerInfo> {
    return this.purchases.getCustomerInfo();
  }
}
