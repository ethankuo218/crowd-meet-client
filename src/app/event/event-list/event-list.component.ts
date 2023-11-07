import { BoostedEvent } from './../../core/+states/event-list-state/event-list.model';
import { Component, OnInit, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { EventListData } from 'src/app/core/+states/event-list-state/event-list.model';
import { EventService } from '../../core/event.service';
import {
  InfiniteScrollCustomEvent,
  RefresherCustomEvent
} from '@ionic/angular';
import * as _ from 'underscore';
import Swiper, {
  Autoplay,
  Navigation,
  Pagination,
  SwiperOptions
} from 'swiper';
// configure Swiper to use modules
Swiper.use([Navigation, Pagination, Autoplay]);

@Component({
  selector: 'app-listing',
  templateUrl: './event-list.component.html',
  styleUrls: [
    './styles/event-list.component.scss',
    './styles/event-list.shell.scss'
  ]
})
export class EventListComponent implements OnInit {
  private eventService = inject(EventService);
  swiperConfig!: SwiperOptions;

  listing$: Observable<EventListData[]> = this.eventService
    .getEventList()
    .pipe(map((result) => result?.data));

  boosted$!: Observable<BoostedEvent[]>;

  filter: any = {};

  get isLoading(): boolean {
    return this.eventService.isLoading;
  }

  ngOnInit(): void {
    this.boosted$ = this.eventService.getBoostedEvent().pipe(
      map((result) => {
        const shuffled = _.shuffle(result);
        this.setSwiperConfig(shuffled.length);
        return shuffled;
      })
    );
    this.eventService.reload();
  }

  handleRefresh(event: Event) {
    this.eventService.reload().then(() => {
      (event as RefresherCustomEvent).target.complete();
    });
  }

  private setSwiperConfig(itemCount: number): void {
    this.swiperConfig = {
      slidesPerView: 2,
      loop: itemCount > 2,
      autoplay: {
        delay: 2000,
        disableOnInteraction: true
      }
    };
  }

  onIonInfinite(event: Event) {
    this.eventService.loadNextPage().then(() => {
      (event as InfiniteScrollCustomEvent).target.complete();
    });
  }

  get noMoreContent(): boolean {
    return this.eventService.noMoreContent;
  }
}
