
import {User} from './user';

export class Prospect {
  id: number;
  guest_id: number;

  start: string;
  end: string;
  number_of_guests: number;
  number_of_children: number;
  number_of_pets: number;

  property_ids: number[];

  guest: any;

  getGuest(): User {
    return this['guest']['data'];
  }
}
