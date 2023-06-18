import { ImgUploadService } from './../../core/img-upload.service';
import { EventService } from '../../core/event.service';
import { ReferenceStateFacade } from './../../core/states/reference-state/reference.state.facade';
import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormArray } from '@angular/forms';

import { counterRangeValidator } from '../../components/counter-input/counter-input.component';
import { Observable, take } from 'rxjs';
import { Router } from '@angular/router';
import { Category } from 'src/app/core/states/reference-state/reference.model';

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
      { type: 'rangeError', message: 'Input participants is out of range.' },
    ],
    price: [{ type: 'required', message: 'Price is required.' }],
    locationName: [{ type: 'required', message: 'Location name is required' }],
    image: [{ type: 'required', message: 'Image is required' }],
  };

  categoryList: Category[] = [];

  get categories(): FormArray {
    return <FormArray>this.eventForm.get('categories');
  }

  constructor(
    private referenceStateFacade: ReferenceStateFacade,
    private eventService: EventService,
    private router: Router,
    private imgUploadService: ImgUploadService
  ) {}

  ngOnInit(): void {
    this.eventForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      startTime: new FormControl('', [Validators.required]),
      endTime: new FormControl('', [Validators.required]),
      maxParticipants: new FormControl(1, counterRangeValidator(1, 15)),
      locationName: new FormControl('', [Validators.required]),
      price: new FormControl(0, [Validators.required]),
      categories: new FormArray([], [Validators.required]),
    });

    this.referenceStateFacade.getCategories().pipe(take(1)).subscribe({
      next: (result) => {
        this.categoryList = result;
        this.categoryList.forEach(() => {
          this.categories.push(new FormControl());
        });
      },
    });
  }

  onSubmit(values: any) {
    const selection: number[] = [];
    this.categories.value.forEach((value: boolean, index: number) => {
      if (value) {
        selection.push(this.categoryList[index].categoryId);
      }
    });

    this.eventService
      .createEvent({
        ...values,
        startTime: this.formatDateToIsoString(values.startTime),
        endTime: this.formatDateToIsoString(values.endTime),
        categories: selection,
      })
      .subscribe({
        next: (result) => {
          if (this.imgUploadService.uploadedImagesCount !== 0) {
            this.uploadEventImg(result.eventId);
          } else {
            this.router.navigate(['/app/event']);
          }
        },
      });
  }

  selectImage(): void {
    this.imgUploadService.selectImage();
  }

  private async uploadEventImg(id: number) {
    const formData = new FormData();
    const files = await this.imgUploadService.getUploadedImg();

    formData.append('file', files[0]);
    this.eventService.updateEventImage(id, formData).subscribe({
      next: () => {
        this.router.navigate(['/app/event']);
      },
    });
  }

  private formatDateToIsoString(date: string): string {
    return new Date(date).toISOString();
  }

  trackByIndex(index: number, item: Category): number {
    return index;
  }
}
