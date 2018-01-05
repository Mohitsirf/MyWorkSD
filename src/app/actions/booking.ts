import {Action} from './action';
import {Booking} from '../models/booking';
import {BookingGuest} from '../models/booking-guest';
import {SecurityDeduction} from '../models/security-deduction';
import {ScheduledMessage} from '../models/scheduled-message';
import {Payment} from '../models/payment';

/**
 * Created by piyushkantm on 08/07/17.
 */


export const UPCOMING_OWNER_INDEX_REQUEST = 'Owner Upcoming [BOOKING] Index Request';
export const UPCOMING_OWNER_INDEX_SUCCESS = 'Owner Upcoming [BOOKING] Index Success';
export const INDEX_REQUEST = '[BOOKING] Index Request';
export const INDEX_SUCCESS = '[BOOKING] Index Success';
export const UPDATE_REQUEST = '[BOOKING] Update Request';
export const UPDATE_SUCCESS = '[BOOKING] Update Success';
export const ADD_NEW_GUEST_REQUEST = '[BOOKING] Add New Guest Request';
export const ADD_NEW_GUEST_SUCCESS = '[BOOKING] Add New Guest Success';
export const EDIT_GUEST_REQUEST = '[BOOKING] Edit Guest Request';
export const EDIT_GUEST_SUCCESS = '[BOOKING] Edit Guest Success';
export const DELETE_GUEST_REQUEST = '[BOOKING] Delete Guest Request';
export const DELETE_GUEST_SUCCESS = '[BOOKING] Delete Guest Success';

export const TODAY_INDEX_REQUEST = 'Today [BOOKING] Index Request';
export const UPCOMING_INDEX_REQUEST = 'Upcoming [BOOKING] Index Request';
export const ONGOING_INDEX_REQUEST = 'Ongoing [BOOKING] Index Request';
export const PAST_INDEX_REQUEST = 'Past [BOOKING] Index Request';

export const TODAY_INDEX_SUCCESS = 'Today [BOOKING] Index Success';
export const UPCOMING_INDEX_SUCCESS = 'Upcoming [BOOKING] Index Success';
export const ONGOING_INDEX_SUCCESS = 'Ongoing [BOOKING] Index Success';
export const PAST_INDEX_SUCCESS = 'Past [BOOKING] Index Success';

export const SHOW_REQUEST = '[BOOKING] Show Request';
export const SHOW_SUCCESS = '[BOOKING] Show Success';

export const SECURITY_DEDUCTION_REQUEST = '[BOOKING] Security Deduction Request';
export const SECURITY_DEDUCTION_SUCCESS = '[BOOKING] Security Deduction Success';

export const SCHEDULED_MESSAGE_UPDATE_REQUEST = '[BOOKING] Scheduled Message Update Request';
export const SCHEDULED_MESSAGE_UPDATE_SUCCESS = '[BOOKING] Scheduled Message Update Success';

export const BOOKING_CREATE_REQUEST = '[BOOKING] Create Request';
export const BOOKING_CREATE_SUCCESS = '[BOOKING] Create Success';

export const BOOKING_PAYMENT_CREATE_REQUEST = '[BOOKING] Payment Create Request';
export const BOOKING_PAYMENT_CREATE_SUCCESS = '[BOOKING] Payment Create Success';


export class UpcomingOwnerBookingIndexRequestAction implements Action {
  readonly type = UPCOMING_OWNER_INDEX_REQUEST;
}

export class UpcomingOwnerBookingIndexSuccessAction implements Action {
  readonly type = UPCOMING_OWNER_INDEX_SUCCESS;

  constructor(public payload: Booking[]) {
  }
}

export class BookingIndexRequestAction implements Action {
  readonly type = INDEX_REQUEST;
}

export class BookingIndexSuccessAction implements Action {
  readonly type = INDEX_SUCCESS;

  constructor(public payload: Booking[]) {
  }
}

export class BookingUpdateRequestAction implements Action {
  readonly type = UPDATE_REQUEST;
}

export class BookingUpdateSuccessAction implements Action {
  readonly type = UPDATE_SUCCESS;

  constructor(public payload: { booking: Booking, thread_id: number }) {
  }
}

export class BookingGuestUpdateRequestAction implements Action {
  readonly type = EDIT_GUEST_REQUEST;
}

export class BookingGuestUpdateSuccessAction implements Action {
  readonly type = EDIT_GUEST_SUCCESS;

  constructor(public payload: { bookingId: string, guest: BookingGuest }) {
  }
}

export class BookingGuestAddRequestAction implements Action {
  readonly type = ADD_NEW_GUEST_REQUEST;
}

export class BookingGuestAddSuccessAction implements Action {
  readonly type = ADD_NEW_GUEST_SUCCESS;

  constructor(public payload: { bookingId: string, guest: BookingGuest }) {
  }
}

export class BookingGuestDeleteRequestAction implements Action {
  readonly type = DELETE_GUEST_REQUEST;
}

export class BookingGuestDeleteSuccessAction implements Action {
  readonly type = DELETE_GUEST_SUCCESS;

  constructor(public payload: { bookingId: string, guestId: string }) {
  }
}



export class TodayBookingIndexRequestAction implements Action {
  readonly type = TODAY_INDEX_REQUEST;
}

export class UpcomingBookingIndexRequestAction implements Action {
  readonly type = UPCOMING_INDEX_REQUEST;
}

export class OngoingBookingIndexRequestAction implements Action {
  readonly type = ONGOING_INDEX_REQUEST;
}

export class PastBookingIndexRequestAction implements Action {
  readonly type = PAST_INDEX_REQUEST;
}

export class TodayBookingIndexSuccessAction implements Action {
  readonly type = TODAY_INDEX_SUCCESS;

  constructor(public payload: {bookings: Booking[], currentPage: number, totalPages: number, totalCount: number}) {
  }
}

export class UpcomingBookingIndexSuccessAction implements Action {
  readonly type = UPCOMING_INDEX_SUCCESS;

  constructor(public payload: {bookings: Booking[], currentPage: number, totalPages: number, totalCount: number}) {
  }
}

export class OngoingBookingIndexSuccessAction implements Action {
  readonly type = ONGOING_INDEX_SUCCESS;

  constructor(public payload: {bookings: Booking[], currentPage: number, totalPages: number, totalCount: number}) {
  }
}

export class PastBookingIndexSuccessAction implements Action {
  readonly type = PAST_INDEX_SUCCESS;

  constructor(public payload: {bookings: Booking[], currentPage: number, totalPages: number, totalCount: number}) {
  }
}

export class BookingShowRequestAction implements Action {
  readonly type = SHOW_REQUEST;

  constructor(public payload: number) {
  }
}

export class BookingShowSuccessAction implements Action {
  readonly type = SHOW_SUCCESS;

  constructor(public payload: Booking) {
  }
}

export class BookingSecurityDeductionRequestAction implements Action {
  readonly type = SECURITY_DEDUCTION_REQUEST;
}

export class BookingSecurityDeductionSuccessAction implements Action {
  readonly type = SECURITY_DEDUCTION_SUCCESS;

  constructor(public payload: {bookingId: number, deduction: SecurityDeduction}) {
  }
}

export class BookingScheduledMessageUpdateRequestAction implements Action {
  readonly type = SCHEDULED_MESSAGE_UPDATE_REQUEST;
}

export class BookingScheduledMessageUpdateSuccessAction implements Action {
  readonly type = SCHEDULED_MESSAGE_UPDATE_SUCCESS;

  constructor(public payload: {bookingId: number, scheduledMessage: ScheduledMessage}) {
  }
}

export class BookingCreateRequestAction implements Action {
  readonly type = BOOKING_CREATE_REQUEST;
}

export class BookingCreateSuccessAction implements Action {
  readonly type = BOOKING_CREATE_SUCCESS;

  constructor(public payload: Booking) {
  }
}

export class BookingPaymentCreateRequestAction implements Action {
  readonly type = BOOKING_PAYMENT_CREATE_REQUEST;

  constructor(public payload: number) {
  }
}

export class BookingPaymentCreateSuccessAction implements Action {
  readonly type = BOOKING_PAYMENT_CREATE_SUCCESS;

  constructor(public payload: {bookingId:number, payment: Payment}) {
  }
}


export type Actions
  = UpcomingOwnerBookingIndexRequestAction
  | UpcomingBookingIndexSuccessAction
  | BookingIndexRequestAction
  | BookingIndexSuccessAction
  | BookingUpdateRequestAction
  | BookingGuestAddRequestAction
  | BookingGuestAddSuccessAction
  | BookingGuestDeleteRequestAction
  | BookingGuestDeleteSuccessAction
  | BookingGuestUpdateRequestAction
  | BookingUpdateSuccessAction
  | TodayBookingIndexRequestAction
  | UpcomingBookingIndexRequestAction
  | OngoingBookingIndexRequestAction
  | PastBookingIndexRequestAction
  | TodayBookingIndexSuccessAction
  | UpcomingBookingIndexSuccessAction
  | OngoingBookingIndexSuccessAction
  | PastBookingIndexSuccessAction
  | BookingShowRequestAction
  | BookingShowSuccessAction
  | BookingSecurityDeductionRequestAction
  | BookingSecurityDeductionSuccessAction
  | BookingScheduledMessageUpdateRequestAction
  | BookingScheduledMessageUpdateSuccessAction
  | BookingCreateRequestAction
  | BookingCreateSuccessAction
  | BookingPaymentCreateRequestAction
  | BookingPaymentCreateSuccessAction;
