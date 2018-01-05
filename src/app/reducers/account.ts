import {AirbnbAccount} from '../models/airbnb_account';
import {Action} from '../actions/action';
import {
  AIRBNB_ACCOUNT_UPDATE_SUCCESS, AIRBNB_ACCOUNTS_FETCH_REQUEST,
  AIRBNB_ACCOUNTS_FETCH_SUCCESS
} from '../actions/account';
import Utils from '../utils';
import {createSelector} from 'reselect';

export interface State {
  ids: number[];
  entities: {
    [id: number]: AirbnbAccount;
  };
  loaded: boolean;
  loading: boolean;
}

export const initialState: State = {
  ids: [],
  entities: {},
  loading: false,
  loaded: false
}

export function reducer(state = initialState, action: Action): State {
  switch (action.type) {
    case AIRBNB_ACCOUNTS_FETCH_REQUEST: {
      return Object.assign({}, state, {loading: true});
    }
    case AIRBNB_ACCOUNTS_FETCH_SUCCESS: {
      const accounts = action.payload;
      const accountIds = accounts.map(account => account.id);
      const entities = Utils.normalize(accounts);
      return Object.assign({}, state, {ids: accountIds, entities: entities, loaded: true, loading: false});
    }
    case AIRBNB_ACCOUNT_UPDATE_SUCCESS: {
      const account = action.payload;
      const id = account.id;


      return {
        ...state,
        entities: {
          ...state.entities,
          [id]: account
        }

      };
    }
    default: {
      return state;
    }
  }
}

export const getIsLoading = (state: State) => state.loading;
export const getIsLoaded = (state: State) => state.loaded;
export const getEntities = (state: State) => state.entities;
export const getIds = (state: State) => state.ids;
export const getAll = createSelector(getEntities, getIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});

