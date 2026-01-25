import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';

import {Backend} from './backend';
import {HelloResponse} from './backend.model';

describe('Backend', () => {
  let service: Backend;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(Backend);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should send GET request to /api/hello', () => {
      const mockResponse: HelloResponse = {message: 'Hello user!'};

      service.get().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/api/hello');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('post', () => {
    it('should send POST request to /api/hello with request body', () => {
      const mockResponse: HelloResponse = {message: 'Hello World, from user: testuser'};

      service.post('World').subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/api/hello');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({name: 'World'});
      req.flush(mockResponse);
    });
  });
});
