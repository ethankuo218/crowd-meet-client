import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UserProfilePage } from './user-profile.page';
import { ComponentsModule } from '../components/components.module';
import { LanguageService } from '../language/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { ImgUploadService } from '../core/img-upload.service';

const routes: Routes = [
  {
    path: '',
    component: UserProfilePage,
  },
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    ComponentsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [UserProfilePage],
  providers: [
    LanguageService,
    ImgUploadService
  ],
})
export class UserProfilePageModule {}
