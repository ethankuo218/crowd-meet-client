import { Storage } from '@ionic/storage-angular';
import { UserStateFacade } from '../core/+states/user-state/user.state.facade';
import { Component, inject } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  private storage = inject(Storage);
  private authService = inject(AuthService);
  private router = inject(Router);

  user$ = inject(UserStateFacade).getUser();
  isDarkMode: boolean = document.body.classList.contains('dark');

  changeMode(): void {
    this.isDarkMode = !this.isDarkMode;
    this.storage.set('isDarkMode', this.isDarkMode);
    document.body.classList.toggle('dark', this.isDarkMode);
  }

  logout(): void {
    try {
      this.authService.signOut().then(() => {
        this.router.navigate(['auth/sign-in']);
      });
    } catch (error) {
      console.error(error);
    }
  }
}
