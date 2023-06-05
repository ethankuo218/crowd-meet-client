import { NgModule } from '@angular/core';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { AuthHelper } from './auth.helper';
import { UserStateFacade } from './states/user-state/user.state.facade';
import { ReferenceStateFacade } from './states/reference-state/reference.state.facade';

@NgModule({
  providers: [
    UserService,
    AuthService,
    AuthHelper,
    UserStateFacade,
    ReferenceStateFacade,
  ],
})
export class CoreModule {}
