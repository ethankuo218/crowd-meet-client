import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonItemSliding, RefresherCustomEvent } from '@ionic/angular';
import { Subject, firstValueFrom } from 'rxjs';
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

  eventId!: number;

  private joinerSubject: Subject<Participant[]> = new Subject();

  joiners$ = this.joinerSubject;

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

    console.log(result);
    this.joinerSubject.next(result.canView ? result.participants : []);
    if (event) {
      (event as RefresherCustomEvent).target.complete();
    }
  }

  async accept(id: number): Promise<void> {
    await this.eventService.accept(this.eventId, [id]);
    this.reload();
  }

  async decline(id: number): Promise<void> {
    await this.eventService.decline(this.eventId, [id]);
    this.reload();
  }

  async kick(slidingItem: IonItemSliding, id: number): Promise<void> {
    slidingItem.close();
    await this.eventService.kick(this.eventId, id);
    this.reload();
  }

  get eventStatus(): typeof EventStatus {
    return EventStatus;
  }
}
