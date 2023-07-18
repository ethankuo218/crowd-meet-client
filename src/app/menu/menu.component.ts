import { Storage } from '@ionic/storage-angular';
import { UserStateFacade } from './../core/states/user-state/user.state.facade';
import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  isDarkMode!: boolean;
  user$ = this.userStateFacade.getUser();
  constructor(
    private userStateFacade: UserStateFacade,
    private storage: Storage,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.platform.ready().then(async () => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      this.isDarkMode = prefersDark.matches;
    });
  }

  changeMode() {
    this.isDarkMode = !this.isDarkMode;
    this.storage.set('isDarkMode', this.isDarkMode);
    document.body.classList.toggle('dark', this.isDarkMode);
  }
}
