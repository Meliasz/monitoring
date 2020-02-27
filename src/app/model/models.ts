import { HttpErrorResponse } from '@angular/common/http';

export enum connectionUrls {
  databases = 'databases',
  connections = 'connections',
  auths = 'auths',
  devices = 'devices',
  stats = 'stats',
  health = 'health',
  info = 'info'
}

export class ConnectionInfo {
  name?: string;
  status?: string | number;
  url?: string;
  errorMsg?: string;
  httpError?: boolean;
  constructor(err: HttpErrorResponse) {
    if (err) {
      this.status = err.status;
      this.errorMsg = err.message ? err.message : '';
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
}

export interface Bank {
  bankName: string;
  code: string;
  baseUrl: string;
  connected?: boolean;
}

export interface VersionInfo {
  build: {
    version: string;
  };
}

export interface BankData extends Bank {
  databaseInfo?: Array<ConnectionInfo>;
  connectionInfo?: Array<ConnectionInfo>;
  stats?: AuthInfo;
  version?: string;
}
