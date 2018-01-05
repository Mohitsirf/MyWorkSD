import {Action} from './action';
import {Task} from '../models/task';
import {AutoTask} from '../models/auto-task';

export const CREATE_REQUEST = '[TASK] create request';
export const CREATE_SUCCESS = '[TASK] create successful';
export const INDEX_REQUEST = '[TASK] index request';
export const INDEX_SUCCESS = '[TASK] index successful';
export const UPDATE_REQUEST = '[TASK] update request';
export const UPDATE_SUCCESS = '[TASK] update successful';
export const DELETE_REQUEST = '[TASK]  delete  Request';
export const DELETE_SUCCESS = '[TASK]  delete  Success';

export const AUTO_TASK_CREATE_REQUEST = '[TASK] auto task create request';
export const AUTO_TASK_CREATE_SUCCESS = '[TASK] auto task create successful';
export const AUTO_TASK_INDEX_REQUEST = '[TASK] auto task index request';
export const AUTO_TASK_INDEX_SUCCESS = '[TASK] auto task index successful';
export const AUTO_TASK_UPDATE_REQUEST = '[TASK] auto task update request';
export const AUTO_TASK_UPDATE_SUCCESS = '[TASK] auto task update successful';
export const AUTO_TASK_DELETE_REQUEST = '[TASK] auto task delete  Request';
export const AUTO_TASK_DELETE_SUCCESS = '[TASK] auto task delete  Success';


/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class TaskIndexRequestAction implements Action {
  readonly type = INDEX_REQUEST;
}

export class TaskIndexSuccessAction implements Action {
  readonly type = INDEX_SUCCESS;

  constructor(public payload: Task[]) {
  }
}

export class TaskCreateRequestAction implements Action {
  readonly type = CREATE_REQUEST;
}

export class TaskCreateSuccessAction implements Action {
  readonly type = CREATE_SUCCESS;

  constructor(public payload: Task) {
  }
}

export class TaskUpdateRequestAction implements Action {
  readonly type = UPDATE_REQUEST;
}

export class TaskUpdateSuccessAction implements Action {
  readonly type = UPDATE_SUCCESS;

  constructor(public payload: Task) {
  }
}

export class TaskDeleteRequestAction implements Action {
  readonly type = DELETE_REQUEST;
}

export class TaskDeleteSuccessAction implements Action {
  readonly type = DELETE_SUCCESS;

  constructor(public payload: {taskId:number} ) {
  }
}

// Auto Tasks

export class AutoTaskIndexRequestAction implements Action {
  readonly type = AUTO_TASK_INDEX_REQUEST;
}

export class AutoTaskIndexSuccessAction implements Action {
  readonly type = AUTO_TASK_INDEX_SUCCESS;

  constructor(public payload: AutoTask[]) {
  }
}

export class AutoTaskCreateRequestAction implements Action {
  readonly type = AUTO_TASK_CREATE_REQUEST;
}

export class AutoTaskCreateSuccessAction implements Action {
  readonly type = AUTO_TASK_CREATE_SUCCESS;

  constructor(public payload: AutoTask) {
  }
}

export class AutoTaskUpdateRequestAction implements Action {
  readonly type = AUTO_TASK_UPDATE_REQUEST;
}

export class AutoTaskUpdateSuccessAction implements Action {
  readonly type = AUTO_TASK_UPDATE_SUCCESS;

  constructor(public payload: AutoTask) {
  }
}

export class AutoTaskDeleteRequestAction implements Action {
  readonly type = AUTO_TASK_DELETE_REQUEST;
}

export class AutoTaskDeleteSuccessAction implements Action {
  readonly type = AUTO_TASK_DELETE_SUCCESS;

  constructor(public payload: {taskId:number} ) {
  }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */

export type Actions
  = TaskIndexRequestAction
  | TaskIndexSuccessAction
  | TaskCreateRequestAction
  | TaskCreateSuccessAction
  | TaskUpdateRequestAction
  | TaskUpdateSuccessAction
  | TaskDeleteRequestAction
  | TaskDeleteSuccessAction
  | AutoTaskIndexRequestAction
  | AutoTaskIndexSuccessAction
  | AutoTaskCreateRequestAction
  | AutoTaskCreateSuccessAction
  | AutoTaskUpdateRequestAction
  | AutoTaskUpdateSuccessAction
  | AutoTaskDeleteRequestAction
  | AutoTaskDeleteSuccessAction;
