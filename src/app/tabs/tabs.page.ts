import { FcmTokenService } from './../core/fcm-token.service';
import { Component, NgZone, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['./styles/tabs.page.scss']
})
export class TabsPage {
  private menu = inject(MenuController);
  private router = inject(Router);

  private readonly tabBarExceptionList = [
    '/app/event/list/',
    '/app/chat/list/',
    '/app/event/profile/',
    '/app/menu/profile'
  ];

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
