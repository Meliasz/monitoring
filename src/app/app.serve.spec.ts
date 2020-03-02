/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppService } from './app.service';
import { StubAppService } from './app.service.stub';

describe('App service', () => {
  let service: AppService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: AppService,
          useClass: StubAppService
        }
      ]
    });

    service = TestBed.inject(AppService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('Shoud create service instance.', () => {
    expect(service).toBeTruthy();
  });



});