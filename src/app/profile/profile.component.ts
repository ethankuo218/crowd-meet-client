import { UserService } from './../core/user.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HeaderComponent } from '../header/header.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SwiperModule } from 'swiper/angular';
import { from, switchMap, Observable } from 'rxjs';
import { User } from '../core/+states/user-state/user.model';
import { AgePipe } from '../core/pipe/age.pipe';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FontAwesomeModule,
    HeaderComponent,
    RouterModule,
    SwiperModule,
    AgePipe
  ],
  providers: [UserService]
})
export class ProfileComponent implements OnInit {
  user$ = from(this.route.params).pipe(
    switchMap((params): Observable<User> => {
      return this.userService.getUserById(params['id']);
    })
  );

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {}
}
