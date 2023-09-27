import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewChild
} from '@angular/core';
import {
  ImageCroppedEvent,
  ImageCropperComponent,
  ImageCropperModule
} from 'ngx-image-cropper';
import { IonicModule, ModalController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss'],
  standalone: true,
  imports: [ImageCropperModule, IonicModule]
})
export class ImageCropperModalComponent {
  @Input() imageUri: string | undefined;
  private currentCropEvent: ImageCroppedEvent | undefined;

  constructor(private readonly modalController: ModalController) {}

  async onImageCropped(event: ImageCroppedEvent): Promise<void> {
    this.currentCropEvent = event;
  }

  onLoadImageFailed(): void {
    console.error('Load image failed');
  }

  async crop() {
    const base64Img = await this.blobToBase64(this.currentCropEvent?.blob!);
    this.modalController.dismiss({ base64Img }, 'crop');
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  }

  cancel(): void {
    this.modalController.dismiss({}, 'cancel');
  }
}
