import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HistoryHelperService {
  public previousUrl: string | undefined;

  constructor(private router: Router) {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
        this.previousUrl = urlAfterRedirects;
      });
  }
}
