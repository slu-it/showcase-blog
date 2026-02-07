import {TestBed} from '@angular/core/testing';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {NotificationsService} from './notifications.service';
import {NotificationType} from './notifications.model';

let uuidCounter = 0;
beforeEach(() => {
  uuidCounter = 0;
  Object.defineProperty(globalThis, 'crypto', {
    value: {randomUUID: () => `uuid-${uuidCounter++}`},
    writable: true,
  });
});

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
    });

    const translateService = TestBed.inject(TranslateService);
    translateService.setTranslation('en', {'msg.key': 'Translated message', 'other.key': 'Other message'});
    translateService.use('en');

    service = TestBed.inject(NotificationsService);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('publishInfo', () => {
    it('should add a notification with type Info', () => {
      service.publishInfo('msg.key');

      expect(service.notifications()).toEqual([
        expect.objectContaining({type: NotificationType.Info}),
      ]);
    });
  });

  describe('publishWarning', () => {
    it('should add a notification with type Warning', () => {
      service.publishWarning('msg.key');

      expect(service.notifications()).toEqual([
        expect.objectContaining({type: NotificationType.Warning}),
      ]);
    });
  });

  describe('publishError', () => {
    it('should add a notification with type Error', () => {
      service.publishError('msg.key');

      expect(service.notifications()).toEqual([
        expect.objectContaining({type: NotificationType.Error}),
      ]);
    });
  });

  describe('message translation', () => {
    it('should translate the message key when publishing', () => {
      service.publishInfo('msg.key');

      expect(service.notifications()[0].message).toBe('Translated message');
    });
  });

  describe('auto-removal', () => {
    it('should auto-remove the notification after 3 seconds', () => {
      service.publishInfo('msg.key');
      expect(service.notifications()).toHaveLength(1);

      jest.advanceTimersByTime(3000);

      expect(service.notifications()).toHaveLength(0);
    });
  });

  describe('unique ids', () => {
    it('should assign a unique id to each notification', () => {
      service.publishInfo('msg.key');
      service.publishInfo('other.key');

      const [first, second] = service.notifications();
      expect(first.id).not.toBe(second.id);
    });
  });
});
