import {BookingGuest} from "./booking-guest";
import {User} from './user';
import {Listing} from './listing';
import {SecurityDeduction} from './security-deduction';
import {ScheduledMessage} from './scheduled-message';
import {BookingLog} from './booking-log';
import {Payment} from './payment';

/**
 * Created by piyushkantm on 06/07/17.
 */

export class Booking {
  id: number;
  type:string;
  property_id: number;
  guest_id: number;
  gue_id: number;
  owner_id:number;
  thread_id:number
  guest_full_name: string;


  airbnb_booking_id: string;
  homeaway_booking_id: string;
  confirmation_code: string;

  start: string;
  end: string;
  check_in_time: string;
  check_out_time: string;
  nights: string;

  number_of_guests: number;
  number_of_children: number;
  number_of_pets: number;

  is_inspected:boolean;
  is_clean:boolean;

  source: string;
  checked_in: boolean;
  instant_booked: boolean;

  security_deposit_fee: number;
  guest_channel_fee: number;
  base_amount: number;
  cc_process_fee: number;
  amount_to_pay: number;
  cleaning_fee: number;
  other_fee: any;
  subtotal_amount: number;
  channel_fee: number;
  payout_amount: number;
  total_tax: number;
  commission: number;
  owners_revenue: number;

  booking_notes: string;

  status: string;
  is_enquiry: boolean;
  payment_method: string;

  is_paid: boolean;
  total_paid: number;
  total_refunded: number;
  total_due: number;
  is_refunded: boolean;
  refunded_by_id: number;

  auto_review_enabled: boolean;
  alerts_enabled: boolean;

  created_at: string;
  updated_at: string;

  guest: any;
  guests: any;
  logs: any;
  payments: any;
  property: any;
  tasks: any;
  securityDeductions: any;
  scheduledMessages: any;

  showFull: boolean;

  getListing(): Listing {
    return this.property.data;
  }

  getGuest(): User {
    return this['guest']['data'];
  }

  getBookingGuests(): BookingGuest[] {
    return this['guests']['data'];
  }

  getBookingLogs(): BookingLog[] {
    return this['logs']['data'];
  }

  getTasks(): SecurityDeduction[] {
    return this['tasks']['data'];
  }

  getPayments(): Payment[] {
    return this['payments']['data'];
  }

  getSecurityDeductions(): SecurityDeduction[] {
    return this['securityDeductions']['data'];
  }

  getScheduledMessages(): ScheduledMessage[] {
    return this['scheduledMessages']['data'];
  }
}
