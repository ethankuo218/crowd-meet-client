import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { map } from 'rxjs/operators';

import { canActivate, AuthPipeGenerator } from '@angular/fire/auth-guard';

import { SignInPage } from './sign-in.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// ? Firebase guard to redirect logged in users to profile
const redirectLoggedInToHome: AuthPipeGenerator = (next) =>
  map((user) => {
    // ? When queryParams['auth-redirect'] don't redirect because we want the component to handle the redirection
    if (
      user !== null &&
      !next.queryParams['auth-redirect'] &&
      !next.params['logout']
    ) {
      return ['app/event'];
    } else {
      return true;
    }
  });

const routes: Routes = [
  {
    path: '',
    component: SignInPage,
    ...canActivate(redirectLoggedInToHome)
  },
  {
    path: ':logout',
    component: SignInPage,
    ...canActivate(redirectLoggedInToHome)
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FontAwesomeModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SignInPage]
})
export class SignInPageModule {}
