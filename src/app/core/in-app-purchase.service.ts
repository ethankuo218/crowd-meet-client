import { firstValueFrom, from, map, of, switchMap } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import {
  Purchases,
  PurchasesStoreProduct
} from '@awesome-cordova-plugins/purchases/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class InAppPurchaseService {
  private purchases = inject(Purchases);
  private platform = inject(Platform);

  initialInAppPurchase(userId: number): void {
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
    this.purchases.logIn(userId.toString());
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
