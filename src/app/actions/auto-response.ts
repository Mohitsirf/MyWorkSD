import {Action} from './action';
import {AutoResponse} from '../models/auto-response';


export const INDEX_REQUEST = '[AUTO RESPONSE] Index  Request';
export const INDEX_SUCCESS = '[AUTO RESPONSE] Index  Success';
export const CREATE_REQUEST = '[AUTO RESPONSE] Create  Request';
export const CREATE_SUCCESS = '[AUTO RESPONSE] Create  Success';
export const UPDATE_REQUEST = '[AUTO RESPONSE] Update  Request';
export const UPDATE_SUCCESS = '[AUTO RESPONSE] Update  Success';
export const DELETE_REQUEST = '[AUTO RESPONSE] Delete  Request';
export const DELETE_SUCCESS = '[AUTO RESPONSE] Delete  Success';

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */

export class CreateAutoResponseRequestAction implements Action {
  readonly type = CREATE_REQUEST;
}

export class CreateAutoResponseSuccessAction implements Action {
  readonly type = CREATE_SUCCESS;

  constructor(public payload:  {response :  AutoResponse } ) {
  }
}

export class IndexAutoResponseRequestAction implements Action {
  readonly type = INDEX_REQUEST;

  constructor() {
  }
}

export class IndexAutoResponseSuccessAction implements Action {
  readonly type = INDEX_SUCCESS;

  constructor(public payload: {responses :  AutoResponse[] }) {
  }
}

export class UpdateAutoResponseRequestAction implements Action {
  readonly type = UPDATE_REQUEST;
}

export class UpdateAutoResponseSuccessAction implements Action {
  readonly type = UPDATE_SUCCESS;

  constructor(public payload:{response :  AutoResponse }) {
  }
}

export class DeleteAutoResponseRequestAction implements Action {
  readonly type = DELETE_REQUEST;
}

export class DeleteAutoResponseSuccessAction implements Action {
  readonly type = DELETE_SUCCESS;

  constructor(public payload: {responseId:number} ) {
  }
}




/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = CreateAutoResponseRequestAction
  | CreateAutoResponseSuccessAction
  | IndexAutoResponseRequestAction
  | IndexAutoResponseSuccessAction
  | UpdateAutoResponseRequestAction
  | UpdateAutoResponseSuccessAction
  | DeleteAutoResponseRequestAction
  | DeleteAutoResponseSuccessAction;
