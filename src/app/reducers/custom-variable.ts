import {CustomVariable} from '../models/custom-variable';
import {
  ADD_REQUEST, ADD_SUCCESS, DELETE_REQUEST, DELETE_SUCCESS,
  INDEX_REQUEST, INDEX_SUCCESS, UPDATE_REQUEST, UPDATE_SUCCESS

} from '../actions/custom-variable';
import {Action} from '../actions/action';
import Utils from '../utils';
import {createSelector} from 'reselect';



export interface State {

  ids: number[];
  entities: { [id: number]: CustomVariable };
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
      const customVariables = action.payload;
      const customVariableIds = customVariables.map(customVariable => customVariable.id);
      const entities = Utils.normalize(customVariables);
      return Object.assign({}, state, {loading: false, ids: customVariableIds, loaded: true, entities: entities});
    }

    case ADD_REQUEST: {
      return Object.assign({}, state, {});
    }

    case ADD_SUCCESS: {
      const newCustomVariable = action.payload;
      const newCustomVariableId = newCustomVariable.id;

      return {
        ...state,
        entities: {
          ...state.entities,
          [newCustomVariableId]: newCustomVariable
        },
        ids: [
          ...state.ids,
          newCustomVariableId
        ]
      };
    }

    case UPDATE_REQUEST: {
      return Object.assign({}, state, {});
    }

    case UPDATE_SUCCESS: {
      const newCustomVariable = action.payload;
      const newCustomVariableId = newCustomVariable.id;

      let Ids = state.ids;
      if (state.ids.indexOf(newCustomVariableId) === -1) {
        Ids = [
          ...state.ids,
          newCustomVariableId
        ];
      }

      return {
        ...state,
        entities: {
          ...state.entities,
          [newCustomVariableId]: newCustomVariable
        },
        ids: Ids
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
export const getAll = createSelector(getEntities, getIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});
