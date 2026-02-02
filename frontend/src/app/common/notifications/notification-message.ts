import {Component, input} from '@angular/core';
import {Notification} from './notifications.model';

@Component({
  selector: 'app-notification-message',
  templateUrl: 'notification-message.html',
  styleUrl: 'notification-message.scss'
})
export class NotificationMessage {
  readonly notification = input.required<Notification>();
}
