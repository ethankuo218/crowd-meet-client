import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController, RangeCustomEvent } from '@ionic/angular';
import { Category } from '../core/states/reference-state/reference.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import { take } from 'rxjs';
import { ReferenceStateFacade } from '../core/states/reference-state/reference.state.facade';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FontAwesomeModule, ReactiveFormsModule],
  providers: [ReferenceStateFacade]
})
export class FilterComponent implements OnInit {
  @Input() filter: any;

  categoryList: Category[] = [];

  minDate: string = '';

  get categories(): FormArray {
    return <FormArray>this.filterForm.get('categories');
  }

  filterForm: FormGroup = new FormGroup({
    categories: new FormArray([], []),
    radius: new FormControl<number>(5, []),
    startDate: new FormControl<string>('', []),
    endDate: new FormControl<string>('', [])
  });

  constructor(
    private modalControl: ModalController,
    private referenceStateFacade: ReferenceStateFacade
  ) {}

  ngOnInit() {
    this.referenceStateFacade
      .getCategories()
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.categoryList = result;
          this.categoryList.forEach(() => {
            this.categories.push(new FormControl());
          });
        }
      });

    this.minDate = this.getFormatTimeString();

    this.filterForm.patchValue({
      startDate: this.minDate,
      ...this.filter,
      ...(this.filter?.startDate && {
        startDate: this.getFormatTimeString(this.filter.startDate)
      }),
      ...(this.filter?.categories && {
        categories: this.getPatchCategories()
      })
    });
  }

  cancel(): void {
    this.modalControl.dismiss(null, 'cancel');
  }

  reset(): void {
    this.filterForm.reset();
  }

  applyFilter(): void {
    this.modalControl.dismiss(
      {
        categories: this.getCategories(),
        radius: this.filterForm.value.radius,
        ...(this.filterForm.value.startDate && {
          startDate: new Date(this.filterForm.value.startDate).toISOString()
        }),
        ...(this.filterForm.value.endDate && {
          endDate: new Date(this.filterForm.value.endDate).toISOString()
        })
      },
      'filter'
    );
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  pinFormatter(value: number) {
    return `${value}km`;
  }

  onDistanceChange(event: Event) {
    const value = (event as RangeCustomEvent).detail.value;
    this.filterForm.get('radius')?.patchValue(value);
  }

  private getCategories(): number[] {
    if (this.categories.value.length === 0) {
      return [];
    }

    const returnArr: number[] = [];

    this.categories.value.forEach((element: boolean, index: number) => {
      const category = this.categoryList[index];
      if (element && category) {
        returnArr.push(category.categoryId);
      }
    });

    return returnArr;
  }

  private getPatchCategories() {
    this.filter?.categories.forEach((item: number) => {
      const index = this.categoryList.findIndex(
        (category) => category.categoryId === item
      );
      this.categories.get(index.toString())?.patchValue(true);
    });
  }

  private getFormatTimeString(input?: string): string {
    const date = input ? new Date(input) : new Date();
    const isoDateString = date.toLocaleDateString().split('/');
    const isMorning = date.toLocaleTimeString().split(' ')[1] === 'AM';
    const isoTimeString = date.toLocaleTimeString().split(' ')[0].split(':');

    return `${isoDateString[2]}-${isoDateString[0].padStart(
      2,
      '0'
    )}-${isoDateString[1].padStart(2, '0')}T${
      isMorning
        ? isoTimeString[0].padStart(2, '0')
        : Number(isoTimeString[0]) + 12
    }:${isoTimeString[1]}`;
  }
}
