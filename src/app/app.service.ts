import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Bank,
  INTERVAL,
  BankData,
  createConnectionResponseMock,
  ConnectionInfo,
  createAuthInfoMock,
  AuthInfo,
  createDeviceMock,
  connectionUrls
} from './model/models';
import { Observable, of, zip } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  readonly interval: number = INTERVAL;

  constructor(private http: HttpClient) {}

  getData(bank: Bank, mockData?: boolean): Observable<BankData> {
    return zip(
      this.getConnectionInfo(connectionUrls.databases, bank, mockData, 3).pipe(
        catchError((err: Error) => of(null))
      ),
      this.getConnectionInfo(
        connectionUrls.connections,
        bank,
        mockData,
        3
      ).pipe(catchError((err: Error) => of(null))),
      this.getAuthData(bank, mockData).pipe(
        catchError(() => of(new AuthInfo()))
      ),
      this.getDevicesData(bank, mockData).pipe(catchError(e => of(e)))
    ).pipe(
      map(value => ({
        code: bank.code,
        bankName: bank.bankName,
        databaseInfo: value[0],
        connected: value[0] && value[1] ? true : false,
        baseUrl: bank.baseUrl,
        connectionInfo: value[1],
        stats: {
          ...value[2],
          ...(typeof value[3] !== 'number'
            ? {}
            : { DEVICES: value[3] })
        }
      }))
    );
  }

  getConnectionInfo(
    urlChunk: string,
    bank: Bank,
    mockData?: boolean,
    mocksQty?: number
  ): Observable<ConnectionInfo[]> {
    if (mockData) {
      return createConnectionResponseMock(mocksQty);
    }
    return this.http.get<ConnectionInfo[]>(
      `${bank.baseUrl}/${connectionUrls.health}/${bank.code}/${urlChunk}`
    );
  }

  getAuthData(bank: Bank, mockData?: boolean): Observable<AuthInfo> {
    if (mockData) {
      return createAuthInfoMock();
    }

    return this.http.get<AuthInfo>(
      `${bank.baseUrl}/${connectionUrls.stats}/${bank.code}/${connectionUrls.auths}`
    );
  }

  getDevicesData(bank: Bank, mockData?: boolean) {
    if (mockData) {
      return createDeviceMock();
    }

    return this.http.get<number>(
      `${bank.baseUrl}/${connectionUrls.stats}/${bank.code}/${connectionUrls.devices}`
    );
  }
}
