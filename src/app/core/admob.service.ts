import { UserStateFacade } from './+states/user-state/user.state.facade';
import { Injectable, inject } from '@angular/core';
import { AdMob, AdOptions, RewardAdOptions } from '@capacitor-community/admob';
import { BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';
import { firstValueFrom, map } from 'rxjs';
import { AllowanceType } from './models/core.model';
import { UserService } from './user.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../components/alert-dialog/alert-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class AdmobService {
  private platform = Capacitor.getPlatform();
  private userStateFacade = inject(UserStateFacade);
  private userService = inject(UserService);
  private dialog = inject(MatDialog);

  private userId$ = this.userStateFacade
    .getUser()
    .pipe(map((user) => user.userId));

  initializeAdmob(): Promise<void> {
    return AdMob.initialize({
      requestTrackingAuthorization: true,
      testingDevices: ['25aecfff-a6b5-463c-beac-4043d5497b2e'],
      initializeForTesting: true
    });
  }

  async showBanner() {
    const userId = (await firstValueFrom(this.userId$)).toString();

    await AdMob.showBanner({
      adId: 'test',
      isTesting: true,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.CENTER
    });
  }

  async showInterstitial(): Promise<void> {
    const options: AdOptions = {
      adId: 'YOUR ADID',
      isTesting: true
      // npa: true
    };
    await AdMob.prepareInterstitial(options);

    AdMob.showInterstitial();
  }

  async showReward(option: AdOption): Promise<void> {
    const checkAllowanceResult = await this.checkAdAllowance(option);

    if (checkAllowanceResult === 'skipAd') {
      return;
    }

    if (!checkAllowanceResult) {
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Oops',
          content: `You are out of AD watching times`,
          enableCancelButton: false
        },
        panelClass: 'custom-dialog'
      });
      throw 'You are out of AD watching times';
    }

    const userId = (await firstValueFrom(this.userId$)).toString();
    const options: RewardAdOptions = {
      adId: AdId[`${option}${this.platform === 'ios' ? '_IOS' : '_MD'}`],
      isTesting: true,
      // npa: true,
      ssv: {
        userId: userId,
        customData: JSON.stringify({ fake: 'data' })
      }
    };

    await AdMob.prepareRewardVideoAd(options);
    await AdMob.showRewardVideoAd();

    let getReward: boolean = false;
    let checkCount: number = 0;

    await new Promise(async (resolve, reject) => {
      while (checkCount < 3) {
        setTimeout(async () => {
          const checkResult = await this.checkCurrentAllowance(option);
          if (checkResult) {
            getReward = checkResult;
            resolve(getReward);
            checkCount = 3;
          }
        }, 500);

        checkCount++;
      }

      this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Oops',
          content: `Get reward failed. Please try again`,
          enableCancelButton: false
        },
        panelClass: 'custom-dialog'
      });
      reject('Get reward failed!');
    });
  }

  private async checkAdAllowance(option: AdOption): Promise<string | boolean> {
    const allowanceType = AllowanceType[`${option}`];
    const adAllowanceType = AllowanceType[`${option}_AD_WATCH`];
    const currentAllowance = await firstValueFrom(
      this.userService.getAllowance()
    );

    if (currentAllowance[allowanceType] > 0) {
      return 'skipAd';
    } else {
      return option === AdOption.EVENT_JOIN
        ? true
        : currentAllowance[adAllowanceType] > 0;
    }
  }

  private async checkCurrentAllowance(option: AdOption): Promise<boolean> {
    const allowanceType = AllowanceType[`${option}`];
    const currentAllowance = (
      await firstValueFrom(this.userService.getAllowance())
    )[allowanceType];

    return currentAllowance > 0;
  }
}

export enum AdOption {
  EVENT_CREATE = 'EVENT_CREATE',
  EVENT_JOIN = 'EVENT_JOIN',
  KICK = 'KICK',
  CHECK_PARTICIPANT = 'CHECK_PARTICIPANT'
}

enum AdId {
  EVENT_CREATE_IOS = 'ca-app-pub-5981152485884247/5384719545',
  EVENT_JOIN_IOS = 'ca-app-pub-5981152485884247/3103274788',
  KICK_IOS = 'ca-app-pub-5981152485884247/6298399868',
  CHECK_PARTICIPANT_IOS = 'ca-app-pub-5981152485884247/4622302216',
  EVENT_CREATE_MD = 'ca-app-pub-5981152485884247/8738744842',
  EVENT_JOIN_MD = 'ca-app-pub-5981152485884247/4263209563',
  KICK_MD = 'ca-app-pub-5981152485884247/8010882881',
  CHECK_PARTICIPANT_MD = 'ca-app-pub-5981152485884247/8226505307'
}
