import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { EventListData } from 'src/app/core/+states/event-list-state/event-list.model';
import { EventService } from '../../core/event.service';
import {
  InfiniteScrollCustomEvent,
  RefresherCustomEvent,
  ModalController
} from '@ionic/angular';
import { FilterComponent } from 'src/app/filter/filter.component';

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
  private route = inject(ActivatedRoute);
  private modalCtrl = inject(ModalController);

  listing$: Observable<EventListData[]> = this.eventService
    .getEventList()
    .pipe(map((result) => result?.data));

  filter: any = {};

  get isLoading(): boolean {
    return this.eventService.isLoading;
  }

  ngOnInit(): void {
    this.eventService.reload({});
  }

  ionViewWillEnter() {}

  ionViewWillLeave(): void {
    this.route.paramMap.pipe(take(1)).subscribe({
      next: (params) => {
        if (params.get('refresh')) {
          this.eventService.reload(this.filter);
        }
      }
    });
  }

  handleRefresh(event: Event) {
    this.eventService.reload(this.filter).then(() => {
      (event as RefresherCustomEvent).target.complete();
    });
  }

  onIonInfinite(event: Event) {
    this.eventService.loadNextPage(this.filter).then(() => {
      (event as InfiniteScrollCustomEvent).target.complete();
    });
  }

  async openFilter() {
    const modal = await this.modalCtrl.create({
      component: FilterComponent,
      initialBreakpoint: 1,
      breakpoints: [0, 1]
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'filter') {
      this.filter = data;
      console.log(this.filter);
      this.eventService.reload(this.filter);
    }
  }

  get noMoreContent(): boolean {
    return this.eventService.noMoreContent;
  }
}
