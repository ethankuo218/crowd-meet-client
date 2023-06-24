import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { EditProfileComponent } from './edit-profile.component';
import { LanguageService } from '../language/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { ImgUploadService } from '../core/img-upload.service';
import { ShellModule } from '../shell/shell.module';
import { HeaderComponent } from '../header/header.component';
import { SwiperModule } from 'swiper/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

const routes: Routes = [
  {
    path: '',
    component: EditProfileComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FontAwesomeModule,
    FormsModule,
    TranslateModule,
    RouterModule.forChild(routes),
    ShellModule,
    HeaderComponent,
    SwiperModule
  ],
  declarations: [EditProfileComponent],
  providers: [LanguageService, ImgUploadService]
})
export class EditProfileModule {}
