import { Injectable } from '@angular/core';
import {
  AdMob,
  AdMobRewardItem,
  AdOptions,
  RewardAdOptions
} from '@capacitor-community/admob';
import { BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class AdmobService {
  private platform = Capacitor.getPlatform();

  initializeAdmob(): Promise<void> {
    return AdMob.initialize({
      requestTrackingAuthorization: true,
      testingDevices: ['25aecfff-a6b5-463c-beac-4043d5497b2e'],
      initializeForTesting: true
    });
  }

  showBanner() {
    AdMob.showBanner({
      adId: 'test',
      isTesting: true,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.CENTER
    })
      .then(() => {
        console.log('Banner Ad Shown');
      })
      .catch((err: any) => {
        console.error(err.message);
      });
  }

  async showInterstitial(): Promise<void> {
    const options: AdOptions = {
      adId: 'YOUR ADID',
      isTesting: true
      // npa: true
    };
    await AdMob.prepareInterstitial(options);

    AdMob.showInterstitial()
      .then(() => {
        console.log('Interstitial Ad Shown');
      })
      .catch((err: any) => {
        console.error(err.message);
      });
  }

  async showReward(option: AdOption): Promise<AdMobRewardItem> {
    const adId = this.platform === 'ios' ? `${option}_IOS` : `${option}_MD`;
    const options: RewardAdOptions = {
      adId: (AdId as any)[adId],
      isTesting: true,
      // npa: true,
      ssv: {
        userId: '351', // user id (server)
        customData: JSON.stringify({ fake: 'data' })
      }
    };

    await AdMob.prepareRewardVideoAd(options);

    return AdMob.showRewardVideoAd();
  }
}

export enum AdOption {
  CREATE_EVENT = 'CREATE_EVENT',
  JOIN_EVENT = 'JOIN_EVENT',
  KICK = 'KICK',
  VIEW = 'VIEW'
}

enum AdId {
  CREATE_EVENT_IOS = 'ca-app-pub-5981152485884247/5384719545',
  JOIN_EVENT_IOS = 'ca-app-pub-5981152485884247/3103274788',
  KICK_IOS = 'ca-app-pub-5981152485884247/6298399868',
  VIEW_IOS = 'ca-app-pub-5981152485884247/4622302216',
  CREATE_EVENT_MD = 'ca-app-pub-5981152485884247/8738744842',
  JOIN_EVENT_MD = 'ca-app-pub-5981152485884247/4263209563',
  KICK_MD = 'ca-app-pub-5981152485884247/8010882881',
  VIEW_MD = 'ca-app-pub-5981152485884247/8226505307'
}
