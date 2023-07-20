import { Component, OnInit } from '@angular/core';
import { Purchases } from '@awesome-cordova-plugins/purchases/ngx';
declare let window: any;

@Component({
  selector: 'app-in-app-purchase',
  templateUrl: './in-app-purchase.component.html',
  styleUrls: ['./in-app-purchase.component.scss']
})
export class InAppPurchaseComponent implements OnInit {
  offering: any | undefined;

  constructor(private purchases: Purchases) {}

  ngOnInit() {
    this.purchases.getOfferings().then((offerings) => {
      console.log('************');
      console.log(offerings);
      console.log('************');

      if (
        offerings.current !== null &&
        offerings.current.availablePackages.length !== 0
      ) {
        this.offering = offerings.current.availablePackages[0];
      }
    });
  }

  purchase() {
    this.purchases.purchasePackage(this.offering).then(() => {});
  }
}
