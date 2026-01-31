export interface Notification {
  id: number;
  message: string
  type: NotificationType
}

export enum NotificationType {
  Info = "info",
  Warning = "warning",
  Error = "error"
}
