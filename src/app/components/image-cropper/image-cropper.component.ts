import { Component, Inject, Input, inject } from '@angular/core';
import { ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';
import { IonicModule } from '@ionic/angular';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss'],
  standalone: true,
  imports: [ImageCropperModule, IonicModule, MatDialogModule]
})
export class ImageCropperModalComponent {
  private dialog: MatDialogRef<ImageCropperModalComponent> =
    inject(MatDialogRef);

  @Input() imageUri: string = this.data.imageUri;
  private currentCropEvent: ImageCroppedEvent | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      imageUri: string;
    }
  ) {}

  async onImageCropped(event: ImageCroppedEvent): Promise<void> {
    this.currentCropEvent = event;
  }

  onLoadImageFailed(): void {
    console.error('Load image failed');
  }

  async crop(): Promise<void> {
    const base64Data = await this.blobToBase64(this.currentCropEvent?.blob!);
    this.dialog.close({ base64Data });
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
    this.dialog.close();
  }
}

// FIXME:
// 1. crop button wrong position
// 2. image not being uploaded
// 3. modal will be scrolled when moving the crop box
// 4. quality
