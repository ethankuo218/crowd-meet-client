import { ImgUploadService } from 'src/app/core/img-upload.service';
import { UserStateFacade } from '../core/states/user-state/user.state.facade';
import { Component, OnInit, HostBinding, OnDestroy } from '@angular/core';
import { of, switchMap } from 'rxjs';

import { AlertController } from '@ionic/angular';

import { LanguageService } from '../language/language.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageModel } from 'src/app/language/language.model';
import { User } from 'src/app/core/states/user-state/user.model';
import { UserService } from '../core/user.service';

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
  // Gather all component subscription in one place. Can be one Subscription or multiple (chained using the Subscription.add() method)
  profile: User = {
    userId: 0,
    email: '',
    name: '',
    profilePictureUrl: '',
    bio: '',
    interests: [],
    images: []
  };
  available_languages: any[] = [];
  translations: any;

  @HostBinding('class.is-shell') get isShell() {
    return this.profile ? true : false;
  }

  constructor(
    public translate: TranslateService,
    public languageService: LanguageService,
    public alertController: AlertController,
    private userStateFacade: UserStateFacade,
    private userService: UserService,
    private imgUploadService: ImgUploadService
  ) {}

  ngOnInit(): void {
    this.userStateFacade
      .getUser()
      .pipe(
        switchMap((result) => {
          return result.name
            ? of(result)
            : this.userService.getUserById(result.userId);
        })
      )
      .subscribe((result) => {
        this.profile = result;
        this.getTranslations();
      });
    this.translate.onLangChange.subscribe(() => this.getTranslations());
  }

  // NOTE: Ionic only calls ngOnDestroy if the page was popped (ex: when navigating back)
  // Since ngOnDestroy might not fire when you navigate from the current page, use ionViewWillLeave to cleanup Subscriptions
  ionViewWillLeave(): void {}

  getTranslations() {
    // get translations for this page to use in the Language Chooser Alert
    this.translate
      .getTranslation(this.translate.currentLang)
      .subscribe((translations) => (this.translations = translations));
  }

  async openLanguageChooser() {
    this.available_languages = this.languageService
      .getLanguages()
      .map((item: LanguageModel) => ({
        name: item.name,
        type: 'radio',
        label: item.name,
        value: item.code,
        checked: item.code === this.translate.currentLang
      }));

    const alert = await this.alertController.create({
      header: this.translations.SELECT_LANGUAGE,
      inputs: this.available_languages,
      cssClass: 'language-alert',
      buttons: [
        {
          text: this.translations.CANCEL,
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        },
        {
          text: this.translations.OK,
          handler: (data) => {
            if (data) {
              this.translate.use(data);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  selectImage() {
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
