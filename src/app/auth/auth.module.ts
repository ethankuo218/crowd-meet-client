import { NgModule, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Routes,
  RouterModule,
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../core/auth.service';
import { UserService } from '../core/user.service';
import { Observable, map } from 'rxjs';

const preventNavigateToSignInPage: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(AuthService).isLogout();
};

const preventBackToWalkthroughPage: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  const userService = inject(UserService);

  return userService.getHasBirthDate().pipe(
    map((hasBirthDate) => {
      console.log(`getHasBirthDate: ${hasBirthDate}`);
      return !hasBirthDate; // negate the value to ensure users with a birthday can't access
    })
  );
};

const routes: Routes = [
  {
    path: '',
    children: [
      // ? /firebase/auth redirect
      {
        path: '',
        redirectTo: 'sign-in',
        pathMatch: 'full'
      },
      {
        path: 'sign-in',
        loadChildren: () =>
          import('./sign-in/sign-in.module').then((m) => m.SignInPageModule),
        canActivate: [preventNavigateToSignInPage]
      },
      {
        path: 'walkthrough',
        loadChildren: () =>
          import('./walkthrough/walkthrough.module').then(
            (m) => m.WalkthroughPageModule
          ),
        canActivate: [preventBackToWalkthroughPage]
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes)
    // ? Correct way to initialize Firebase using the Capacitor Firebase plugin mixed with the Firebase JS SDK (@angular/fire)
  ],
  providers: []
})
export class AuthModule {}
