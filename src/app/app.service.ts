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
  connectionUrls,
  createVersionMock,
  VersionInfo
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
      this.getVersion(bank, mockData).pipe(
        catchError((err: any) => of('')),
        map((v: VersionInfo) => v.build.version)
      ),
      this.getConnectionInfo(connectionUrls.databases, bank, mockData, 1).pipe(
        catchError((err: any) => of([new ConnectionInfo(err)]))
      ),
      this.getConnectionInfo(
        connectionUrls.connections,
        bank,
        mockData,
        3
      ).pipe(
        catchError((err: any) => of([new ConnectionInfo(err)]))
        ),
      this.getAuthData(bank, mockData).pipe(
        catchError(() => of(new AuthInfo()))
      ),
      this.getDevicesData(bank, mockData).pipe(catchError(e => of(e)))
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

  getVersion(bank: Bank, mockData?: boolean){
    if (mockData) {
      return createVersionMock();
    }

    return this.http.get<VersionInfo>(
      `${bank.baseUrl}/${connectionUrls.health}/${bank.code}/${connectionUrls.info}`
    );
  }

}
