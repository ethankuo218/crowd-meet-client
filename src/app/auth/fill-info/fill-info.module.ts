import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectGenderComponent } from './select-gender/select-gender.component';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SelectBirthComponent } from './select-birth/select-birth.component';
import { FillInfoService } from './fill-info.service';

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
  }
];

@NgModule({
  declarations: [SelectGenderComponent, SelectBirthComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers: [FillInfoService]
})
export class FillInfoModule {}
