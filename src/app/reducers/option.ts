/**
 * Created by Piyush on 22-Jul-17.
 */
import {Action} from '../actions/action';
import Utils from '../utils';
import {createSelector} from 'reselect';
import {
  ADMIN_INDEX_REQUEST, ADMIN_INDEX_SUCCESS, LOCATIONS_INDEX_REQUEST,
  LOCATIONS_INDEX_SUCCESS, TAG_ADD_SUCCESS, TAGS_INDEX_REQUEST, TAGS_INDEX_SUCCESS, TASK_ASSIGNEES_INDEX_REQUEST,
  TASK_ASSIGNEES_INDEX_SUCCESS,
  VENDOR_INDEX_REQUEST,
  VENDOR_INDEX_SUCCESS
} from '../actions/option';
import {isNullOrUndefined} from "util";
import {ManagementContact} from '../models/management-contact';
import {User} from '../models/user';

export interface State {
  admin_ids: number[];
  entities: { [id: number]: User };
  adminsLoading: boolean;
  adminsLoaded: boolean;

  locations: string[];
  locationsLoading: boolean;
  locationsLoaded: boolean;

  tags: string[];
  tagsLoading: boolean;
  tagsLoaded: boolean;

  vendors: User[];
  vendorsLoading: boolean;
  vendorsLoaded: boolean;

  taskAssignees: User[];
  taskAssigneesLoading: boolean;
  taskAssigneesLoaded: boolean;
}

export const initialState: State = {
  admin_ids: [],
  entities: {},
  adminsLoading: false,
  adminsLoaded: false,

  locations: [],
  locationsLoading: false,
  locationsLoaded: false,

  tags: [],
  tagsLoading: false,
  tagsLoaded: false,

  vendors: [],
  vendorsLoading: false,
  vendorsLoaded: false,

  taskAssignees: [],
  taskAssigneesLoading: false,
  taskAssigneesLoaded: false,
};

export function reducer(state = initialState, action: Action): State {
  switch (action.type) {
    case ADMIN_INDEX_REQUEST: {
      return Object.assign({}, state, {adminsLoading: true});
    }
    case ADMIN_INDEX_SUCCESS: {
      const admins = action.payload;
      const adminIds = admins.map(contact => contact.id);
      const entities = Utils.normalize(admins);
      return Object.assign({}, state, {
        adminsLoading: false,
        admin_ids: adminIds,
        adminsLoaded: true,
        entities: entities
      });
    }

    case LOCATIONS_INDEX_REQUEST: {
      return Object.assign({}, state, {locationsLoading: true});
    }
    case LOCATIONS_INDEX_SUCCESS: {
      const locations = action.payload;
      return Object.assign({}, state, {locationsLoading: false, locationsLoaded: true, locations: locations});
    }

    case TAGS_INDEX_REQUEST: {
      return Object.assign({}, state, {tagsLoading: true});
    }
    case TAGS_INDEX_SUCCESS: {
      const tags = action.payload;
      return Object.assign({}, state, {tagsLoading: false, tagsLoaded: true, tags: tags});
    }

    case TAG_ADD_SUCCESS: {
      const tag = action.payload;

      if (!state.tags.includes(tag.title)) {
        const tags =[
          ...state.tags,
          tag.title
        ];

        tags.sort((first,second) => {
          if(first < second) return -1;
          if(first > second) return 1;
          return 0;
        });

        return {
          ...state,
          tags:tags
        };
      }
      return state;
    }

    case VENDOR_INDEX_REQUEST: {
      return Object.assign({}, state, {vendorsLoading: true});
    }
    case VENDOR_INDEX_SUCCESS: {
      const vendors = action.payload;
      return Object.assign({}, state, {vendorsLoading: false, vendorsLoaded: true, vendors: vendors});
    }

    case TASK_ASSIGNEES_INDEX_REQUEST: {
      return Object.assign({}, state, {taskAssigneesLoading: true});
    }
    case TASK_ASSIGNEES_INDEX_SUCCESS: {
      const taskAssignees = action.payload;
      return Object.assign({}, state, {
        taskAssigneesLoading: false,
        taskAssigneesLoaded: true,
        taskAssignees: taskAssignees
      });
    }

    default: {
      return state;
    }
  }
}


export const getIsAdminsLoading = (state: State) => state.adminsLoading;
export const getIsAdminsLoaded = (state: State) => state.adminsLoaded;

export const getAdminEntities = (state: State) => state.entities;
export const getAdminIds = (state: State) => state.admin_ids;

export const getAllAdmins = createSelector(getAdminEntities, getAdminIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});

export const getIsLocationsLoading = (state: State) => state.locationsLoading;
export const getIsLocationsLoaded = (state: State) => state.locationsLoaded;
export const getLocationEntities = (state: State) => state.locations;


export const getIsTagsLoading = (state: State) => state.tagsLoading;
export const getIsTagsLoaded = (state: State) => state.tagsLoaded;
export const getTagsEntities = (state: State) => state.tags;

export const getIsVendorsLoading = (state: State) => state.vendorsLoading;
export const getIsVendorsLoaded = (state: State) => state.vendorsLoaded;
export const getVendorsEntities = (state: State) => state.vendors;


export const getIsTaskAssigneesLoading = (state: State) => state.taskAssigneesLoading;
export const getIsTaskAssigneesLoaded = (state: State) => state.taskAssigneesLoaded;
export const getTaskAssigneesEntities = (state: State) => state.taskAssignees;
