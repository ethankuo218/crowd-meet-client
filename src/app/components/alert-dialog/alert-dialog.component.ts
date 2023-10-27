import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { InAppPurchaseComponent } from 'src/app/in-app-purchase/in-app-purchase.component';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, MatDialogModule, TranslateModule]
})
export class AlertDialogComponent {
  private modalCtrl = inject(ModalController);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      content: string;
      enableCancelButton: boolean;
      enableUpgradeButton: boolean;
    }
  ) {}

  async openPurchasePage() {
    const modal = await this.modalCtrl.create({
      component: InAppPurchaseComponent,
      initialBreakpoint: 0.95,
      breakpoints: [0, 0.95],
      componentProps: {
        isModalMode: true
      }
    });
    modal.present();
  }
}
