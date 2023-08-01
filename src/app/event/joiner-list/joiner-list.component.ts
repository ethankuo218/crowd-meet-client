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

  private eventId!: number;

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
    this.joinerSubject.next(result);
    if (event) {
      (event as RefresherCustomEvent).target.complete();
    }
  }

  accept(id: number): void {
    this.eventService.accept(this.eventId, [id]).subscribe(() => {
      this.reload();
    });
  }

  decline(id: number): void {
    this.eventService.decline(this.eventId, [id]).subscribe(() => {
      this.reload();
    });
  }

  kick(slidingItem: IonItemSliding, id: number): void {
    slidingItem.close();
    this.eventService.decline(this.eventId, [id]).subscribe(() => {
      this.reload();
    });
  }

  get eventStatus(): typeof EventStatus {
    return EventStatus;
  }
}
