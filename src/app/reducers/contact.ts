/**
 * Created by Piyush on 22-Jul-17.
 */
import {Action} from '../actions/action';
import Utils from '../utils';
import {createSelector} from 'reselect';
import {
  ADD_LISTING_SUCCESS, CONTACT_ACTIVE_SUCCESS, CONTACT_INACTIVE_SUCCESS, CREATE_REQUEST, CREATE_SUCCESS,
  INDEX_ACTIVE_CONTACT_REQUEST,
  INDEX_ACTIVE_CONTACT_SUCCESS, INDEX_CONTACT_SUCCESS,
  INDEX_INACTIVE_CONTACT_REQUEST, INDEX_INACTIVE_CONTACT_SUCCESS,
  REMOVE_LISTING_SUCCESS, UPDATE_REQUEST, UPDATE_SUCCESS
} from '../actions/contact';
import {AddContactSuccessAction} from "../actions/listing";
import {User} from '../models/user';

export interface State {

  contacts: { [id: number]: User };

  activeContactIds: number[];
  activeContactsLoading: boolean;
  activeContactsLoaded: boolean;

  inactiveContactIds: number[];
  inactiveContactsLoading: boolean;
  inactiveContactsLoaded: boolean;
}

export const initialState: State = {
  activeContactIds: [],
  activeContactsLoading: false,
  activeContactsLoaded: false,

  inactiveContactIds: [],
  inactiveContactsLoading: false,
  inactiveContactsLoaded: false,

  contacts: {},

};

export function reducer(state = initialState, action: Action): State {
  switch (action.type) {

    case INDEX_ACTIVE_CONTACT_REQUEST: {
      return Object.assign({}, state, {activeContactsLoading: true});
    }

    case INDEX_ACTIVE_CONTACT_SUCCESS: {
      const contacts = action.payload;
      const contactIds = contacts.map(contact => contact.id);
      const activeContacts = Utils.normalize(contacts);
      return Object.assign({}, state,
        {
          activeContactsLoading: false,
          activeContactIds: contactIds,
          activeContactsLoaded: true,
          contacts: {
            ...state.contacts,
            ...activeContacts
          }
        });
    }

    case INDEX_INACTIVE_CONTACT_REQUEST: {
      return Object.assign({}, state, {inactiveContactsLoading: true});
    }

    case INDEX_INACTIVE_CONTACT_SUCCESS: {
      const contacts = action.payload;
      const contactIds = contacts.map(contact => contact.id);
      const inactiveContacts = Utils.normalize(contacts);
      return Object.assign({}, state,
        {
          inactiveContactsLoading: false,
          inactiveContactIds: contactIds,
          inactiveContactsLoaded: true,
          contacts: {
            ...state.contacts,
            ...inactiveContacts
          }
        });
    }

    case CREATE_REQUEST: {
      return Object.assign({}, state, {});
    }

    case CREATE_SUCCESS: {
      const newContact = action.payload;
      const newContactId = newContact.id;

      return {
        ...state,
        contacts: {
          ...state.contacts,
          [newContactId]: newContact
        },
        activeContactIds: [
          ...state.activeContactIds,
          newContactId
        ]
      };
    }

    case INDEX_CONTACT_SUCCESS: {
      const newContact = action.payload;
      const newContactId = newContact.id;

      if (newContact.is_active) {
        return {
          ...state,
          contacts: {
            ...state.contacts,
            [newContactId]: newContact
          },
          activeContactIds: [
            ...state.activeContactIds,
            newContactId
          ]
        };
      }
      else {
        return {
          ...state,
          contacts: {
            ...state.contacts,
            [newContactId]: newContact
          },
          inactiveContactIds: [
            ...state.inactiveContactIds,
            newContactId
          ]
        };
      }

    }


    case UPDATE_REQUEST: {
      return Object.assign({}, state, {});
    }

    case UPDATE_SUCCESS: {
      const updatedContact = action.payload;
      const updatedContactId = updatedContact.id;

      return {
        ...state,
        contacts: {
          ...state.contacts,
          [updatedContactId]: updatedContact
        }
      };

    }

    case ADD_LISTING_SUCCESS: {
      const listingId = action.payload.listingId;
      const contactId = action.payload.contactId;


      const contact = Object.assign(new User(), JSON.parse(JSON.stringify(state.contacts[contactId])));
      contact['managementContact']['data']['properties'] = [
        ...contact['managementContact']['data']['properties'],
        listingId
      ];


      return {
        ...state,
        contacts: {
          ...state.contacts,
          [contactId]: contact
        }
      };

    }

    case REMOVE_LISTING_SUCCESS: {
      const listingId = action.payload.listingId;
      const contactId = action.payload.contactId;

      const contact = Object.assign(new User(), JSON.parse(JSON.stringify(state.contacts[contactId])));
      const listingsIds = contact.getManagementContact().properties;
      contact['managementContact']['data']['properties'] = listingsIds.filter(
        item => item != listingId
      );
      return {
        ...state,
        contacts: {
          ...state.contacts,
          [contactId]: contact
        }
      };

    }

    case CONTACT_ACTIVE_SUCCESS: {
      const contact = action.payload;
      if (contact.is_active) {
        let inactiveContactIds = state.inactiveContactIds;
        inactiveContactIds = inactiveContactIds.filter(id => id != contact.id);
        let activeContactIds = [...state.activeContactIds, contact.id];

        return {
          ...state,
          inactiveContactIds: inactiveContactIds,
          activeContactIds: activeContactIds,
          contacts: {
            ...state.contacts,
            [contact.id]: contact
          }
        };
      }

      return state;
    }

    case CONTACT_INACTIVE_SUCCESS: {
      const contact = action.payload;

      if (!contact.is_active) {
        let activeContactIds = state.activeContactIds;
        activeContactIds = activeContactIds.filter(id => id != contact.id);
        let inactiveContactIds = [...state.inactiveContactIds, contact.id];

        return {
          ...state,
          inactiveContactIds: inactiveContactIds,
          activeContactIds: activeContactIds,
          contacts: {
            ...state.contacts,
            [contact.id]: contact
          }
        };
      }

      return state;
    }


    default: {
      return state;
    }
  }
}


export const getIsActiveContactsLoading = (state: State) => state.activeContactsLoading;
export const getIsActiveContactsLoaded = (state: State) => state.activeContactsLoaded;
export const getContactEntities = (state: State) => state.contacts;


export const getActiveContactIds = (state: State) => state.activeContactIds;

export const getById = (state: State, contactId: number) => state.contacts[contactId];


export const getActiveContacts = createSelector(getContactEntities, getActiveContactIds, (contacts, ids) => {
  return ids.map(id => contacts[id]);
});


export const getIsInActiveContactsLoading = (state: State) => state.inactiveContactsLoading;
export const getIsInActiveContactsLoaded = (state: State) => state.inactiveContactsLoaded;

export const getInActiveContactIds = (state: State) => state.inactiveContactIds;


export const getInActiveContacts = createSelector(getContactEntities, getInActiveContactIds, (contacts, ids) => {
  return ids.map(id => contacts[id]);
});


export const getContacts = createSelector(getContactEntities, getInActiveContactIds, getActiveContactIds, (contacts, inactiveIds, activeIds) => {

  let allIds =  [...activeIds , ...inactiveIds];
  allIds  = Array.from(new Set(allIds));

  return allIds.map(id => contacts[id]);
});
