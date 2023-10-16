import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'bundleWording',
  standalone: true
})
export class BundleWordingPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}
  transform(
    identifier: string,
    bundleWording: string,
    descriptionIndex?: number
  ): string {
    const baseKey = 'IN_APP_PURCHASE.BUNDLE_2';
    const identifierLow = identifier.toLowerCase();

    let bundlePrefix = '';
    if (identifierLow.includes('free')) {
      bundlePrefix = 'FREE';
    } else if (identifierLow.includes('social')) {
      bundlePrefix = 'SOCIAL';
    } else if (identifierLow.includes('influencer')) {
      bundlePrefix = 'INFLUENCER';
    } else if (identifierLow.includes('lifestyle')) {
      bundlePrefix = 'LIFESTYLE';
    }

    if (descriptionIndex) {
      return this.translate.instant(
        `${baseKey}.${bundlePrefix}.${bundleWording}_${descriptionIndex}`
      );
    }

    return this.translate.instant(
      `${baseKey}.${bundlePrefix}.${bundleWording}`
    );
  }
}
