import { Component, Input } from '@angular/core';
import { EventListData } from 'src/app/core/+states/event-list-state/event-list.model';

@Component({
  selector: 'app-listing-card',
  templateUrl: './listing-card.component.html',
  styleUrls: ['./listing-card.component.scss']
})
export class ListingCardComponent {
  @Input() cardInfo: EventListData = {
    imageUrl: '',
    title: '',
    description: '',
    eventId: 0,
    startTime: '',
    categories: []
  };

  constructor() {}
}
