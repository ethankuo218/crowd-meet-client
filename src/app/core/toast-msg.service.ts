import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastMsgService {
  private toastController = inject(ToastController);

  async presentToast(msg: string, position?: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: position ?? 'bottom'
    });

    await toast.present();
  }
}
