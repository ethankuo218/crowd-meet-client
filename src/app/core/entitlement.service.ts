import { Injectable } from '@angular/core';
import { Purchases } from '@awesome-cordova-plugins/purchases/ngx';
import { Observable, from, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntitlementService {
  constructor(private readonly purchases: Purchases) {}

  getEntitlements() {
    const customerInfo$ = from(this.purchases.getCustomerInfo());
    return customerInfo$.pipe(map((customerInfo) => customerInfo.entitlements));
  }

  hasEntitlement(entitlementId: string): Observable<boolean> {
    return this.getEntitlements().pipe(
      take(1),
      map((entitlements) => {
        const entitlement = entitlements.active[entitlementId];
        return entitlement && entitlement.isActive;
      })
    );
  }
}

export enum Entitlements {
  UNLIMITED_HOST = 'unlimitedHost',
  EVENT_TOP_ORDER = 'eventTopOrder',
  EVENT_NOTIFY = 'eventNotify',
  DIRECT_MESSAGE = 'directMessage',
  VIEW_PARTICIPANT = 'viewParticipant',
  INFLUENCER_BADGE = 'influencerBadge',
  SOCIAL_BADGE = 'socialBadge',
  AD_FREE = 'adFree',
  LIFESTYLE_BADGE = 'lifestyleBadge',
  UNLIMITED_APPLY = 'unlimitedApply'
}
