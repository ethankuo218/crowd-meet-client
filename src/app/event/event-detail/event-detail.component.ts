import { Event, Participant } from './../models/event.model';
import { UserStateFacade } from './../../core/states/user-state/user.state.facade';
import { EventService } from '../../core/event.service';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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
  eventDetail$: Observable<Event> = this.route.params.pipe(
    switchMap((params) => {
      return this.eventService.getEventDetail(params['id']);
    })
  );

  participants$: Observable<Participant[]> = this.route.params.pipe(
    switchMap((params) => {
      return this.eventService.getParticipants(params['id']);
    })
  );

  user$ = inject(UserStateFacade).getUser();

  comments$ = this.eventService.getComment();

  comment: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
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

  leaveComment(id: number): void {
    this.eventService.leaveComment(id, this.comment!).subscribe();
    delete this.comment;
  }

  editEvent(eventDetail: Event): void {
    this.router.navigate([
      '/app/event-create',
      { mode: 'edit', eventInfo: JSON.stringify(eventDetail) }
    ]);
  }

  joinEvent(id: number): void {
    this.eventService.apply(id).subscribe();
  }

  getJsonString(input: any) {
    return JSON.stringify(input);
  }
}
