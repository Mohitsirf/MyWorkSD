import {Action} from './action';
import {Message} from '../models/message';
import {Thread} from '../models/thread';
import {Booking} from "../models/booking";


export const INDEX_REQUEST = '[MESSAGE] index request';
export const INDEX_SUCCESS = '[MESSAGE] index successful';
export const CREATE_REQUEST = '[MESSAGE] create request';
export const CREATE_SUCCESS = '[MESSAGE] create successful';
export const UPDATE_REQUEST = '[MESSAGE] update request';
export const UPDATE_SUCCESS = '[MESSAGE] update successful';

export const THREAD_INDEX_REQUEST = '[MESSAGE] thread index request';
export const THREAD_INDEX_SUCCESS = '[MESSAGE] thread index successful';
export const UNREAD_THREAD_INDEX_REQUEST = '[MESSAGE] unread thread index request';
export const UNREAD_THREAD_INDEX_SUCCESS = '[MESSAGE] unread thread index successful';
export const FOLLOWUP_THREAD_INDEX_REQUEST = '[MESSAGE] followup thread index request';
export const FOLLOWUP_THREAD_INDEX_SUCCESS = '[MESSAGE] followup thread index successful';
export const BOOKED_THREAD_INDEX_REQUEST = '[MESSAGE] booked thread index request';
export const BOOKED_THREAD_INDEX_SUCCESS = '[MESSAGE] booked thread index successful';
export const ONGOING_THREAD_INDEX_REQUEST = '[MESSAGE] ongoing thread index request';
export const ONGOING_THREAD_INDEX_SUCCESS = '[MESSAGE] ongoing thread index successful';
export const REQUESTS_THREAD_INDEX_REQUEST = '[MESSAGE] requests thread index request';
export const REQUESTS_THREAD_INDEX_SUCCESS = '[MESSAGE] requests thread index successful';
export const ARCHIVED_THREAD_INDEX_REQUEST = '[MESSAGE] archived thread index request';
export const ARCHIVED_THREAD_INDEX_SUCCESS = '[MESSAGE] archived thread index successful';
export const OTHER_THREAD_INDEX_REQUEST = '[MESSAGE] other thread index request';
export const OTHER_THREAD_INDEX_SUCCESS = '[MESSAGE] other thread index successful';

export const THREAD_UPDATE_REQUEST = '[MESSAGE] thread update request';
export const THREAD_UPDATE_SUCCESS = '[MESSAGE] thread update successful';
export const THREAD_STATUS_UPDATE_SUCCESS = '[MESSAGE] thread status update successful';


export const THREAD_GET_REQUEST = '[MESSAGE] thread get request';
export const THREAD_GET_SUCCESS = '[MESSAGE] thread get successful';

export const THREAD_SIDEBAR_UPDATE = '[THREAD] sidebar update';


/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class MessageIndexRequestAction implements Action {
  readonly type = INDEX_REQUEST;

  constructor(public payload: number) {
  }
}

export class MessageIndexSuccessAction implements Action {
  readonly type = INDEX_SUCCESS;

  constructor(public payload: { messages: Message[], threadId: number }) {
  }
}

export class MessageCreateRequestAction implements Action {
  readonly type = CREATE_REQUEST;

  constructor(public payload: number) {
  }
}

export class MessageCreateSuccessAction implements Action {
  readonly type = CREATE_SUCCESS;

  constructor(public payload: { message: Message, threadId: number }) {
  }
}

export class UnreadThreadIndexRequestAction implements Action {
  readonly type = UNREAD_THREAD_INDEX_REQUEST;
}

export class UnreadThreadIndexSuccessAction implements Action {
  readonly type = UNREAD_THREAD_INDEX_SUCCESS;

  constructor(public payload:{threads: Thread[], currentPage: number, totalPages: number}) {
  }
}

export class FollowupThreadIndexRequestAction implements Action {
  readonly type = FOLLOWUP_THREAD_INDEX_REQUEST;
}

export class FollowupThreadIndexSuccessAction implements Action {
  readonly type = FOLLOWUP_THREAD_INDEX_SUCCESS;

  constructor(public payload:{threads: Thread[], currentPage: number, totalPages: number}) {
  }
}

export class BookedThreadIndexRequestAction implements Action {
  readonly type = BOOKED_THREAD_INDEX_REQUEST;
}

export class BookedThreadIndexSuccessAction implements Action {
  readonly type = BOOKED_THREAD_INDEX_SUCCESS;

  constructor(public payload:{threads: Thread[], currentPage: number, totalPages: number}) {
  }
}

export class OngoingThreadIndexRequestAction implements Action {
  readonly type = ONGOING_THREAD_INDEX_REQUEST;
}

export class OngoingThreadIndexSuccessAction implements Action {
  readonly type = ONGOING_THREAD_INDEX_SUCCESS;

  constructor(public payload:{threads: Thread[], currentPage: number, totalPages: number}) {
  }
}

export class RequestsThreadIndexRequestAction implements Action {
  readonly type = REQUESTS_THREAD_INDEX_REQUEST;
}

export class RequestsThreadIndexSuccessAction implements Action {
  readonly type = REQUESTS_THREAD_INDEX_SUCCESS;

  constructor(public payload:{threads: Thread[], currentPage: number, totalPages: number}) {
  }
}

export class ArchivedThreadIndexRequestAction implements Action {
  readonly type = ARCHIVED_THREAD_INDEX_REQUEST;
}

export class ArchivedThreadIndexSuccessAction implements Action {
  readonly type = ARCHIVED_THREAD_INDEX_SUCCESS;

  constructor(public payload:{threads: Thread[], currentPage: number, totalPages: number}) {
  }
}

export class OtherThreadsIndexRequestAction implements Action {
  readonly type = OTHER_THREAD_INDEX_REQUEST;
}

export class OtherThreadsIndexSuccessAction implements Action {
  readonly type = OTHER_THREAD_INDEX_SUCCESS;

  constructor(public payload:{threads: Thread[], currentPage: number, totalPages: number}) {
  }
}

export class ThreadUpdateRequestAction implements Action {
  readonly type = THREAD_UPDATE_REQUEST;

  constructor(public payload: number) {
  }
}

export class ThreadUpdateSuccessAction implements Action {
  readonly type = THREAD_UPDATE_SUCCESS;

  constructor(public payload: {
    updatedThread: Thread,
    oldThread: Thread
  }) {
  }
}

export class ThreadSidebarUpdateSuccess implements Action {
  readonly type = THREAD_SIDEBAR_UPDATE;

  constructor(public payload: string) {
  }
}

export class ThreadGetRequest implements Action {
  readonly type = THREAD_GET_REQUEST;

  constructor(public payload: number) {
  }
}

export class ThreadGetSuccess implements Action {
  readonly type = THREAD_GET_SUCCESS;

  constructor(public payload: Thread) {
  }
}

export class ThreadBookingUpdateRequestAction implements Action {
  readonly type = UPDATE_REQUEST;

  constructor(public payload: number) {
  }
}

export class ThreadBookingUpdateSuccessAction implements Action {
  readonly type = UPDATE_SUCCESS;

  constructor(public payload: {booking:Booking , thread_id:number}) {
  }
}

export class ThreadStatusUpdateSuccessAction implements Action {
  readonly type = THREAD_STATUS_UPDATE_SUCCESS;

  constructor(public payload: {booking:Booking , thread_id:number}) {
  }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */

export type Actions
  = MessageIndexRequestAction
  | MessageIndexSuccessAction
  | MessageCreateRequestAction
  | MessageCreateSuccessAction
  | ThreadUpdateRequestAction
  | ThreadUpdateSuccessAction
  | UnreadThreadIndexRequestAction
  | UnreadThreadIndexSuccessAction
  | FollowupThreadIndexRequestAction
  | FollowupThreadIndexSuccessAction
  | BookedThreadIndexRequestAction
  | BookedThreadIndexSuccessAction
  | OngoingThreadIndexRequestAction
  | OngoingThreadIndexSuccessAction
  | RequestsThreadIndexRequestAction
  | RequestsThreadIndexSuccessAction
  | ArchivedThreadIndexRequestAction
  | ArchivedThreadIndexSuccessAction
  | OtherThreadsIndexRequestAction
  | OtherThreadsIndexSuccessAction
  | ThreadSidebarUpdateSuccess
  | ThreadGetRequest
  | ThreadGetSuccess
  | ThreadBookingUpdateRequestAction
  | ThreadBookingUpdateSuccessAction
  | ThreadStatusUpdateSuccessAction;
