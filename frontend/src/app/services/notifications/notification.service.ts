import {inject, Injectable, signal} from '@angular/core';
import {Notification, NotificationType} from './notification.model';
import {TranslateService} from '@ngx-translate/core';

@Injectable({providedIn: 'root'})
export class NotificationService {
  private translate = inject(TranslateService);
  private nextId = 0;
  notifications = signal<Notification[]>([]);

  publishInfo(messageKey: string) {
    this.publish(messageKey, NotificationType.Info);
  }

  publishWarning(messageKey: string) {
    this.publish(messageKey, NotificationType.Warning);
  }

  publishError(messageKey: string) {
    this.publish(messageKey, NotificationType.Error);
  }

  private publish(messageKey: string, type: NotificationType) {
    const id = this.nextId++;
    const message = this.translate.instant(messageKey);
    this.notifications.update(list => [...list, {id, message, type}]);
    setTimeout(() => {
      this.notifications.update(list => list.filter(n => n.id !== id));
    }, 3000);
  }
}
