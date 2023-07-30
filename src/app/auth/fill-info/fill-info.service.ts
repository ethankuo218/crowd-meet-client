import { Storage } from '@ionic/storage-angular';
import { Injectable, inject } from '@angular/core';
import { UserService } from 'src/app/core/user.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FillInfoService {
  private userService = inject(UserService);
  private storage = inject(Storage);
  private router = inject(Router);

  gender: string | undefined;
  birth: string | undefined;
  interests: number[] | undefined;

  saveInfo() {
    this.userService
      .updateUser({
        gender: this.gender,
        birthDate: this.birth,
        interests: this.interests
      })
      .subscribe({
        next: () => {
          this.gender = undefined;
          this.birth = undefined;
          this.interests = undefined;
          this.storage.set('isNewuser', false);
          this.router.navigate(['app']);
        }
      });
  }
}
