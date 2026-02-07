import {ComponentFixture, TestBed} from '@angular/core/testing';
import {signal} from '@angular/core';
import {By} from '@angular/platform-browser';
import {NotificationsContainer} from './notifications-container';
import {NotificationsService} from './notifications.service';
import {NotificationMessage} from './notification-message';
import {Notification, NotificationType} from './notifications.model';

describe('NotificationsContainer', () => {
  let fixture: ComponentFixture<NotificationsContainer>;
  const notifications = signal<Notification[]>([]);

  const getNotificationMessages = () =>
    fixture.debugElement.queryAll(By.directive(NotificationMessage));

  beforeEach(async () => {
    notifications.set([]);

    await TestBed.configureTestingModule({
      imports: [NotificationsContainer],
      providers: [
        {provide: NotificationsService, useValue: {notifications: notifications.asReadonly()}},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsContainer);
    fixture.detectChanges();
  });

  it('should render nothing when there are no notifications', () => {
    expect(getNotificationMessages()).toHaveLength(0);
  });

  it('should render a notification-message for each notification in the service', () => {
    notifications.set([
      {id: '1', message: 'First', type: NotificationType.Info},
      {id: '2', message: 'Second', type: NotificationType.Warning},
    ]);
    fixture.detectChanges();

    expect(getNotificationMessages()).toHaveLength(2);
  });
});
