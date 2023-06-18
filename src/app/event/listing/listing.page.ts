import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventListData } from 'src/app/core/states/event-list-state/event-list.model';
import { EventService } from '../../core/event.service';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.page.html',
  styleUrls: ['./styles/listing.page.scss', './styles/listing.shell.scss'],
})
export class ListingPage {
  listing$: Observable<EventListData[]> = this.eventService
    .getEventList()
    .pipe(map((result) => result?.data));

  constructor(private eventService: EventService) {}

  ionViewWillEnter(): void {
    this.eventService.reloadEventList();
  }

  // NOTE: Ionic only calls ngOnDestroy if the page was popped (ex: when navigating back)
  // Since ngOnDestroy might not fire when you navigate from the current page, use ionViewWillLeave to cleanup Subscriptions
  ionViewWillLeave(): void {}
}
