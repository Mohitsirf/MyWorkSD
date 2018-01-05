import {Action} from './action';
import {User} from '../models/user';
import {Listing} from '../models/listing';
import {OwnerDashStats} from '../models/owner-dash-stats';
import {AdminDashStats} from '../models/admin-dash-stats';
import {Image} from '../models/image';
import {Tag} from '../models/tag';
import {OwnerBlock} from '../models/owner-block';
import {SavedMessage} from '../models/saved-message';
import {CheckList} from '../models/check-list';

export const INDEX_REQUEST = '[LISTING] Index Request';
export const INDEX_SUCCESS = '[LISTING] Index Success';
export const INDEX_STATS_REQUEST = '[LISTING] Index Stats Request';
export const INDEX_STATS_SUCCESS = '[LISTING] Index Stats Success';
export const INDEX_ADMIN_STATS_REQUEST = '[LISTING] Index Admin Stats Request';
export const INDEX_ADMIN_STATS_SUCCESS = '[LISTING] Index Admin Stats Success';
export const INDEX_MONTHLY_BREAKDOWN_REQUEST = '[LISTING] Index Monthly Breakdown Request';
export const INDEX_MONTHLY_BREAKDOWN_SUCCESS = '[LISTING] Index Monthly Breakdown Success';
export const CREATE_REQUEST = '[LISTING] Create Request';
export const CREATE_SUCCESS = '[LISTING] Create Success';
export const SHOW_REQUEST = '[LISTING] Show Request';
export const SHOW_SUCCESS = '[LISTING] Show Success';
export const UPDATE_REQUEST = '[LISTING] Update Request';
export const UPDATE_SUCCESS = '[LISTING] Update Success';
export const DELETE_IMAGE_SUCCESS = '[LISTING] Delete Image Success';
export const ADD_IMAGE_SUCCESS = '[LISTING] Add Image Success';
export const EDIT_IMAGE_SUCCESS = '[LISTING] Edit Image Success';
export const IMAGE_SORTING_SUCCESS = '[LISTING] Image Sorting Success';
export const ADD_CONTACT_SUCCESS = '[LISTING] Add Contact Success';
export const DELETE_CONTACT_SUCCESS = '[LISTING] Delete Contact Success';
export const TAG_ATTACH_SUCCESS = '[LISTING] Tag Attach Success';
export const TAG_DELETE_SUCCESS = '[LISTING] Tag  Delete Success';
export const CALENDAR_REQUEST = '[LISTING] Calendar Request';
export const CALENDAR_SUCCESS = '[LISTING] Calendar Success';
export const BLOCK_SUCCESS = '[LISTING] Block Success';
export const UNBLOCK_SUCCESS = '[LISTING] Unblock Success';
export const ADD_CHECKLIST_SUCCESS = '[LISTING] Add Check-List success';
export const DELETE_CHECKLIST_SUCCESS = '[LISTING] Delete Check-List success';
export const UPDATE_CHECKLIST_SUCCESS = '[LISTING] Update Check-List success';


/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class IndexRequestAction implements Action {
  readonly type = INDEX_REQUEST;
}

export class IndexSuccessAction implements Action {
  readonly type = INDEX_SUCCESS;

  constructor(public payload: Listing[]) {
  }
}

export class IndexStatsRequestAction implements Action {
  readonly type = INDEX_STATS_REQUEST;
}

export class IndexStatsSuccessAction implements Action {
  readonly type = INDEX_STATS_SUCCESS;

  constructor(public payload: { [id: number]: OwnerDashStats }) {
  }
}

export class IndexAdminStatsRequestAction implements Action {
  readonly type = INDEX_ADMIN_STATS_REQUEST;
}

export class IndexAdminStatsSuccessAction implements Action {
  readonly type = INDEX_ADMIN_STATS_SUCCESS;

  constructor(public payload: { [id: number]: AdminDashStats }) {
  }
}


export class IndexMonthlyBreakdownRequestAction implements Action {
  readonly type = INDEX_MONTHLY_BREAKDOWN_REQUEST;
}


export class IndexMonthlyBreakdownSuccessAction implements Action {
  readonly type = INDEX_MONTHLY_BREAKDOWN_SUCCESS;

  constructor(public payload: { [id: number]: { [month: string]: number } }) {
  }
}

export class CreateRequestAction implements Action {
  readonly type = CREATE_REQUEST;
}

export class CreateSuccessAction implements Action {
  readonly type = CREATE_SUCCESS;

  constructor(public payload: Listing) {
  }
}

export class ShowRequestAction implements Action {
  readonly type = SHOW_REQUEST;
}

export class ShowSuccessAction implements Action {
  readonly type = SHOW_SUCCESS;

  constructor(public payload: Listing) {
  }
}

export class UpdateRequestAction implements Action {
  readonly type = UPDATE_REQUEST;
}

export class UpdateSuccessAction implements Action {
  readonly type = UPDATE_SUCCESS;

  constructor(public payload: Listing) {
  }
}

export class DeleteImageSuccessAction implements Action {
  readonly type = DELETE_IMAGE_SUCCESS;

  constructor(public payload: { listingId: string, imageId: string }) {
  }
}

export class AddImageSuccessAction implements Action {
  readonly type = ADD_IMAGE_SUCCESS;

  constructor(public payload: { listingId: string, image: Image }) {
  }
}

export class EditImageSuccessAction implements Action {
  readonly type = EDIT_IMAGE_SUCCESS;

  constructor(public payload: { listingId: string, image: Image }) {
  }
}

export class ImageSortingSuccessAction implements Action {
  readonly type = IMAGE_SORTING_SUCCESS;

  constructor(public payload: { listingId: string, sortOrder: {}, images: Image[] }) {
  }
}


export class DeleteTagSuccessAction implements Action {
  readonly type = TAG_DELETE_SUCCESS;

  constructor(public payload: { listingId: string, tagId: string }) {
  }
}

export class AttachTagSuccessAction implements Action {
  readonly type = TAG_ATTACH_SUCCESS;

  constructor(public payload: { listingId: string, tag: Tag }) {
  }
}


export class DeleteContactSuccessAction implements Action {
  readonly type = DELETE_CONTACT_SUCCESS;

  constructor(public payload: { listingId: number, contact: User }) {
  }
}

export class AddContactSuccessAction implements Action {
  readonly type = ADD_CONTACT_SUCCESS;

  constructor(public payload: { contact: User, listingId: number }) {

  }
}

export class CalendarRequestAction implements Action {
  readonly type = CALENDAR_REQUEST;

  constructor(public payload: { month: string, listingId: number }) {
  }
}

export class CalendarSuccessAction implements Action {
  readonly type = CALENDAR_SUCCESS;

  constructor(public payload: { month: string, listingId: number, data: any }) {
  }
}

export class BlockSuccessAction implements Action {
  readonly type = BLOCK_SUCCESS;

  constructor(public payload: { month: string, listingId: number, block: OwnerBlock[] }) {
  }
}

export class UnblockSuccessAction implements Action {
  readonly type = UNBLOCK_SUCCESS;

  constructor(public payload: { month: string, listingId: number, date: string }) {
  }
}


export class AddCheckListSuccessAction implements Action {
  readonly type = ADD_CHECKLIST_SUCCESS;

  constructor(public  payload: { listingId: number, checklist: CheckList }) {
  }
}


export class DeleteCheckListSuccessAction implements Action {
  readonly type = DELETE_CHECKLIST_SUCCESS;

  constructor(public  payload: { listingId: number, checklistId: number }) {
  }
}

export class UpdateCheckListSuccessAction implements Action {
  readonly type = UPDATE_CHECKLIST_SUCCESS;

  constructor(public payload: { listingId: number, checklist: CheckList }) {
  }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = IndexRequestAction
  | IndexSuccessAction
  | IndexStatsRequestAction
  | IndexStatsSuccessAction
  | IndexMonthlyBreakdownRequestAction
  | IndexMonthlyBreakdownSuccessAction
  | CreateRequestAction
  | CreateSuccessAction
  | ShowRequestAction
  | ShowSuccessAction
  | UpdateRequestAction
  | UpdateSuccessAction
  | DeleteImageSuccessAction
  | IndexAdminStatsRequestAction
  | IndexAdminStatsSuccessAction
  | CalendarRequestAction
  | CalendarSuccessAction
  | BlockSuccessAction
  | UnblockSuccessAction
  | EditImageSuccessAction
  | AddCheckListSuccessAction
  | DeleteCheckListSuccessAction
  | UpdateCheckListSuccessAction;
