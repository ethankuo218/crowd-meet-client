import { NgModule } from '@angular/core';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { AuthHelper } from './auth.helper';
import { UserStateFacade } from './states/user-state/user.state.facade';
import { ReferenceStateFacade } from './states/reference-state/reference.state.facade';
import { EventListStateFacade } from './states/event-list-state/event-list.state.facade';

@NgModule({
  providers: [
    UserService,
    AuthService,
    AuthHelper,
    UserStateFacade,
    ReferenceStateFacade,
    EventListStateFacade
  ],
})
export class CoreModule {}
