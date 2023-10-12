import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeDate'
})
export class RelativeDatePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    const today = new Date();
    const dateValue = new Date(value); // This should convert the UTC timestamp to the client's local time

    const diffInDays = Math.floor(
      (today.getTime() - dateValue.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays <= 3) {
      // If the difference is 3 days or less, return the day name.
      return (
        new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(
          dateValue
        ) +
        ` | ${dateValue.getHours()}:${
          dateValue.getMinutes() < 10 ? '0' : ''
        }${dateValue.getMinutes()} ${dateValue.getHours() >= 12 ? 'PM' : 'AM'}`
      );
    } else {
      // Otherwise, return the date.
      return (
        new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit'
        }).format(dateValue) +
        ` | ${dateValue.getHours()}:${
          dateValue.getMinutes() < 10 ? '0' : ''
        }${dateValue.getMinutes()} ${dateValue.getHours() >= 12 ? 'PM' : 'AM'}`
      );
    }
  }
}
