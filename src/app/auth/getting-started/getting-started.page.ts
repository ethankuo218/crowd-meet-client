import { UserStateFacade } from '../../core/states/user-state/user.state.facade';
import { ReferenceStateFacade } from '../../core/states/reference-state/reference.state.facade';
import { Component, HostBinding, NgZone, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { MenuController } from '@ionic/angular';
import { IonicSwiper } from '@ionic/angular';

import SwiperCore, { Pagination } from 'swiper';
import { Router } from '@angular/router';
import { Category } from 'src/app/core/states/reference-state/reference.model';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/core/user.service';

SwiperCore.use([Pagination, IonicSwiper]);

@Component({
  selector: 'app-getting-started',
  templateUrl: './getting-started.page.html',
  styleUrls: [
    './styles/getting-started.page.scss',
    './styles/getting-started.shell.scss',
    './styles/getting-started.responsive.scss',
  ],
})
export class GettingStartedPage implements OnInit {
  @HostBinding('class.last-slide-active') isLastSlide = false;

  private swiperRef!: SwiperCore;

  categoryList$: Observable<Category[]> =
    this.referenceStateFacade.getCategories();

  interestForm!: FormGroup;

  constructor(
    public menu: MenuController,
    private ngZone: NgZone,
    private formBuilder: FormBuilder,
    private router: Router,
    private referenceStateFacade: ReferenceStateFacade,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.interestForm = this.formBuilder.group({
      interests: this.formBuilder.array([]),
    });

    this.categoryList$.subscribe({
      next: (result) => {
        result.forEach(() => {
          this.interests.push(new FormControl());
        });
      },
      error: (error) => console.error(error),
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

  itemById(index: number, item: Category): number {
    return item.categoryId - 1;
  }

  goNext(): void {
    const selection: number[] = [];
    this.interests.value.forEach((value: boolean, index: number) => {
      if (value) {
        selection.push(index + 1);
      }
    });

    this.updateUserInterests(selection);
  }

  skip(): void {
    this.updateUserInterests();
  }

  private updateUserInterests(interestSelection?: number[]) {
    this.userService
      .updateUser({
        interests: interestSelection ? interestSelection : [],
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/app'], { replaceUrl: true });
        },
        error: (error) => console.error(error),
      });
  }

  get interests(): FormArray {
    return <FormArray>this.interestForm.get('interests');
  }
}
