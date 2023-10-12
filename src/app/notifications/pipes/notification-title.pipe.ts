import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'notificationTitle'
})
export class NotificationTitlePipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    const titleKey = 'NOTIFICATIONS.TITLE.';
    let title = '';
    if (value.includes('new comment')) {
      title = 'NEW_COMMENT';
    } else if (value.includes('been accepted')) {
      title = 'ACCEPTED';
    } else if (value.includes('been declined')) {
      title = 'DECLINED';
    } else if (value.includes('been kicked out')) {
      title = 'KICKED';
    } else if (value.includes('who left')) {
      title = 'LEFT';
    } else if (value.includes('new application')) {
      title = 'APPLIED';
    } else {
      title = 'UPDATED';
    }

    return titleKey + title.toUpperCase();
  }
}
