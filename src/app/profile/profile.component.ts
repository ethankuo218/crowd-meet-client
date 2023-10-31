import { UserService } from './../core/user.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HeaderComponent } from '../header/header.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SwiperModule } from 'swiper/angular';
import { switchMap, Observable, tap, map, firstValueFrom } from 'rxjs';
import { AgePipe } from '../core/pipe/age.pipe';
import { User } from '../core/+states/user-state/user.model';
import { Review } from '../history/reviews/models/reviews.model';
import { ReviewsService } from '../history/reviews/reviews.service';
import { DirectivesModule } from '../directives/directives.module';
import { TranslateModule } from '@ngx-translate/core';
import { ChatService } from '../chat/chat.service';
import { EntitlementService, Entitlements } from '../core/entitlement.service';
import { UserStateFacade } from '../core/+states/user-state/user.state.facade';
import { InAppPurchaseComponent } from '../in-app-purchase/in-app-purchase.component';

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
    AgePipe,
    DirectivesModule,
    TranslateModule
  ],
  providers: [UserService]
})
export class ProfileComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  private reviewService = inject(ReviewsService);
  private chatService = inject(ChatService);
  private userFacade = inject(UserStateFacade);
  private entitlementService = inject(EntitlementService);
  private modalCtrl = inject(ModalController);

  private id!: number;
  isLoading = true;
  isSent: boolean = false;

  user$: Observable<User> = this.route.params.pipe(
    switchMap((params) => {
      this.id = params['id'];
      return this.userService.getUserById(params['id']).pipe(
        tap(() => {
          this.isLoading = false;
        })
      );
    })
  );

  review$: Observable<Review[]> = this.route.params.pipe(
    switchMap((params) => {
      return this.reviewService.getReviewee(params['id']).pipe(
        tap(() => {
          this.isLoading = false;
        })
      );
    })
  );

  getInfoView(user: User): string {
    const birthDateObject = new Date(user.birthDate);
    const today = new Date();

    const age = Math.floor(
      (today.getTime() - birthDateObject.getTime()) /
        (365 * 24 * 60 * 60 * 1000)
    );
    const genderDisplayMap = {
      male: 'M',
      female: 'F',
      secret: '?'
    };
    type GenderKey = 'male' | 'female' | 'secret';
    return `${age} / ${genderDisplayMap[user.gender as GenderKey] ?? '?'}`;
  }

  get isOwn$(): Observable<boolean> {
    return this.userFacade
      .getUser()
      .pipe(map((user) => user.userId === Number(this.id)));
  }

  async sendMessage(): Promise<void> {
    this.isSent = true;
    const hasPermission = await firstValueFrom(
      this.entitlementService.hasEntitlement(Entitlements.DIRECT_MESSAGE)
    );

    if (hasPermission) {
      this.chatService.sendPrivateMessage(this.id).subscribe({
        next: ({ chatId }) => {
          this.router.navigate(['/app/chat/list', chatId]);
        }
      });
    } else {
      const modal = await this.modalCtrl.create({
        component: InAppPurchaseComponent,
        initialBreakpoint: 1,
        breakpoints: [0, 1],
        componentProps: {
          isModalMode: true
        }
      });
      modal.present();
    }

    this.isSent = false;
  }
}
