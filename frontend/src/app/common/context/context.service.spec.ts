import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';
import {ContextService} from './context.service';
import {Context} from './context.model';

describe('ContextService', () => {
  let service: ContextService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ContextService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  describe('refresh', () => {
    it('should update the user signal when refresh is called', async () => {
      const first: Context = {user: {username: 'alice', isAuthor: true, isAdmin: false}};
      const second: Context = {user: {username: 'bob', isAuthor: false, isAdmin: true}};

      const firstPromise = service.refresh();
      httpTesting.expectOne('/api/context').flush(first);
      await firstPromise;

      expect(service.user()).toEqual({username: 'alice', isAuthor: true, isAdmin: false});

      const secondPromise = service.refresh();
      httpTesting.expectOne('/api/context').flush(second);
      await secondPromise;

      expect(service.user()).toEqual({username: 'bob', isAuthor: false, isAdmin: true});
    });
  });
});
