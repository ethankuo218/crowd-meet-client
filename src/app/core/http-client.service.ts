import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  Observable,
  catchError,
  from,
  of,
  retry,
  switchMap,
  throwError
} from 'rxjs';
import { GetResult, Preferences } from '@capacitor/preferences';
import { environment } from 'src/environments/environment.dev';
import { ErrorDialogComponent } from '../components/error-dialog/error-dialog.component';
import { Auth } from '@angular/fire/auth';
import { ToastMsgService } from './toast-msg.service';

@Injectable({ providedIn: 'root' })
export class HttpClientService {
  private httpClient = inject(HttpClient);
  private auth = inject(Auth);
  private toastMsgService = inject(ToastMsgService);

  private urlPrefix: string = environment.serverUrl;
  private timeStamp: number = 0;
  private expiredTime = 50 * 60 * 1000; // millisecond

  constructor() {
    Preferences.remove({ key: 'token' });
  }

  private async storeToken(): Promise<string> {
    const idToken = await this.auth.currentUser?.getIdToken(true);

    if (!idToken) {
      throw new Error('No current user');
    }

    const token = `Bearer ${idToken}`;
    if (idToken && token) {
      await Preferences.set({ key: 'token', value: token });
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
            : await this.storeToken();
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
        const requestUrl = this.urlPrefix + apiName;
        return this.httpClient
          .post<T>(requestUrl, body, {
            headers: headers
          })
          .pipe(
            retry(2),
            catchError((err) => {
              this.showErrorDialog(err.error.message);
              console.error(`${requestUrl}: ${err.error.message}`);
              return throwError(() => err);
            })
          );
      })
    );
  }

  get<T>(apiName: string, parameter?: string | any): Observable<T> {
    return from(this.getIdToken()).pipe(
      switchMap((headers: HttpHeaders): Observable<T> => {
        let queryString = '';
        const requestUrl =
          typeof parameter === 'string'
            ? `${this.urlPrefix}${apiName}${parameter ? '/' + parameter : ''}`
            : `${this.urlPrefix}${apiName}${queryString}`;

        return this.httpClient
          .get<T>(requestUrl, {
            headers: headers,
            params: typeof parameter === 'string' ? undefined : parameter
          })
          .pipe(
            retry(2),
            catchError((err) => {
              this.showErrorDialog(err.error.message);
              console.error(`${requestUrl}: ${err.error.message}`);
              return throwError(() => err);
            })
          );
      })
    );
  }

  patch<T>(apiName: string, body: any): Observable<T> {
    return from(this.getIdToken()).pipe(
      switchMap((headers: HttpHeaders): Observable<T> => {
        const requestUrl = this.urlPrefix + apiName;
        return this.httpClient
          .patch<T>(requestUrl, body, {
            headers: headers
          })
          .pipe(
            retry(2),
            catchError((err) => {
              this.showErrorDialog(err.error.message);
              console.error(`${requestUrl}: ${err.error.message}`);
              return throwError(() => err);
            })
          );
      })
    );
  }

  delete<T>(apiName: string, id?: number): Observable<T> {
    return from(this.getIdToken()).pipe(
      switchMap((headers: HttpHeaders): Observable<T> => {
        const requestUrl = id
          ? `${this.urlPrefix}${apiName}/${id}`
          : `${this.urlPrefix}${apiName}`;
        return this.httpClient
          .delete<T>(requestUrl, {
            headers: headers
          })
          .pipe(
            retry(2),
            catchError((err) => {
              this.showErrorDialog(err.error.message);
              console.error(`${requestUrl}: ${err.error.message}`);
              return throwError(() => err);
            })
          );
      })
    );
  }

  put<T>(apiName: string, body: any): Observable<T> {
    return from(this.getIdToken()).pipe(
      switchMap((headers: HttpHeaders): Observable<T> => {
        const requestUrl = this.urlPrefix + apiName;
        return this.httpClient
          .put<T>(requestUrl, body, {
            headers: headers
          })
          .pipe(
            retry(2),
            catchError((err) => {
              this.showErrorDialog(err.error.message);
              console.error(`${requestUrl}: ${err.error.message}`);
              return throwError(() => err);
            })
          );
      })
    );
  }

  private showErrorDialog(errorMsg: string) {
    this.toastMsgService.presentToast(errorMsg);
  }
}
