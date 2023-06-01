import { HttpClientService } from '../../core/http-client.service';
import { Component, HostBinding, NgZone, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';

import { MenuController } from '@ionic/angular';
import { IonicSwiper } from '@ionic/angular';

import SwiperCore, { Pagination } from 'swiper';
import { Category, ReferenceResponse } from './models/getting-started.model';
import { Router } from '@angular/router';

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
  categoryList: Category[] = [];
  interestForm!: FormGroup;

  constructor(
    public menu: MenuController,
    private ngZone: NgZone,
    private httpClientService: HttpClientService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.interestForm = this.formBuilder.group({
      interests: this.formBuilder.array([]),
    });

    this.getCatrgories();
  }

  private getCatrgories(): void {
    this.httpClientService
      .get<ReferenceResponse>('reference')
      .subscribe((result) => {
        this.categoryList = result.categories;
        this.categoryList.forEach(() => {
          this.interests.push(new FormControl());
        });
      });
  }

  // Disable side menu for this page
  public ionViewDidEnter(): void {
    this.menu.enable(false);
  }

  // Restore to default when leaving this page
  public ionViewDidLeave(): void {
    this.menu.enable(true);
  }

  public swiperInit(swiper: SwiperCore): void {
    this.swiperRef = swiper;
  }

  public slideWillChange(): void {
    // ? We need to use ngZone because the change happens outside Angular
    // (see: https://swiperjs.com/angular#swiper-component-events)
    this.ngZone.run(() => {
      if (this.swiperRef) {
        this.isLastSlide = this.swiperRef.isEnd;
      }
    });
  }

  public itemById(index: number, item: Category) {
    return item.categoryId - 1;
  }

  public goNext() {
    const selection: string[] = [];
    this.interests.value.forEach((value: boolean, index: string) => {
      if (value) {
        selection.push(index + 1);
      }
    });

    this.httpClientService
      .patch('user', {
        interests: selection,
      })
      .subscribe(() => {
        this.router.navigate(['/app'], { replaceUrl: true });
      });
  }

  get interests(): FormArray {
    return <FormArray>this.interestForm.get('interests');
  }
}
