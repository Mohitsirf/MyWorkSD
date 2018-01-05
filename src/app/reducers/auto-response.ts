import {Action} from '../actions/action';
import {
  CREATE_REQUEST,
  CREATE_SUCCESS, DELETE_SUCCESS, INDEX_REQUEST, INDEX_SUCCESS,
  UPDATE_REQUEST,
  UPDATE_SUCCESS
} from '../actions/auto-response';
import {createSelector} from 'reselect';
import Utils from '../utils';
import {AutoResponse} from "../models/auto-response";


export interface State {

  autoResponseIds:number[];
  autoResponses: { [id: string]: AutoResponse };
  autoResponsesLoading: boolean;
  autoResponsesLoaded: boolean;

}

export const initialState: State = {

  autoResponseIds:[],
  autoResponses: {},
  autoResponsesLoading: false,
  autoResponsesLoaded: false,

};

export function reducer(state = initialState, action: Action): State {
  switch (action.type) {


    case INDEX_REQUEST: {
      return Object.assign({}, state, {autoResponsesLoading: true});

    }

    case INDEX_SUCCESS: {
      const responses = action.payload.responses;
      const responseIds = responses.map(response => response.id);
      const entities = Utils.normalize(responses);
      return Object.assign({}, state, {autoResponsesLoaded: true, autoResponseIds: responseIds, autoResponsesLoading: false, autoResponses: entities});

    }

    case DELETE_SUCCESS: {
      const responseId = action.payload.responseId;

      let autoResponses = Utils.getObjectValues(state.autoResponses);


      autoResponses = autoResponses.filter(response =>  response.id != responseId);

      const responseIds = autoResponses.map(response => response.id);
      const entities = Utils.normalize(autoResponses);

      return {
        ...state,
        autoResponses: entities,
        autoResponseIds : responseIds
      };
    }

    case CREATE_SUCCESS: {
      const newResponse = action.payload.response;
      const newResponseId = newResponse.id;


      return {
        ...state,
        autoResponses: {
          ...state.autoResponses,
          [newResponseId]: newResponse
        },
        autoResponseIds: [
          ...state.autoResponseIds,
          newResponseId
        ]
      };
    }

    case UPDATE_SUCCESS: {
      const updatedResponse = action.payload.response;
      const id = updatedResponse.id;


      return {
        ...state,
        autoResponses: {
          ...state.autoResponses,
          [id]: updatedResponse
        }

      };
    }


    default: {
      return state;
    }
  }
}


export const getAutoResponsesEntities = (state: State) => state.autoResponses;
export const getAutoResponsesIds = (state: State) => state.autoResponseIds;

export const isAutoResponsesLoading = (state: State) => state.autoResponsesLoading;
export const isAutoResponsesLoaded = (state: State) => state.autoResponsesLoaded;
export const getAutoResponses = createSelector(getAutoResponsesEntities, getAutoResponsesIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});
