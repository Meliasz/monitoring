export const BANKS: Array<Bank> = [
  { bankName: 'kekeke', code: '5555', baseUrl: 'http://localhost' },
  { bankName: 'kekeke2', code: '1111', baseUrl: 'http://localhost' },
  { bankName: 'kekeke3', code: '2222', baseUrl: 'http://localhost' }
];

export const INTERVAL = 1000000; // in ms, 1 hour = 3600000 ms

export enum connectionUrls {
  databases = 'databases',
  connections = 'connections',
  auths = 'auths',
  devices = 'devices',
  stats = 'stats',
  health = 'health',
  info = 'info'
}

import { from, of, Observable } from 'rxjs';

export class ConnectionInfo {
  name?: string;
  status?: string;
  url?: string;
  errorMsg?: string;
  httpError?: boolean;
  constructor(fillWithMockData: boolean | any = false) {
    if (fillWithMockData && typeof fillWithMockData === 'boolean') {
      const evaluateStatus: number = Math.floor(
        Math.random() * (505 - 200 + 1) + 200
      );
      this.name = Math.random()
        .toString(36)
        .substring(7);
      this.status = evaluateStatus < 300 ? 'OK' : 'error';
      this.url = 'http://somefakeurl';
      this.errorMsg = evaluateStatus > 299 ? 'Some error msg' : null;
    }
    if (fillWithMockData && typeof fillWithMockData === 'object') {
      this.status =  fillWithMockData.status;
      this.errorMsg = fillWithMockData.message ? fillWithMockData.message : '';
      this.httpError = true;
    }
  }
}

export class AuthInfo {
  PENDING?: number;
  ACCEPTED?: number;
  DECLINED?: number;
  SUCESS?: number;
  ERROR?: number;
  TIMEOUT?: number;
  DEVICES?: number;
  constructor(fillWithMockData: boolean = false) {
    if (fillWithMockData) {
      this.ACCEPTED = Math.floor(Math.random() * (9505 - 1 + 1) + 1);
      this.PENDING = Math.floor(Math.random() * (9505 - 1 + 1) + 1);
      this.DECLINED = Math.floor(Math.random() * (9505 - 1 + 1) + 1);
      this.SUCESS = Math.floor(Math.random() * (9505 - 1 + 1) + 1);
      this.TIMEOUT = Math.floor(Math.random() * (9505 - 1 + 1) + 1);
      this.ERROR = Math.floor(Math.random() * (9505 - 1 + 1) + 1);
    }
  }
}

export interface Bank {
  bankName: string;
  code: string;
  baseUrl: string;
  connected?: boolean;
}

export interface VersionInfo{
  build:{
    version: string;
  }
}

export interface BankData extends Bank {
  databaseInfo?: Array<ConnectionInfo>;
  connectionInfo?: Array<ConnectionInfo>;
  stats?: AuthInfo;
  version?: string;
}

export function createConnectionResponseMock(
  objectsQuantity: number = 1
): Observable<ConnectionInfo[]> {
  const responseArray: Array<ConnectionInfo> = [];
  for (let i = 0; i < objectsQuantity; i++) {
    responseArray.push(new ConnectionInfo(true));
  }
  return from([responseArray]);
}

export function createAuthInfoMock(): Observable<AuthInfo> {
  return of(new AuthInfo(true));
}

export function createDeviceMock(): Observable<number> {
  return of(Math.floor(Math.random() * (50 - 1 + 1) + 1));
}

export function createVersionMock(): Observable<VersionInfo> {
  return of({build:{version: 'Version xxxxxx'}});
}
