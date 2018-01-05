import {Action} from './action';
import {LastMinuteDiscount} from '../models/last-minute-discount';

export const INDEX_REQUEST = '[DISCOUNT] Index Request';
export const INDEX_SUCCESS = '[DISCOUNT] Index Success';
export const ADD_REQUEST = '[DISCOUNT] add request';
export const ADD_SUCCESS = '[DISCOUNT] add successful';
export const DELETE_REQUEST = '[DISCOUNT] delete request';
export const DELETE_SUCCESS = '[DISCOUNT] delete successful'
export const UPDATE_REQUEST = '[DISCOUNT] create request';
export const UPDATE_SUCCESS = '[DISCOUNT] create successful';


export class DiscountIndexRequestAction implements Action {
  readonly type = INDEX_REQUEST;
}

export class DiscountIndexSuccessAction implements Action {
  readonly type = INDEX_SUCCESS;

  constructor(public payload: LastMinuteDiscount[]) {
  }
}

export class DiscountAddRequestAction implements Action {
  readonly type = ADD_REQUEST;
}

export class DiscountADDSuccessAction implements Action {
  readonly type = ADD_SUCCESS;

  constructor(public payload: LastMinuteDiscount) {
  }
}

export class DiscountUpdateRequestAction implements Action {
  readonly type = UPDATE_REQUEST;
}

export class DiscountUpdateSuccessAction implements Action {
  readonly type = UPDATE_SUCCESS;

  constructor(public payload: LastMinuteDiscount) {
  }
}

  export class DiscountDeleteRequestAction implements Action {
  readonly type = DELETE_REQUEST;
}

export class DiscountDeleteSuccessAction implements Action {
  readonly type = DELETE_SUCCESS;

  constructor(public payload: number) {
  }
}

export type Actions
 = DiscountAddRequestAction
  | DiscountADDSuccessAction
  | DiscountIndexRequestAction
  | DiscountIndexSuccessAction
  | DiscountUpdateRequestAction
  | DiscountUpdateSuccessAction
  | DiscountDeleteRequestAction
  | DiscountDeleteSuccessAction;
