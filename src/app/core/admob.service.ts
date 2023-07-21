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
  async initializeAdmob(): Promise<void> {
    const { status } = await AdMob.trackingAuthorizationStatus();
    let needRequestTrackingAuth = true;
    if (status === 'notDetermined') {
      // show track modal
      needRequestTrackingAuth = false;
    }

    await AdMob.initialize({
      requestTrackingAuthorization: true,
      testingDevices: ['testDeviceID'],
      initializeForTesting: true
    });

    console.log('Admob initialized');
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
        console.log(err.message);
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
        console.log(err.message);
      });
  }

  async showReward(): Promise<AdMobRewardItem> {
    const options: RewardAdOptions = {
      adId: 'YOUR ADID',
      isTesting: true
      // npa: true
      // ssv: {
      //   userId: "A user ID to send to your SSV"
      //   customData: JSON.stringify({ ...MyCustomData })
      //}
    };
    await AdMob.prepareRewardVideoAd(options);

    return AdMob.showRewardVideoAd();
  }
}
