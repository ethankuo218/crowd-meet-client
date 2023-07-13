import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/core/states/user-state/user.model';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {
  @Input() userDetail!: User;

  form = new FormGroup({
    rating: new FormControl<number>(1, [Validators.required]),
    comment: new FormControl<string>('', [Validators.required])
  });
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  submit(): void {
    this.modalCtrl.dismiss(this.form.value, 'submit');
  }

  cancel(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
