import { Observable } from 'rxjs';
import { HttpClientService } from '../../core/http-client.service';
import { Injectable } from '@angular/core';
import { Review } from './models/reviews.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  constructor(private httpClientService: HttpClientService) {}

  review(body: {
    revieweeId: number;
    eventId: number;
    rating: number;
    comment: string;
  }) {
    return this.httpClientService.post(`review`, body);
  }
}
