import { ImgUploadService } from 'src/app/core/img-upload.service';
import { UserStateFacade } from './../core/states/user-state/user.state.facade';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/user.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  user$ = this.userStateFacade.getUser();
  constructor(
    private userStateFacade: UserStateFacade,
    private imgUploadService: ImgUploadService,
    private userService: UserService
  ) {}

  ngOnInit() {}

  selectPhoto() {
    this.imgUploadService.selectImage().then(() => {
      this.uploadImg();
    });
  }

  private async uploadImg() {
    const formData = new FormData();
    const files = await this.imgUploadService.getUploadedImg();

    if (files.length > 0) {
      formData.append('file', files[0]);
      await this.userService.updateUserProfilePicture(formData);
    } else {
      console.error('No image found, please try again!');
    }
  }
}
