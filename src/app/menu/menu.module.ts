import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MenuComponent } from './menu.component';
import { HeaderComponent } from '../header/header.component';
import { UserStateFacade } from '../core/+states/user-state/user.state.facade';
import { UserService } from '../core/user.service';
import { ImgUploadService } from '../core/img-upload.service';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { InAppPurchaseComponent } from '../in-app-purchase/in-app-purchase.component';
import { DirectivesModule } from '../directives/directives.module';

const routes: Routes = [
  {
    path: '',
    component: MenuComponent
  },
  {
    path: 'edit-profile',
    loadChildren: () =>
      import('../menu/edit-profile/edit-profile.module').then(
        (m) => m.EditProfileModule
      )
  },
  {
    path: 'purchase',
    component: InAppPurchaseComponent
  }
];

@NgModule({
  declarations: [MenuComponent],
  imports: [
    IonicModule,
    FontAwesomeModule,
    CommonModule,
    RouterModule.forChild(routes),
    HeaderComponent,
    MatDialogModule,
    TranslateModule,
    InAppPurchaseComponent,
    DirectivesModule
  ],
  providers: [UserStateFacade, UserService, ImgUploadService]
})
export class MenuModule {}
