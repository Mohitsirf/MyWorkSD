import {Action} from './action';

export const APP_STATE_RESET = '[App] reset';
export const APP_BOOTSTRAPPED = '[App] bootstrapped';

export class AppStateResetAction implements Action {
  readonly type = APP_STATE_RESET;
}

export class AppBootstrapSuccessAction implements Action {
  readonly type = APP_BOOTSTRAPPED;
}

export type Actions
  = AppStateResetAction
  | AppBootstrapSuccessAction;
