import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      // /app/ redirect
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
              import('../event/event-create/event-create.module').then(
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
      },
      {
        path: 'purchase',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../in-app-purchase/in-app-purchase.module').then(
                (m) => m.InAppPurchaseModule
              )
          }
        ]
      },
      {
        path: 'reviews',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../reviews/reviews.module').then((m) => m.ReviewsModule)
          }
        ]
      },
      {
        path: 'edit-profile',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../edit-profile/edit-profile.module').then(
                (m) => m.EditProfileModule
              )
          }
        ]
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../profile/profile.module').then((m) => m.ProfileModule)
          }
        ]
      },
      {
        path: 'joiner-list',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../joiner-list/joiner-list.module').then(
                (m) => m.JoinerListModule
              )
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class TabsPageRoutingModule {}
