import {Action} from './action';
import {Tag} from '../models/tag';
import {ManagementContact} from '../models/management-contact';
import {User} from '../models/user';


export const ADMIN_INDEX_REQUEST = '[OPTION] Admin Index request';
export const ADMIN_INDEX_SUCCESS = '[OPTION] Admin Index successful';

export const LOCATIONS_INDEX_REQUEST = '[OPTION] Locations Index request';
export const LOCATIONS_INDEX_SUCCESS = '[OPTION] Locations Index successful';

export const TAGS_INDEX_REQUEST = '[OPTION] Tags Index request';
export const TAGS_INDEX_SUCCESS = '[OPTION] Tags Index successful';
export const TAG_ADD_SUCCESS = '[OPTION] Tag Add successful';

export const VENDOR_INDEX_REQUEST = '[OPTION] Vendor Index request';
export const VENDOR_INDEX_SUCCESS = '[OPTION] Vendor Index successful';

export const TASK_ASSIGNEES_INDEX_REQUEST = '[OPTION] Task Assignees Index request';
export const TASK_ASSIGNEES_INDEX_SUCCESS = '[OPTION] Task Assignees Index successful';


export class AdminIndexRequestAction implements Action {
  readonly type = ADMIN_INDEX_REQUEST;
}

export class AdminIndexSuccessAction implements Action {
  readonly type = ADMIN_INDEX_SUCCESS;

  constructor(public payload: User[]) {
  }
}

export class LocationsIndexRequestAction implements Action {
  readonly type = LOCATIONS_INDEX_REQUEST;
}

export class LocationsIndexSuccessAction implements Action {
  readonly type = LOCATIONS_INDEX_SUCCESS;

  constructor(public payload: string[]) {
  }
}

export class TagsIndexRequestAction implements Action {
  readonly type = TAGS_INDEX_REQUEST;
}

export class TagsIndexSuccessAction implements Action {
  readonly type = TAGS_INDEX_SUCCESS;

  constructor(public payload: string[]) {
  }
}

export class TagAddSuccessAction implements Action {
  readonly type = TAG_ADD_SUCCESS;

  constructor(public payload: Tag) {
  }
}

export class VendorsIndexRequestAction implements Action {
  readonly type = VENDOR_INDEX_REQUEST;
}

export class VendorsIndexSuccessAction implements Action {
  readonly type = VENDOR_INDEX_SUCCESS;

  constructor(public payload: ManagementContact[]) {
  }
}

export class TaskAssigneesIndexRequestAction implements Action {
  readonly type = TASK_ASSIGNEES_INDEX_REQUEST;
}

export class TaskAssigneesIndexSuccessAction implements Action {
  readonly type = TASK_ASSIGNEES_INDEX_SUCCESS;

  constructor(public payload: User[]) {
  }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */

export type Actions
  = AdminIndexRequestAction
  | AdminIndexSuccessAction
  | LocationsIndexRequestAction
  | LocationsIndexSuccessAction
  | TagsIndexRequestAction
  | TagsIndexSuccessAction
  | TagAddSuccessAction
  | VendorsIndexRequestAction
  | VendorsIndexSuccessAction
  | TaskAssigneesIndexRequestAction
  | TaskAssigneesIndexSuccessAction;
