import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SwiperModule } from 'swiper/angular';

import { GettingStartedPage } from './getting-started.page';
import { HttpClientService } from '../../core/http-client.service';
import { ShellModule } from 'src/app/shell/shell.module';
import { CheckboxWrapperComponent } from 'src/app/components/checkbox-wrapper/checkbox-wrapper.component';

const routes: Routes = [
  {
    path: '',
    component: GettingStartedPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SwiperModule,
    ShellModule,
    CheckboxWrapperComponent
  ],
  declarations: [GettingStartedPage],
  providers: [HttpClientService]
})
export class GettingStartedPageModule {}
