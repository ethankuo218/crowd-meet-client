import { UserService } from './../core/user.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HeaderComponent } from '../header/header.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SwiperModule } from 'swiper/angular';
import { switchMap, Observable, tap } from 'rxjs';
import { AgePipe } from '../core/pipe/age.pipe';
import { User } from '../core/+states/user-state/user.model';

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
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  isLoading = true;

  user$: Observable<User> = this.route.params.pipe(
    switchMap((params) => {
      return this.userService.getUserById(params['id']).pipe(
        tap(() => {
          this.isLoading = false;
        })
      );
    })
  );

  ngOnInit() {}
}
