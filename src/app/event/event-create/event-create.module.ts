import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { EventCreateComponent } from './event-create.component';
import { ImgUploadService } from 'src/app/core/img-upload.service';
import { HeaderComponent } from 'src/app/header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EventService } from 'src/app/core/event.service';
import { CounterInputComponent } from 'src/app/components/counter-input/counter-input.component';

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
    HeaderComponent,
    CounterInputComponent
  ],
  declarations: [EventCreateComponent],
  providers: [EventService]
})
export class EventCreateModule {}
