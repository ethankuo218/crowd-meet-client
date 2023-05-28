import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import {
  IResolvedRouteData,
  ResolverHelper,
} from '../../utils/resolver-helper';

import { ProfileModel } from './profile.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./styles/profile.page.scss', './styles/profile.shell.scss'],
})
export class ProfilePage implements OnInit {
  // ? Gather all component subscription in one place. Can be one Subscription or multiple (chained using the Subscription.add() method)
  subscriptions: Subscription | undefined;
  user: ProfileModel | undefined;

  @HostBinding('class.is-shell') get isShell() {
    return this.user && this.user.isShell ? true : false;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.subscriptions = this.route.data
      .pipe(
        // ? Extract data for this page
        switchMap((resolvedRouteData) => {
          return ResolverHelper.extractData<ProfileModel>(
            resolvedRouteData['data'],
            ProfileModel
          );
        })
      )
      .subscribe({
        next: (state) => {
          this.user = state;
        },
        error: (error) => console.log(error),
      });
  }

  public async signOut(): Promise<void> {
    try {
      // * 1. Sign out on the native layer
      await this.authService
        .signOut()
        .then((result) => {
          // ? Sign-out successful
          // ? Replace state as we are no longer authorized to access profile page
          this.router.navigate(['auth/sign-in'], { replaceUrl: true });
        })
        .catch((error) => {
          console.log('userProfile - signOut() - error', error);
        });
    } finally {
      console.log('userProfile - signOut() - finally');
    }
  }

  // ? NOTE: Ionic only calls ngOnDestroy if the page was popped (ex: when navigating back)
  // ? Since ngOnDestroy might not fire when you navigate from the current page, use ionViewWillLeave to cleanup Subscriptions
  ionViewWillLeave(): void {
    this.subscriptions?.unsubscribe();
  }
}
