import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { Capacitor } from '@capacitor/core';

import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {
  provideAuth,
  getAuth,
  initializeAuth,
  indexedDBLocalPersistence,
} from '@angular/fire/auth';

import { ComponentsModule } from '../components/components.module';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { AuthHelper } from './auth.helper';
import { HttpClientService } from '../core/http-client.service';

const routes: Routes = [
  {
    path: '',
    children: [
      // ? /firebase/auth redirect
      {
        path: '',
        redirectTo: '/sign-in',
        pathMatch: 'full',
      },
      {
        path: 'sign-in',
        loadChildren: () =>
          import('./sign-in/sign-in.module').then((m) => m.SignInPageModule),
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
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfilePageModule),
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ComponentsModule,
    RouterModule.forChild(routes),
    // ? Correct way to initialize Firebase using the Capacitor Firebase plugin mixed with the Firebase JS SDK (@angular/fire)
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => {
      if (Capacitor.isNativePlatform()) {
        return initializeAuth(getApp(), {
          persistence: indexedDBLocalPersistence,
          // persistence: browserLocalPersistence
          // popupRedirectResolver: browserPopupRedirectResolver
        });
      } else {
        return getAuth();
      }
    }),
  ],
  providers: [AuthService, HttpClientService, AuthHelper],
})
export class AuthModule {}
