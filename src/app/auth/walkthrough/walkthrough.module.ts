import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SwiperModule } from 'swiper/angular';

import { WalkthroughPage } from './walkthrough.page';
import { ShellModule } from 'src/app/shell/shell.module';
import { TranslateModule } from '@ngx-translate/core';
import { CheckboxWrapperComponent } from 'src/app/components/checkbox-wrapper/checkbox-wrapper.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FillInfoService } from './fill-info.service';

const routes: Routes = [
  {
    path: '',
    component: WalkthroughPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ShellModule,
    RouterModule.forChild(routes),
    SwiperModule,
    TranslateModule,
    CheckboxWrapperComponent,
    FontAwesomeModule
  ],
  declarations: [WalkthroughPage],
  providers: [FillInfoService]
})
export class WalkthroughPageModule {}
