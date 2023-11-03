import { Platform } from '@ionic/angular';
import { Injectable, inject } from '@angular/core';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo
} from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { MatDialog } from '@angular/material/dialog';
import { ImageCropperModalComponent } from '../components/image-cropper/image-cropper.component';
import { firstValueFrom } from 'rxjs';

const IMAGE_DIR = 'stored-images';

@Injectable({ providedIn: 'root' })
export class ImgUploadService {
  private platform = inject(Platform);
  private dialog = inject(MatDialog);
  private uploadedImageName: string[] = [];

  async selectImage(cleanPreviousSelection = false): Promise<string> {
    const image = await Camera.getPhoto({
      quality: 100,
      height: 800,
      width: 800,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos
    });

    const dialogRef = this.dialog.open(ImageCropperModalComponent, {
      maxHeight: '67vh',
      maxWidth: '90vw',
      height: '67vh',
      width: '90vw',
      data: {
        imageUri: image.webPath
      },
      panelClass: 'crop-dialog',
      hasBackdrop: true,
      disableClose: true
    });

    if (image) {
      const { base64Data } = await firstValueFrom(dialogRef.afterClosed());
      const fileName = new Date().getTime() + '.jpeg';

      await Filesystem.writeFile({
        directory: Directory.Data,
        path: `${IMAGE_DIR}/${fileName}`,
        data: base64Data.split(',')[1],
        recursive: true
      });
      if (cleanPreviousSelection) this.uploadedImageName = [];
      this.uploadedImageName.push(fileName);

      return base64Data;
    } else {
      return '';
    }
  }

  async getUploadedImg(): Promise<Blob[]> {
    const images: Blob[] = [];

    while (this.uploadedImageName.length !== 0) {
      const fileName = this.uploadedImageName.shift();
      const filePath = `${IMAGE_DIR}/${fileName}`;
      const readFile = await Filesystem.readFile({
        directory: Directory.Data,
        path: filePath
      });

      // delete after upload
      await Filesystem.deleteFile({
        directory: Directory.Data,
        path: filePath
      });

      images.push(await this.convertBase64ToBlob(readFile.data));
    }

    return images;
  }

  private async readAsBase64(photo: Photo): Promise<string> {
    // "hybrid" will detect Cordova or Capacitor
    if (this.platform.is('hybrid')) {
      // Read the file into base64 format
      const file = await Filesystem.readFile({
        path: photo.path!
      });

      return file.data;
    } else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();

      return (await this.convertBlobToBase64(blob)) as string;
    }
  }

  private async readAsBase64ByPath(path: string): Promise<string> {
    // Read the file into base64 format
    const file = await Filesystem.readFile({
      path: path
    });

    return file.data;
  }

  private convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

  private async convertImageToBlob(base64Data: string) {
    return this.convertBase64ToBlob(base64Data, 'image/jpeg');
  }
  // Ref:https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
  private convertBase64ToBlob(
    b64Data: any,
    contentType = 'image/jpeg',
    sliceSize = 512
  ) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  get uploadedImagesCount(): number {
    return this.uploadedImageName.length;
  }
}
