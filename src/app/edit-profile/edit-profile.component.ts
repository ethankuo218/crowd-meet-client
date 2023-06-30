import { UserStateFacade } from './../core/states/user-state/user.state.facade';
import { ImgUploadService } from 'src/app/core/img-upload.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/user.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReferenceStateFacade } from '../core/states/reference-state/reference.state.facade';
import { take } from 'rxjs';
import { Category } from '../core/states/reference-state/reference.model';
import { Image } from '../core/states/user-state/user.model';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: [
    './styles/edit-profile.component.scss',
    './styles/edit-profile.shell.scss',
    './styles/edit-profile.ios.scss',
    './styles/edit-profile.md.scss'
  ]
})
export class EditProfileComponent implements OnInit {
  user$ = this.userStateFacade.getUser();

  categoryList: Category[] = [];

  userForm!: FormGroup;

  images: Array<Image | undefined> = [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined
  ];

  private imageOrder: number[] = [];

  get interests(): FormArray {
    return <FormArray>this.userForm.get('interests');
  }

  constructor(
    private userService: UserService,
    private imgUploadService: ImgUploadService,
    private userStateFacade: UserStateFacade,
    private referenceStateFacade: ReferenceStateFacade
  ) {}

  ngOnInit(): void {
    this.userForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      bio: new FormControl('', [Validators.required]),
      interests: new FormArray([], Validators.required)
    });

    this.referenceStateFacade
      .getCategories()
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.categoryList = result;
          this.categoryList.forEach(() => {
            this.interests.push(new FormControl());
          });
        }
      });

    this.userStateFacade.getUser().subscribe({
      next: (result) => {
        result.images.forEach((item) => {
          this.images[item.order] = item;
        });

        this.imageOrder = this.getCurrentOrder();
      }
    });
  }

  ionViewWillLeave(): void {
    const currentImageOrder: number[] = this.getCurrentOrder();

    if (this.imageOrder === currentImageOrder) {
      console.log('REORDER');
      this.userService.patchUserImageOrder(currentImageOrder);
    }
  }

  trackByIndex(index: number, item: Category): number {
    return index;
  }

  updateUserInfo(): void {
    this.userService.updateUser(this.userForm.value).subscribe({
      next: (result) => {
        this.userStateFacade.storeUser(result);
      }
    });
  }

  selectPhoto(index: number) {
    this.imgUploadService.selectImage().then(async () => {
      const formData = new FormData();
      const files = await this.imgUploadService.getUploadedImg();

      if (files.length > 0) {
        formData.append('file', files[0]);
        formData.append('order', index.toString());
        this.userService.updateUserImage(formData).subscribe();
      } else {
        console.error('No image found, please try again!');
      }
    });
  }

  deletePhoto(image: Image) {
    alert('DELETE ?');
    this.userService.deletePhoto(image.id).subscribe(() => {
      this.removePhoto(image.order);
    });
  }

  private removePhoto(index: number) {
    const elementBeforeIndex: Array<Image | undefined> = this.images.slice(
      0,
      index
    );
    const elementAfterIndex: Array<Image | undefined> = this.images.slice(
      index + 1
    );
    const newImagesOrder = elementBeforeIndex.concat(elementAfterIndex);

    newImagesOrder.push(undefined);

    this.images = newImagesOrder;
  }

  private getCurrentOrder() {
    const returnOrder: number[] = [];

    this.images.forEach((item) => {
      if (item) {
        returnOrder.push(item.id);
      }
    });

    return returnOrder;
  }
}
