import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {NotificationMessage} from './notification-message';
import {Notification, NotificationType} from './notifications.model';

@Component({
  template: `<app-notification-message [notification]="notification" />`,
  imports: [NotificationMessage],
})
class TestHost {
  notification: Notification = {id: '1', message: 'Some message', type: NotificationType.Info};
}

describe('NotificationMessage', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  const getNotificationDiv = () =>
    fixture.debugElement.query(By.css('.notification')).nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('message', () => {
    it('should display the notification message text', () => {
      expect(getNotificationDiv().textContent?.trim()).toBe('Some message');
    });
  });

  describe('type', () => {
    it.each([
      {type: NotificationType.Info, expectedClass: 'info'},
      {type: NotificationType.Warning, expectedClass: 'warning'},
      {type: NotificationType.Error, expectedClass: 'error'},
    ])('should apply the "$expectedClass" CSS class for type $type', ({type, expectedClass}) => {
      host.notification = {id: '1', message: 'msg', type};
      fixture.detectChanges();

      expect(getNotificationDiv().classList).toContain(expectedClass);
    });
  });
});
