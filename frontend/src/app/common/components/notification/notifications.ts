import {Component, inject} from '@angular/core';
import {NotificationService} from '../../../services/notifications/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  templateUrl: 'notifications.html',
  styleUrl: 'notifications.scss'
})
export class Notifications {
  protected notificationService = inject(NotificationService);
}
