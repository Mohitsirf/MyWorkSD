
import {Booking} from './booking';

export class Payment{
  id: number;
  booking_id: number;
  amount: number;
  description: string;
  method: string;
  stripe_charge_id: string;
  is_paid: boolean;
  paid_on: string;

  booking:any;

  getBooking(): Booking {
    return this['booking']['data'];
  }
}
