import { UserStateFacade } from './../core/states/user-state/user.state.facade';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user$ = this.userStateFacade.getUser();

  constructor(private userStateFacade: UserStateFacade) {}

  ngOnInit() {}
}
