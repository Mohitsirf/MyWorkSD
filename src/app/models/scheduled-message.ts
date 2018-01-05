export class ScheduledMessage {

  id: number;
  booking_id: number;
  alert_id: number;

  title: string;
  due_time: string;
  message: string;
  send_via: string;
  is_active: boolean;
  to: string;
  sent: boolean;
}
