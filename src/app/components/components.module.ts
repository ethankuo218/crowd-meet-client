import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ShellModule } from '../shell/shell.module';

import { CheckboxWrapperComponent } from './checkbox-wrapper/checkbox-wrapper.component';
// import { CountdownTimerComponent } from './countdown-timer/countdown-timer.component';
import { RatingInputComponent } from './rating-input/rating-input.component';
import { CounterInputComponent } from './counter-input/counter-input.component';
// import { GoogleMapComponent } from './google-map/google-map.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ShellModule,
    IonicModule
  ],
  declarations: [
    CheckboxWrapperComponent,
    // CountdownTimerComponent,
    CounterInputComponent,
    RatingInputComponent,
    // GoogleMapComponent
  ],
  exports: [
    ShellModule,
    CheckboxWrapperComponent,
    // ShowHidePasswordComponent,
    // CountdownTimerComponent,
    CounterInputComponent,
    RatingInputComponent,
    // GoogleMapComponent
  ]
})
export class ComponentsModule {}
