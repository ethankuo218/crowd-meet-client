import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController, RangeCustomEvent } from '@ionic/angular';
import { Category } from '../core/states/reference-state/reference.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
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
  categoryList: Category[] = [];

  minDate: string = '';

  get categories(): FormArray {
    return <FormArray>this.filterForm.get('categories');
  }

  filterForm: FormGroup = new FormGroup({
    categories: new FormArray([], Validators.required),
    radius: new FormControl<number>(5, Validators.required),
    startDate: new FormControl<string>(
      new Date().toISOString().split('.')[0],
      Validators.required
    ),
    endDate: new FormControl<string>(
      new Date().toISOString().split('.')[0],
      Validators.required
    )
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

    this.minDate = new Date().toISOString().split('.')[0];
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
        ...this.filterForm.value,
        startDate: new Date(this.filterForm.value.startDate).toISOString(),
        endDate: new Date(this.filterForm.value.endDate).toISOString(),
        categories: this.getCategories()
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
    const returnArr: number[] = [];

    this.categories.value.forEach((element: boolean, index: number) => {
      const category = this.categoryList[index];
      if (element && category) {
        returnArr.push(category.categoryId);
      }
    });

    return returnArr;
  }
}
