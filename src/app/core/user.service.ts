import { ReferenceStateFacade } from './states/reference-state/reference.state.facade';
import { UserStateFacade } from './states/user-state/user.state.facade';
import { Observable, firstValueFrom, forkJoin, map, take, tap } from 'rxjs';
import { HttpClientService } from './http-client.service';
import { Injectable } from '@angular/core';
import {
  FileResponse,
  LoginResponse,
  ProfilePictureResponse
} from './models/core.model';
import { User } from './states/user-state/user.model';
import { Reference } from './states/reference-state/reference.model';

@Injectable({
  providedIn: 'root'
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
      this.httpClientService.get<Reference>('Reference')
    ]).pipe(
      map(([loginResult, referenceResult]): LoginResponse => {
        this.userStateFacade.storeUser({ userId: loginResult.userId });
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

  updateUserImage(file: FormData): Observable<FileResponse> {
    return this.httpClientService.post<FileResponse>('user/image', file);
  }

  async updateUserProfilePicture(file: FormData): Promise<void> {
    const fileName = (await firstValueFrom(this.updateUserImage(file)))
      .fileName;
    this.updateUser({ profilePicture: fileName }).subscribe({
      next: (result) => {
        this.userStateFacade.storeUser(result);
      }
    });
  }

  getProfilePictureUrls(ids: number[]) {
    // the api is like this /api/v1/user/profile-picture?userIds=1&userIds=2
    const params = ids.map((id) => `userIds=${id}`).join('&');
    return firstValueFrom(
      this.httpClientService.get<ProfilePictureResponse>(
        `user/profile-picture?${params}`
      )
    );
  }
}
