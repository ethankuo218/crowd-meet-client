import { Component, OnInit } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { Participant } from '../models/event.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss']
})
export class ParticipantsComponent implements OnInit {
  participants$: Observable<Participant[]> = this.route.params.pipe(
    switchMap((params) => {
      return of(JSON.parse(params['participants']));
    })
  );

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {}
}
