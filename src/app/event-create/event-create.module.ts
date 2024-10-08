import { GoogleMapsLoaderService } from 'src/app/core/google-maps-loader.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { EventCreateComponent } from './event-create.component';
import { HeaderComponent } from 'src/app/header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CounterInputComponent } from 'src/app/components/counter-input/counter-input.component';
import { LocationInputComponent } from 'src/app/components/location-input/location-input.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ImageCropperModalComponent } from 'src/app/components/image-cropper/image-cropper.component';

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
    CounterInputComponent,
    LocationInputComponent,
    MatDialogModule,
    TranslateModule,
    ImageCropperModalComponent
  ],
  declarations: [EventCreateComponent]
})
export class EventCreateModule {}
