import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventListData } from 'src/app/core/states/event-list-state/event-list.model';
import { EventService } from '../../core/event.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/components/alert-dialog/alert-dialog.component';
import { ToolDialogComponent } from 'src/app/components/tool-dialog/tool-dialog.component';
import { GoogleMapsLoaderService } from 'src/app/core/google-maps-loader.service';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-listing',
  templateUrl: './event-list.component.html',
  styleUrls: [
    './styles/event-list.component.scss',
    './styles/event-list.shell.scss'
  ]
})
export class EventListComponent {
  listing$: Observable<EventListData[]> = this.eventService
    .getEventList()
    .pipe(map((result) => result?.data));

  @ViewChild('searchInput', { read: IonInput })
  public searchElementRef!: IonInput;
  public search: string = '';

  constructor(
    private eventService: EventService,
    private googleMapsLoaderService: GoogleMapsLoaderService,
    private ngZone: NgZone
  ) {}
  ionViewWillEnter(): void {
    this.googleMapsLoaderService.load().then(async (placesService) => {
      const inputElement = await this.searchElementRef.getInputElement();
      const autocomplete = new google.maps.places.Autocomplete(inputElement);
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          console.log(place);
          this.search = place.formatted_address || '';
        });
      });
    });

    this.eventService.reloadEventList();
  }

  // NOTE: Ionic only calls ngOnDestroy if the page was popped (ex: when navigating back)
  // Since ngOnDestroy might not fire when you navigate from the current page, use ionViewWillLeave to cleanup Subscriptions
  ionViewWillLeave(): void {}
}
