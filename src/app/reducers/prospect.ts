import {Prospect} from '../models/prospect';
import {
  CREATE_REQUEST, CREATE_SUCCESS, INDEX_EXPIRED_REQUEST, INDEX_EXPIRED_SUCCESS, INDEX_PASSED_REQUEST,
  INDEX_PASSED_SUCCESS,
  INDEX_TODAY_REQUEST, INDEX_TODAY_SUCCESS,
  INDEX_UPCOMING_REQUEST,
  INDEX_UPCOMING_SUCCESS

} from '../actions/prospect';
import {Action} from '../actions/action';
import Utils from '../utils';
import {createSelector} from 'reselect';
import {getDateObj} from '../components/calendar/calendar-utils';



export interface State {
  entities: { [id: number]: Prospect };

  todayIds: number[];
  todayLoading: boolean;
  todayLoaded: boolean;
  todayCurrentPage: number;
  todayTotalPage: number;
  todayTotalCount: number;

  upcomingIds: number[];
  upcomingLoading: boolean;
  upcomingLoaded: boolean;
  upcomingCurrentPage: number;
  upcomingTotalPage: number;
  upcomingTotalCount: number;

  expiredIds: number[];
  expiredLoading: boolean;
  expiredLoaded: boolean;
  expiredCurrentPage: number;
  expiredTotalPage: number;
  expiredTotalCount: number;

  passedIds: number[];
  passedLoading: boolean;
  passedLoaded: boolean;
  passedCurrentPage: number;
  passedTotalPage: number;
  passedTotalCount: number;
}

export const initialState: State = {
  entities: {},

  todayIds: [],
  todayLoading: false,
  todayLoaded: false,
  todayCurrentPage: 0,
  todayTotalPage: 1,
  todayTotalCount: 0,

  upcomingIds: [],
  upcomingLoading: false,
  upcomingLoaded: false,
  upcomingCurrentPage: 0,
  upcomingTotalPage: 1,
  upcomingTotalCount: 0,

  expiredIds: [],
  expiredLoading: false,
  expiredLoaded: false,
  expiredCurrentPage: 0,
  expiredTotalPage: 1,
  expiredTotalCount: 0,

  passedIds: [],
  passedLoading: false,
  passedLoaded: false,
  passedCurrentPage: 0,
  passedTotalPage: 1,
  passedTotalCount: 0,
};

export function reducer(state = initialState, action: Action): State {
  switch (action.type) {


    case INDEX_TODAY_REQUEST: {
      return Object.assign({}, state, {todayLoading: true});
    }

    case INDEX_TODAY_SUCCESS: {
      const prospects = action.payload.prospects;

      const currentPage = action.payload.currentPage;
      const totalPages = action.payload.totalPages;
      const totalCount = action.payload.totalCount;
      const prospectIds = prospects.map(prospect => prospect.id);

      const entities = Utils.normalize(prospects);

      return Object.assign({}, state, {
        todayIds: [
          ...state.todayIds,
          ...prospectIds
        ],
        entities: {
          ...state.entities,
          ...entities
        },
        todayLoaded: true,
        todayLoading: false,
        todayCurrentPage: currentPage,
        todayTotalPage: totalPages,
        todayTotalCount: totalCount
      });
    }


    case INDEX_UPCOMING_REQUEST: {
      return Object.assign({}, state, {upcomingLoading: true});
    }

    case INDEX_UPCOMING_SUCCESS: {
      const prospects = action.payload.prospects;

      const currentPage = action.payload.currentPage;
      const totalPages = action.payload.totalPages;
      const totalCount = action.payload.totalCount;
      const prospectIds = prospects.map(prospect => prospect.id);

      const entities = Utils.normalize(prospects);

      return Object.assign({}, state, {
        upcomingIds: [
          ...state.upcomingIds,
          ...prospectIds
        ],
        entities: {
          ...state.entities,
          ...entities
        },
        upcomingLoaded: true,
        upcomingLoading: false,
        upcomingCurrentPage: currentPage,
        upcomingTotalPage: totalPages,
        upcomingTotalCount: totalCount
      });
    }


    case INDEX_EXPIRED_REQUEST: {
      return Object.assign({}, state, {expiredLoading: true});
    }

    case INDEX_EXPIRED_SUCCESS: {
      const prospects = action.payload.prospects;

      const currentPage = action.payload.currentPage;
      const totalPages = action.payload.totalPages;
      const totalCount = action.payload.totalCount;
      const prospectIds = prospects.map(prospect => prospect.id);

      const entities = Utils.normalize(prospects);

      return Object.assign({}, state, {
        expiredIds: [
          ...state.expiredIds,
          ...prospectIds
        ],
        entities: {
          ...state.entities,
          ...entities
        },
        expiredLoaded: true,
        expiredLoading: false,
        expiredCurrentPage: currentPage,
        expiredTotalPage: totalPages,
        expiredTotalCount: totalCount
      });
    }


    case INDEX_PASSED_REQUEST: {
      return Object.assign({}, state, {passedLoading: true});
    }

    case INDEX_PASSED_SUCCESS: {
      const prospects = action.payload.prospects;

      const currentPage = action.payload.currentPage;
      const totalPages = action.payload.totalPages;
      const totalCount = action.payload.totalCount;
      const prospectIds = prospects.map(prospect => prospect.id);

      const entities = Utils.normalize(prospects);

      return Object.assign({}, state, {
        passedIds: [
          ...state.passedIds,
          ...prospectIds
        ],
        entities: {
          ...state.entities,
          ...entities
        },
        passedLoaded: true,
        passedLoading: false,
        passedCurrentPage: currentPage,
        passedTotalPage: totalPages,
        passedTotalCount: totalCount
      });
    }

    case CREATE_REQUEST: {
      return state;
    }

    case CREATE_SUCCESS: {
      const prospect = action.payload;

      const date = getDateObj();
      const fullDate = ('0' + date.getDate()).slice(-2);
      const fullMonth = ('0' + (date.getMonth() + 1)).slice(-2);
      const fullYear = date.getFullYear();
      const currentDateString = fullYear + '-' + fullMonth + '-' + fullDate;

      if (currentDateString === prospect.start) {
        // Today Prospect
        return Object.assign({}, state, {
          todayIds: [
            prospect.id,
            ...state.todayIds,
          ],
          entities: {
            ...state.entities,
            [prospect.id]: prospect
          },
        });
      } else {
        // Upcoming Prospect
        return Object.assign({}, state, {
          upcomingIds: [
            prospect.id,
            ...state.upcomingIds,
          ],
          entities: {
            ...state.entities,
            [prospect.id]: prospect
          },
        });
      }
    }

    default: {
      return state;
    }
  }
}

export const getEntities = (state: State) => state.entities;

export const getIsTodayLoading = (state: State) => state.todayLoading;
export const getIsTodayLoaded = (state: State) => state.todayLoaded;
export const getTodayCurrentPage = (state: State) => state.todayCurrentPage;
export const getTodayTotalPage = (state: State) => state.todayTotalPage;
export const getTodayTotalCount = (state: State) => state.todayTotalCount;

export const getTodayIds = (state: State) => state.todayIds;

export const getTodayAll = createSelector(getEntities, getTodayIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});

export const getIsUpcomingLoading = (state: State) => state.upcomingLoading;
export const getIsUpcomingLoaded = (state: State) => state.upcomingLoaded;
export const getUpcomingCurrentPage = (state: State) => state.upcomingCurrentPage;
export const getUpcomingTotalPage = (state: State) => state.upcomingTotalPage;
export const getUpcomingTotalCount = (state: State) => state.upcomingTotalCount;

export const getUpcomingIds = (state: State) => state.upcomingIds;

export const getUpcomingAll = createSelector(getEntities, getUpcomingIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});

export const getIsExpiredLoading = (state: State) => state.expiredLoading;
export const getIsExpiredLoaded = (state: State) => state.expiredLoaded;
export const getExpiredCurrentPage = (state: State) => state.expiredCurrentPage;
export const getExpiredTotalPage = (state: State) => state.expiredTotalPage;
export const getExpiredTotalCount = (state: State) => state.expiredTotalCount;

export const getExpiredIds = (state: State) => state.expiredIds;

export const getExpiredAll = createSelector(getEntities, getExpiredIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});

export const getIsPassedLoading = (state: State) => state.passedLoading;
export const getIsPassedLoaded = (state: State) => state.passedLoaded;
export const getPassedCurrentPage = (state: State) => state.passedCurrentPage;
export const getPassedTotalPage = (state: State) => state.passedTotalPage;
export const getPassedTotalCount = (state: State) => state.passedTotalCount;

export const getPassedIds = (state: State) => state.passedIds;

export const getPassedAll = createSelector(getEntities, getPassedIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});
