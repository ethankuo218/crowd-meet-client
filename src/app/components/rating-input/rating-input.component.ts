import { CommonModule } from '@angular/common';
import {
  Component,
  forwardRef,
  Input,
  ViewEncapsulation,
  OnInit
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-rating-input',
  templateUrl: './rating-input.component.html',
  styleUrls: ['./rating-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RatingInputComponent),
      multi: true
    }
  ],
  standalone: true,
  imports: [CommonModule, IonicModule, FontAwesomeModule],
  encapsulation: ViewEncapsulation.None
})
export class RatingInputComponent implements ControlValueAccessor, OnInit {
  @Input() max = 5;
  @Input() readOnly = false;

  range: Array<number> = [];
  innerValue: any; // the value of the control
  propagateChange: any = () => {};

  ngOnInit() {
    this.range = []; // the amout of stars

    for (let i = 0; i < this.max; i++) {
      this.range[i] = 1;
    }
  }

  get value(): any {
    return this.innerValue;
  }

  set value(val: any) {
    if (val !== this.innerValue) {
      this.innerValue = val;
      this.propagateChange(val);
    }
  }

  writeValue(value: any) {
    if (value !== this.innerValue) {
      this.innerValue = value;
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

  rate(amount: number) {
    if (!this.readOnly && amount >= 0 && amount <= this.range.length) {
      this.value = amount;
    }
  }
}
