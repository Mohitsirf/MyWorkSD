import {Booking} from './booking';
import {OwnerBlock} from './owner-block';

export class MultiCalendar {
  [ id: number ]: {
    bookings: Booking[],
    blocks: OwnerBlock[]
  };
}
