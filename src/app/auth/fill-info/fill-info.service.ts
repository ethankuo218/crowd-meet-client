import { Storage } from '@ionic/storage-angular';
import { Injectable } from '@angular/core';
import { UserService } from 'src/app/core/user.service';

@Injectable({
  providedIn: 'root'
})
export class FillInfoService {
  gender: string | undefined;
  birth: string | undefined;
  constructor(private userService: UserService, private storage: Storage) {}

  saveInfo() {
    // this.userService
    //   .updateUser({
    //     gender: this.gender,
    //     birth: this.birth
    //   })
    //   .subscribe({
    //     next: () => {
    //       this.gender = undefined;
    //       this.birth = undefined;
    //       this.storage.set('isNewuser', false);
    //     }
    //   });
    console.log('SET FALSE');
    this.storage.set('isNewUser', false);
  }
}
