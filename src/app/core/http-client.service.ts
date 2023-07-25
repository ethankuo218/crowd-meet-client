import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, from, of, switchMap } from 'rxjs';
import { GetResult, Preferences } from '@capacitor/preferences';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { environment } from 'src/environments/environment.dev';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../components/error-dialog/error-dialog.component';

@Injectable({ providedIn: 'root' })
export class HttpClientService {
  private httpClient = inject(HttpClient);
  private dialog = inject(MatDialog);

  private urlPrefix: string = environment.serverUrl;
  private timeStamp: number = 0;
  private expiredTime = 50 * 60 * 1000; // millisecond

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
        return this.httpClient
          .post<T>(this.urlPrefix + apiName, body, {
            headers: headers
          })
          .pipe(
            catchError((err) => {
              console.log(err.error);
              console.log(err.error.message);
              this.showErrorDialog(err.error.message);
              return of(err);
            })
          );
      })
    );
  }

  get<T>(apiName: string, parameter?: string | any): Observable<T> {
    return from(this.getIdToken()).pipe(
      switchMap((headers: HttpHeaders): Observable<T> => {
        let queryString = '';
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
                params: parameter,
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

  put<T>(apiName: string, body: any): Observable<T> {
    return from(this.getIdToken()).pipe(
      switchMap((headers: HttpHeaders): Observable<T> => {
        return this.httpClient.put<T>(this.urlPrefix + apiName, body, {
          headers: headers
        });
      })
    );
  }

  private showErrorDialog(errorMsg: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: {
        title: 'Oops!',
        content: errorMsg,
        enableCancelButton: false
      },
      panelClass: 'custom-dialog'
    });
  }
}
