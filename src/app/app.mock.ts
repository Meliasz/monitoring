import { Observable, from, of } from 'rxjs';
import { ConnectionInfo, AuthInfo, VersionInfo } from './model/models';

const MockAuthInfoResponse: AuthInfo = {
  PENDING: Math.floor(Math.random() * (9505 - 1 + 1) + 1),
  ACCEPTED: Math.floor(Math.random() * (9505 - 1 + 1) + 1),
  DECLINED: Math.floor(Math.random() * (9505 - 1 + 1) + 1),
  SUCESS: Math.floor(Math.random() * (9505 - 1 + 1) + 1),
  ERROR: Math.floor(Math.random() * (9505 - 1 + 1) + 1),
  TIMEOUT: Math.floor(Math.random() * (9505 - 1 + 1) + 1),
  DEVICES: Math.floor(Math.random() * (9505 - 1 + 1) + 1)
};

const MockConnectionInfoResponse: ConnectionInfo = {
  url: 'http://somefakeurl'
};

export function createConnectionResponseMock(
  objectsQuantity: number  = 1
): Observable<ConnectionInfo[]> {
  const responseArray: Array<ConnectionInfo> = [];
  for (let i = 0; i < objectsQuantity; i++) {
    const evaluateStatus: number = Math.floor(
      Math.random() * (505 - 200 + 1) + 200
    );
    MockConnectionInfoResponse.status = evaluateStatus < 300 ? 'OK' : 'error';
    MockConnectionInfoResponse.errorMsg = evaluateStatus > 299 ? 'Some error msg' : null;
    MockConnectionInfoResponse.name = Math.random().toString(36).substring(7);
    responseArray.push(MockConnectionInfoResponse);
  }
  return from([responseArray]);
}

export function createAuthInfoMock(): Observable<AuthInfo> {
  return of(MockAuthInfoResponse);
}

export function createDeviceMock(): Observable<number> {
  return of(Math.floor(Math.random() * (50 - 1 + 1) + 1));
}

export function createVersionMock(): Observable<VersionInfo> {
  return of({ build: { version: 'Version xxxxxx' } });
}


