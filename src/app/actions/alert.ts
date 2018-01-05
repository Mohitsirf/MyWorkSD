import {Action} from './action';
import {Alert} from '../models/alert';

export const ALERT_INDEX_REQUEST = '[ALERTS] Alerts index request';
export const ALERT_INDEX_SUCCESS = '[ALERTS] Alerts index success';
export const ALERT_CREATE_REQUEST = '[ALERTS] Alerts create request';
export const ALERT_CREATE_SUCCESS = '[ALERTS] Alerts create success';
export const ALERT_UPDATE_REQUEST = '[ALERTS] Alerts update request';
export const ALERT_UPDATE_SUCCESS = '[ALERTS] Alerts update success';
export const ALERT_DELETE_REQUEST = '[ALERTS] Alerts delete request';
export const ALERT_DELETE_SUCCESS = '[ALERTS] Alerts delete success';

export class AlertsIndexRequestAction implements Action {
  readonly  type = ALERT_INDEX_REQUEST;
}

export class AlertsIndexSuccessAction implements Action {
  readonly type = ALERT_INDEX_SUCCESS;
  constructor(public payload: Alert[]) {
  }
}

export class AlertsCreateRequestAction implements Action {
  readonly  type = ALERT_CREATE_REQUEST;
}

export class AlertsCreateSuccessAction implements Action {
  readonly type = ALERT_CREATE_SUCCESS;
  constructor(public payload: Alert) {
  }
}

export class AlertsUpdateRequestAction implements Action {
  readonly  type = ALERT_UPDATE_REQUEST;
  constructor(public payload: number) {
  }
}

export class AlertsUpdateSuccessAction implements Action {
  readonly type = ALERT_UPDATE_SUCCESS;
  constructor(public payload: Alert) {
  }
}

export class AlertsDeleteRequestAction implements Action {
  readonly  type = ALERT_DELETE_REQUEST;
  constructor(public payload: number) {
  }
}

export class AlertsDeleteSuccessAction implements Action {
  readonly type = ALERT_DELETE_SUCCESS;
  constructor(public payload: number) {
  }
}

export type Actions
  = AlertsIndexRequestAction
  | AlertsIndexSuccessAction
  | AlertsCreateRequestAction
  | AlertsCreateSuccessAction
  | AlertsUpdateRequestAction
  | AlertsUpdateSuccessAction
  | AlertsDeleteRequestAction
  | AlertsDeleteSuccessAction;
