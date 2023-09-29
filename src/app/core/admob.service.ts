import { UserStateFacade } from './+states/user-state/user.state.facade';
import { Injectable, inject } from '@angular/core';
import {
  AdMob,
  AdMobRewardItem,
  AdOptions,
  RewardAdOptions,
  RewardAdPluginEvents
} from '@capacitor-community/admob';
import { BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';
import { firstValueFrom, map, retry, timer } from 'rxjs';
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

    try {
      await AdMob.showBanner({
        adId: 'test',
        isTesting: true,
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: BannerAdPosition.CENTER
      });
    } catch (error) {}
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
      // isTesting: true,
      npa: true,
      ssv: {
        userId: userId,
        customData: JSON.stringify({ fake: 'data' })
      }
    };

    try {
      await AdMob.prepareRewardVideoAd(options);
      await AdMob.showRewardVideoAd();
    } catch (error) {
      this.showNoAdModal();
      throw error;
    }

    if (this.platform !== 'ios') {
      await new Promise<void>((resolve) => {
        AdMob.addListener(
          RewardAdPluginEvents.Rewarded,
          (rewardItem: AdMobRewardItem) => {
            resolve();
          }
        );
      });
    }

    try {
      await this.checkCurrentAllowance(option);
    } catch (error) {
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Oops',
          content: `Get reward failed. Please try again`,
          enableCancelButton: false
        },
        panelClass: 'custom-dialog'
      });
      throw error;
    }
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
      return option === AdOption.JOIN_EVENT
        ? true
        : currentAllowance[adAllowanceType] < AdWatchMaxCount[`${option}`];
    }
  }

  private async checkCurrentAllowance(option: AdOption): Promise<void> {
    const allowanceType = AllowanceType[`${option}`];
    await firstValueFrom(
      this.userService.getAllowance().pipe(
        map((result) => {
          if (result[allowanceType] > 0) {
            return true;
          } else {
            throw 'Get reward failed';
          }
        }),
        retry({ count: 2, delay: () => timer(500) })
      )
    );
  }

  private showNoAdModal(): void {
    this.dialog.open(AlertDialogComponent, {
      data: {
        title: 'Oops',
        content: `No AD to show, please ty later`,
        enableCancelButton: false
      },
      panelClass: 'custom-dialog'
    });
  }
}

export enum AdOption {
  CREATE_EVENT = 'CREATE_EVENT',
  JOIN_EVENT = 'JOIN_EVENT',
  KICK_PARTICIPANT = 'KICK_PARTICIPANT',
  VIEW_PARTICIPANT = 'VIEW_PARTICIPANT'
}

enum AdId {
  CREATE_EVENT_IOS = 'ca-app-pub-5981152485884247/7648422786',
  JOIN_EVENT_IOS = 'ca-app-pub-5981152485884247/9463943629',
  KICK_PARTICIPANT_IOS = 'ca-app-pub-5981152485884247/6837780285',
  VIEW_PARTICIPANT_IOS = 'ca-app-pub-5981152485884247/6049396508',
  CREATE_EVENT_MD = 'ca-app-pub-5981152485884247/8738744842',
  JOIN_EVENT_MD = 'ca-app-pub-5981152485884247/4263209563',
  KICK_PARTICIPANT_MD = 'ca-app-pub-5981152485884247/8010882881',
  VIEW_PARTICIPANT_MD = 'ca-app-pub-5981152485884247/8226505307'
}

enum AdWatchMaxCount {
  CREATE_EVENT = 3,
  JOIN_EVENT = 999,
  KICK_PARTICIPANT = 1,
  VIEW_PARTICIPANT = 3
}
