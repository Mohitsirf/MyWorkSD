import {URLSearchParams} from '@angular/http';
import * as moment from 'moment';
import {Thread} from './models/thread';
import {getDateObj} from './components/calendar/calendar-utils';
import {isNullOrUndefined} from "util";
import {Booking} from "./models/booking";

export default class Utils {
  static objToSearchParams(obj): URLSearchParams {
    const params: URLSearchParams = new URLSearchParams();
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        params.set(key, obj[key]);
      }
    }
    return params;
  }

  static getThreadFromBooking(thread: Thread, status: string) {
    thread.reservation_request = false;

    switch (status) {
      case 'inquiry':
        thread.status = 'Inquiry';
        break;
      case 'pending':
      case 'awaiting_payment':
        thread.status = 'Awaiting Payment';
        break;
      case 'not_possible':
        thread.status = 'Closed';
        break;
      case 'requested':
        thread.status = 'Requested';
        thread.reservation_request = true;
        break;
      case 'timedout':
        thread.status = 'Expired';
        break;
      case 'denied':
        thread.status = 'Declined';
        break;
      case 'cancelled':
        thread.status = 'Cancelled';
        break;
      default :
        thread.status = 'Accepted';
    }
    return thread;
  }

  static getThreadType(thread: Thread): string {
    let filter = null;

    if (isNullOrUndefined(thread)) {
      return filter;
    }
    if (this.isUnreadThread(thread)) {
      filter = 'unread';
    } else if (this.isFollowUpThread(thread)) {
      filter = 'followup';
    } else if (this.isArchivedThread(thread)) {
      filter = 'archived';
    } else if (this.isRequestThread(thread)) {
      filter = 'requests';
    } else if (this.isOngoingThread(thread)) {
      filter = 'ongoing';
    } else if (this.isBookedThread(thread)) {
      filter = 'booked';
    } else {
      filter = 'ongoing';
    }

    return filter;
  }

  static isArchivedThread(thread: Thread) {
    return thread.is_archived;
  }

  static isFollowUpThread(thread: Thread) {
    return thread.is_marked_for_followup;
  }

  static isUnreadThread(thread: Thread) {
    return !thread.is_opened;
  }

  static isRequestThread(thread: Thread) {
    return thread.reservation_request;
  }

  static isOngoingThread(thread: Thread) {
    if (thread.status == 'Accepted' || thread.status.startsWith('Awaiting Payment')) {
      const startDate = moment(thread.getBooking().start);
      const endDate = moment(thread.getBooking().end);

      const currentDate = getDateObj();
      const currentDateString = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
      const currentDateMoment = moment(currentDateString);

      if (endDate.diff(currentDateMoment) >= 0 && currentDateMoment.diff(startDate) >= 0) {
        return true;
      }
    }

    return false;
  }

  static isBookedThread(thread: Thread) {
    if (thread.status == 'Accepted' || thread.status.startsWith('Awaiting Payment')) {
      const startDate = moment(thread.getBooking().start);
      const endDate = moment(thread.getBooking().end);

      const currentDate = getDateObj();
      const currentDateString = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
      const currentDateMoment = moment(currentDateString);

      if (endDate.diff(currentDateMoment) > 0 || currentDateMoment.diff(startDate) > 0) {
        return true;
      }
    }

    return false;
  }

  static isOtherThread(thread: Thread) {
    return !(thread.status == 'Accepted' || thread.status.startsWith('Awaiting Payment'));

  }

  static getBookingType(booking: Booking): string {
    let filter = null;

    if (isNullOrUndefined(booking)) {
      return filter;
    }

    const temp = getDateObj();
    const currentDateString = temp.getFullYear() + '-' + (temp.getMonth() + 1) + '-' + temp.getDate();
    const currentDateMoment = moment(currentDateString);

    const startDateMoment = moment(booking.start);
    const endDateMoment = moment(booking.end);

    if (currentDateMoment.diff(startDateMoment) == 0) {
      filter = 'today';
    } else if (startDateMoment.diff(currentDateMoment) > 0) {
      filter = 'upcoming';
    } else if (currentDateMoment.diff(endDateMoment) > 0) {
      filter = 'past';
    } else if (currentDateMoment.diff(startDateMoment) > 0 && endDateMoment.diff(currentDateMoment) > 0) {
      filter = 'ongoing';
    }

    return filter;
  }

  static trim(subject: string, length: number): string {
    if (subject.length > length) {
      return subject.substr(0, length);
    }
    return subject;
  }

  static removeKey(obj, deleteKey) {
    return Object.keys(obj)
      .filter(key => key !== deleteKey)
      .reduce((result, current) => {
        result[current] = obj[current];
        return result;
      }, {});
  }

  static normalize(entityArray: Entity[]) {
    const result = {};
    for (let i = 0; i < entityArray.length; i++) {
      result[entityArray[i].id] = entityArray[i];
    }

    return result;
  }

  static normalizedObjToArray(object: { [id: number]: any }) {
    const result = [];
    for (let i = 1; i <= Object.keys(object).length; i++) {
      result.push(object[i]);
    }

    return result;
  }

  static getObjectValues(object: { [id: number]: any }) {
    const vals = [];
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        vals.push(object[key]);
      }
    }
    return vals;
  }

  static removeNullFields(data: Object) {
    Object.keys(data).forEach((key) => (data[key] == null) && delete data[key]);
    return data;
  }

  static objectIsEquivalent(obj1, obj2) {
    // Create arrays of key names
    const obj1keys = Object.keys(obj1);
    const obj2keys = Object.keys(obj2);

    // If number of properties is different,
    // objects are not equivalent
    if (obj1keys.length !== obj2keys.length) {
      return false;
    }

    for (let i = 0; i < obj1keys.length; i++) {
      const keyName = obj1keys[i];
      // If values of same property are not equal,
      // objects are not equivalent
      if (obj1[keyName] !== obj2[keyName]) {
        return false;
      }
    }
    // If we made it this far, objects
    // are considered equivalent
    return true;
  }
}

interface Entity {
  id: number;
}

interface SDEnum {
  title: string;
  slug: string;
}

export function getAllTasksStatsTypes(): { title: string, slug: string, color: string, tooltipText: string }[] {
  const allValues = [];

  allValues.push(getTaskStatusType('waiting_for_approval'));
  allValues.push(getTaskStatusType('scheduled'));
  // allValues.push(getTaskStatusType('paid'));
  allValues.push(getTaskStatusType('completed'));
  allValues.push(getTaskStatusType('cancelled'));
  allValues.push(getTaskStatusType('late'));

  return allValues;
}

export function getTaskStatusType(slug: string): { title: string, slug: string, color: string, tooltipText: string } {
  let title;
  let color;
  let tooltipText;

  switch (slug) {
    case 'waiting_for_approval': {
      title = 'Waiting';
      color = '#13304b';
      tooltipText = 'Waiting For Approval';

      break;
    }
    case 'scheduled': {
      title = 'Scheduled';
      color = '#ffff00';
      tooltipText = 'Scheduled';

      break;
    }
    case 'paid': {
      title = 'Paid';
      color = '#a9a9a9';
      tooltipText = 'Paid';

      break;
    }
    case 'completed': {
      title = 'Completed';
      color = '#4F8A10';
      tooltipText = 'Completed';

      break;
    }
    case 'late': {
      title = 'Late';
      color = '#ff0000';
      tooltipText = 'Late';

      break;
    }
    default: {
      title = 'Cancelled';
      color = '#ff0000';
      tooltipText = 'Cancelled';

    }
  }

  return {title: title, slug: slug, color: color, tooltipText: tooltipText};
}

export function getAllReservationStatusTypes(): { title: string, slug: string, color: string }[] {
  const allValues = [];

  allValues.push(getReservationStatusType('inquiry'));
  allValues.push(getReservationStatusType('reserved'));
  allValues.push(getReservationStatusType('accepted'));
  allValues.push(getReservationStatusType('checked_in'));
  allValues.push(getReservationStatusType('checked_out'));
  allValues.push(getReservationStatusType('pending'));
  allValues.push(getReservationStatusType('requested'));
  allValues.push(getReservationStatusType('cancelled'));
  allValues.push(getReservationStatusType('denied'));
  allValues.push(getReservationStatusType('timedout'));
  allValues.push(getReservationStatusType('not_possible'));

  return allValues;
}

export function getThreadStatColor(slug: string): { color: string } {
  let color;

  switch (slug) {
    case 'Inquiry': {
      color = '#6d777d';
      break;
    }
    case 'Reserved': {
      color = '#f0ad40';
      break;
    }
    case 'Accepted': {
      color = '#5cb85c';
      break;
    }
    case 'Awaiting Payment': {
      color = '#556b8d';
      break;
    }
    case 'Requested': {
      color = '#556b8d';
      break;
    }
    case 'Canceled': {
      color = '#e25d5d';
      break;
    }
    case 'Declined': {
      color = '#e25d5d';
      break;
    }
    case 'Expired': {
      color = '#e25d5d';
      break;
    }
    case 'Closed': {
      color = '#808080';
      break;
    }

    default: {
      color = '#ff0000';
    }
  }

  return {color: color};
}


export function getReservationStatusType(slug: string): { title: string, slug: string, color: string } {
  let title;
  let color;

  switch (slug) {
    case 'Inquiry':
    case 'inquiry': {
      title = 'Inquiry';
      color = '#6d777d';
      break;
    }
    case 'Reserved':
    case 'reserved': {
      title = 'Reserved';
      color = '#f0ad40';
      break;
    }
    case 'Accepted':
    case 'accepted': {
      title = 'Accepted';
      color = '#5cb85c';
      break;
    }
    case 'Checked In':
    case 'checked_in': {
      title = 'Checked In';
      color = '#6ec06e';
      break;
    }
    case 'Checked Out':
    case 'checked_out': {
      title = 'Checked Out';
      color = '#5cb85c';
      break;
    }
    case 'Pending':
    case 'awaiting_payment':
    case 'pending': {
      title = 'Awaiting Payment';
      color = '#556b8d';
      break;
    }
    case 'Requested':
    case 'requested': {
      title = 'Requested';
      color = '#556b8d';
      break;
    }
    case 'Canceled':
    case 'cancelled': {
      title = 'Cancelled';
      color = '#e25d5d';
      break;
    }
    case 'Declined':
    case 'denied': {
      title = 'Declined';
      color = '#e25d5d';
      break;
    }
    case 'Closed':
    case 'timedout': {
      title = 'Expired';
      color = '#e25d5d';
      break;
    }
    case 'Not Possible':
    case 'not_possible': {
      title = 'Closed';
      color = '#808080';
      break;
    }

    default: {
      title = 'Booking Status';
      color = '#ff0000';
    }
  }

  return {title: title, slug: slug, color: color};
}

export function getAllPetsAllowedTypes(): SDEnum[] {
  const allValues = [];

  allValues.push(getPetsAllowedType('yes'));
  allValues.push(getPetsAllowedType('all_sizes'));
  allValues.push(getPetsAllowedType('small_sizes'));
  allValues.push(getPetsAllowedType('no'));

  return allValues;
}

export function getPetsAllowedType(slug: string): SDEnum {
  let title;

  switch (slug) {
    case 'yes': {
      title = 'Yes';
      break;
    }
    case 'all_sizes': {
      title = 'All Sizes';
      break;
    }
    case 'small_sizes': {
      title = 'Small Sizes';
      break;
    }
    default: {
      title = 'No';
    }
  }

  return {title: title, slug: slug};
}


export function getAllSources(): SDEnum[] {
  const allValues = [];

  allValues.push(getSourceType('airbnb'));
  allValues.push(getSourceType('stayduvet'));
  allValues.push(getSourceType('homeaway'));

  return allValues;
}

export function getSourceType(slug: string): SDEnum {
  let title;

  switch (slug) {
    case 'airbnb': {
      title = 'Airbnb';
      break;
    }
    case 'stayduvet': {
      title = 'Stay Duvet';
      break;
    }
    case 'homeaway': {
      title = 'HomeAway';
      break;
    }
  }

  return {title: title, slug: slug};
}


export function getAutoResponseTypes(): SDEnum[] {
  const allValues = [];

  allValues.push(getAutoResponseType('confirmed_before_check_in'));
  allValues.push(getAutoResponseType('confirmed_on_the_day_of_check_in'));
  allValues.push(getAutoResponseType('confirmed_on_the_day_of_check_out'));
  allValues.push(getAutoResponseType('confirmed_during_stay'));
  allValues.push(getAutoResponseType('confirmed_after_check_out'));
  allValues.push(getAutoResponseType('after_first_message'));
  allValues.push(getAutoResponseType('any_subsequent_message'));

  return allValues;
}

export function getAutoResponseType(slug: string): SDEnum {
  let title;

  switch (slug) {
    case 'confirmed_before_check_in': {
      title = 'Before checking in';
      break;
    }
    case 'confirmed_on_the_day_of_check_in': {
      title = 'On the day of check in';
      break;
    }
    case 'confirmed_on_the_day_of_check_out': {
      title = 'On the day of check out';
      break;
    }
    case 'confirmed_during_stay': {
      title = ' During stay';
      break;
    }
    case 'confirmed_after_check_out': {
      title = 'After checking out';
      break;
    }
    case 'after_first_message': {
      title = 'For the first message';
      break;
    }
    case 'any_subsequent_message': {
      title = 'For any subsequent message';
      break;
    }
  }

  return {title: title, slug: slug};
}


export function getAllSuitableForEventsTypes(): SDEnum[] {
  const allValues = [];

  allValues.push(getSuitableForEventsType('events_only'));
  allValues.push(getSuitableForEventsType('filming_only'));
  allValues.push(getSuitableForEventsType('call_before'));
  allValues.push(getSuitableForEventsType('no'));

  return allValues;
}

export function getSuitableForEventsType(slug: string): SDEnum {
  let title;

  switch (slug) {
    case 'events_only': {
      title = 'Events Only';
      break;
    }
    case 'filming_only': {
      title = 'Filming Only';
      break;
    }
    case 'call_before': {
      title = 'Call Before';
      break;
    }
    default: {
      title = 'No';
      break;
    }
  }

  return {title: title, slug: slug};
}

export function getDays(): SDEnum[] {
  const getOptions = [];

  getOptions.push(getDay('sunday'));
  getOptions.push(getDay('monday'));
  getOptions.push(getDay('tuesday'));
  getOptions.push(getDay('wednesday'));
  getOptions.push(getDay('thursday'));
  getOptions.push(getDay('friday'));
  getOptions.push(getDay('saturday'));

  return getOptions;
}

export function getDay(slug: string): SDEnum {
  let title;

  switch (slug) {
    case 'sunday': {
      title = 'Sunday';
      break;
    }
    case 'monday': {
      title = 'Monday';
      break;
    }
    case 'tuesday': {
      title = 'Tuesday';
      break;
    }
    case 'wednesday': {
      title = 'Wednesday';
      break;
    }
    case 'thursday': {
      title = 'Thursday';
      break;
    }
    case 'friday': {
      title = 'Friday';
      break;
    }
    case 'saturday': {
      title = 'Saturday';
      break;
    }
  }

  return {title: title, slug: slug};
}

export function getFrequencies(): SDEnum[] {
  const getOptions = [];

  getOptions.push(getFrequency('every'));
  getOptions.push(getFrequency('every_other'));
  getOptions.push(getFrequency('every_third'));

  return getOptions;
}

export function getFrequency(slug: string): SDEnum {
  let title;

  switch (slug) {
    case 'every': {
      title = 'Every';
      break;
    }
    case 'every_other': {
      title = 'Every Other';
      break;
    }
    case 'every_third': {
      title = 'Every Third';
      break;
    }
  }

  return {title: title, slug: slug};
}

export function getPaymentByOptions(): SDEnum[] {
  const getOptions = [];

  getOptions.push(getOption('guests'));
  getOptions.push(getOption('management'));
  getOptions.push(getOption('owner_charge'));
  getOptions.push(getOption('insurance_claim'));

  return getOptions;
}

export function getOption(slug: string): SDEnum {
  let title;

  switch (slug) {
    case 'guests': {
      title = 'Guest';
      break;
    }
    case 'management': {
      title = 'Management';
      break;
    }
    case 'owner_charge': {
      title = 'Owner';
      break;
    }
    case 'insurance_claim': {
      title = 'Insurance Claim';
      break;
    }
  }

  return {title: title, slug: slug};
}


export function getProspectsFilterTypes(): SDEnum[] {
  const prospectTypes = [];
  prospectTypes.push(getProspectFilterType('today_prospects'));
  prospectTypes.push(getProspectFilterType('upcoming_prospects'));
  prospectTypes.push(getProspectFilterType('expired_prospects'));
  prospectTypes.push(getProspectFilterType('passed_prospects'));
  return prospectTypes;
}

export function getProspectFilterType(slug: string): SDEnum {
  let title;

  switch (slug) {
    case 'today_prospects': {
      title = 'Today\'s Prospects';
      break;
    }
    case 'upcoming_prospects': {
      title = 'Upcoming Prospects';
      break;
    }
    case 'expired_prospects': {
      title = 'Expired Prospects';
      break;
    }
    case 'passed_prospects': {
      title = 'Passed Prospects';
      break;
    }
  }

  return {title: title, slug: slug};
}

export function getQuotesFilterTypes(): SDEnum[] {
  const quoteTypes = [];
  quoteTypes.push(getQuoteFilterType('today_quotes'));
  quoteTypes.push(getQuoteFilterType('upcoming_quotes'));
  quoteTypes.push(getQuoteFilterType('expired_quotes'));
  return quoteTypes;
}

export function getQuoteFilterType(slug: string): SDEnum {
  let title;

  switch (slug) {
    case 'today_quotes': {
      title = 'Today\'s Quotes';
      break;
    }
    case 'upcoming_quotes': {
      title = 'Upcoming Quotes';
      break;
    }
    case 'expired_quotes': {
      title = 'Expired Quotes';
      break;
    }
  }

  return {title: title, slug: slug};
}

export function getTaskFilterTypes(): SDEnum[] {
  const taskTypes = [];
  taskTypes.push(getTaskFilterType('today_tasks'));
  taskTypes.push(getTaskFilterType('upcoming_tasks'));
  taskTypes.push(getTaskFilterType('late_tasks'));
  taskTypes.push(getTaskFilterType('completed_tasks'));
  taskTypes.push(getTaskFilterType('paid_tasks'));
  taskTypes.push(getTaskFilterType('all_tasks'));
  return taskTypes;
}

export function getTaskFilterType(slug: string): SDEnum {
  let title;

  switch (slug) {
    case 'today_tasks': {
      title = 'Today\'s Tasks';
      break;
    }
    case 'upcoming_tasks': {
      title = 'Upcoming Tasks';
      break;
    }
    case 'late_tasks': {
      title = 'Late Tasks';
      break;
    }
    case 'completed_tasks': {
      title = 'Completed Tasks';
      break;
    }
    case 'paid_tasks': {
      title = 'Paid Tasks';
      break;
    }
    case 'all_tasks': {
      title = 'All Tasks';
      break;
    }
  }

  return {title: title, slug: slug};
}


export function getAllTaskTypes(): SDEnum[] {
  const taskTypes = [];

  taskTypes.push(getTaskType('cleaning'));
  taskTypes.push(getTaskType('inspection'));
  taskTypes.push(getTaskType('check_in'));
  taskTypes.push(getTaskType('rental_expense'));
  taskTypes.push(getTaskType('work_order'));
  taskTypes.push(getTaskType('reminder'));
  taskTypes.push(getTaskType('insurance_claim'));


  return taskTypes;
}

export function getTaskType(slug: string): SDEnum {
  let title;

  switch (slug) {
    case 'cleaning': {
      title = 'Cleaning';
      break;
    }
    case 'inspection': {
      title = 'Inspection';
      break;
    }
    case 'check_in': {
      title = 'Check In';
      break;
    }
    case 'rental_expense': {
      title = 'Rental Expenses';
      break;
    }
    case 'insurance_claim': {
      title = 'Insurance Claim';
      break;
    }
    case 'work_order': {
      title = 'Work Order';
      break;
    }
    case 'reminder': {
      title = 'Reminder';
      break;
    }
  }

  return {title: title, slug: slug};
}

export function getAllTaskPaymentByTypes(): { title: string, slug: string }[] {
  const allValues = [];

  allValues.push(getTaskPaymentByType('guests'));
  allValues.push(getTaskPaymentByType('management'));
  allValues.push(getTaskPaymentByType('owner_charge'));
  allValues.push(getTaskPaymentByType('insurance_claim'));

  return allValues;
}

export function getTaskPaymentByType(slug: string): { title: string, slug: string } {
  let title;

  switch (slug) {
    case 'guests': {
      title = 'Guests';
      break;
    }
    case 'management': {
      title = 'Management';
      break;
    }
    case 'owner_charge': {
      title = 'Owner Charge';
      break;
    }
    default: {
      title = 'Insurance Claim';
    }
  }

  return {title: title, slug: slug};
}

export function getAllMaintenanceThresholdTypes(): { title: string, slug: string }[] {
  const allValues = [];

  allValues.push(getMaintenanceThresholdType('confirm_first'));
  allValues.push(getMaintenanceThresholdType('150-499'));
  allValues.push(getMaintenanceThresholdType('500-999'));
  allValues.push(getMaintenanceThresholdType('approved'));

  return allValues;
}

export function getMaintenanceThresholdType(slug: string): { title: string, slug: string } {
  let title;

  switch (slug) {
    case 'confirm_first': {
      title = 'Confirm First';
      break;
    }
    case '150-499': {
      title = '$150 - $499';
      break;
    }
    case '500-999': {
      title = '$500 - $999';
      break;
    }
    default: {
      title = 'Auto Approve';
      break;
    }
  }

  return {title: title, slug: slug};
}


export function getCoffeeMakerTypes(): { title: string, slug: string }[] {
  const allValues = [];

  allValues.push(getCoffeeMakerType('drip'));
  allValues.push(getCoffeeMakerType('french_press'));
  allValues.push(getCoffeeMakerType('keurig'));
  allValues.push(getCoffeeMakerType('expresso'));

  return allValues;
}

export function getCoffeeMakerType(slug: string): { title: string, slug: string } {
  let title;

  switch (slug) {
    case 'drip': {
      title = 'Drip';
      break;
    }
    case 'french_press': {
      title = 'French Press';
      break;
    }
    case 'keurig': {
      title = 'Keurig';
      break;
    }
    case 'expresso': {
      title = 'Expresso';
      break;
    }
    default: {
      title = 'Auto Approve';
      break;
    }
  }

  return {title: title, slug: slug};
}

export function getContactMaintenanceCatagoryTypes(): { title: string, slug: string }[] {
  const allValues = [];

  allValues.push(getContactMaintenanceCatagoryType('hvac'));
  allValues.push(getContactMaintenanceCatagoryType('plumber'));
  allValues.push(getContactMaintenanceCatagoryType('painter'));
  allValues.push(getContactMaintenanceCatagoryType('electrician'));
  allValues.push(getContactMaintenanceCatagoryType('homeowner'));
  allValues.push(getContactMaintenanceCatagoryType('inspector'));
  allValues.push(getContactMaintenanceCatagoryType('general_maintenance'));
  allValues.push(getContactMaintenanceCatagoryType('housekeeper'));

  return allValues;
}

export function getContactMaintenanceCatagoryType(slug: string): { title: string, slug: string } {
  let title;

  switch (slug) {
    case 'hvac': {
      title = 'HVAC';
      break;
    }
    case 'plumber': {
      title = 'Plumber';
      break;
    }
    case 'painter': {
      title = 'Painter';
      break;
    }
    case 'electrician': {
      title = 'Electrician';
      break;
    }
    case 'general_maintenance': {
      title = 'General Maintenance';
      break;
    }
    case 'homeowner': {
      title = 'Homeowner';
      break;
    }
    case 'inspector': {
      title = 'Inspector';
      break;
    }
    case 'housekeeper': {
      title = 'House Keeper';
      break;
    }
    default: {
      title = 'Auto Approve';
      break;
    }
  }

  return {title: title, slug: slug};
}

export function getContactSourcesTypes(): { title: string, slug: string }[] {
  const allValues = [];

  allValues.push(getContactSourcesType('airbnb'));
  allValues.push(getContactSourcesType('homeaway'));
  allValues.push(getContactSourcesType('stayduvet'));

  return allValues;
}

export function getContactSourcesType(slug: string): { title: string, slug: string } {
  let title;

  switch (slug) {
    case 'airbnb': {
      title = 'Airbnb';
      break;
    }
    case 'homeaway': {
      title = 'HomeAway';
      break;
    }
    case 'stayduvet': {
      title = 'StayDuvet';
      break;
    }
    default: {
      title = 'Auto Approve';
      break;
    }
  }

  return {title: title, slug: slug};
}


export function getContactMethodTypes(): { title: string, slug: string }[] {
  const allValues = [];

  allValues.push(getContactMethodType('phone'));
  allValues.push(getContactMethodType('email'));
  return allValues;
}

export function getContactMethodType(slug: string): { title: string, slug: string } {
  let title;

  switch (slug) {
    case 'phone': {
      title = 'Phone';
      break;
    }
    case 'email': {
      title = 'Email';
      break;
    }
    default: {
      title = 'Auto Approve';
      break;
    }
  }

  return {title: title, slug: slug};
}


export function getApartmentTypes(): { title: string, slug: string }[] {
  const allValues = [];

  allValues.push(getApartmentType('entire_home'));
  allValues.push(getApartmentType('private_room'));
  allValues.push(getApartmentType('shared_room'));
  return allValues;
}

export function getApartmentType(slug: string): { title: string, slug: string } {
  let title;

  switch (slug) {
    case 'entire_home': {
      title = 'Entire Home';
      break;
    }
    case 'private_room': {
      title = 'Private Rooms';
      break;
    }
    case 'shared_room': {
      title = 'Shared Rooms';
      break;
    }
    default: {
      title = 'Auto Approve';
      break;
    }
  }

  return {title: title, slug: slug};
}

export function getBedTypes(): { title: string, slug: string }[] {
  const allValues = [];

  allValues.push(getBedType('twin'));
  allValues.push(getBedType('full'));
  allValues.push(getBedType('queen'));
  allValues.push(getBedType('king'));
  allValues.push(getBedType('sofa_bed'));
  allValues.push(getBedType('bunk_bed'));
  allValues.push(getBedType('day_bed'));
  allValues.push(getBedType('air_matress'));
  return allValues;
}

export function getBedType(slug: string): { title: string, slug: string } {
  let title;

  switch (slug) {
    case 'twin': {
      title = 'Twin/Single';
      break;
    }
    case 'full': {
      title = 'Full/Double';
      break;
    }
    case 'queen': {
      title = 'Queen';
      break;
    }
    case 'king': {
      title = 'King/Cali King';
      break;
    }
    case 'sofa_bed': {
      title = 'Sofa Bed';
      break;
    }
    case 'bunk_bed': {
      title = 'Bunk Bed';
      break;
    }
    case 'day_bed': {
      title = 'Day Bed';
      break;
    }
    case 'air_matress': {
      title = 'Air Matress';
      break;
    }

    default: {
      title = 'Auto Approve';
      break;
    }
  }

  return {title: title, slug: slug};
}

export function getAllAlertOffsetReferences(): SDEnum[] {
  const allValues = [];

  allValues.push(getAlertOffsetReference('check_in'));
  allValues.push(getAlertOffsetReference('check_out'));
  allValues.push(getAlertOffsetReference('booking_confirmation'));
  return allValues;
}

export function getAlertOffsetReference(slug: string): { title: string, slug: string } {
  let title;

  switch (slug) {
    case 'check_in': {
      title = 'Check In';
      break;
    }
    case 'check_out': {
      title = 'Check Out';
      break;
    }

    default: {
      title = 'Reservation Confirmation';
      break;
    }
  }

  return {title: title, slug: slug};
}

export function getAllSendVias(): SDEnum[] {
  const allValues = [];

  allValues.push(getSendVia('text'));
  allValues.push(getSendVia('email'));
  allValues.push(getSendVia('booking_channel'));
  return allValues;
}

export function getSendVia(slug: string): { title: string, slug: string } {
  let title;

  switch (slug) {
    case 'text': {
      title = 'Text';
      break;
    }
    case 'email': {
      title = 'Email';
      break;
    }

    default: {
      title = 'Booking Channel';
      break;
    }
  }

  return {title: title, slug: slug};
}

export function getAllOffsetPositions(): SDEnum[] {
  const allValues = [];

  allValues.push(getOffsetPosition('before'));
  allValues.push(getOffsetPosition('after'));
  return allValues;
}

export function getOffsetPosition(slug: string): { title: string, slug: string } {
  let title;

  switch (slug) {
    case 'before': {
      title = 'Before';
      break;
    }

    default: {
      title = 'After';
      break;
    }
  }

  return {title: title, slug: slug};
}

export function getAllAlertTypes(): SDEnum[] {
  const allValues = [];

  allValues.push(getAlertType('include'));
  allValues.push(getAlertType('exclude'));
  return allValues;
}

export function getAlertType(slug: string): { title: string, slug: string } {
  let title;

  switch (slug) {
    case 'include': {
      title = 'Include';
      break;
    }

    default: {
      title = 'Exclude';
      break;
    }
  }

  return {title: title, slug: slug};
}

export function getAllTimeDenominations(): SDEnum[] {
  const allValues = [];

  allValues.push(getTimeDenomination('day'));
  allValues.push(getTimeDenomination('hour'));
  allValues.push(getTimeDenomination('minute'));
  allValues.push(getTimeDenomination('second'));
  return allValues;
}

export function getTimeDenomination(slug: string): { title: string, slug: string } {
  let title;

  switch (slug) {
    case 'day': {
      title = 'Day(s)';
      break;
    }
    case 'hour': {
      title = 'Hour(s)';
      break;
    }
    case 'minute': {
      title = 'Minute(s)';
      break;
    }

    default: {
      title = 'Second(s)';
      break;
    }
  }

  return {title: title, slug: slug};
}

export function getSourceIcon(source) {
  if (source === 'airbnb') {
    return '../../assets/images/airbnb_icon.png';
  } else if (source === 'stayduvet') {
    return '../../assets/images/logo.png';
  } else if (source === 'homeaway') {
    return '../../assets/images/homeaway_icon.png';
  } else {
    return '../../assets/images/placeholder.jpg';
  }
}


export enum CalendarDayStatus {
  first_half,
  second_half,
  full_day,
  none,
  blocked
}


export function getAllBookingLogTypes(): { title: string, slug: string, color: string }[] {
  const allValues = [];

  allValues.push(getBookingLogType('created'));
  allValues.push(getBookingLogType('updated'));
  allValues.push(getBookingLogType('deleted'));
  allValues.push(getBookingLogType('success'));
  allValues.push(getBookingLogType('error'));

  return allValues;
}

export function getBookingLogType(slug: string): { title: string, slug: string, color: string } {
  let title;
  let color;

  switch (slug) {
    case 'created': {
      title = 'Created';
      color = '#4F8A10';

      break;
    }
    case 'updated': {
      title = 'Updated';
      color = '#D17B26';

      break;
    }
    case 'deleted': {
      title = 'Deleted';
      color = '#FF0000';

      break;
    }
    case 'success': {
      title = 'Success';
      color = '#4F8A10';

      break;
    }
    case 'error': {
      title = 'Error';
      color = '#FF0000';

      break;
    }
  }

  return {title: title, slug: slug, color: color};
}


export function getAllCollectionMethodTypes(): SDEnum[] {
  const allValues = [];

  allValues.push(getCollectionMethodType('cash'));
  allValues.push(getCollectionMethodType('credit_card'));
  allValues.push(getCollectionMethodType('invoice'));

  return allValues;
}

export function getCollectionMethodType(slug: string): SDEnum {
  let title;

  switch (slug) {
    case 'cash': {
      title = 'Cash';
      break;
    }
    case 'paid': {
      title = 'Paid';
      break;
    }
    case 'airbnb': {
      title = 'Airbnb';
      break;
    }
    case 'credit_card': {
      title = 'Credit Card';
      break;
    }
    case 'invoice': {
      title = 'Invoice';
      break;
    }
  }

  return {title: title, slug: slug};
}

export function getAllReservationPaymentTypes(): SDEnum[] {
  const allValues = [];

  // allValues.push(getReservationPaymentType('from_source'));
  allValues.push(getReservationPaymentType('from_platform'));
  allValues.push(getReservationPaymentType('owners_charge'));
  allValues.push(getReservationPaymentType('paid'));
  allValues.push(getReservationPaymentType('over_the_phone'));

  return allValues;
}

export function getReservationPaymentType(slug: string): SDEnum {
  let title;

  switch (slug) {
    case 'from_source': {
      title = 'From Source';
      break;
    }
    case 'from_platform': {
      title = 'From Platform';
      break;
    }
    case 'owners_charge': {
      title = 'Owner\'s Charge';
      break;
    }
    case 'paid': {
      title = 'Paid';
      break;
    }
    case 'over_the_phone': {
      title = 'Over The Phone';
      break;
    }
  }

  return {title: title, slug: slug};
}


