import { BoostedEvent } from './../../core/+states/event-list-state/event-list.model';
import { Component, OnInit, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { EventListData } from 'src/app/core/+states/event-list-state/event-list.model';
import { EventService } from '../../core/event.service';
import {
  InfiniteScrollCustomEvent,
  RefresherCustomEvent
} from '@ionic/angular';

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

  listing$: Observable<EventListData[]> = this.eventService
    .getEventList()
    .pipe(map((result) => result?.data));

  boosted$: Observable<BoostedEvent[]> = this.eventService
    .getBoostedEvent()
    .pipe(map((result) => this.shuffle<BoostedEvent>(result)));

  filter: any = {};

  get isLoading(): boolean {
    return this.eventService.isLoading;
  }

  ngOnInit(): void {
    this.eventService.reload();
  }

  handleRefresh(event: Event) {
    this.eventService.reload().then(() => {
      (event as RefresherCustomEvent).target.complete();
    });
  }

  onIonInfinite(event: Event) {
    this.eventService.loadNextPage().then(() => {
      (event as InfiniteScrollCustomEvent).target.complete();
    });
  }

  private shuffle<T>(inputArray: T[]): T[] {
    let array = [...inputArray];
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex]
      ];
    }

    return array;
  }

  get noMoreContent(): boolean {
    return this.eventService.noMoreContent;
  }
}
