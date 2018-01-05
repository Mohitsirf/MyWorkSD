import {Action} from './action';
import {User} from '../models/user';

export const LOGIN_REQUEST = '[USER] login request';
export const LOGIN_SUCCESS = '[USER] login successful';
export const UPDATE_REQUEST = '[USER] update request';
export const UPDATE_SUCCESS = '[USER] update successful';


/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class LoginRequestAction implements Action {
  readonly type = LOGIN_REQUEST;
}

export class LoginSuccessAction implements Action {
  readonly type = LOGIN_SUCCESS;

  constructor(public payload: User) {
  }
}

export class UpdateRequestAction implements Action {
  readonly type = UPDATE_REQUEST;
}

export class UpdateSuccessAction implements Action {
  readonly type = UPDATE_SUCCESS;

  constructor(public payload: User) {
  }
}


/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = LoginRequestAction
  | LoginSuccessAction
  | UpdateRequestAction
  | UpdateSuccessAction;
