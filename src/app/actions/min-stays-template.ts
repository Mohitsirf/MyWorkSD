import {Action} from './action';
import {MinimumStay} from '../models/minimum-stay';


export const INDEX_REQUEST = '[MIN STAYS TEMPLATE] Index  Request';
export const INDEX_SUCCESS = '[MIN STAYS TEMPLATE] Index  Success';
export const CREATE_REQUEST = '[MIN STAYS TEMPLATE] Create  Request';
export const CREATE_SUCCESS = '[MIN STAYS TEMPLATE] Create  Success';
export const UPDATE_REQUEST = '[MIN STAYS TEMPLATE] Update  Request';
export const UPDATE_SUCCESS = '[MIN STAYS TEMPLATE] Update  Success';
export const DELETE_REQUEST = '[MIN STAYS TEMPLATE] Delete  Request';
export const DELETE_SUCCESS = '[MIN STAYS TEMPLATE] Delete  Success';

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */

export class CreateMinStaysTemplateRequestAction implements Action {
  readonly type = CREATE_REQUEST;
}

export class CreateMinStaysTemplateSuccessAction implements Action {
  readonly type = CREATE_SUCCESS;

  constructor(public payload:  {template :  MinimumStay } ) {
  }
}

export class IndexMinStaysTemplateRequestAction implements Action {
  readonly type = INDEX_REQUEST;

  constructor() {
  }
}

export class IndexMinStaysTemplateSuccessAction implements Action {
  readonly type = INDEX_SUCCESS;

  constructor(public payload: {templates :  MinimumStay[] }) {
  }
}

export class UpdateMinStaysTemplateRequestAction implements Action {
  readonly type = UPDATE_REQUEST;
}

export class UpdateMinStaysTemplateSuccessAction implements Action {
  readonly type = UPDATE_SUCCESS;

  constructor(public payload:{template :  MinimumStay }) {
  }
}

export class DeleteMinStaysTemplateRequestAction implements Action {
  readonly type = DELETE_REQUEST;
}

export class DeleteMinStaysTemplateSuccessAction implements Action {
  readonly type = DELETE_SUCCESS;

  constructor(public payload: {templateId:number} ) {
  }
}




/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = CreateMinStaysTemplateRequestAction
  | CreateMinStaysTemplateSuccessAction
  | IndexMinStaysTemplateRequestAction
  | IndexMinStaysTemplateSuccessAction
  | UpdateMinStaysTemplateRequestAction
  | UpdateMinStaysTemplateSuccessAction
  | DeleteMinStaysTemplateRequestAction
  | DeleteMinStaysTemplateSuccessAction;
