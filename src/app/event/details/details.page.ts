import { EventService } from '../../core/event.service';
import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { ResolverHelper } from '../../utils/resolver-helper';
import { DetailsModel } from './details.model';
import { switchMap } from 'rxjs/operators';
import { Event } from '../models/event.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./styles/details.page.scss', './styles/details.shell.scss'],
})
export class DetailsPage implements OnInit {
  // Gather all component subscription in one place. Can be one Subscription or multiple (chained using the Subscription.add() method)
  subscriptions: Subscription | undefined;

  details: Event = {
    imageUrl: '',
    videoUrl: '',
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    maxParticipants: 0,
    locationName: '',
    price: 0,
    categories: [],
    creator: {
      userId: 0,
      email: '',
      name: '',
      profilePictureUrl: '',
      bio: '',
      interests: [],
      images: [],
    },
    eventId: 0,
  };

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.subscriptions = this.route.params
      .pipe(
        // Extract data for this page
        switchMap((params) => {
          return this.eventService.getEventDetail(params['id']);
        })
      )
      .subscribe({
        next: (state) => {
          this.details = state;
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
