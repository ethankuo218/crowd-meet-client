import { FillInfoService } from '../fill-info.service';
import { ReferenceStateFacade } from '../../../core/+states/reference-state/reference.state.facade';
import { Component, HostBinding, NgZone, OnInit, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import { IonicSwiper } from '@ionic/angular';
import SwiperCore, { Pagination } from 'swiper';
import { Category } from 'src/app/core/+states/reference-state/reference.model';
import { take } from 'rxjs';

SwiperCore.use([Pagination, IonicSwiper]);

@Component({
  selector: 'app-select-interests',
  templateUrl: './select-interests.component.html',
  styleUrls: [
    './styles/select-interests.component.scss',
    './styles/select-interests.responsive.scss'
  ]
})
export class SelectInterestsComponent implements OnInit {
  private ngZone = inject(NgZone);
  private formBuilder = inject(FormBuilder);
  private referenceStateFacade = inject(ReferenceStateFacade);
  private fillInfoService = inject(FillInfoService);

  @HostBinding('class.last-slide-active') isLastSlide = false;

  private swiperRef!: SwiperCore;

  categoryList: Category[] = [];
  interestForm: FormGroup = new FormGroup({
    interests: new FormArray([], [Validators.required])
  });

  get interests(): FormArray {
    return <FormArray>this.interestForm.get('interests');
  }

  ngOnInit(): void {
    this.interestForm = this.formBuilder.group({
      interests: this.formBuilder.array([])
    });

    this.referenceStateFacade
      .getCategories()
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.categoryList = result;
          this.categoryList.forEach(() => {
            this.interests.push(new FormControl());
          });
        }
      });
  }

  swiperInit(swiper: SwiperCore): void {
    this.swiperRef = swiper;
  }

  slideWillChange(): void {
    // ? We need to use ngZone because the change happens outside Angular
    // (see: https://swiperjs.com/angular#swiper-component-events)
    this.ngZone.run(() => {
      if (this.swiperRef) {
        this.isLastSlide = this.swiperRef.isEnd;
      }
    });
  }

  trackByIndex(index: number, item: Category): number {
    return index;
  }

  goNext(): void {
    const selection: number[] = [];
    this.interests.value.forEach((value: boolean, index: number) => {
      if (value) {
        selection.push(this.categoryList[index].categoryId);
      }
    });

    this.fillInfoService.interests = selection;
    this.fillInfoService.saveInfo();
  }
}
