import { firstValueFrom, from, map, of, switchMap } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import {
  CustomerInfo,
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

  async purchase(productIdentifier: string): Promise<CustomerInfo> {
    return (await this.purchases.purchaseProduct(productIdentifier))
      .customerInfo;
  }
}
