import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { IResolvedRouteData, ResolverHelper } from '../../utils/resolver-helper';
import { ListingModel } from './listing.model';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.page.html',
  styleUrls: [
    './styles/listing.page.scss',
    './styles/listing.shell.scss'
  ]
})
export class ListingPage implements OnInit {
  // Gather all component subscription in one place. Can be one Subscription or multiple (chained using the Subscription.add() method)
  subscriptions: Subscription | undefined;

  listing: ListingModel = new ListingModel();

  @HostBinding('class.is-shell') get isShell() {
    return (this.listing && this.listing.isShell) ? true : false;
  }

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.subscriptions = this.route.data
    .pipe(
      // Extract data for this page
      switchMap((resolvedRouteData) => {
        return ResolverHelper.extractData<ListingModel>(resolvedRouteData['data']['dataStore'], ListingModel);
      })
    )
    .subscribe({
      next: (state) => {
        this.listing = state;
      },
      error: (error) => console.log(error)
    });
  }

  // NOTE: Ionic only calls ngOnDestroy if the page was popped (ex: when navigating back)
  // Since ngOnDestroy might not fire when you navigate from the current page, use ionViewWillLeave to cleanup Subscriptions
  ionViewWillLeave(): void {
    this.subscriptions?.unsubscribe();
  }
}
