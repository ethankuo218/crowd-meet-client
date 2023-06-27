import { UserStateFacade } from './../core/states/user-state/user.state.facade';
import { ImgUploadService } from 'src/app/core/img-upload.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  // interest
  userForm = new FormGroup({
    bio: new FormControl('', [Validators.required])
  });

  constructor(
    private userService: UserService,
    private imgUploadService: ImgUploadService,
    private userStateFacade: UserStateFacade
  ) {}

  ngOnInit(): void {}

  ionViewWillLeave(): void {}
}
