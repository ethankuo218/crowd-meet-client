import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HeaderComponent } from '../header/header.component';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { UserStateFacade } from '../core/states/user-state/user.state.facade';
import { SwiperModule } from 'swiper/angular';
import SwiperCore, { Pagination } from 'swiper';
import { CoreModule } from '../core/core.module';

SwiperCore.use([Pagination]);

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent
  }
];

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    IonicModule,
    FontAwesomeModule,
    HeaderComponent,
    RouterModule.forChild(routes),
    SwiperModule,
    CoreModule
  ],
  providers: [UserStateFacade]
})
export class ProfileModule {}
