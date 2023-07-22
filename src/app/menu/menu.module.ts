import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MenuComponent } from './menu.component';
import { HeaderComponent } from '../header/header.component';
import { AuthService } from '../core/auth.service';
import { UserStateFacade } from '../core/+states/user-state/user.state.facade';
import { UserService } from '../core/user.service';
import { ImgUploadService } from '../core/img-upload.service';
const routes: Routes = [
  {
    path: '',
    component: MenuComponent
  }
];

@NgModule({
  declarations: [MenuComponent],
  imports: [
    IonicModule,
    FontAwesomeModule,
    CommonModule,
    RouterModule.forChild(routes),
    HeaderComponent
  ],
  providers: [UserStateFacade, UserService, ImgUploadService]
})
export class MenuModule {}
