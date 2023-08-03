import { CommonModule } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { IonAccordionGroup, IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-mega-boost',
  templateUrl: './mega-boost.component.html',
  styleUrls: ['./mega-boost.component.scss'],
  standalone: true,
  imports: [CommonModule, MatDialogModule, IonicModule, FormsModule]
})
export class MegaBoostComponent {
  @ViewChild('accordionGroup', { static: true })
  accordionGroup!: IonAccordionGroup;

  boost: 'Y' | 'N' = 'Y';
  plan: 1 | 3 | 7 | null = 1;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      content: string;
      enableCancelButton: boolean;
    }
  ) {}

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
}
