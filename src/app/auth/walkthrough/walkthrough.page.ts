import { FillInfoService } from './fill-info.service';
import {
  Inject,
  PLATFORM_ID,
  Component,
  AfterViewInit,
  ViewChild,
  HostBinding,
  NgZone,
  OnInit,
  inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { MenuController, IonicSwiper } from '@ionic/angular';

import SwiperCore, { Pagination } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Category } from 'src/app/core/+states/reference-state/reference.model';
import { ReferenceStateFacade } from 'src/app/core/+states/reference-state/reference.state.facade';
import { skip, take } from 'rxjs';
import { Router } from '@angular/router';

SwiperCore.use([Pagination, IonicSwiper]);

@Component({
  selector: 'app-walkthrough',
  templateUrl: './walkthrough.page.html',
  styleUrls: [
    './styles/walkthrough.page.scss',
    './styles/walkthrough.shell.scss',
    './styles/walkthrough.responsive.scss'
  ]
})
export class WalkthroughPage implements AfterViewInit, OnInit {
  private fillInfoService = inject(FillInfoService);
  private referenceStateFacade = inject(ReferenceStateFacade);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  swiperRef: SwiperCore | undefined;

  @ViewChild(SwiperComponent, { static: false }) swiper?: SwiperComponent;

  @HostBinding('class.first-slide-active') isFirstSlide = true;

  @HostBinding('class.last-slide-active') isLastSlide = false;

  categoryList: Category[] = [];

  form!: FormGroup;

  get interests(): FormArray {
    return <FormArray>this.form.get('interests');
  }

  get birthDayError(): boolean {
    return this.form.get('birth')?.errors !== null;
  }

  get genderError(): boolean {
    return this.form.get('gender')?.errors !== null;
  }

  get interestsError(): boolean {
    return !this.form
      .get('interests')
      ?.value.find((item: boolean) => item === true);
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    public menu: MenuController,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      birth: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      interests: this.formBuilder.array([])
    });

    this.referenceStateFacade
      .getCategories()
      .pipe(skip(1), take(1))
      .subscribe({
        next: (result) => {
          this.categoryList = result;
          this.categoryList.forEach(() => {
            this.interests.push(new FormControl());
          });
        }
      });
  }

  // Disable side menu for this page
  ionViewDidEnter(): void {
    this.menu.enable(false);
  }

  // Restore to default when leaving this page
  ionViewDidLeave(): void {
    this.menu.enable(true);
  }

  ngAfterViewInit(): void {
    // Accessing slides in server platform throw errors
    if (isPlatformBrowser(this.platformId)) {
      this.swiperRef = this.swiper?.swiperRef;

      this.swiperRef?.on('slidesLengthChange', () => {
        // ? We need to use ngZone because the change happens outside Angular
        // (see: https://swiperjs.com/angular#swiper-component-events)
        this.ngZone.run(() => {
          if (this.swiperRef) {
            this.markSlides(this.swiperRef);
          }
        });
      });

      this.swiperRef?.on('slideChange', () => {
        // ? We need to use ngZone because the change happens outside Angular
        // (see: https://swiperjs.com/angular#swiper-component-events)
        this.ngZone.run(() => {
          if (this.swiperRef) {
            this.markSlides(this.swiperRef);
          }
        });
      });
    }
  }

  public setSwiperInstance(swiper: SwiperCore): void {
    // console.log('setSwiperInstance');
  }

  public swiperInit(): void {
    // console.log('swiperInit');
  }

  public slideWillChange(): void {
    // console.log('slideWillChange');
  }

  public markSlides(swiper: SwiperCore): void {
    this.isFirstSlide = swiper.isBeginning || swiper.activeIndex === 0;
    this.isLastSlide = swiper.isEnd;
  }

  public skipWalkthrough(): void {
    // Skip to the last slide
    this.swiperRef?.slideTo(this.swiperRef.slides.length - 1);
  }

  trackByIndex(index: number, item: Category): number {
    return index;
  }

  selectGender(gender: string): void {
    this.form.get('gender')?.setValue(gender);
  }

  getStarted(): void {
    const selection: number[] = [];
    this.interests.value.forEach((value: boolean, index: number) => {
      if (value) {
        selection.push(this.categoryList[index].categoryId);
      }
    });

    this.fillInfoService.saveInfo({
      ...this.form.value,
      interests: selection
    });
  }

  get gender() {
    return this.form.get('gender')?.value;
  }

  get dateLimit() {
    const dateStr = new Date().toJSON().split('T')[0].split('-');

    const year = Number(dateStr[0]) - 15;
    const month = dateStr[1];
    const date = dateStr[2];

    return [year, month, date].join('-');
  }
}
