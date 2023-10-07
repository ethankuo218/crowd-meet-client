import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

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
          import('./sign-in/sign-in.module').then((m) => m.SignInPageModule)
      },
      {
        path: 'walkthrough',
        loadChildren: () =>
          import('./walkthrough/walkthrough.module').then(
            (m) => m.WalkthroughPageModule
          )
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
