import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['./styles/tabs.page.scss']
})
export class TabsPage {
  private readonly tabBarExceptionList = [
    '/app/event/list/',
    '/app/chat/list/'
  ];

  constructor(public menu: MenuController, private router: Router) {}

  ionViewWillEnter() {
    this.menu.enable(true);
  }

  ionTabsDidChange(event: any) {}

  get currentUrl() {
    return this.router.url;
  }

  get showTabBar() {
    let canShow = true;

    this.tabBarExceptionList.forEach((item) => {
      if (this.currentUrl.match(item)) {
        canShow = false;
      }
    });

    return canShow;
  }
}
