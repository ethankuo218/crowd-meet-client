import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/walkthrough',
    pathMatch: 'full',
  },
  {
    path: 'walkthrough',
    loadChildren: () =>
      import('./walkthrough/walkthrough.module').then(
        (m) => m.WalkthroughPageModule
      ),
  },
  {
    path: 'getting-started',
    loadChildren: () =>
      import('./getting-started/getting-started.module').then(
        (m) => m.GettingStartedPageModule
      ),
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // This value is required for server-side rendering to work.
      initialNavigation: 'enabledBlocking',
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
