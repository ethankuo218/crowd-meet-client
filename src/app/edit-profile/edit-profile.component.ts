import { UserStateFacade } from './../core/states/user-state/user.state.facade';
import { ImgUploadService } from 'src/app/core/img-upload.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/user.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReferenceStateFacade } from '../core/states/reference-state/reference.state.facade';
import { Observable, take } from 'rxjs';
import { Category } from '../core/states/reference-state/reference.model';

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

  images: Array<string | undefined> = [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined
  ];

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
        result.images.forEach((item, index) => {
          this.images[index] = item;
        });
      }
    });
  }

  ionViewWillLeave(): void {}

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

  selectPhoto() {
    this.imgUploadService.selectImage().then(async () => {
      const formData = new FormData();
      const files = await this.imgUploadService.getUploadedImg();

      if (files.length > 0) {
        formData.append('file', files[0]);
        await this.userService.updateUserProfilePicture(formData);
      } else {
        console.error('No image found, please try again!');
      }
    });
  }
}
