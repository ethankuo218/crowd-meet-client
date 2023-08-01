import { FcmTokenService } from './fcm-token.service';
import { InAppPurchaseService } from './in-app-purchase.service';
import { ReferenceStateFacade } from './+states/reference-state/reference.state.facade';
import { UserStateFacade } from './+states/user-state/user.state.facade';
import {
  Observable,
  firstValueFrom,
  forkJoin,
  map,
  tap,
  throwError
} from 'rxjs';
import { HttpClientService } from './http-client.service';
import { Injectable, inject } from '@angular/core';
import { LoginResponse, ProfilePictureResponse } from './models/core.model';
import { Image, User, UserEvent } from './+states/user-state/user.model';
import { Reference } from './+states/reference-state/reference.model';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Injectable({ providedIn: 'root' })
export class UserService {
  private httpClientService = inject(HttpClientService);
  private userStateFacade = inject(UserStateFacade);
  private referenceStateFacade = inject(ReferenceStateFacade);
  private router = inject(Router);
  private storage = inject(Storage);
  private inAppPurchaseService = inject(InAppPurchaseService);
  private fcmTokenService = inject(FcmTokenService);
  private _isLoading: boolean = false;

  get isLoading(): boolean {
    return this._isLoading;
  }

  login(): void {
    forkJoin([
      this.httpClientService.post<LoginResponse>('user', {}),
      this.httpClientService.get<Reference>('Reference')
    ]).subscribe(([loginResult, referenceResult]) => {
      this.referenceStateFacade.storeReference(referenceResult);
      this.inAppPurchaseService.initialInAppPurchase(loginResult.userId);
      this.getUserById(loginResult.userId).subscribe({
        next: async (result) => {
          const isNewUser = await this.storage.get('isNewUser');
          this.userStateFacade.storeUser(result);
          if (isNewUser === null) {
            this.storage.set('isNewUser', true);
            this.router.navigate(['auth/walkthrough'], {
              replaceUrl: true
            });
          } else {
            this.router.navigate(isNewUser ? ['auth/walkthrough'] : ['app'], {
              replaceUrl: true
            });
          }
          this.fcmTokenService.register();
        }
      });
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

  updateUser(body: any): void {
    this.httpClientService.patch<User>('user', body).subscribe({
      next: (result: User) => {
        this.userStateFacade.storeUser({
          userId: result.userId,
          email: result.email,
          name: result.name,
          profilePictureUrl: result.profilePictureUrl,
          bio: result.bio,
          interests: result.interests
        });
      },
      error: (err) => throwError(() => err)
    });
  }

  updateUserImage(body: FormData): void {
    this.httpClientService.post<Image[]>('user/image', body).subscribe({
      next: (result) => {
        this.userStateFacade.storeUser({ images: result });
      }
    });
  }

  deletePhoto(id: number) {
    return this.httpClientService.delete<Image[]>('user/image', id);
  }

  patchUserImageOrder(order: number[]): Observable<Image[]> {
    return this.httpClientService
      .patch<Image[]>('user/image/order', {
        newOrder: order
      })
      .pipe(
        tap((result: Image[]) => {
          this.userStateFacade.storeUser({
            profilePictureUrl: result[0].url,
            images: result
          });
        })
      );
  }

  getProfilePictureUrls(ids: number[]) {
    // the api is like this /api/v1/user/profile-picture?userIds=1&userIds=2
    const params = ids.map((id) => `userIds=${id}`).join('&');
    return this.httpClientService
      .get<ProfilePictureResponse>(`user/profile-picture?${params}`)
      .pipe(map((resp) => resp.images));
  }

  getEvents(): Observable<UserEvent[]> {
    return this.userStateFacade.getUserEvents();
  }

  async reloadUserEvents(): Promise<void> {
    this._isLoading = true;
    const userId = (await firstValueFrom(this.userStateFacade.getUser()))
      .userId;
    this.httpClientService.get<UserEvent[]>(`user/${userId}/events`).subscribe({
      next: (result) => {
        this._isLoading = false;
        this.userStateFacade.storeUserEvents(result);
      }
    });
  }
}
