import { DatePipe } from '@angular/common';

export function getFormatTimeString(input?: string): string {
  const date = input ? new Date(input) : new Date();
  const isoDateString = new DatePipe('en-US')
    .transform(date.toLocaleDateString(), 'MM/dd/yyyy')
    ?.split('/');
  const isMorning = date.toLocaleTimeString('en-US').split(' ')[1] === 'AM';
  const isoTimeString = date
    .toLocaleTimeString('en-US')
    .split(' ')[0]
    .split(':');

  return `${isoDateString![2]}-${isoDateString![0].padStart(
    2,
    '0'
  )}-${isoDateString![1].padStart(2, '0')}T${
    isMorning
      ? isoTimeString[0].padStart(2, '0')
      : Number(isoTimeString[0]) + 12
  }:${isoTimeString[1]}`;
}
