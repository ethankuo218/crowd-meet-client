import { Component, Input } from '@angular/core';
import { EventListData } from 'src/app/core/+states/event-list-state/event-list.model';

@Component({
  selector: 'app-listing-card',
  templateUrl: './listing-card.component.html',
  styleUrls: ['./listing-card.component.scss']
})
export class ListingCardComponent {
  private _cardInfo!: EventListData;

  get cardInfo(): EventListData {
    return this._cardInfo;
  }
  @Input() set cardInfo(value: EventListData) {
    this._cardInfo = { ...value };
  }

  constructor() {}
}
