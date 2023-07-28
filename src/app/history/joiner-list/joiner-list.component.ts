import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, from, switchMap } from 'rxjs';
import { EventStatus } from 'src/app/core/+states/user-state/user.model';
import { EventService } from 'src/app/core/event.service';
import { Participant } from 'src/app/event/models/event.model';

@Component({
  selector: 'app-joiner-list',
  templateUrl: './joiner-list.component.html',
  styleUrls: ['./joiner-list.component.scss']
})
export class JoinerListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private eventService = inject(EventService);

  private eventId!: number;
  joiners$ = from(this.route.params).pipe(
    switchMap((params): Observable<Participant[]> => {
      this.eventId = params['id'];
      return this.eventService.getParticipants(params['id']);
    })
  );

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.eventId = params['id'];
    });
  }

  accept(id: number): void {
    this.eventService.accept(this.eventId, [id]).subscribe(() => {});
  }

  decline(id: number): void {
    this.eventService.decline(this.eventId, [id]).subscribe();
  }

  get eventStatus(): typeof EventStatus {
    return EventStatus;
  }
}
