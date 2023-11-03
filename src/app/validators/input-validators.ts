import { AbstractControl } from '@angular/forms';

export class InputValidators {
  static startTimeValidate(formcCtrl: AbstractControl) {
    const currentTime = new Date();
    const startTime = new Date(formcCtrl.get('startTime')?.value);

    if (startTime.getTime() < currentTime.getTime() + 10 * 60 * 1000) {
      return {
        startTimeShouldAfterTenMinutes: true
      };
    } else {
      return null;
    }
  }

  static endTimeValidate(formcCtrl: AbstractControl) {
    const startTime = new Date(formcCtrl.get('startTime')?.value);
    const endTime = new Date(formcCtrl.get('endTime')?.value);
    if (startTime.getTime() >= endTime.getTime()) {
      return {
        endTimeShouldAfterStartTime: true
      };
    } else {
      return null;
    }
  }

  static categoriesValidate(formcCtrl: AbstractControl) {
    const categoriesValue = formcCtrl.get('categories')?.value;
    let validateSuccess = false;
    categoriesValue.forEach((item: any) => {
      if (item) {
        validateSuccess = true;
      }
    });

    if (!validateSuccess) {
      return {
        categoryShouldBeChoose: true
      };
    } else {
      return null;
    }
  }
}
