import {Action} from '../actions/action';
import {APP_LANDING_URL, APP_IS_MENU_HIDDEN} from '../actions/app';
import {APP_BOOTSTRAPPED} from '../actions/index';
import {LOGIN_SUCCESS, UPDATE_SUCCESS} from '../actions/user';

export interface State {
  landing_url: string;
  landing_url_overridden: boolean;
  is_bootstrapped: boolean;
  isMenuHidden: boolean;
}

export const initialState: State = {
  landing_url: '/home',
  landing_url_overridden: false,
  is_bootstrapped: false,
  isMenuHidden: false,
};

export function reducer(state = initialState, action: Action): State {
  switch (action.type) {
    case APP_LANDING_URL: {
      return Object.assign({}, state, {landing_url: action.payload, landing_url_overridden: true});
    }
    case APP_BOOTSTRAPPED: {
      return Object.assign({}, state, {is_bootstrapped: true});
    }

    case APP_IS_MENU_HIDDEN: {
      // localStorage.setItem('side_collapsed', String(!state.isMenuHidden));
      return Object.assign({}, state, {isMenuHidden: !state.isMenuHidden});
    }
    case LOGIN_SUCCESS: {
      if (state.landing_url_overridden) {
        return state;
      }

      const user = action.payload;

      if (user.is_admin) {
        return Object.assign({}, state, {landing_url: '/admin-home'});
      } else if (user.is_owner) {
        return Object.assign({}, state, {landing_url: '/home'});
      } else {
        return Object.assign({}, state, {landing_url: '/homeowner-home'});
      }
    }
    case UPDATE_SUCCESS: {
      if (state.landing_url_overridden) {
        return state;
      }

      const user = action.payload;


      if (user.is_admin) {
        return Object.assign({}, state, {landing_url: '/admin-home'});
      } else if (user.is_owner) {
        return Object.assign({}, state, {landing_url: '/home'});
      }
      else {
        return Object.assign({}, state, {landing_url: '/homeowner-home'});
      }
    }
    default: {
      return state;
    }
  }
}

export const getLandingUrl = (state: State) => state.landing_url;
export const getIsBootstrapped = (state: State) => state.is_bootstrapped;
export const getIsMenuHidden = (state: State) => state.isMenuHidden;
