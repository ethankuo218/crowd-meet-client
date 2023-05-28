import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { redirectUnauthorizedTo, canActivate, AuthPipe } from '@angular/fire/auth-guard';

import { ComponentsModule } from '../../components/components.module';
import { ProfilePage } from './profile.page';
import { ProfileResolver } from './profile.resolver';


const redirectUnauthorizedToLogin: () => AuthPipe = () => redirectUnauthorizedTo(['/auth/sign-in']);

const routes: Routes = [
  {
    path: '',
    component: ProfilePage,
    resolve: {
      data: ProfileResolver
    },
    ...canActivate(redirectUnauthorizedToLogin)
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [
    ProfilePage
  ],
  providers: [
    ProfileResolver
  ]
})
export class ProfilePageModule {}
