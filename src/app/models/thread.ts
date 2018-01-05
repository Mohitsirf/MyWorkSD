
import {Booking} from './booking';
import {User} from './user';
import {SavedMessage} from './saved-message';
import {AirbnbAccount} from "./airbnb_account";
import {isNullOrUndefined} from 'util';

export class Thread {
  id: number;

  airbnb_thread_id: number;
  guest_id: number;
  owner_id: number;
  assignee_id: number;

  status: string;

  last_message:string;
  last_message_on: string;
  is_last_sent: boolean;
  is_opened: boolean;
  is_archived: boolean;
  is_marked_for_followup: boolean;
  is_favourite: boolean;
  inquiry_action_taken: boolean;
  reservation_request: boolean;

  saved_messages: SavedMessage[];

  showFull: boolean;

  getGuest(): User {
    return this['guest']['data'];
  }

  getOwner(): User {
    return this['owner']['data'];
  }

  getAccount():AirbnbAccount {
    if (isNullOrUndefined(this['airbnbAccount'])) {
      return null;
    }

    return this['airbnbAccount']['data'];
  }

  getBooking(): Booking {
    return this['booking']['data'];
  }

  getAssignee(): User {
    return this['assignee']['data'];
  }
}
