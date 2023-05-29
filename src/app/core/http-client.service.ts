import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, switchMap } from 'rxjs';
import { GetResult, Preferences } from '@capacitor/preferences';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class HttpClientService {
  private urlPrefix: string = '/api/v1/';

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  removeToken(): void {
    Preferences.remove({ key: 'token' }).then();
  }

  post<T>(apiName: string, body: any): Observable<T> {
    return from(Preferences.get({ key: 'token' })).pipe(
      switchMap((result: GetResult): Observable<T> => {
        const token = result.value;
        const headers = new HttpHeaders({
          Authorization: token as string,
        });

        return this.httpClient.post<T>(this.urlPrefix + apiName, body, {
          headers: headers,
        });
      })
    );
  }
}
