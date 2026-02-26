import {TestBed} from '@angular/core/testing';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {HttpClient} from '@angular/common/http';
import {loadingInterceptor} from './loading.interceptor';
import {LoadingService} from './loading.service';

describe('loadingInterceptor', () => {
  let httpTesting: HttpTestingController;
  let httpClient: HttpClient;
  let loadingService: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([loadingInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    httpTesting = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    loadingService = TestBed.inject(LoadingService);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should set isLoading to true while the request is in flight', () => {
    httpClient.get('/api/test').subscribe();

    expect(loadingService.isLoading()).toBe(true);

    httpTesting.expectOne('/api/test').flush({});
  });

  it('should set isLoading to false after the request completes', () => {
    httpClient.get('/api/test').subscribe();
    httpTesting.expectOne('/api/test').flush({});

    expect(loadingService.isLoading()).toBe(false);
  });

  it('should set isLoading to false after a request error', () => {
    httpClient.get('/api/test').subscribe({error: () => {}});
    httpTesting.expectOne('/api/test').flush('error', {status: 500, statusText: 'Internal Server Error'});

    expect(loadingService.isLoading()).toBe(false);
  });

  it('should keep isLoading true while multiple requests are in flight', () => {
    httpClient.get('/api/first').subscribe();
    httpClient.get('/api/second').subscribe();

    httpTesting.expectOne('/api/first').flush({});

    expect(loadingService.isLoading()).toBe(true);

    httpTesting.expectOne('/api/second').flush({});

    expect(loadingService.isLoading()).toBe(false);
  });
});
