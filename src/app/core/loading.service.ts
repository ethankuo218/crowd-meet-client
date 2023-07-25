import { Injectable, inject } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingCtl = inject(LoadingController);
  private loading: HTMLIonLoadingElement | undefined;

  async present(): Promise<void> {
    this.loading = await this.loadingCtl.create({
      message: 'Loading',
      keyboardClose: true,
      showBackdrop: true
    });
    this.loading.present();
  }

  dismiss(): void {
    this.loading?.dismiss();
  }
}
