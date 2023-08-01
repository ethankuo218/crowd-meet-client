import { Injectable } from '@angular/core';
import {
  AdMob,
  AdMobRewardItem,
  AdOptions,
  RewardAdOptions
} from '@capacitor-community/admob';
import { BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';

@Injectable({
  providedIn: 'root'
})
export class AdmobService {
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

  async showReward(): Promise<AdMobRewardItem> {
    // android:
    // create-event: ca-app-pub-5981152485884247/8738744842
    // join-event: ca-app-pub-5981152485884247/4263209563
    // kick-participant: ca-app-pub-5981152485884247/8010882881
    // view-participant: ca-app-pub-5981152485884247/8226505307

    // ios:
    // create-event: ca-app-pub-5981152485884247/5384719545
    // join-event: ca-app-pub-5981152485884247/3103274788
    // kick-participant: ca-app-pub-5981152485884247/6298399868
    // view-participant: ca-app-pub-5981152485884247/4622302216

    const options: RewardAdOptions = {
      adId: 'ca-app-pub-5981152485884247/1152996343',
      isTesting: true,
      // npa: true,
      ssv: {
        userId: 'A user ID to send to your SSV',
        customData: JSON.stringify({ fake: 'data' })
      }
    };
    await AdMob.prepareRewardVideoAd(options);

    return AdMob.showRewardVideoAd();
  }
}
