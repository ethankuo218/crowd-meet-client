import { InAppPurchaseService } from './../../core/in-app-purchase.service';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonAccordionGroup,
  IonicModule,
  ModalController
} from '@ionic/angular';

@Component({
  selector: 'app-mega-boost',
  templateUrl: './mega-boost.component.html',
  styleUrls: ['./mega-boost.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class MegaBoostComponent implements OnInit {
  private modalControl = inject(ModalController);
  private inAppPurchaseService = inject(InAppPurchaseService);

  @Input() eventId!: number;

  @ViewChild('accordionGroup', { static: true })
  accordionGroup!: IonAccordionGroup;

  boost: 'Y' | 'N' = 'Y';
  plan: 1 | 3 | 7 | null = 1;

  ngOnInit(): void {
    this.inAppPurchaseService.setAttributes({
      boostEventId: this.eventId.toString()
    });
  }

  ngAfterViewInit(): void {
    this.toggleAccordion();
  }

  onBoostChange(): void {
    if (this.boost === 'N') {
      this.toggleAccordion();
    }
  }

  private toggleAccordion = () => {
    const nativeEl = this.accordionGroup;
    if (nativeEl.value === 'selectPlan' || this.boost === 'N') {
      nativeEl.value = undefined;
    } else {
      nativeEl.value = 'selectPlan';
    }
  };

  confirm(): void {
    this.modalControl.dismiss({}, 'boost');
  }
}
