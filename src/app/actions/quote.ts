import {Action} from './action';
import {Quote} from '../models/quote';


export const INDEX_REQUEST = '[QUOTE] Index Request';
export const INDEX_SUCCESS = '[QUOTE] Index Success';

export const CREATE_REQUEST = '[QUOTE] Create Request';
export const CREATE_SUCCESS = '[QUOTE] Create Success';


export class QuoteIndexRequestAction implements Action {
  readonly type = INDEX_REQUEST;
}

export class QuoteIndexSuccessAction implements Action {
  readonly type = INDEX_SUCCESS;

  constructor(public payload: Quote[]) {
  }
}

export class QuoteCreateRequestAction implements Action {
  readonly type = CREATE_REQUEST;
}

export class QuoteCreateSuccessAction implements Action {
  readonly type = CREATE_SUCCESS;

  constructor(public payload: Quote) {
  }
}


export type Actions
  = QuoteIndexRequestAction
  | QuoteIndexSuccessAction
  | QuoteCreateRequestAction
  | QuoteCreateSuccessAction;
