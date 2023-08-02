import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  inject
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IonicModule, ModalController } from '@ionic/angular';
import { FilterComponent } from '../filter/filter.component';
import { EventService } from '../core/event.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FontAwesomeModule, RouterModule]
})
export class HeaderComponent implements OnInit {
  @Input() defaultHref: string = 'app/event/list';
  @Output() menuEvent = new EventEmitter();

  private router = inject(Router);
  private modalCtrl = inject(ModalController);
  private eventService = inject(EventService);

  tabPageUrls: string[] = [
    '/app/event/list',
    '/app/chat/list',
    '/app/event-create',
    '/app/history',
    '/app/notifications'
  ];

  get filter() {
    return this.eventService.filter;
  }

  set filter(val: any) {
    this.eventService.filter = val;
  }

  ngOnInit() {}

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

  get currentUrl(): string {
    return this.router.url;
  }
}
