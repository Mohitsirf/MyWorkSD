/**
 * Created by Piyush on 22-Jul-17.
 */
import {Action} from './action';
import {MultiCalendar} from '../models/multi-calendar';


export const INDEX_REQUEST = '[MULTI CALENDAR] Index Request';
export const INDEX_SUCCESS = '[MULTI CALENDAR] Index Success';


export class MultiCalendarIndexRequestAction implements Action {
  readonly type = INDEX_REQUEST;

  constructor(public payload: string) {
  }
}

export class MultiCalendarIndexSuccessAction implements Action {
  readonly type = INDEX_SUCCESS;

  constructor(public payload: { key: string, data: MultiCalendar }) {
  }
}


export type Actions
  = MultiCalendarIndexRequestAction
  | MultiCalendarIndexSuccessAction;
