import { firstValueFrom, from, map, of, switchMap } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import {
  Purchases,
  PurchasesStoreProduct
} from '@awesome-cordova-plugins/purchases/ngx';
import { Platform } from '@ionic/angular';
import { Auth, user } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class InAppPurchaseService {
  private purchases = inject(Purchases);
  private platform = inject(Platform);
  private auth = inject(Auth);

  async initialInAppPurchase(userId: number): Promise<void> {
    this.purchases.setDebugLogsEnabled(true);
    if (this.platform.is('ios')) {
      this.purchases.configureWith({
        apiKey: 'appl_pSXpxYdElyvkaGoluStFYFEeufZ'
      });
    } else if (this.platform.is('android')) {
      this.purchases.configureWith({
        apiKey: 'goog_zdLdwSKOtRgrUYVKcgrEgrNzzBj'
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

  purchase(productIdentifier: string) {
    this.purchases.purchaseProduct(productIdentifier);
  }
}
