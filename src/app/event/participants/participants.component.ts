import { Component, inject } from '@angular/core';
import { Subject, firstValueFrom, Observable } from 'rxjs';
import { Participant } from '../models/event.model';
import { ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/core/event.service';
import { RefresherCustomEvent } from '@ionic/angular';
import { User } from 'src/app/core/+states/user-state/user.model';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss']
})
export class ParticipantsComponent {
  private route = inject(ActivatedRoute);
  private eventService = inject(EventService);

  canView: boolean = true;

  private eventId!: number;

  participants: Participant[] = [];

  get creator(): User {
    return this.eventService.currentEventDetail?.creator!;
  }

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
    this.canView = result.canView;
    this.participants = result.canView ? result.participants : [];
    if (event) {
      (event as RefresherCustomEvent).target.complete();
    }
  }
}
