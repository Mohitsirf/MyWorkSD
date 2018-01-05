import {Quote} from '../models/quote';
import {
  CREATE_REQUEST, CREATE_SUCCESS,
  INDEX_REQUEST, INDEX_SUCCESS

} from '../actions/quote';
import {Action} from '../actions/action';
import Utils from '../utils';
import {createSelector} from 'reselect';



export interface State {

  ids: number[];
  entities: { [id: number]: Quote };
  loading: boolean;
  loaded: boolean;
}

export const initialState: State = {
  ids: [],
  entities: {},
  loading: false,
  loaded: false
};

export function reducer(state = initialState, action: Action): State {
  switch (action.type) {

    case INDEX_REQUEST: {
      return Object.assign({}, state, {loading: true});
    }
    case INDEX_SUCCESS: {
      const quotes = action.payload;
      const quoteIds = quotes.map(quote => quote.id);
      const entities = Utils.normalize(quotes);
      return Object.assign({}, state, {loading: false, ids: quoteIds, loaded: true, entities: entities});
    }

    case CREATE_REQUEST: {
      return state;
    }
    case CREATE_SUCCESS: {
      const quotes = action.payload;
      const quoteIds = quotes.map(quote => quote.id);
      const entities = Utils.normalize(quotes);
      return Object.assign({}, state, {loading: false, ids: quoteIds, loaded: true, entities: entities});
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
