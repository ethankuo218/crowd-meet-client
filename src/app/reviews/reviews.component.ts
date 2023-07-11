import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RatingComponent } from './rating/rating.component';
@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  async writeReview() {
    const modal = await this.modalCtrl.create({
      component: RatingComponent,
      initialBreakpoint: 0.65,
      breakpoints: [0, 0.65]
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
  }
}
