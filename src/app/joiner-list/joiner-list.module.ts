import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from '../header/header.component';
import { RouterModule, Routes } from '@angular/router';
import { JoinerListComponent } from './joiner-list.component';

const routes: Routes = [
  {
    path: '',
    component: JoinerListComponent
  }
];

@NgModule({
  declarations: [JoinerListComponent],
  imports: [
    CommonModule,
    IonicModule,
    HeaderComponent,
    RouterModule.forChild(routes)
  ]
})
export class JoinerListModule {}
