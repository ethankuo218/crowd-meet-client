import { UserStateFacade } from '../../core/+states/user-state/user.state.facade';
import { ImgUploadService } from 'src/app/core/img-upload.service';
import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../core/user.service';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ReferenceStateFacade } from '../../core/+states/reference-state/reference.state.facade';
import { take } from 'rxjs';
import { Category } from '../../core/+states/reference-state/reference.model';
import { Image } from '../../core/+states/user-state/user.model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import * as _ from 'underscore';

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
  private userService = inject(UserService);
  private imgUploadService = inject(ImgUploadService);
  private userStateFacade = inject(UserStateFacade);
  private referenceStateFacade = inject(ReferenceStateFacade);

  categoryList: Category[] = [];

  userForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    bio: new FormControl(''),
    interests: new FormArray([])
  });

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

  ngOnInit(): void {
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
        const patchInterestArr: boolean[] = [];
        this.categoryList.forEach((element: Category, index: number) => {
          if (
            result.interests.find(
              (interest) => interest.categoryId === element.categoryId
            )
          ) {
            patchInterestArr.push(true);
          } else {
            patchInterestArr.push(false);
          }
        });

        this.userForm.patchValue({
          name: result.name,
          bio: result.bio,
          interests: [...patchInterestArr]
        });

        result.images.forEach((item) => {
          this.images[item.order] = item;
        });

        this.imageOrder = this.getCurrentOrder();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  ionViewWillLeave(): void {
    const currentImageOrder: number[] = this.getCurrentOrder();

    if (
      !_.isEqual(this.imageOrder, currentImageOrder) &&
      currentImageOrder.length > 0
    ) {
      this.userService.patchUserImageOrder(currentImageOrder);
    }

    if (currentImageOrder.length === 0) {
      this.userStateFacade.storeUser({ profilePictureUrl: '', images: [] });
    } else {
      this.userStateFacade.storeUser({
        profilePictureUrl: this.images[0]?.url
      });
    }

    if (this.userForm.dirty) {
      this.userService.updateUser({
        name: this.userForm.get('name')?.value,
        bio: this.userForm.get('bio')?.value,
        interests: this.getInterests()
      });
    }
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  updateUserInfo(): void {
    this.userService.updateUser(this.userForm.value);
  }

  selectPhoto(index: number) {
    this.imgUploadService.selectImage().then(async () => {
      const formData = new FormData();
      const files = await this.imgUploadService.getUploadedImg();

      if (files.length > 0) {
        formData.append('file', files[0]);
        formData.append('order', this.getFirstUndefinedImageIndex(index));
        this.userService.updateUserImage(formData);
      } else {
        console.error('No image found, please try again!');
      }
    });
  }

  deletePhoto(image: Image) {
    alert('DELETE ?');
    this.userService.deletePhoto(image.id).subscribe(() => {
      this.removePhoto(image.id);
    });
  }

  private removePhoto(id: number) {
    const index = this.images.findIndex((image) => image?.id === id);
    const elementBeforeIndex: Array<Image | undefined> = [...this.images].slice(
      0,
      index
    );
    const elementAfterIndex: Array<Image | undefined> = [...this.images].slice(
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

  private getInterests(): number[] {
    const returnArr: number[] = [];
    this.interests.value.forEach((element: boolean, index: number) => {
      const interest = this.categoryList[index];
      if (element && interest) {
        returnArr.push(interest.categoryId);
      }
    });

    return returnArr;
  }

  private getFirstUndefinedImageIndex(index: number): string {
    const returnVal = this.images.findIndex((image) => image === undefined);

    return returnVal ? returnVal.toString() : index.toString();
  }

  drop(event: CdkDragDrop<{ item: Image | undefined; index: number }>) {
    this.images[event.previousContainer.data.index] = event.container.data
      .item && { ...event.container.data.item };
    this.images[event.container.data.index] = event.previousContainer.data
      .item && { ...event.previousContainer.data.item };
  }
}
