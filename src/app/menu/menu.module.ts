import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MenuComponent } from './menu.component';
const routes: Routes = [
  {
    path: '',
    component: MenuComponent
  }
];

@NgModule({
  declarations: [MenuComponent],
  imports: [IonicModule, CommonModule, RouterModule.forChild(routes)]
})
export class MenuModule {}
