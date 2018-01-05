import {User} from './user';
import {Booking} from './booking';

export class SecurityDeduction {
  id: number;
  admin_id: number;
  booking_id: number;
  amount: number;
  description: string;

  created_at: string;
  updated_at: string;

  getAdmin(): User {
    return this['admin']['data'];
  }

  getBooking(): Booking {
    return this['booking']['data'];
  }
}
