import {inject, Injectable, signal} from '@angular/core';
import {Notification, NotificationType} from './notifications.model';
import {TranslateService} from '@ngx-translate/core';

@Injectable({providedIn: 'root'})
export class NotificationsService {

  private readonly translate = inject(TranslateService);

  private readonly _notifications = signal<Notification[]>([]);
  readonly notifications = this._notifications.asReadonly();

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
    const id = crypto.randomUUID();
    const message = this.translate.instant(messageKey);

    this.addNotification({id, message, type});
    setTimeout(() => this.removeNotificationById(id), 3000);
  }

  private addNotification(notification: Notification) {
    this._notifications.update(list => [...list, notification]);
  }

  private removeNotificationById(id: string) {
    this._notifications.update(list => list.filter(n => n.id !== id));
  }
}
