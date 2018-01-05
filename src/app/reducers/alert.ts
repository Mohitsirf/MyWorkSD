
import {Alert} from '../models/alert';
import {Action} from '../actions/action';
import {
  ALERT_CREATE_REQUEST, ALERT_CREATE_SUCCESS, ALERT_DELETE_REQUEST, ALERT_DELETE_SUCCESS, ALERT_INDEX_REQUEST,
  ALERT_INDEX_SUCCESS,
  ALERT_UPDATE_REQUEST, ALERT_UPDATE_SUCCESS
} from '../actions/alert';
import Utils from '../utils';
import {createSelector} from 'reselect';

export interface State {
  ids: number[];
  entities: {
    [id: number]: Alert;
  };
  loaded: boolean;
  loading: boolean;
}

export const initialState: State = {
  ids: [],
  entities: {},
  loading: false,
  loaded: false
};

export function reducer(state = initialState, action: Action): State {
  switch (action.type) {
    case ALERT_INDEX_REQUEST: {
      return Object.assign({}, state, {loading: true});
    }

    case ALERT_INDEX_SUCCESS: {
      const alerts = action.payload;
      const alertIds = alerts.map(alert => alert.id);
      const entities = Utils.normalize(alerts);
      return Object.assign({}, state, {ids: alertIds, entities: entities, loaded: true, loading: false});
    }

    case ALERT_CREATE_REQUEST: {
      return state;
    }

    case ALERT_CREATE_SUCCESS: {
      const newAlert = action.payload;
      const newAlertId = newAlert.id;

      return {
        ...state,
        entities: {
          ...state.entities,
          [newAlertId]: newAlert
        },
        ids: [
          ...state.ids,
          newAlertId
        ]
      };
    }

    case ALERT_UPDATE_REQUEST: {
      return Object.assign({}, state, {});
    }

    case ALERT_UPDATE_SUCCESS: {
      const newAlert = action.payload;
      const newAlertId = newAlert.id;

      let Ids = state.ids;
      if (state.ids.indexOf(newAlert.id) === -1) {
        Ids = [
          ...state.ids,
          newAlertId
        ];
      }

      return {
        ...state,
        entities: {
          ...state.entities,
          [newAlertId]: newAlert
        },
        ids: Ids
      };
    }

    case ALERT_DELETE_REQUEST: {
      return Object.assign({}, state, {});
    }

    case ALERT_DELETE_SUCCESS: {
      const id = action.payload;
      const newIds = state.ids.filter((elem) => elem !== id);
      const newEntities = Utils.removeKey(state.entities, id);
      return {
        ...state,
        ids: newIds,
        entities: newEntities
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

