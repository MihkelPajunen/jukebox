export interface Notification {
  id: string;
  type: 'is-success' | 'is-warning' | 'is-danger';
  message: string;
}
