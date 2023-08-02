import { Component, inject } from '@angular/core';
import { Subject, firstValueFrom } from 'rxjs';
import { Participant } from '../models/event.model';
import { ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/core/event.service';
import { RefresherCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss']
})
export class ParticipantsComponent {
  private route = inject(ActivatedRoute);
  private eventService = inject(EventService);

  canView: boolean = false;

  private eventId!: number;

  private participantsSubject: Subject<Participant[]> = new Subject();

  participants$ = this.participantsSubject;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.eventId = params['id'];
      this.reload();
    });
  }

  async reload(event?: Event): Promise<void> {
    const result = await firstValueFrom(
      this.eventService.getParticipants(this.eventId)
    );

    this.participantsSubject.next(result.canView ? result.participants : []);
    if (event) {
      (event as RefresherCustomEvent).target.complete();
    }
  }

  unlock(): void {}
}
