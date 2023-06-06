import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '../../../components/components.module';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-listing-card',
  templateUrl: './listing-card.component.html',
  styleUrls: ['./listing-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    ComponentsModule,
  ],
})
export class ListingCardComponent {
  @Input() cardInfo: Event = {
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
    },
    eventId: 0,
    rating: 0,
    reviewsCount: 0,
  };

  constructor() {}
}
