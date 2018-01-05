import {LastMinuteDiscount} from '../models/last-minute-discount';
import {Action} from '../actions/action';
import {
  ADD_REQUEST, ADD_SUCCESS, DELETE_REQUEST, DELETE_SUCCESS, INDEX_REQUEST, INDEX_SUCCESS, UPDATE_REQUEST,
  UPDATE_SUCCESS
} from '../actions/discount';
import Utils from '../utils';
import {createSelector} from 'reselect';

export interface State {
  ids: number[];
  entities: { [id: number]: LastMinuteDiscount };
  loading: boolean;
  loaded: boolean;
}

export const initialState: State = {
  ids: [],
  entities: {},
  loading: false,
  loaded: false
}

export function reducer(state = initialState, action: Action): State {
  switch (action.type) {
    case INDEX_REQUEST: {
      return Object.assign({}, state, {loading: true});
    }
    case INDEX_SUCCESS: {
      const discounts = action.payload;
      const discountIds = discounts.map(contact => contact.id);
      const entities = Utils.normalize(discounts);
      return Object.assign({}, state, {loading: false, ids: discountIds, loaded: true, entities: entities});
    }
    case ADD_REQUEST: {
      return Object.assign({}, state, {});
    }

    case ADD_SUCCESS: {
      const newDiscount = action.payload;
      const newDiscountId = newDiscount.id;
      const newIds = [...state.ids, newDiscountId];
      const newEntities = {...state.entities, newDiscountId: newDiscount};


      return {
        ...state,
        entities: {
          ...state.entities,
          [newDiscountId]: newDiscount
        },
        ids: [
          ...state.ids,
          newDiscountId
        ]
      };
    }

    case UPDATE_REQUEST: {
      return Object.assign({}, state, {});
    }

    case UPDATE_SUCCESS: {
      const newDiscount = action.payload;
      const newDiscountId = newDiscount.id;

      let discountIds = state.ids;
      if (state.ids.indexOf(newDiscountId) === -1) {
        discountIds = [
          ...state.ids,
          newDiscountId
        ];
      }

      return {
        ...state,
        entities: {
          ...state.entities,
          [newDiscountId]: newDiscount
        },
        ids: discountIds
      };
    }

    case DELETE_REQUEST: {
      return Object.assign({}, state, {});
    }

    case DELETE_SUCCESS: {
      const id = action.payload;
      const newIds = state.ids.filter((elem) => elem !== id);
      const newEntities = Utils.removeKey(state.entities, id);
      return {...state, ...{ids: newIds, entities: newEntities}};
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
export const getById = (state: State, discountId: number) => state.entities[discountId];


export const getAll = createSelector(getEntities, getIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});
