import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age'
})
export class AgePipe implements PipeTransform {
  transform(value: string): number {
    const birthDate = new Date(value);
    const currentDate = new Date();
    return currentDate.getFullYear() - birthDate.getFullYear() + 1;
  }
}
