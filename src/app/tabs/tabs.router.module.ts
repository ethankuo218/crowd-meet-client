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
        pathMatch: 'full',
      },
      {
        path: 'event',
        children: [
          {
            path: 'create',
            loadChildren: () =>
              import('../event/create/create.module').then(
                (m) => m.CreatePageModule
              ),
          },
          {
            path: '',
            loadChildren: () =>
              import('../event/listing/listing.module').then(
                (m) => m.ListingPageModule
              ),
          },
          {
            path: ':id',
            loadChildren: () =>
              import('../event/details/details.module').then(
                (m) => m.DetailsPageModule
              ),
          },
        ],
      },
      {
        path: 'user',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../user/user-profile.module').then(
                (m) => m.UserProfilePageModule
              ),
          },
        ],
      },
      {
        path: 'messages',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../notifications/notifications.module').then(
                (m) => m.NotificationsPageModule
              ),
          },
        ],
      },
      {
        path: 'purchase',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../in-app-purchase/in-app-purchase.module').then(
                (m) => m.InAppPurchaseModule
              ),
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class TabsPageRoutingModule {}
