import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Bank, BASE_URL, INTERVAL, BankData, createConnectionResponseMock,
  ConnectionInfo, createAuthInfoMock, AuthInfo, createDeviceMock, connectionUrls
} from './model/models';
import { Observable, throwError, of, zip } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// const httpOptions = {
//   headers: new HttpHeaders({
//     'Content-Type': 'application/json'
//   })
// };

@Injectable({
  providedIn: 'root'
})
export class AppService {
  readonly baseUrl: string = BASE_URL;
  readonly interval: number = INTERVAL;

  constructor(private http: HttpClient) { }

  getData(bank: Bank, mockData?: boolean): Observable<BankData> {
    return zip(
      this.getConnectionInfo(connectionUrls.databases, bank.code, mockData, 1).pipe(catchError((err: Error) => throwError(err.message))),
      this.getConnectionInfo(connectionUrls.connections, bank.code, mockData, 3).pipe(catchError((err: Error) => throwError(err.message))),
      this.getAuthData(bank.code, mockData).pipe(catchError(() => of(new AuthInfo()))),
      this.getDevicesData(bank.code, mockData).pipe(catchError((e) => of(e))),
    ).pipe(map(value => ({
      code: bank.code, bankName: bank.bankName, databaseInfo: value[0], connected: true,
      connectionInfo: value[1], stats: { ...value[2], DEVICES: typeof value[3] !== 'number' ? null : value[3] }
    }))
    );
  }

  getConnectionInfo(urlChunk: string, bankCode: string, mockData?: boolean, mocksQty?: number): Observable<ConnectionInfo[]> {
    if (mockData) {
      // return throwError(new Error('oops!'))
      return createConnectionResponseMock(mocksQty);
    }
    return this.http.get<ConnectionInfo[]>(`${BASE_URL}${connectionUrls.health}/${bankCode}/${urlChunk}`);
  }

  getAuthData(bankCode: string, mockData?: boolean): Observable<AuthInfo> {
    if (mockData) {
      // return throwError(new Error('oops!'))
      return createAuthInfoMock();
    }

    return this.http.get<AuthInfo>(`${BASE_URL}${connectionUrls.stats}/${bankCode}/${connectionUrls.auths}`);
  }

  getDevicesData(bankCode: string, mockData?: boolean) {
    if (mockData) {
      // return throwError(new Error('oops!'))
      return createDeviceMock();
    }

    return this.http.get<number>(`${BASE_URL}${connectionUrls.stats}/${bankCode}/${connectionUrls.devices}`);
  }

}
