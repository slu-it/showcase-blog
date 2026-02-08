import {Component, inject, Signal} from '@angular/core';
import {NotificationsService} from './notifications.service';
import {NotificationMessage} from './notification-message';
import {Notification} from './notifications.model';

@Component({
  selector: 'app-notifications-container',
  templateUrl: 'notifications-container.html',
  styleUrl: 'notifications-container.scss',
  imports: [NotificationMessage]
})
export class NotificationsContainer {
  private readonly notificationService = inject(NotificationsService);

  get getNotifications(): Signal<Notification[]> {
    return this.notificationService.notifications;
  }
}
