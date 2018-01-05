export class Alert {
  id: number;
  title: string;

  offset: string;
  offset_position: string;
  offset_reference: string;

  to:string;

  message: string;
  alert_type: string;
  property_ids: number[];

  send_via: string;
  is_active: boolean;
}
