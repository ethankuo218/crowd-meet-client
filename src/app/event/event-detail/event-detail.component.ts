import { EventService } from '../../core/event.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Event } from '../models/event.model';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-details',
  templateUrl: './event-detail.component.html',
  styleUrls: [
    './styles/event-detail.component.scss',
    './styles/event-detail.shell.scss'
  ]
})
export class EventDetailComponent implements OnInit {
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
      gender: '',
      birthDate: ''
    },
    eventId: 0
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
        error: (error) => console.log(error)
      });
  }

  // NOTE: Ionic only calls ngOnDestroy if the page was popped (ex: when navigating back)
  // Since ngOnDestroy might not fire when you navigate from the current page, use ionViewWillLeave to cleanup Subscriptions
  ionViewWillLeave(): void {
    this.subscriptions?.unsubscribe();
  }

  async openMap(): Promise<void> {
    // get the place details from server
    const mockPlaceDetails = {
      lat: 37.4220041,
      lng: -122.0862462,
      name: 'Googleplex',
      address: '1600 Amphitheatre Parkway, Mountain View, CA, USA',
      placeId: 'ChIJj61dQgK6j4AR4GeTYWZsKWw'
    };

    // The following URL should open Google Maps on all platforms
    let url = `https://www.google.com/maps/search/?api=1&query=${mockPlaceDetails.lat},${mockPlaceDetails.lng}&query_place_id=${mockPlaceDetails.placeId}`;

    await Browser.open({ url });
  }
}
