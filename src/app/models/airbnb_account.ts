
export class AirbnbAccount {
  first_name: boolean;
  last_name: boolean;
  location: boolean;
  verifications: string[];
  pic_thumb_url: string;
  pic_original_url: string;

  id: number;
  owner_id: number;
  airbnb_account_id: number;

  forwarding_email: string;

  reservation_confirmation: boolean;
  reservation_requests: boolean;
  inquiries: boolean;
  reminders: boolean;
  reviews: boolean;
  emails_from_guests: boolean;

  airbnb_username: string;
  airbnb_password: string;
  access_token: string;
  airlock_id: string;
  airbnb_connected: boolean;
}
