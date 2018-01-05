import {Action} from './action';

export const APP_LANDING_URL = '[App] landing_url';
export const APP_IS_MENU_HIDDEN = '[App] is_menu_hidden';


/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class SetLandingUrlAction implements Action {
  readonly type = APP_LANDING_URL;

  constructor(public payload: string) {
  }
}

export class MenuHiddenChangeAction implements Action {
  readonly type = APP_IS_MENU_HIDDEN;

  constructor() {
  }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = SetLandingUrlAction;
