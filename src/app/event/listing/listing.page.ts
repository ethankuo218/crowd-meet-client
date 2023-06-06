import { EventService } from './../event.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Event } from '../models/event.model';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.page.html',
  styleUrls: ['./styles/listing.page.scss', './styles/listing.shell.scss'],
})
export class ListingPage implements OnInit {
  // Gather all component subscription in one place. Can be one Subscription or multiple (chained using the Subscription.add() method)
  subscriptions: Subscription | undefined;

  listing: Event[] = [];

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService) {}

  ngOnInit(): void {
    this.subscriptions = this.route.data
      .pipe(
        // Extract data for this page
        switchMap(() => {
          return this.eventService.getEventList();
        })
      )
      .subscribe({
        next: (result) => {
          this.listing = result;
        },
        error: (error) => console.log(error),
      });
  }

  // NOTE: Ionic only calls ngOnDestroy if the page was popped (ex: when navigating back)
  // Since ngOnDestroy might not fire when you navigate from the current page, use ionViewWillLeave to cleanup Subscriptions
  ionViewWillLeave(): void {
    this.subscriptions?.unsubscribe();
  }
}
