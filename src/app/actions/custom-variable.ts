import {Action} from './action';
import {CustomVariable} from '../models/custom-variable';


export const INDEX_REQUEST = '[CUSTOM VARIABLE] Index Request';
export const INDEX_SUCCESS = '[CUSTOM VARIABLE] Index Success';
export const ADD_REQUEST = '[CUSTOM VARIABLE] add request';
export const ADD_SUCCESS = '[CUSTOM VARIABLE] add successful';
export const DELETE_REQUEST = '[CUSTOM VARIABLE] delete request';
export const DELETE_SUCCESS = '[CUSTOM VARIABLE] delete successful';
export const UPDATE_REQUEST = '[CUSTOM VARIABLE] create request';
export const UPDATE_SUCCESS = '[CUSTOM VARIABLE] create successful';


export class CustomVariableIndexRequestAction implements Action {
  readonly type = INDEX_REQUEST;
}

export class CustomVariableIndexSuccessAction implements Action {
  readonly type = INDEX_SUCCESS;

  constructor(public payload: CustomVariable[]) {
  }
}

export class CustomVariableAddRequestAction implements Action {
  readonly type = ADD_REQUEST;
}

export class CustomVariableAddSuccessAction implements Action {
  readonly type = ADD_SUCCESS;

  constructor(public payload: CustomVariable) {
  }
}

export class CustomVariableUpdateRequestAction implements Action {
  readonly type = UPDATE_REQUEST;
}

export class CustomVariableUpdateSuccessAction implements Action {
  readonly type = UPDATE_SUCCESS;

  constructor(public payload: CustomVariable) {
  }
}

export class CustomVariableDeleteRequestAction implements Action {
  readonly type = DELETE_REQUEST;
}

export class CustomVariableDeleteSuccessAction implements Action {
  readonly type = DELETE_SUCCESS;

  constructor(public payload: number) {
  }
}

export type Actions
  = CustomVariableAddRequestAction
  | CustomVariableAddSuccessAction
  | CustomVariableIndexRequestAction
  | CustomVariableIndexSuccessAction
  | CustomVariableUpdateRequestAction
  | CustomVariableUpdateSuccessAction
  | CustomVariableDeleteRequestAction
  | CustomVariableDeleteSuccessAction;
;
