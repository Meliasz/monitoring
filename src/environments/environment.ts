import { Bank } from 'src/app/model/models';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const BANKS: Array<Bank> = [
  { bankName: 'kekeke', code: '5555', baseUrl: 'http://localhost' },
  { bankName: 'kekeke2', code: '1111', baseUrl: 'http://localhost' },
  { bankName: 'kekeke3', code: '2222', baseUrl: 'http://localhost' }
];

export const environment = {
  production: false,
  BANKS,
  INTERVAL: 1000000
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
