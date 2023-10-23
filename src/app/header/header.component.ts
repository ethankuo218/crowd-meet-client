import { UserStateFacade } from './../core/+states/user-state/user.state.facade';
import { CommonModule } from '@angular/common';
import {
  Component,
  Output,
  EventEmitter,
  Input,
  inject,
  OnInit,
  OnDestroy
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IonicModule, ModalController } from '@ionic/angular';
import { FilterComponent } from '../filter/filter.component';
import { EventService } from '../core/event.service';
import { MegaBoostComponent } from '../event-create/mega-boost/mega-boost.component';
import { Observable, Subject, Subscription, map } from 'rxjs';
import { Share } from '@capacitor/share';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InAppPurchaseComponent } from '../in-app-purchase/in-app-purchase.component';
import { ChatService } from '../chat/chat.service';
import { NotificationPreference } from '../chat/models/chat.models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FontAwesomeModule,
    RouterModule,
    FormsModule,
    TranslateModule
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() defaultHref: string = 'app/event/list';
  @Output() menuEvent = new EventEmitter();

  private router = inject(Router);
  private modalCtrl = inject(ModalController);
  private eventService = inject(EventService);
  private chatService = inject(ChatService);
  private route = inject(ActivatedRoute);
  private readonly translate = inject(TranslateService);

  searchText: string = '';

  userId$: Observable<number> = inject(UserStateFacade)
    .getUser()
    .pipe(map((user) => user.userId));

  tabPageUrls: string[] = [
    '/app/event/list',
    '/app/chat/list',
    '/app/event-create',
    '/app/history',
    '/app/notifications'
  ];

  private notificationPreferenceSubject: Subject<NotificationPreference> =
    new Subject();

  private routeSubscription!: Subscription;

  get notificationPreference$(): Observable<NotificationPreference> {
    return this.notificationPreferenceSubject;
  }

  get filter() {
    return this.eventService.filter;
  }

  set filter(val: any) {
    this.eventService.filter = val;
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.url.subscribe(() => {
      if (location.pathname.includes('app/chat/list/')) {
        this.reloadNotificationPreference();
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  async openFilter() {
    const modal = await this.modalCtrl.create({
      component: FilterComponent,
      initialBreakpoint: 1,
      breakpoints: [0, 1],
      componentProps: { filter: this.filter }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'filter') {
      this.filter = data;
      this.eventService.reload();
    }
  }

  async shareEvent(): Promise<void> {
    const eventDetail = this.eventService.currentEventDetail;
    await Share.share({
      title: eventDetail?.title,
      text: this.translate.instant('SHARE.EVENT'),
      url: `https://dev.crowdmeet.app/app/event/list/${eventDetail?.eventId}`,
      dialogTitle: 'Share with buddies'
    });
  }

  async openPurchasePage() {
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

  async openBoostPage() {
    const modal = await this.modalCtrl.create({
      component: MegaBoostComponent,
      initialBreakpoint: 1,
      breakpoints: [0, 1],
      componentProps: {
        eventId: this.eventService.currentEventDetail?.eventId,
        endTime: this.eventService.currentEventDetail?.endTime
      }
    });
    modal.present();
  }

  search(): void {
    this.filter = { ...this.filter, eventName: this.searchText };
    if (this.searchText === '') {
      delete this.filter.eventName;
    }
    this.eventService.reload();
  }

  setNotificationPreference(preference: boolean): void {
    const chatId: string = this.router.url.split('/').pop() as string;

    this.chatService
      .setNotificationsPreference(chatId, preference)
      .subscribe(() => {
        this.reloadNotificationPreference();
      });
  }

  private reloadNotificationPreference(): void {
    const chatId: string = location.pathname.split('/').pop() as string;
    this.chatService
      .getNotificationPreference(chatId)
      .subscribe((preferenceInfo) => {
        this.notificationPreferenceSubject.next(preferenceInfo);
      });
  }

  get currentUrl(): string {
    return this.router.url;
  }

  get curretEventDetailCreatorId() {
    return this.eventService.currentEventDetail?.creator.userId;
  }
}
