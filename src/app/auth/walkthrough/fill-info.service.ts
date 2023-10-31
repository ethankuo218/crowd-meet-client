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

  saveInfo(form: { gender: string; birthDate: string; interests: number[] }) {
    try {
      this.userService.updateUser(form);
    } catch (err) {
      return;
    }

    this.storage.remove('isNewUser');
    this.router.navigate(['app']);
  }
}
