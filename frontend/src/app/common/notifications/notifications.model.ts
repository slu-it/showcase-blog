export interface Notification {
  id: string;
  message: string
  type: NotificationType
}

export enum NotificationType {
  Info = "info",
  Warning = "warning",
  Error = "error"
}
