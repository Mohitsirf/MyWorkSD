import {Action} from './action';
import {SavedMessage} from '../models/saved-message';


export const INDEX_REQUEST = '[LISTING] Index  Request';
export const INDEX_SUCCESS = '[LISTING] Index  Success';
export const CREATE_REQUEST = '[LISTING] Create  Request';
export const CREATE_SUCCESS = '[LISTING] Create  Success';
export const UPDATE_REQUEST = '[LISTING] Update  Request';
export const UPDATE_SUCCESS = '[LISTING] Update  Success';
export const DELETE_REQUEST = '[LISTING] Delete  Request';
export const DELETE_SUCCESS = '[LISTING] Delete  Success';

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */

export class CreateSavedMessageRequestAction implements Action {
  readonly type = CREATE_REQUEST;
}

export class CreateSavedMessageSuccessAction implements Action {
  readonly type = CREATE_SUCCESS;

  constructor(public payload:  {message :  SavedMessage } ) {
  }
}

export class IndexSavedMessageRequestAction implements Action {
  readonly type = INDEX_REQUEST;

  constructor() {
  }
}

export class IndexSavedMessageSuccessAction implements Action {
  readonly type = INDEX_SUCCESS;

  constructor(public payload: {messages :  SavedMessage[] }) {
  }
}

export class UpdateSavedMessageRequestAction implements Action {
  readonly type = UPDATE_REQUEST;
}

export class UpdateSavedMessageSuccessAction implements Action {
  readonly type = UPDATE_SUCCESS;

  constructor(public payload:{message :  SavedMessage }) {
  }
}

export class DeleteSavedMessageRequestAction implements Action {
  readonly type = DELETE_REQUEST;
}

export class DeleteSavedMessageSuccessAction implements Action {
  readonly type = DELETE_SUCCESS;

  constructor(public payload: {messageId:number} ) {
  }
}




/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = CreateSavedMessageRequestAction
  | CreateSavedMessageSuccessAction
  | IndexSavedMessageRequestAction
  | IndexSavedMessageSuccessAction
  | UpdateSavedMessageRequestAction
  | UpdateSavedMessageSuccessAction
  | DeleteSavedMessageRequestAction
  | DeleteSavedMessageSuccessAction;
