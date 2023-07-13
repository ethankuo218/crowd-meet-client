import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class FilterComponent implements OnInit {
  constructor(private modalControl: ModalController) {}

  ngOnInit() {}

  cancel(): void {
    this.modalControl.dismiss(null, 'cancel');
  }

  filter(): void {
    this.modalControl.dismiss(null, 'filter');
  }
}
