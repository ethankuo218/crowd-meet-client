import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, from, switchMap } from 'rxjs';
import { EventService } from 'src/app/core/event.service';
import { Participant } from 'src/app/event/models/event.model';

@Component({
  selector: 'app-joiner-list',
  templateUrl: './joiner-list.component.html',
  styleUrls: ['./joiner-list.component.scss']
})
export class JoinerListComponent implements OnInit {
  private eventId!: number;
  joiners$ = from(this.route.params).pipe(
    switchMap((params): Observable<Participant[]> => {
      this.eventId = params['id'];
      return this.eventServive.getParticipants(params['id']);
    })
  );

  constructor(
    private route: ActivatedRoute,
    private eventServive: EventService
  ) {}

  ngOnInit() {}

  accept(id: number): void {
    this.eventServive.accept(this.eventId, [id]);
  }

  decline(id: number): void {
    this.eventServive.decline(this.eventId, [id]);
  }
}
