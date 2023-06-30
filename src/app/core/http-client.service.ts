import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, of, switchMap } from 'rxjs';
import { GetResult, Preferences } from '@capacitor/preferences';
import {
  FirebaseAuthentication,
  GetIdTokenResult
} from '@capacitor-firebase/authentication';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  // private urlPrefix: string = 'https://127.0.0.1:3000/api/v1/';
  private urlPrefix: string =
    'https://crowd-meet-server-tpqol4vd2a-uc.a.run.app/api/v1/';

  private timeStamp: number = 0;
  private expiredTime = 50 * 60 * 1000; // millisecond

  constructor(private httpClient: HttpClient) {}

  private async storeToken(previousToken: string | null): Promise<string> {
    const token = `Bearer ${(await FirebaseAuthentication.getIdToken()).token}`;
    if (token !== previousToken) {
      Preferences.set({ key: 'token', value: token });
      this.timeStamp = Date.now();
    }

    return token;
  }

  private getIdToken(): Observable<HttpHeaders> {
    return from(Preferences.get({ key: 'token' })).pipe(
      switchMap(async (result: GetResult): Promise<HttpHeaders> => {
        const tokenExpired = Date.now() - this.timeStamp >= this.expiredTime;
        const token =
          result.value && !tokenExpired
            ? result.value
            : await this.storeToken(result.value);
        const headers = new HttpHeaders({
          Authorization: token
        });

        return headers;
      })
    );
  }

  post<T>(apiName: string, body: any): Observable<T> {
    return from(this.getIdToken()).pipe(
      switchMap((headers: HttpHeaders): Observable<T> => {
        return this.httpClient.post<T>(this.urlPrefix + apiName, body, {
          headers: headers
        });
      })
    );
  }

  get<T>(apiName: string, parameter?: string | any): Observable<T> {
    return from(this.getIdToken()).pipe(
      switchMap((headers: HttpHeaders): Observable<T> => {
        let queryString = '';

        if (typeof parameter !== 'string' && parameter) {
          for (const key in parameter) {
            queryString += `?${key}=${parameter[key]}`;
          }
        }

        return typeof parameter === 'string'
          ? this.httpClient.get<T>(
              `${this.urlPrefix}${apiName}${parameter ? '/' + parameter : ''}`,
              {
                headers: headers
              }
            )
          : this.httpClient.get<T>(
              `${this.urlPrefix}${apiName}${queryString}`,
              {
                headers: headers
              }
            );
      })
    );
  }

  patch<T>(apiName: string, body: any): Observable<T> {
    return from(this.getIdToken()).pipe(
      switchMap((headers: HttpHeaders): Observable<T> => {
        return this.httpClient.patch<T>(this.urlPrefix + apiName, body, {
          headers: headers
        });
      })
    );
  }

  delete<T>(apiName: string, id: number): Observable<T> {
    return from(this.getIdToken()).pipe(
      switchMap((headers: HttpHeaders): Observable<T> => {
        return this.httpClient.delete<T>(`${this.urlPrefix}${apiName}/${id}`, {
          headers: headers
        });
      })
    );
  }
}
