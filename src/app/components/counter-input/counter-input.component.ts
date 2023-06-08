import {
  Component,
  forwardRef,
  Input,
  OnChanges,
  ViewEncapsulation,
} from '@angular/core';
import {
  UntypedFormControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  AbstractControl,
} from '@angular/forms';

export function counterRangeValidator(minValue: number, maxValue: number) {
  return (c: AbstractControl) => {
    const err = {
      rangeError: {
        given: c.value,
        min: minValue || 0,
        max: maxValue || 10,
      },
    };

    return c.value > +maxValue || c.value < +minValue ? err : null;
  };
}

@Component({
  selector: 'app-counter-input',
  templateUrl: './counter-input.component.html',
  styleUrls: ['./counter-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CounterInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CounterInputComponent),
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class CounterInputComponent implements ControlValueAccessor, OnChanges {
  @Input('counterValue') _counterValue = 0;
  @Input('max') counterRangeMax: number = 0;
  @Input('min') counterRangeMin: number = 0;

  propagateChange: any = () => {}; // Noop function
  validateFn: any = () => {}; // Noop function

  get counterValue() {
    return this._counterValue;
  }

  set counterValue(val) {
    this._counterValue = val;
    this.propagateChange(val);
  }

  ngOnChanges(inputs: any) {
    if (inputs.counterRangeMax || inputs.counterRangeMin) {
      this.validateFn = counterRangeValidator(
        this.counterRangeMin,
        this.counterRangeMax
      );
    }
  }

  writeValue(value: number) {
    if (value) {
      this.counterValue = value;
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

  increase() {
    this.counterValue++;
  }

  decrease() {
    this.counterValue--;
  }

  validate(c: UntypedFormControl) {
    return this.validateFn(c);
  }
}
