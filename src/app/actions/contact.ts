/**
 * Created by Piyush on 22-Jul-17.
 */
import {Action} from './action';
import {User} from '../models/user';

export const INDEX_CONTACT_SUCCESS = '[CONTACT] Index Contact Success';
export const INDEX_ACTIVE_CONTACT_REQUEST = '[CONTACT] Index Active Contact Request';
export const INDEX_ACTIVE_CONTACT_SUCCESS = '[CONTACT] Index Active Contact Success';
export const INDEX_INACTIVE_CONTACT_REQUEST = '[CONTACT] Index InActive Contact Request';
export const INDEX_INACTIVE_CONTACT_SUCCESS = '[CONTACT] Index InActive Contact Success';
export const CREATE_REQUEST = '[CONTACT] create request';
export const CREATE_SUCCESS = '[CONTACT] create successful';
export const UPDATE_REQUEST = '[CONTACT] update request';
export const UPDATE_SUCCESS = '[CONTACT] update successful';
export const ADD_LISTING_SUCCESS = '[CONTACT] add listing successful';
export const REMOVE_LISTING_SUCCESS = '[CONTACT] remove listing successful';
export const CONTACT_ACTIVE_SUCCESS = '[CONTACT] active contact successful';
export const CONTACT_INACTIVE_SUCCESS = '[CONTACT] inactive contact successful';


export class ActiveContactIndexRequestAction implements Action {
  readonly type = INDEX_ACTIVE_CONTACT_REQUEST;
}

export class ActiveContactIndexSuccessAction implements Action {
  readonly type = INDEX_ACTIVE_CONTACT_SUCCESS;

  constructor(public payload: User[]) {
  }
}

export class InActiveContactIndexRequestAction implements Action {
  readonly type = INDEX_INACTIVE_CONTACT_REQUEST;
}

export class InActiveContactIndexSuccessAction implements Action {
  readonly type = INDEX_INACTIVE_CONTACT_SUCCESS;

  constructor(public payload: User[]) {
  }
}

export class ActiveContactSuccessAction implements Action {
  readonly type = CONTACT_ACTIVE_SUCCESS;

  constructor(public payload: User) {
  }
}

export class InActiveContactSuccessAction implements Action {
  readonly type = CONTACT_INACTIVE_SUCCESS;

  constructor(public payload: User) {
  }
}

export class IndexContactSuccessAction implements Action {
  readonly type = INDEX_CONTACT_SUCCESS;

  constructor(public payload: User) {
  }
}

export class ContactCreateRequestAction implements Action {
  readonly type = CREATE_REQUEST;
}

export class ContactCreateSuccessAction implements Action {
  readonly type = CREATE_SUCCESS;

  constructor(public payload: User) {
  }
}

export class ContactUpdateRequestAction implements Action {
  readonly type = UPDATE_REQUEST;
}

export class ContactUpdateSuccessAction implements Action {
  readonly type = UPDATE_SUCCESS;

  constructor(public payload: User) {
  }
}

export class AddListingSuccessAction implements Action {
  readonly type = ADD_LISTING_SUCCESS;

  constructor(public payload: { contactId: number, listingId: number }) {
  }
}

export class RemoveListingSuccessAction implements Action {
  readonly type = REMOVE_LISTING_SUCCESS;

  constructor(public payload: { contactId: number, listingId: number }) {

  }
}

export type Actions
  = ActiveContactIndexRequestAction
  | ActiveContactIndexSuccessAction
  | InActiveContactIndexRequestAction
  | InActiveContactIndexSuccessAction
  | ActiveContactSuccessAction
  | InActiveContactSuccessAction
  | ContactCreateRequestAction
  | ContactCreateSuccessAction
  | ContactUpdateRequestAction
  | ContactUpdateSuccessAction
  | AddListingSuccessAction
  | RemoveListingSuccessAction
  | IndexContactSuccessAction;
