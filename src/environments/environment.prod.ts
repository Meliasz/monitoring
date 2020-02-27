import { Bank } from 'src/app/model/models';

const BANKS: Array<Bank> = [
  { bankName: 'kekeke', code: '5555', baseUrl: 'http://localhost' },
  { bankName: 'kekeke2', code: '1111', baseUrl: 'http://localhost' },
  { bankName: 'kekeke3', code: '2222', baseUrl: 'http://localhost' }
];

export const environment = {
  production: true,
  BANKS,
  INTERVAL: 1000000
};
