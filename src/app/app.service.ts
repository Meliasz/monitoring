import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  Bank,
  BankData,
  ConnectionInfo,
  AuthInfo,
  connectionUrls,
  VersionInfo
} from './model/models';
import { Observable, of, zip } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  readonly interval: number = environment.INTERVAL;

  constructor(private http: HttpClient) { }

  getData(bank: Bank): Observable<BankData> {
    return zip(
      this.getVersionMock(bank).pipe(
        catchError(() => of('')),
        map((v: VersionInfo) => v.build && v.build.version ? v.build.version : '')
      ),
      this.getConnectionInfo(connectionUrls.databases, bank).pipe(
        catchError((err: HttpErrorResponse) => of([new ConnectionInfo(err)]))
      ),
      this.getConnectionInfo(connectionUrls.connections, bank).pipe(
        catchError((err: HttpErrorResponse) => of([new ConnectionInfo(err)]))
      ),
      this.getAuthDataMock(bank).pipe(
        catchError(() => of(new AuthInfo()))
      ),
      this.getDevicesDataMock(bank).pipe(catchError(e => of(e)))
    ).pipe(
      map(value => ({
        code: bank.code,
        version: value[0],
        bankName: bank.bankName,
        databaseInfo: value[1],
        connected: value[1] && value[2] && !value[1].find(e => e.httpError) && !value[2].find(e => e.httpError) ? true : false,
        baseUrl: bank.baseUrl,
        connectionInfo: value[2],
        stats: {
          ...value[3],
          ...(typeof value[4] !== 'number'
            ? {}
            : { DEVICES: value[4] })
        }
      }))
    );
  }

  getConnectionInfo(
    urlChunk: string,
    bank: Bank,
  ): Observable<ConnectionInfo[]> {
    return this.http.get<ConnectionInfo[]>(
      `${bank.baseUrl}/${connectionUrls.health}/${bank.code}/${urlChunk}`
    );
  }

  getAuthDataMock(bank: Bank): Observable<AuthInfo> {
    return this.http.get<AuthInfo>(
      `${bank.baseUrl}/${connectionUrls.stats}/${bank.code}/${connectionUrls.auths}`
    );
  }

  getDevicesDataMock(bank: Bank) {
    return this.http.get<number>(
      `${bank.baseUrl}/${connectionUrls.stats}/${bank.code}/${connectionUrls.devices}`
    );
  }

  getVersionMock(bank: Bank) {
    return this.http.get<VersionInfo>(
      `${bank.baseUrl}/${connectionUrls.health}/${bank.code}/${connectionUrls.info}`
    );
  }

}
