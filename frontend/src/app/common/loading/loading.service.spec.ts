import {TestBed} from '@angular/core/testing';
import {LoadingService} from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  describe('initial state', () => {
    it('should not be loading initially', () => {
      expect(service.isLoading()).toBe(false);
    });
  });

  describe('increment', () => {
    it('should set isLoading to true after the first increment', () => {
      service.increment();

      expect(service.isLoading()).toBe(true);
    });

    it('should keep isLoading true when incremented multiple times', () => {
      service.increment();
      service.increment();

      expect(service.isLoading()).toBe(true);
    });
  });

  describe('decrement', () => {
    it('should set isLoading to false when the last request finishes', () => {
      service.increment();
      service.decrement();

      expect(service.isLoading()).toBe(false);
    });

    it('should keep isLoading true while there are still active requests', () => {
      service.increment();
      service.increment();
      service.decrement();

      expect(service.isLoading()).toBe(true);
    });

    it('should not go below zero when decremented without a prior increment', () => {
      service.decrement();
      service.increment();

      expect(service.isLoading()).toBe(true);
    });
  });
});
