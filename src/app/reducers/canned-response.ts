import {Action} from '../actions/action';
import {
  CREATE_REQUEST,
  CREATE_SUCCESS, DELETE_SUCCESS, INDEX_REQUEST, INDEX_SUCCESS,
  UPDATE_REQUEST,
  UPDATE_SUCCESS
} from '../actions/canned-response';
import {createSelector} from 'reselect';
import Utils from '../utils';
import {SavedMessage} from "../models/saved-message";


export interface State {

  savedMessageIds:number[];
  savedMessages: { [id: string]: SavedMessage };
  savedMessagesLoading: boolean;
  savedMessagesLoaded: boolean;

}

export const initialState: State = {

  savedMessageIds:[],
  savedMessages: {},
  savedMessagesLoading: false,
  savedMessagesLoaded: false,

};

export function reducer(state = initialState, action: Action): State {
  switch (action.type) {


    case INDEX_REQUEST: {
      return Object.assign({}, state, {savedMessagesLoading: true});

    }

    case INDEX_SUCCESS: {
      const messages = action.payload.messages;
      const messageIds = messages.map(message => message.id);
      const entities = Utils.normalize(messages);
      return Object.assign({}, state, {savedMessagesLoaded: true, savedMessageIds: messageIds, savedMessagesLoading: false, savedMessages: entities});

    }

    case DELETE_SUCCESS: {
      const messageId = action.payload.messageId;

      let savedMessages = Utils.getObjectValues(state.savedMessages);


      savedMessages = savedMessages.filter(message =>  message.id != messageId);

      const messageIds = savedMessages.map(message => message.id);
      const entities = Utils.normalize(savedMessages);

      return {
        ...state,
        savedMessages: entities,
        savedMessageIds : messageIds
      };
    }

    case CREATE_SUCCESS: {
      const newMessage = action.payload.message;
      const newMessageId = newMessage.id;


      return {
        ...state,
        savedMessages: {
          ...state.savedMessages,
          [newMessageId]: newMessage
        },
        savedMessageIds: [
          ...state.savedMessageIds,
          newMessageId
        ]
      };
    }

    case UPDATE_SUCCESS: {
      const updatedMessage = action.payload.message;
      const id = updatedMessage.id;


      return {
        ...state,
        savedMessages: {
          ...state.savedMessages,
          [id]: updatedMessage
        }

      };
    }


    default: {
      return state;
    }
  }
}


export const getSavedMessageEntities = (state: State) => state.savedMessages;
export const getSavedMessageIds = (state: State) => state.savedMessageIds;

export const isSavedMessagesLoading = (state: State) => state.savedMessagesLoading;
export const isSavedMessagesLoaded = (state: State) => state.savedMessagesLoaded;
export const getSavedMessages = createSelector(getSavedMessageEntities, getSavedMessageIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});
