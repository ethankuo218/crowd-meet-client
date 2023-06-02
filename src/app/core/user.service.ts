import { ReferenceStateFacade } from './states/reference-state/reference.state.facade';
import { UserStateFacade } from './states/user-state/user.state.facade';
import { Observable, forkJoin, map, tap } from 'rxjs';
import { HttpClientService } from './http-client.service';
import { Injectable } from '@angular/core';
import { FileResponse, LoginResponse } from './models/core.model';
import { User } from './states/user-state/user.model';
import { Reference } from './states/reference-state/reference.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private httpClientService: HttpClientService,
    private userStateFacade: UserStateFacade,
    private referenceStateFacade: ReferenceStateFacade
  ) {}

  login(): Observable<LoginResponse> {
    return forkJoin([
      this.httpClientService.post<LoginResponse>('user', {}),
      this.httpClientService.get<Reference>('Reference'),
    ]).pipe(
      map(([loginResult, referenceResult]): LoginResponse => {
        this.referenceStateFacade.storeReference(referenceResult);
        return loginResult;
      })
    );
  }

  getUserById(id: number): Observable<User> {
    return this.httpClientService.get<User>(`user/${id}`);
  }

  updateUser(body: any): Observable<User> {
    return this.httpClientService.patch<User>('user', body).pipe(
      tap((result: User) => {
        this.userStateFacade.storeUser(result);
      })
    );
  }

  updateUserImage(file: string): Observable<FileResponse> {
    return this.httpClientService.post<FileResponse>('user/image', {
      file: file,
    });
  }
}
