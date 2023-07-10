import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IonicModule } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FontAwesomeModule]
})
export class HeaderComponent implements OnInit {
  @Output() menuEvent = new EventEmitter();

  constructor(private actionSheetController: ActionSheetController) {}

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
}
