import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { EventListData } from 'src/app/core/states/event-list-state/event-list.model';
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
  listing$: Observable<EventListData[]> = this.eventService
    .getEventList()
    .pipe(map((result) => result?.data));

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.eventService.reload();
  }

  ionViewWillEnter() {}

  ionViewWillLeave(): void {
    this.route.paramMap.pipe(take(1)).subscribe({
      next: (params) => {
        if (params.get('refresh')) {
          this.eventService.reload();
        }
      }
    });
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

  get noMoreContent(): boolean {
    return this.eventService.noMoreContent;
  }
}
