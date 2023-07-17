import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age',
  standalone: true
})
export class AgePipe implements PipeTransform {
  transform(value: string): number | string {
    const birthDate = new Date(value);
    const currentDate = new Date();
    return value
      ? currentDate.getFullYear() - birthDate.getFullYear() + 1
      : '??';
  }
}
