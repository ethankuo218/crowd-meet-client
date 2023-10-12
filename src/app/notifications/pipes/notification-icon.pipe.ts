import { Pipe, PipeTransform } from '@angular/core';
import { IconPrefix, IconName } from '@fortawesome/fontawesome-svg-core';

@Pipe({
  name: 'notificationIcon'
})
export class NotificationIconPipe implements PipeTransform {
  transform(titleKey: string, ...args: unknown[]): [IconPrefix, IconName] {
    switch (titleKey) {
      case 'NOTIFICATIONS.TITLE.NEW_COMMENT':
        return ['fas', 'comment'];
      case 'NOTIFICATIONS.TITLE.ACCEPTED':
        return ['far', 'circle-check'];
      case 'NOTIFICATIONS.TITLE.DECLINED':
        return ['fas', 'user-xmark'];
      case 'NOTIFICATIONS.TITLE.KICKED':
        return ['fas', 'user-slash'];
      case 'NOTIFICATIONS.TITLE.LEFT':
        return ['fas', 'person-through-window'];
      case 'NOTIFICATIONS.TITLE.APPLIED':
        return ['fas', 'user-plus'];
      // You can add more mappings as required
      default:
        return ['fas', 'exclamation']; // Default or fallback icon
    }
  }
}
