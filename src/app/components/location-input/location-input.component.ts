import { GoogleMapsLoaderService } from 'src/app/core/google-maps-loader.service';
import { CommonModule } from '@angular/common';
import {
  Component,
  ViewChild,
  forwardRef,
  AfterViewInit,
  OnDestroy,
  EventEmitter,
  Output,
  inject
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IonInput, IonicModule } from '@ionic/angular';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormsModule
} from '@angular/forms';
import { fromEvent, map, debounceTime, Subscription } from 'rxjs';

@Component({
  selector: 'app-location-input',
  templateUrl: './location-input.component.html',
  styleUrls: ['./location-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LocationInputComponent),
      multi: true
    },
    GoogleMapsLoaderService
  ],
  standalone: true,
  imports: [CommonModule, IonicModule, FontAwesomeModule, FormsModule]
})
export class LocationInputComponent
  implements ControlValueAccessor, AfterViewInit, OnDestroy
{
  private googleMapsLoaderService = inject(GoogleMapsLoaderService);

  @ViewChild('inputbox') input!: IonInput;
  @Output()
  locaitionChangeEvent: EventEmitter<google.maps.places.PlaceResult> =
    new EventEmitter();

  predictions: google.maps.places.AutocompletePrediction[] = [];

  isDisabled: boolean = false;

  showDropddown: boolean = false;

  private _value: any;
  onChange: any = () => {};

  get value(): any {
    return this._value;
  }

  set value(val: any) {
    if (val !== this._value) {
      this._value = val;
      this.onChange(val);
    }
  }

  private subscription!: Subscription;

  async ngAfterViewInit(): Promise<void> {
    const inputElement = await this.input.getInputElement();
    this.subscription = fromEvent(inputElement, 'keyup')
      .pipe(
        map((event) => inputElement.value),
        debounceTime(1000)
      )
      .subscribe({
        next: async (val) => {
          this._value = val;

          if (this._value && this._value !== '') {
            this.predictions =
              await this.googleMapsLoaderService.loadPredictions(this._value);
            this.showDropddown = true;
          } else {
            this.showDropddown = false;
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  writeValue(val: any): void {
    if (val !== this._value) {
      this._value = val;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(): void {}

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    if (isDisabled) {
      this._value = '';
    }
  }

  async onMenuClick(
    item: google.maps.places.AutocompletePrediction
  ): Promise<void> {
    this.showDropddown = false;
    const selectLocation = await this.googleMapsLoaderService.getPlacesDetail(
      item.place_id
    );
    this.locaitionChangeEvent.emit(selectLocation);
    this._value = item.structured_formatting.main_text;
  }
}
