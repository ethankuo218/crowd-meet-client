import { UserStateFacade } from './../core/states/user-state/user.state.facade';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  user$ = this.userStateFacade.getUser();
  constructor(private userStateFacade: UserStateFacade) {}

  ngOnInit() {}
}
