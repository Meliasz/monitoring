export const BANKS: Array<Bank> = [
  { bankName: 'kekeke', code: '5555' },
  { bankName: 'kekeke2', code: '1111' },
  { bankName: 'kekeke3', code: '2222' }
];

export const BASE_URL = 'http://localhost:8055/mobilehub/health/';

export const INTERVAL = 3600000; // in ms, 1 hour = 3600000 ms

export enum connectionUrls {
  databases = 'databases',
  connections = 'connections',
  auths = 'auths',
  devices = 'devices'
}

import { from, of, Observable } from 'rxjs';

export class ConnectionInfo {
  name: string;
  status: string;
  url: string;
  errorMsg?: string;
  constructor(fillWithMockData: boolean = false) {
    if (fillWithMockData) {
      const evaluateStatus: number = Math.floor(Math.random() * (505 - 200 + 1) + 200);
      this.name = Math.random().toString(36).substring(7);
      this.status = evaluateStatus < 300 ? 'OK' : 'error';
      this.url = 'http://somefakeurl';
      this.errorMsg = evaluateStatus > 299 ? 'Some error msg' : null;
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
  connected?: boolean;
}

export interface BankData extends Bank {
  databaseInfo: Array<ConnectionInfo>;
  connectionInfo: Array<ConnectionInfo>;
  stats?: AuthInfo;
}

export function createConnectionResponseMock(objectsQuantity: number = 1): Observable<ConnectionInfo[]> {
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
