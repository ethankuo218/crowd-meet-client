import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { CheckboxWrapperComponent } from '../components/checkbox-wrapper/checkbox-wrapper.component';
import { ReferenceStateFacade } from '../core/states/reference-state/reference.state.facade';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';

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
    ReactiveFormsModule,
    TranslateModule,
    RouterModule.forChild(routes),
    ShellModule,
    HeaderComponent,
    SwiperModule,
    CheckboxWrapperComponent,
    CdkDropList,
    CdkDrag
  ],
  declarations: [EditProfileComponent],
  providers: [LanguageService, ImgUploadService, ReferenceStateFacade]
})
export class EditProfileModule {}
