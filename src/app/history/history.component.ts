import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  cardInfo = {
    imageUrl: '',
    title: 'TEST Title',
    description:
      'This use for testThis use for testThis use for testThis use for testThis use for test',
    eventId: 0,
    startTime: '',
    categories: []
  };

  constructor(private actionSheetController: ActionSheetController) {}

  ngOnInit() {}

  handleRefresh(event: Event) {
    // this.eventService.reload().then(() => {
    //   (event as RefresherCustomEvent).target.complete();
    // });
  }

  async openMenu() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: 'Leave',
          role: 'leave',
          cssClass: 'leave_button',
          handler: () => {
            console.log('Leave clicked');
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
}
