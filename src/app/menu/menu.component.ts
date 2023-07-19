import { Storage } from '@ionic/storage-angular';
import { UserStateFacade } from './../core/states/user-state/user.state.facade';
import { Component, OnInit, inject } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  private storage = inject(Storage);
  user$ = inject(UserStateFacade).getUser();
  isDarkMode: boolean = document.body.classList.contains('dark');

  changeMode(): void {
    this.isDarkMode = !this.isDarkMode;
    this.storage.set('isDarkMode', this.isDarkMode);
    document.body.classList.toggle('dark', this.isDarkMode);
  }
}
