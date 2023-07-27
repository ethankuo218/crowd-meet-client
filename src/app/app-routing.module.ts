import { NgModule, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterModule,
  RouterStateSnapshot,
  Routes
} from '@angular/router';
import { AuthService } from './core/auth.service';

const redirectUnAuthorizedToLogin: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(AuthService).canActivate();
};

const routes: Routes = [
  {
    path: '',
    redirectTo: 'app',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
    canActivate: [redirectUnAuthorizedToLogin]
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
