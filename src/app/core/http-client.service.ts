import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, of, switchMap } from 'rxjs';
import { GetResult, Preferences } from '@capacitor/preferences';
import {
  FirebaseAuthentication,
  GetIdTokenResult,
} from '@capacitor-firebase/authentication';

@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  // private urlPrefix: string = '/api/v1/';
  private urlPrefix: string =
    'https://crowd-meet-server-tpqol4vd2a-uc.a.run.app/api/v1/';

  constructor(private httpClient: HttpClient) {}

  private getIdToken() {
    return from(Preferences.get({ key: 'token' })).pipe(
      switchMap(async (result: GetResult): Promise<HttpHeaders> => {
        const token = result.value
          ? result.value
          : `Bearer ${(await FirebaseAuthentication.getIdToken()).token}`;

        const headers = new HttpHeaders({
          Authorization: token,
        });

        Preferences.set({ key: 'token', value: token });

        return headers;
      })
    );
  }

  post<T>(apiName: string, body: any): Observable<T> {
    return from(this.getIdToken()).pipe(
      switchMap((headers: HttpHeaders): Observable<T> => {
        return this.httpClient.post<T>(this.urlPrefix + apiName, body, {
          headers: headers,
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
                headers: headers,
              }
            )
          : this.httpClient.get<T>(
              `${this.urlPrefix}${apiName}${queryString}`,
              {
                headers: headers,
              }
            );
      })
    );
  }

  patch<T>(apiName: string, body: any): Observable<T> {
    return from(this.getIdToken()).pipe(
      switchMap((headers: HttpHeaders): Observable<T> => {
        return this.httpClient.patch<T>(this.urlPrefix + apiName, body, {
          headers: headers,
        });
      })
    );
  }
}
