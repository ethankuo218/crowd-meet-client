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
export class TabsPage implements OnInit {
  private menu = inject(MenuController);
  private router = inject(Router);
  private fcmTokenService = inject(FcmTokenService);
  private zone = inject(NgZone);

  private readonly tabBarExceptionList = [
    '/app/event/list/',
    '/app/chat/list/',
    '/app/event/profile/',
    '/app/menu/profile'
  ];

  ngOnInit(): void {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.zone.run(() => {
        const slug = event.url.split('.app').pop();
        if (slug) {
          this.router.navigate([slug]);
        }
      });
    });

    this.fcmTokenService.addListener();
  }

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
