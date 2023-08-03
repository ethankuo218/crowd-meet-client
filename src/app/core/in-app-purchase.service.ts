import { firstValueFrom, from, map, of, switchMap } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import {
  Purchases,
  PurchasesStoreProduct
} from '@awesome-cordova-plugins/purchases/ngx';
import { Platform } from '@ionic/angular';
import { Auth, user } from '@angular/fire/auth';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class InAppPurchaseService {
  private purchases = inject(Purchases);
  private platform = inject(Platform);
  private auth = inject(Auth);

  private purchaseAttr: { serverUid: string } | undefined;

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
    this.purchaseAttr = { serverUid: userId.toString() };
    this.purchases.setAttributes(this.purchaseAttr);
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

  purchase(productIdentifier: string) {
    this.purchases.purchaseProduct(productIdentifier);
  }

  purchaseBoost() {
    this.resetAttributes();
  }

  setAttributes(parameter: any) {
    this.purchases.setAttributes({
      ...this.purchaseAttr,
      ...parameter
    });
  }

  resetAttributes() {
    this.purchases.setAttributes(this.purchaseAttr!);
  }
  // set eventId in attributes if purchase boost
  // { serverUid: userId.toString(), boostEventId: eventId.toString() }
  // delete boostEventId when swipe down
}
