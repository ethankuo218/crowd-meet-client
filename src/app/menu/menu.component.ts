import { UserStateFacade } from './../core/states/user-state/user.state.facade';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  isDarkMode: boolean = false;
  user$ = this.userStateFacade.getUser();
  constructor(private userStateFacade: UserStateFacade) {}

  ngOnInit() {}

  changeMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark', this.isDarkMode);
  }
}
