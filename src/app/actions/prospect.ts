import {Action} from './action';
import {Prospect} from '../models/prospect';


export const INDEX_TODAY_REQUEST = '[PROSPECT] Index Today Request';
export const INDEX_TODAY_SUCCESS = '[PROSPECT] Index Today Success';

export const INDEX_UPCOMING_REQUEST = '[PROSPECT] Index Upcoming Request';
export const INDEX_UPCOMING_SUCCESS = '[PROSPECT] Index Upcoming Success';

export const INDEX_EXPIRED_REQUEST = '[PROSPECT] Index Expired Request';
export const INDEX_EXPIRED_SUCCESS = '[PROSPECT] Index Expired Success';

export const INDEX_PASSED_REQUEST = '[PROSPECT] Index Passed Request';
export const INDEX_PASSED_SUCCESS = '[PROSPECT] Index Passed Success';


export const CREATE_REQUEST = '[PROSPECT] Create Request';
export const CREATE_SUCCESS = '[PROSPECT] Create Success';


export class ProspectIndexTodayRequestAction implements Action {
  readonly type = INDEX_TODAY_REQUEST;
}

export class ProspectIndexTodaySuccessAction implements Action {
  readonly type = INDEX_TODAY_SUCCESS;

  constructor(public payload: {prospects: Prospect[], currentPage: number, totalPages: number, totalCount: number}) {
  }
}

export class ProspectIndexUpcomingRequestAction implements Action {
  readonly type = INDEX_UPCOMING_REQUEST;
}

export class ProspectIndexUpcomingSuccessAction implements Action {
  readonly type = INDEX_UPCOMING_SUCCESS;

  constructor(public payload: {prospects: Prospect[], currentPage: number, totalPages: number, totalCount: number}) {
  }
}

export class ProspectIndexExpiredRequestAction implements Action {
  readonly type = INDEX_EXPIRED_REQUEST;
}

export class ProspectIndexExpiredSuccessAction implements Action {
  readonly type = INDEX_EXPIRED_SUCCESS;

  constructor(public payload: {prospects: Prospect[], currentPage: number, totalPages: number, totalCount: number}) {
  }
}

export class ProspectIndexPassedRequestAction implements Action {
  readonly type = INDEX_PASSED_REQUEST;
}

export class ProspectIndexPassedSuccessAction implements Action {
  readonly type = INDEX_PASSED_SUCCESS;

  constructor(public payload: {prospects: Prospect[], currentPage: number, totalPages: number, totalCount: number}) {
  }
}

export class ProspectCreateRequestAction implements Action {
  readonly type = CREATE_REQUEST;
}

export class ProspectCreateSuccessAction implements Action {
  readonly type = CREATE_SUCCESS;

  constructor(public payload: Prospect) {
  }
}


export type Actions
  = ProspectIndexTodayRequestAction
  | ProspectIndexTodaySuccessAction
  | ProspectIndexUpcomingRequestAction
  | ProspectIndexUpcomingSuccessAction
  | ProspectIndexExpiredRequestAction
  | ProspectIndexExpiredSuccessAction
  | ProspectIndexPassedRequestAction
  | ProspectIndexPassedSuccessAction
  | ProspectCreateRequestAction
  | ProspectCreateSuccessAction;
