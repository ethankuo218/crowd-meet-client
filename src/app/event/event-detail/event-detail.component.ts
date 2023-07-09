import { UserStateFacade } from './../../core/states/user-state/user.state.facade';
import { EventService } from '../../core/event.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
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
  eventDetail$: Observable<Event> = this.route.params.pipe(
    // Extract data for this page
    switchMap((params) => {
      return this.eventService.getEventDetail(params['id']);
    })
  );

  user$ = this.userStateFacade.getUser();

  comment: string | undefined;

  participants = [1, 2, 3, 4, 5, 6];

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private userStateFacade: UserStateFacade
  ) {}

  ngOnInit(): void {}

  ionViewWillLeave(): void {}

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

  addComment(): void {
    console.log(this.comment);
    delete this.comment;
  }
}
