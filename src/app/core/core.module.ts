import { Crop } from '@ionic-native/crop/ngx';
import { NgModule } from '@angular/core';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { AuthHelper } from './auth.helper';
import { UserStateFacade } from './states/user-state/user.state.facade';
import { ReferenceStateFacade } from './states/reference-state/reference.state.facade';
import { EventListStateFacade } from './states/event-list-state/event-list.state.facade';
import { AgePipe } from './pipe/age.pipe';
import { ImgUploadService } from './img-upload.service';

@NgModule({
  providers: [
    UserService,
    AuthService,
    ImgUploadService,
    AuthHelper,
    UserStateFacade,
    ReferenceStateFacade,
    EventListStateFacade,
    Crop
  ],
  declarations: [AgePipe],
  exports: [AgePipe]
})
export class CoreModule {}
