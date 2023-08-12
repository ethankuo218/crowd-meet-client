import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';
import { InAppPurchaseComponent } from '../in-app-purchase/in-app-purchase.component';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: 'event',
        pathMatch: 'full'
      },
      {
        path: 'event',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../event/event.module').then((m) => m.EventModule)
          }
        ]
      },
      {
        path: 'chat',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../chat/chat.module').then((m) => m.ChatModule)
          }
        ]
      },
      {
        path: 'event-create',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../event-create/event-create.module').then(
                (m) => m.EventCreateModule
              )
          }
        ]
      },
      {
        path: 'history',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../history/history.module').then((m) => m.HistoryModule)
          }
        ]
      },
      {
        path: 'notifications',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../notifications/notifications.module').then(
                (m) => m.NotificationsPageModule
              )
          }
        ]
      },
      {
        path: 'menu',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../menu/menu.module').then((m) => m.MenuModule)
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), InAppPurchaseComponent],
  exports: [RouterModule],
  providers: []
})
export class TabsPageRoutingModule {}
