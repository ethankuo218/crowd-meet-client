import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../components/components.module';
import { EventCreateComponent } from './event-create.component';
import { ImgUploadService } from 'src/app/core/img-upload.service';
import { HeaderComponent } from 'src/app/header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

const routes: Routes = [
  {
    path: '',
    component: EventCreateComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    HeaderComponent
  ],
  declarations: [EventCreateComponent],
  providers: [ImgUploadService]
})
export class EventCreateModule {}
