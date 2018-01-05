import {Guest} from './guest';
import {ManagementContact} from './management-contact';
import {ContactLog} from './contact-log';

export class User {
  id: number;
  first_name: string;
  last_name: string;
  description: string;
  pic_thumb_url: string;
  pic_original_url: string;
  type: string;
  is_admin: boolean;
  is_owner: boolean;
  is_active: boolean;



  email: string;
  secondary_email: string;
  phone_number: string;
  secondary_phone_name: string;
  secondary_phone_number: string;
  preferred_contact_method: string;

  source: string;

  bank_name: string;
  account_number: string;
  routing_number: string;

  admin: any;
  owner: any;
  guest: any;
  managementContact: any;


  getAdmin(): Guest {
    return this['admin']['data'];
  }

  getOwner(): any {
    return this['owner']['data'];
  }

  getLogs(): ContactLog {
    return this['logs']['data'];
  }

  getGuest(): Guest {
    return this['guest']['data'];
  }

  getManagementContact(): ManagementContact {
    return this['managementContact']['data'];
  }


  getFullName() {
    return this.first_name + this.checkNullString(this.last_name);
  }

  private checkNullString(string: string): string {
    if (string != null) {
      return ' '.concat(string);
    } else {
      return '';
    }
  }
}
