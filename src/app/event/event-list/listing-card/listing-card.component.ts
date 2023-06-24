import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EventListData } from 'src/app/core/states/event-list-state/event-list.model';
import { ShellModule } from 'src/app/shell/shell.module';

@Component({
  selector: 'app-listing-card',
  templateUrl: './listing-card.component.html',
  styleUrls: ['./listing-card.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule, ShellModule]
})
export class ListingCardComponent {
  @Input() cardInfo: EventListData = {
    imageUrl: '',
    title: '',
    description: '',
    eventId: 0
  };

  constructor() {}
}
