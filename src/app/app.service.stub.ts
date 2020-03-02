import { AppService } from './app.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Bank, BankData, VersionInfo, ConnectionInfo, AuthInfo } from './model/models';
import { Observable, zip, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { createVersionMock, createDeviceMock, createAuthInfoMock, createConnectionResponseMock } from './app.mock';
import { Injectable } from '@angular/core';

@Injectable()
export class StubAppService extends AppService {
  readonly interval: number = 10000;

  constructor() {
    super({} as HttpClient);
  }

  getData(bank: Bank): Observable<BankData> {
    return zip(
      this.getVersionMock().pipe(
        catchError(() => of('')),
        map((v: VersionInfo) => v.build && v.build.version ? v.build.version : '')
      ),
      this.getConnectionInfoMock(1).pipe(
        catchError((err: HttpErrorResponse) => of([new ConnectionInfo(err)]))
      ),
      this.getConnectionInfoMock(3).pipe(
        catchError((err: HttpErrorResponse) => of([new ConnectionInfo(err)]))
      ),
      this.getAuthDataMock().pipe(
        catchError(() => of(new AuthInfo()))
      ),
      this.getDevicesDataMock().pipe(catchError(e => of(e)))
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

  getConnectionInfoMock(mocksQty?: number): Observable<ConnectionInfo[]> {
    return createConnectionResponseMock(mocksQty);
  }

  getAuthDataMock(): Observable<AuthInfo> {
    return createAuthInfoMock();
  }

  getDevicesDataMock(): Observable<number> {
    return createDeviceMock();
  }

  getVersionMock(): Observable<VersionInfo> {
    return createVersionMock();
  }

}
