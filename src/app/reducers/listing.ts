/**
 * Created by piyushkantm on 19/06/17.
 */
import {Listing} from '../models/listing';
import {Action} from '../actions/action';
import {
  ADD_CONTACT_SUCCESS,
  ADD_IMAGE_SUCCESS, TAG_ATTACH_SUCCESS,
  CREATE_REQUEST,
  CREATE_SUCCESS, DELETE_CONTACT_SUCCESS, DELETE_IMAGE_SUCCESS, TAG_DELETE_SUCCESS, INDEX_ADMIN_STATS_REQUEST,
  INDEX_ADMIN_STATS_SUCCESS,
  INDEX_MONTHLY_BREAKDOWN_REQUEST,
  INDEX_MONTHLY_BREAKDOWN_SUCCESS,
  INDEX_REQUEST,
  INDEX_STATS_REQUEST,
  INDEX_STATS_SUCCESS,
  INDEX_SUCCESS,
  SHOW_REQUEST,
  SHOW_SUCCESS,
  UPDATE_REQUEST,
  UPDATE_SUCCESS, CALENDAR_REQUEST, CALENDAR_SUCCESS, BLOCK_SUCCESS, UNBLOCK_SUCCESS, EDIT_IMAGE_SUCCESS,
  IMAGE_SORTING_SUCCESS,  ADD_CHECKLIST_SUCCESS, DELETE_CHECKLIST_SUCCESS,
  UPDATE_CHECKLIST_SUCCESS
} from '../actions/listing';
import {createSelector} from 'reselect';
import Utils from '../utils';
import {OwnerDashStats} from '../models/owner-dash-stats';
import {AdminDashStats} from '../models/admin-dash-stats';
import {isNullOrUndefined} from "util";
import {Image} from '../models/image';
import {CheckList} from '../models/check-list';
import {SavedMessage} from "../models/saved-message";


export interface State {
  ids: number[];
  entities: { [id: number]: Listing };
  ownerStats: { [id: number]: OwnerDashStats };
  adminStats: { [id: number]: AdminDashStats };

  monthlyBreakdown: { [month: string]: { [propertyId: number]: number } };

  loaded: boolean;
  loading: boolean;

  statsLoading: boolean;
  statsLoaded: boolean;

  adminStatsLoading: boolean;
  adminStatsLoaded: boolean;

  monthlyBreakdownLoading: boolean;
  monthlyBreakdownLoaded: boolean;

  calendar: { [month: string]: any[] };
  calendarLoadingIds: string[];
  calendarLoadedIds: string[];


  checklists: {
    data: CheckList[];
  };
}

export const initialState: State = {
  ids: [],
  entities: {},
  ownerStats: {},
  adminStats: {},

  monthlyBreakdown: {},

  loaded: false,
  loading: false,

  statsLoading: false,
  statsLoaded: false,

  adminStatsLoading: false,
  adminStatsLoaded: false,

  monthlyBreakdownLoading: false,
  monthlyBreakdownLoaded: false,

  calendar: {},
  calendarLoadingIds: [],
  calendarLoadedIds: [],


  checklists: {
    data: []
  },
};

export function reducer(state = initialState, action: Action): State {
  switch (action.type) {
    case INDEX_REQUEST: {
      return Object.assign({}, state, {loading: true});
    }
    case INDEX_SUCCESS: {
      const listings = action.payload;
      const listingIds = listings.map(listing => listing.id);
      const entities = Utils.normalize(listings);

      return Object.assign({}, state, {ids: listingIds, entities: entities, loaded: true, loading: false});
    }
    case INDEX_STATS_REQUEST: {
      return Object.assign({}, state, {statsLoading: true});
    }
    case INDEX_STATS_SUCCESS: {
      const ownerStats = action.payload;

      return Object.assign({}, state, {ownerStats: ownerStats, statsLoaded: true, statsLoading: false});
    }

    case INDEX_ADMIN_STATS_REQUEST: {
      return Object.assign({}, state, {adminStatsLoading: true});
    }
    case INDEX_ADMIN_STATS_SUCCESS: {
      const adminStats = action.payload;

      return Object.assign({}, state, {adminStats: adminStats, adminStatsLoaded: true, adminStatsLoading: false});
    }


    case INDEX_MONTHLY_BREAKDOWN_REQUEST: {
      return Object.assign({}, state, {monthlyBreakdownLoading: true});
    }
    case INDEX_MONTHLY_BREAKDOWN_SUCCESS: {
      const breakdown = action.payload;

      return Object.assign({}, state, {
        monthlyBreakdown: breakdown,
        monthlyBreakdownLoaded: true,
        monthlyBreakdownLoading: false
      });
    }
    case CREATE_REQUEST: {
      return Object.assign({}, state, {});
    }
    case CREATE_SUCCESS: {
      const newListing = action.payload;
      const newListingId = newListing.id;

      const newIds = [...state.ids, newListingId];
      const newEntities = {...state.entities, newListingId: newListing};

      return {
        ...state,
        entities: {
          ...state.entities,
          [newListingId]: newListing
        },
        ids: [
          ...state.ids,
          newListingId
        ]
      };
    }
    case SHOW_REQUEST: {
      // return Object.assign({}, state, {updating: true});
      return state;
    }
    case UPDATE_REQUEST: {
      return Object.assign({}, state, {updating: true});
    }
    case SHOW_SUCCESS: {
      const newListing = action.payload;
      const newListingId = newListing.id;

      let newListingIds = state.ids;
      if (state.ids.indexOf(newListingId) === -1) {
        newListingIds = [
          ...state.ids,
          newListingId
        ];
      }

      return {
        ...state,
        entities: {
          ...state.entities,
          [newListingId]: newListing
        },
        ids: newListingIds
      };
    }

    case  UPDATE_SUCCESS: {
      const newListing = action.payload;
      const newListingId = newListing.id;

      let newListingIds = state.ids;
      if (state.ids.indexOf(newListingId) === -1) {
        newListingIds = [
          ...state.ids,
          newListingId
        ];
      }

      return {
        ...state,
        entities: {
          ...state.entities,
          [newListingId]: newListing
        },
        ids: newListingIds
      };
    }

    case TAG_DELETE_SUCCESS: {
      const listingId = action.payload.listingId;
      const tagId = action.payload.tagId;

      const listing = Object.assign(new Listing(), JSON.parse(JSON.stringify(state.entities[listingId])));

      const tags = listing.getTags();

      const index = tags.findIndex(item => {
        return String(item.id) === tagId;
      });

      if (index > -1) {
        listing['tags']['data'] = [
          ...listing['tags']['data'].slice(0, index),
          ...listing['tags']['data'].slice(index + 1),
        ];
      }

      return {
        ...state,
        entities: {
          ...state.entities,
          [listingId]: listing
        }
      };
    }
    case TAG_ATTACH_SUCCESS: {
      const listingId = action.payload.listingId;
      const tag = action.payload.tag;

      const listing = Object.assign(new Listing(), JSON.parse(JSON.stringify(state.entities[listingId])));


      const item = listing.getTags().find(data => data.id === tag.id);


      if (isNullOrUndefined(item)) {
        listing['tags']['data'] = [
          ...listing['tags']['data'],
          tag
        ];
      }


      return {
        ...state,
        entities: {
          ...state.entities,
          [listingId]: listing
        }
      };
    }

    case DELETE_IMAGE_SUCCESS: {
      const listingId = action.payload.listingId;
      const imageId = action.payload.imageId;

      const listing = Object.assign(new Listing(), JSON.parse(JSON.stringify(state.entities[listingId])));

      const thumbnails = listing.getThumbnails();

      const index = thumbnails.findIndex(item => {
        return String(item.id) === imageId;
      });

      if (index > -1) {
        listing['images']['data'] = [
          ...listing['images']['data'].slice(0, index),
          ...listing['images']['data'].slice(index + 1),
        ];
      }

      return {
        ...state,
        entities: {
          ...state.entities,
          [listingId]: listing
        }
      };
    }
    case ADD_IMAGE_SUCCESS: {
      const listingId = action.payload.listingId;
      const image = action.payload.image;

      const listing = Object.assign(new Listing(), JSON.parse(JSON.stringify(state.entities[listingId])));

      listing['images']['data'] = [
        ...listing['images']['data'],
        image
      ];

      return {
        ...state,
        entities: {
          ...state.entities,
          [listingId]: listing
        }
      };
    }

    case EDIT_IMAGE_SUCCESS: {
      const listingId = action.payload.listingId;
      const image = action.payload.image;
      const listing = Object.assign(new Listing(), JSON.parse(JSON.stringify(state.entities[listingId])));
      const images = listing['images']['data'];
      const newImages = images.map((img) => {
        if(img['id'] === image.id){
          img['caption'] = image.caption;
        }

        return img;
      });

      listing['images']['data'] = newImages;

      return {
        ...state,
        entities: {
          ...state.entities,
          [listingId]: listing
        }
      };
    }
    case IMAGE_SORTING_SUCCESS: {
      const listingId = action.payload.listingId;
      const listingImages = action.payload.images;
      const sortOrder = action.payload.sortOrder;
      const listing = Object.assign(new Listing(), JSON.parse(JSON.stringify(state.entities[listingId])));
      const newImages = listingImages.map((img) => {
        const image = Object.assign({},img);
        image['sort_order'] = sortOrder[image['id']];
        return image;
      });
      listing['images']['data'] = newImages

      return {
        ...state,
        entities: {
          ...state.entities,
          [listingId]: listing
        }
      };
    }

    case ADD_CONTACT_SUCCESS: {
      const listingId = action.payload.listingId;
      const contact = action.payload.contact;

      console.log(contact);

      const listing = Object.assign(new Listing(), JSON.parse(JSON.stringify(state.entities[listingId])));
      listing['managementContacts']['data'] = [
        ...listing['managementContacts']['data'],
        contact
      ];

      return {
        ...state,
        entities: {
          ...state.entities,
          [listingId]: listing
        }
      };
    }

    case DELETE_CONTACT_SUCCESS: {
      const listingId = action.payload.listingId;
      const contact = action.payload.contact;

      const listing = Object.assign(new Listing(), JSON.parse(JSON.stringify(state.entities[listingId])));

      const contacts = listing.getMaintenancesContacts();


      listing['managementContacts']['data'] = contacts.filter(
        item => item['managementContact']['data']['id'] != contact['managementContact']['data']['id']
      );


      return {
        ...state,
        entities: {
          ...state.entities,
          [listingId]: listing
        }
      };
    }

    case CALENDAR_REQUEST: {
      const listingId = action.payload.listingId;
      const month = action.payload.month;

      const index = String(listingId) + '-' + month;

      let loadingIds = state.calendarLoadingIds;

      if (state.calendarLoadingIds.indexOf(index) === -1) {
        loadingIds = [
          ...state.calendarLoadingIds,
          index
        ];
      }

      return {
        ...state,
        calendarLoadingIds: loadingIds
      };
    }

    case CALENDAR_SUCCESS: {
      const listingId = action.payload.listingId;
      const month = action.payload.month;
      const data = action.payload.data;

      const index = String(listingId) + '-' + month;

      const newLoadingIds = state.calendarLoadingIds.filter(item => {
        return item !== index;
      });

      let newLoadedIds = state.calendarLoadedIds;
      if (state.calendarLoadedIds.indexOf(index) === -1) {
        newLoadedIds = [
          ...state.calendarLoadedIds,
          index
        ];
      }

      return {
        ...state,
        calendarLoadingIds: newLoadingIds,
        calendarLoadedIds: newLoadedIds,
        calendar: {
          ...state.calendar,
          [index]: data
        }
      };
    }

    case BLOCK_SUCCESS: {
      const listingId = action.payload.listingId;
      const month = action.payload.month;
      const block = action.payload.block;

      const index = String(listingId) + '-' + month;

      if (state.calendar[index]) {

        return {
          ...state,
          calendar: {
            ...state.calendar,
            [index]: [
              ...state.calendar[index],
              ...block
            ]
          }
        };
      }

      return state;
    }

    case UNBLOCK_SUCCESS: {
      const listingId = action.payload.listingId;
      const month = action.payload.month;
      const date = action.payload.date;

      const index = String(listingId) + '-' + month;

      if (state.calendar[index]) {
        const newEntities = state.calendar[index].filter(item => {
          return item.start !== date;
        });

        return {
          ...state,
          calendar: {
            ...state.calendar,
            [index]: newEntities
          }
        };
      }

      return state;
    }



    case ADD_CHECKLIST_SUCCESS: {
      const checklist = action.payload.checklist;
      const listingId = action.payload.listingId;

      const listing = Object.assign(new Listing(), JSON.parse(JSON.stringify(state.entities[listingId])));

      listing['checklists']['data'] = [
        ...listing['checklists']['data'],
        checklist
      ];

      return {
        ...state,
        entities: {
          ...state.entities,
          [listingId]: listing
        }
      };
    }

    case DELETE_CHECKLIST_SUCCESS: {
      const listingId = action.payload.listingId;
      const checklistId = action.payload.checklistId;

      const listing = Object.assign(new Listing(), JSON.parse(JSON.stringify(state.entities[listingId])));

      const checklists = listing.getChecklists();

      const index = checklists.findIndex(item => {
        return String(item.id) === String(checklistId);
      });

      if (index > -1) {
        listing['checklists']['data'] = [
          ...listing['checklists']['data'].slice(0, index),
          ...listing['checklists']['data'].slice(index + 1),
        ];
      }

      return {
        ...state,
        entities: {
          ...state.entities,
          [listingId]: listing
        }
      };
    }

    case UPDATE_CHECKLIST_SUCCESS: {
      const checklist = action.payload.checklist;
      const listingId = action.payload.listingId;


      const listing = Object.assign(new Listing(), JSON.parse(JSON.stringify(state.entities[listingId])));
      const checkLists = listing['checklists']['data'];

      const newCheckLists = checkLists.map((chklst) => {
        if(chklst['id'] === checklist.id){
          chklst['title'] = checklist.title;
          chklst['is_complete'] = checklist.is_complete;
        }

        return chklst;
      });

      listing['checklists']['data'] = newCheckLists;

      return {
        ...state,
        entities: {
          ...state.entities,
          [listingId]: listing
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
export const getIsStatsLoading = (state: State) => state.statsLoading;
export const getIsAdminStatsLoaded = (state: State) => state.adminStatsLoaded;
export const getIsAdminStatsLoading = (state: State) => state.adminStatsLoading;
export const getIsStatsLoaded = (state: State) => state.statsLoaded;
export const getIsMonthlyBreakdownLoading = (state: State) => state.monthlyBreakdownLoading;
export const getIsMonthlyBreakdownLoaded = (state: State) => state.monthlyBreakdownLoaded;

export const getEntities = (state: State) => state.entities;

export const getIds = (state: State) => state.ids;

export const getAll = createSelector(getEntities, getIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});

export const getById = (state: State, listingId: number) => state.entities[listingId];

export const getAllStats = (state: State) => state.ownerStats;
export const getAllAdminStats = (state: State) => state.adminStats;
export const getAllBreakdown = (state: State) => state.monthlyBreakdown;

export const isCalendarDataLoading = (state: State, listingId: number, month: string) => {
  const index = String(listingId) + '-' + month;
  return state.calendarLoadingIds.indexOf(index) > -1;
};
export const isCalendarDataLoaded = (state: State, listingId: number, month: string) => {
  const index = String(listingId) + '-' + month;
  return state.calendarLoadedIds.indexOf(index) > -1;
};
export const getCalendarData = (state: State, listingId: number, month: string) => {
  const index = String(listingId) + '-' + month;
  return state.calendar[index];
};


