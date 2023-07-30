import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectGenderComponent } from './select-gender/select-gender.component';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SelectBirthComponent } from './select-birth/select-birth.component';
import { FillInfoService } from './fill-info.service';
import { CheckboxWrapperComponent } from 'src/app/components/checkbox-wrapper/checkbox-wrapper.component';
import { ShellModule } from 'src/app/shell/shell.module';
import { SwiperModule } from 'swiper/angular';
import { SelectInterestsComponent } from './select-interests/select-interests.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'gender',
    pathMatch: 'full'
  },
  {
    path: 'gender',
    component: SelectGenderComponent
  },
  {
    path: 'birth',
    component: SelectBirthComponent
  },
  {
    path: 'interests',
    component: SelectInterestsComponent
  }
];

@NgModule({
  declarations: [
    SelectGenderComponent,
    SelectBirthComponent,
    SelectInterestsComponent
  ],
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
  providers: [FillInfoService]
})
export class FillInfoModule {}
