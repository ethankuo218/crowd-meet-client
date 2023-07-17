import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IonicModule, ModalController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { RatingComponent } from '../reviews/rating/rating.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FontAwesomeModule, RouterModule]
})
export class HeaderComponent implements OnInit {
  @Input() disableBackButton: boolean = false;
  @Output() menuEvent = new EventEmitter();

  tabPageUrls: string[] = [
    '/app/event/list',
    '/app/chat/list',
    '/app/event-create',
    '/app/history',
    '/app/notifications'
  ];

  constructor(
    private actionSheetController: ActionSheetController,
    private router: Router,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {}

  async openMenu() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: 'Edit',
          role: 'edit',
          // cssClass: 'leave_button',
          handler: () => {
            this.menuEvent.emit('edit');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await actionSheet.present();
  }

  openFilter() {
    this.writeReview();
  }

  async writeReview() {
    const modal = await this.modalCtrl.create({
      component: RatingComponent,
      componentProps: { userDetail: {} },
      initialBreakpoint: 0.65,
      breakpoints: [0, 0.65]
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'submit') {
      // this.reviewsService.review({
      //   revieweeId: userDetail.id,
      //   eventId: userDetail.eventId,
      //   ...data
      // });
    }
  }

  get currentUrl(): string {
    return this.router.url;
  }
}
