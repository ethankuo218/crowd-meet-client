import { Component, OnInit } from '@angular/core';
import {
  Validators,
  FormControl,
  FormGroup,
  AbstractControl,
  FormArray,
} from '@angular/forms';

import { counterRangeValidator } from '../../components/counter-input/counter-input.component';

@Component({
  selector: 'app-create-page',
  templateUrl: './create.page.html',
  styleUrls: ['./styles/create.page.scss'],
})
export class CreatePage implements OnInit {
  eventForm!: FormGroup;

  validations = {
    title: [{ type: 'required', message: 'Title is required.' }],
    description: [{ type: 'required', message: 'Description is required.' }],
    startTime: [{ type: 'required', message: 'Start time is required.' }],
    endTime: [{ type: 'required', message: 'End time is required.' }],
    categories: [{ type: 'required', message: 'Categories is required.' }],
    maxParticipants: [
      { type: 'required', message: 'Max participants is required.' },
    ],
    price: [{ type: 'required', message: 'Price is required.' }],
    locationName: [{ type: 'required', message: 'Location name is required' }],
  };

  constructor() {}

  ngOnInit(): void {
    this.eventForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      startTime: new FormControl('', [Validators.required]),
      endTime: new FormControl('', [Validators.required]),
      maxParticipants: new FormControl(1, counterRangeValidator(1, 15)),
      locationName: new FormControl('', [Validators.required]),
      price: new FormControl(0, [Validators.required]),
      categories: new FormControl('', [Validators.required]),
    });
  }

  onSubmit(values: any) {
    console.log(values);
  }
}
