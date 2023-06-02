import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, switchMap } from 'rxjs';
import { GetResult, Preferences } from '@capacitor/preferences';
import {
  FirebaseAuthentication,
  GetIdTokenResult,
} from '@capacitor-firebase/authentication';

@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  private urlPrefix: string = '/api/v1/';
  private isFirstLogin: boolean = true;

  constructor(private httpClient: HttpClient) {}

  removeToken(): void {
    Preferences.remove({ key: 'token' }).then();
  }

  post<T>(apiName: string, body: any): Observable<T> {
    if (this.isFirstLogin) {
      return from(FirebaseAuthentication.getIdToken()).pipe(
        switchMap((result: GetIdTokenResult): Observable<T> => {
          const token = 'Bearer ' + result.token;
          const headers = new HttpHeaders({
            Authorization: token,
          });

          Preferences.set({ key: 'token', value: token });
          this.isFirstLogin = false;

          return this.httpClient.post<T>(this.urlPrefix + apiName, body, {
            headers: headers,
          });
        })
      );
    } else {
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

  get<T>(apiName: string, id?: string): Observable<T> {
    if (this.isFirstLogin) {
      return from(FirebaseAuthentication.getIdToken()).pipe(
        switchMap((result: GetIdTokenResult): Observable<T> => {
          const token = 'Bearer ' + result.token;
          const headers = new HttpHeaders({
            Authorization: token,
          });

          Preferences.set({ key: 'token', value: token });
          this.isFirstLogin = false;

          return this.httpClient.get<T>(
            `${this.urlPrefix}${apiName}${id ? '/' + id : ''}`,
            {
              headers: headers,
            }
          );
        })
      );
    } else {
      return from(Preferences.get({ key: 'token' })).pipe(
        switchMap((result: GetResult): Observable<T> => {
          const token = result.value;
          const headers = new HttpHeaders({
            Authorization: token as string,
          });

          return this.httpClient.get<T>(
            `${this.urlPrefix}${apiName}${id ? '/' + id : ''}`,
            {
              headers: headers,
            }
          );
        })
      );
    }
  }

  patch<T>(apiName: string, body: any): Observable<T> {
    if (this.isFirstLogin) {
      return from(FirebaseAuthentication.getIdToken()).pipe(
        switchMap((result: GetIdTokenResult): Observable<T> => {
          const token = 'Bearer ' + result.token;
          const headers = new HttpHeaders({
            Authorization: token,
          });

          Preferences.set({ key: 'token', value: token });
          this.isFirstLogin = false;

          return this.httpClient.patch<T>(this.urlPrefix + apiName, body, {
            headers: headers,
          });
        })
      );
    } else {
      return from(Preferences.get({ key: 'token' })).pipe(
        switchMap((result: GetResult): Observable<T> => {
          const token = result.value;
          const headers = new HttpHeaders({
            Authorization: token as string,
          });

          return this.httpClient.patch<T>(this.urlPrefix + apiName, body, {
            headers: headers,
          });
        })
      );
    }
  }
}
