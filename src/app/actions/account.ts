import {Action} from './action';
import {AirbnbAccount} from '../models/airbnb_account';

export const AIRBNB_ACCOUNTS_FETCH_REQUEST = '[ACCOUNTS] Airbnb Accounts fetch request';
export const AIRBNB_ACCOUNTS_FETCH_SUCCESS = '[ACCOUNTS] Airbnb Accounts fetch success';
export const AIRBNB_ACCOUNT_UPDATE_SUCCESS = '[ACCOUNTS] Airbnb Account update success';

export class AirbnbAccountsFetchRequestAction implements Action {
  readonly  type = AIRBNB_ACCOUNTS_FETCH_REQUEST;
}

export class AirbnbAccountsFetchSuccessAction implements Action {
  readonly type = AIRBNB_ACCOUNTS_FETCH_SUCCESS;
  constructor(public payload: AirbnbAccount[]) {
  }
}

export class AirbnbAAccountUpdateSuccessAction implements Action {
  readonly type = AIRBNB_ACCOUNT_UPDATE_SUCCESS;
  constructor(public payload: AirbnbAccount) {
  }
}

export type Actions
  = AirbnbAccountsFetchRequestAction
  | AirbnbAccountsFetchSuccessAction
  | AirbnbAAccountUpdateSuccessAction;
