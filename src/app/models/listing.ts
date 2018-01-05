import {Image} from './image';
import {Room} from './room';
import {Tag} from './tag';
import {User} from './user';
import {SavedMessage} from "./saved-message";
import {isNullOrUndefined} from "util";
import {CheckList} from './check-list';
import {isEmpty} from 'rxjs/operator/isEmpty';

/**
 * Created by piyushkantm on 19/06/17.
 */

export class Listing {
  // Identifiers
  id: number;
  parent_property_id: number;
  assignee_id: number;
  airbnb_listing_id: number;
  homeaway_listing_id: number;
  airbnb_account_id: number;
  owner_id: number;

  // Moderation
  status: string;
  rejection_reason: string;
  web_meta: any;
  private_notes: string;

  // Location
  lat: number;
  lng: number;
  time_zone_name: string;
  building: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country_code: string;
  address_string: string;

  // Details
  area_size: string;
  bed_count: string;
  bathrooms: number;
  property_info: string;

  // Amenities
  amenities: string[];

  // House Rules
  house_rules: string;
  suitable_for_children: boolean;
  suitable_for_infants: boolean;
  pets_allowed: boolean;
  smoking_allowed: boolean;
  events_allowed: boolean;
  additional_rules: string;

  must_climb_stairs: boolean;
  potential_for_noise: boolean;
  pets_live_on_property: boolean;
  no_parking_on_property: boolean;

  // Property Access
  property_access_code: string;
  property_access_note: string;
  property_access_title: string;

  wifi_note: string;
  wifi_network: string;
  wifi_password: string;

  parking_note: string;
  entertainment_note: string;
  netflix_username: string;
  netflix_password: string;
  coffee_maker_type: string;

  trash_day: string;
  trash_day_frequency: string;
  recycling_day: string;
  recycling_day_frequency: string;
  task_threshold: string;
  cleaning_instructions: string;

  // Marketing Info
  title: string;
  headline: string;
  summary: string;
  the_space: string;
  guest_access: string;
  the_neighbourhood: string;
  interaction_with_guests: string;
  getting_around: string;
  owner_story: string;
  other_notes: string;


  // Booking Details
  maximum_guest_number: number;
  check_in_time: string;
  check_in_time_end: string;
  check_out_time: string;
  min_nights: number;
  max_nights: number;
  seasonal_min_stays: { start: string, end: string, length: number }[];

  // Pricing Details
  min_dynamic_price: number;
  base_price: number;
  base_weekend_price: number;
  cleaning_fee: number;
  security_deposit: number;
  extra_guest_price: number;
  pet_fee: number;
  tax_percent: number;
  commission_rate: number;

  weekly_discount: number;
  monthly_discount: number;
  discount_for_last_3_days: number;
  discount_for_last_7_days: number;
  discount_for_last_14_days: number;
  discount_for_last_21_days: number;
  discount_for_last_28_days: number;

  last_minute_discount: boolean;
  dynamic_pricing: boolean;
  instant_book: boolean;

  future_booking_limit: string;

  rooms:any;
  images: any;


  getThumbnails(): Image[] {
    return this['images']['data'];
  }

  getMaintenancesContacts(): User[] {
    return this['managementContacts']['data'];
  }

  getTags(): Tag[] {
    return this['tags']['data'];
  }

  getOwner(): User {
    return this['owner']['data'];
  }

  getChecklists(): CheckList[] {
    return this['checklists']['data'];
  }

  getAssignee(): User {
    if(!isNullOrUndefined(this['assignee']))
      return this['assignee']['data'];
    else
      return null;
  }

  getMaintenances(): User[] {
    const maintenancesArray = [];
    const maintenances = this.getMaintenancesContacts();
    if (maintenances && maintenances.length > 0) {
      for (const maintenance of maintenances) {
        maintenancesArray.push(Object.assign(new User(), maintenance));
      }
    }
    return maintenancesArray;
  }

  getOwnerObj(): User {
    const owner = this.getOwner();
    return Object.assign(new User(), owner);
  }

  getAssigneeObj(): User {
    const assignee = this.getAssignee();
    if (assignee){
      return Object.assign(new User(), assignee);
    }
  }

  getRooms(): Room[] {
    const roomsArray = [];
    const rooms = this['rooms'];
    if (rooms) {
      for (const room of rooms) {
        roomsArray.push(Object.assign(new Room(), room));
      }
    }
    return roomsArray;
  }

  getNumberOfRooms() {
    const rooms = this.getRooms();
    if (rooms != null) {
      return rooms.length;
    }
    else {
      return 0;
    }
  }

  getNumberOfBeds() {
    const rooms = this.getRooms();
    let beds = 0;
    if (rooms != null) {
      for (const room of rooms) {
        beds += room.no_of_beds;
      }
      if (isNaN(beds)) {
        return 0;
      }
      return beds;
    }
    else {
      return 0;
    }
  }

  getPosterUrl(): string {
    const thumbnails = this.getThumbnails();

    if (thumbnails.length > 0) {
      return thumbnails[0].medium_url;
    }

    return '/assets/images/image-placeholder.jpg';
  }

  getFullAddress(): string {
    let address = '';

    let building = '';
    let street = '';
    let city = '';
    let state = '';
    let pincode = '';

    if (this.building && this.building.trim() !='') {
      building = this.building;
      address = address.concat(building + ',');
    }

    if (this.street && this.street.trim() !='') {
      street = this.street;
      address = address.concat(street + ',');
    }

    if (this.city && this.city.trim() !='') {
      city = this.city;
      address = address.concat(city + ',');
    }

    if (this.state && this.state.trim() !='') {
      state = this.state;
      address = address.concat(state + ',');
    }

    if (this.pincode && this.pincode.trim() !='') {
      pincode = this.pincode;
      address = address.concat(pincode + '.');
    }

    return address;
  }

  getProgress(): any {

    let nullValues = 0;
    let notNullValues = 0;

    this.assignee_id == null ? nullValues++ : notNullValues++;
    this.title == null || this.title.trim() =='' || this.title == 'New Property' ? nullValues++ : notNullValues++;
    this.headline == null || this.headline.trim() =='' ? nullValues++ : notNullValues++;
    this.lat == 0 ? nullValues++ : notNullValues++;
    this.lng == 0 ? nullValues++ : notNullValues++;
    this.building == null || this.building.trim() =='' ? nullValues++ : notNullValues++;
    this.street == null || this.street.trim() =='' ? nullValues++ : notNullValues++;
    this.city == null || this.city.trim() =='' ? nullValues++ : notNullValues++;
    this.state == null || this.state.trim() =='' ? nullValues++ : notNullValues++;
    this.pincode == null || this.pincode.trim() =='' ? nullValues++ : notNullValues++;
    this.country_code == null || this.country_code.trim() =='' ? nullValues++ : notNullValues++;
    this.getThumbnails().length == 0 ? nullValues++ : notNullValues++;
    this.amenities.length == 0 ? nullValues++ : notNullValues++;
    this.summary == null || this.summary.trim() =='' ? nullValues++ : notNullValues++;
    this.the_space == null || this.the_space.trim() =='' ? nullValues++ : notNullValues++;
    this.guest_access == null || this.guest_access.trim() =='' ? nullValues++ : notNullValues++;
    this.the_neighbourhood == null || this.the_neighbourhood.trim() =='' ? nullValues++ : notNullValues++;
    this.interaction_with_guests == null || this.interaction_with_guests.trim() =='' ? nullValues++ : notNullValues++;
    this.getting_around == null || this.getting_around.trim() =='' ? nullValues++ : notNullValues++;
    this.owner_story == null || this.owner_story.trim() =='' ? nullValues++ : notNullValues++;
    this.other_notes == null || this.other_notes.trim() =='' ? nullValues++ : notNullValues++;
    this.house_rules == null || this.house_rules.trim() =='' ? nullValues++ : notNullValues++;
    this.additional_rules == null || this.additional_rules.trim() =='' ? nullValues++ : notNullValues++;
    this.property_access_code == null || this.property_access_code.trim() =='' ? nullValues++ : notNullValues++;
    this.property_access_note == null || this.property_access_note.trim() =='' ? nullValues++ : notNullValues++;
    this.property_access_title == null || this.property_access_title.trim() =='' ? nullValues++ : notNullValues++;
    this.parking_note == null || this.parking_note.trim() =='' ? nullValues++ : notNullValues++;
    this.netflix_username == null || this.netflix_username.trim() =='' ? nullValues++ : notNullValues++;
    this.netflix_password == null || this.netflix_password.trim() =='' ? nullValues++ : notNullValues++;
    this.entertainment_note == null || this.entertainment_note.trim() =='' ? nullValues++ : notNullValues++;
    this.coffee_maker_type == null || this.coffee_maker_type.trim() =='' ? nullValues++ : notNullValues++;
    this.wifi_network == null || this.wifi_network.trim() =='' ? nullValues++ : notNullValues++;
    this.wifi_password == null || this.wifi_password.trim() =='' ? nullValues++ : notNullValues++;
    this.wifi_note == null || this.wifi_note.trim() =='' ? nullValues++ : notNullValues++;
    this.getChecklists().length == 0 ? nullValues++ : notNullValues++;
    this.getMaintenances().length == 0 ? nullValues++ : notNullValues++;
    this.private_notes == null || this.private_notes.trim() =='' ? nullValues++ : notNullValues++;
    this.bathrooms == null  ? nullValues++ : notNullValues++;
    this.getTags().length == 0  ? nullValues++ : notNullValues++;
    this.rooms == null || this.getRooms().length == 0 ? nullValues++ : notNullValues++;

    return (notNullValues/(nullValues + notNullValues))*100;
  }
}
