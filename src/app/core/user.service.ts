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
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private httpClientService: HttpClientService,
    private userStateFacade: UserStateFacade,
    private referenceStateFacade: ReferenceStateFacade,
    private router: Router
  ) {}

  login(): void {
    forkJoin([
      this.httpClientService.post<LoginResponse>('user', {}),
      this.httpClientService.get<Reference>('Reference')
    ]).subscribe(([loginResult, referenceResult]) => {
      this.referenceStateFacade.storeReference(referenceResult);
      this.getUserById(loginResult.userId).subscribe({
        next: (result) => {
          this.userStateFacade.storeUser(result);
        }
      });

      if (loginResult.isNewUser) {
        this.router.navigate(['walkthrough'], { replaceUrl: true });
      } else {
        this.router.navigate(['app'], { replaceUrl: true });
      }
    });
  }

  getUserById(id: number): Observable<User> {
    return this.httpClientService.get<User>(`user/${id}`);
  }

  async getCurrentUserProfile(): Promise<User> {
    const userId = (await firstValueFrom(this.userStateFacade.getUser()))
      .userId;
    const userInfo = await firstValueFrom(this.getUserById(userId));

    return userInfo;
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
      this.httpClientService.get<ProfilePictureResponse[]>(
        `user/profile-picture?${params}`
      )
    );
  }
}
