import {Message} from '../models/message';
import {Action} from '../actions/action';
import {createSelector} from 'reselect';
import {
  CREATE_REQUEST, CREATE_SUCCESS,
  INDEX_REQUEST, INDEX_SUCCESS, THREAD_INDEX_REQUEST,
  THREAD_INDEX_SUCCESS, THREAD_UPDATE_REQUEST, THREAD_UPDATE_SUCCESS, ARCHIVED_THREAD_INDEX_REQUEST,
  ARCHIVED_THREAD_INDEX_SUCCESS, UNREAD_THREAD_INDEX_REQUEST, UNREAD_THREAD_INDEX_SUCCESS,
  FOLLOWUP_THREAD_INDEX_REQUEST, FOLLOWUP_THREAD_INDEX_SUCCESS, BOOKED_THREAD_INDEX_REQUEST,
  BOOKED_THREAD_INDEX_SUCCESS, ONGOING_THREAD_INDEX_REQUEST, ONGOING_THREAD_INDEX_SUCCESS,
  REQUESTS_THREAD_INDEX_REQUEST, REQUESTS_THREAD_INDEX_SUCCESS, THREAD_GET_REQUEST, THREAD_GET_SUCCESS,
  THREAD_SIDEBAR_UPDATE, UPDATE_SUCCESS, OTHER_THREAD_INDEX_REQUEST, OTHER_THREAD_INDEX_SUCCESS,
  THREAD_STATUS_UPDATE_SUCCESS, ThreadUpdateSuccessAction, ThreadSidebarUpdateSuccess
} from '../actions/message';
import Utils from '../utils';
import {Thread} from '../models/thread';
import {isNullOrUndefined} from 'util';

export interface State {
  loadingThreadIds: number[];
  loadedThreadIds: number[];
  messages: { [id: number]: Message[] };

  filter: string;

  threads: { [id: number]: Thread };


  isUnreadThreadLoading: boolean;
  isUnreadThreadLoaded: boolean;
  unreadThreadIds: number[];
  unreadCurrentPage: number;
  unreadTotalPage: number;

  isFollowupThreadLoading: boolean;
  isFollowupThreadLoaded: boolean;
  followupThreadIds: number[];
  followupCurrentPage: number;
  followupTotalPage: number;


  isBookedThreadLoading: boolean;
  isBookedThreadLoaded: boolean;
  bookedThreadIds: number[];
  bookedCurrentPage: number;
  bookedTotalPage: number;


  isOngoingThreadLoading: boolean;
  isOngoingThreadLoaded: boolean;
  ongoingThreadIds: number[];
  ongoingCurrentPage: number;
  ongoingTotalPage: number;


  isRequestsThreadLoading: boolean;
  isRequestsThreadLoaded: boolean;
  requestsThreadIds: number[];
  requestsCurrentPage: number;
  requestsTotalPage: number;


  isArchivedThreadLoading: boolean;
  isArchivedThreadLoaded: boolean;
  archivedThreadIds: number[];
  archivedCurrentPage: number;
  archivedTotalPage: number;

  isOtherThreadLoading: boolean;
  isOtherThreadLoaded: boolean;
  otherThreadIds: number[];
  otherCurrentPage: number;
  otherTotalPage: number;

}

export const initialState: State = {
  loadingThreadIds: [],
  loadedThreadIds: [],
  messages: {},


  filter: null,

  threads: {},

  isUnreadThreadLoading: false,
  isUnreadThreadLoaded: false,
  unreadThreadIds: [],
  unreadCurrentPage: 0,
  unreadTotalPage: 1,


  isFollowupThreadLoading: false,
  isFollowupThreadLoaded: false,
  followupThreadIds: [],
  followupCurrentPage: 0,
  followupTotalPage: 1,


  isBookedThreadLoading: false,
  isBookedThreadLoaded: false,
  bookedThreadIds: [],
  bookedCurrentPage: 0,
  bookedTotalPage: 1,


  isOngoingThreadLoading: false,
  isOngoingThreadLoaded: false,
  ongoingThreadIds: [],
  ongoingCurrentPage: 0,
  ongoingTotalPage: 1,


  isRequestsThreadLoading: false,
  isRequestsThreadLoaded: false,
  requestsThreadIds: [],
  requestsCurrentPage: 0,
  requestsTotalPage: 1,


  isArchivedThreadLoading: false,
  isArchivedThreadLoaded: false,
  archivedThreadIds: [],
  archivedCurrentPage: 0,
  archivedTotalPage: 1,


  isOtherThreadLoading: false,
  isOtherThreadLoaded: false,
  otherThreadIds: [],
  otherCurrentPage: 0,
  otherTotalPage: 1,

};


export function reducer(state = initialState, action: Action): State {
  switch (action.type) {
    case INDEX_REQUEST: {
      const threadId = action.payload;
      let loadingThreads = state.loadingThreadIds;

      if (state.loadingThreadIds.indexOf(threadId) === -1) {
        loadingThreads = [
          ...state.loadingThreadIds,
          threadId
        ];
      }

      return {
        ...state,
        loadingThreadIds: loadingThreads
      };
    }
    case INDEX_SUCCESS: {
      const messages = action.payload.messages;
      const threadId = action.payload.threadId;

      const newLoadingThreadIds = state.loadingThreadIds.filter(item => {
        return item !== threadId;
      });

      let newLoadedThreadIds = state.loadedThreadIds;
      if (state.loadedThreadIds.indexOf(threadId) === -1) {
        newLoadedThreadIds = [
          ...state.loadedThreadIds,
          threadId
        ];
      }

      return {
        ...state,
        loadingThreadIds: newLoadingThreadIds,
        loadedThreadIds: newLoadedThreadIds,
        messages: {
          ...state.messages,
          [threadId]: messages
        }
      };

    }
    case CREATE_REQUEST: {
      const threadID = action.payload;
      return state;
    }
    case CREATE_SUCCESS: {
      const threadID = action.payload.threadId;
      const message = action.payload.message;

      const currentThread = Object.assign(new Thread(), JSON.parse(JSON.stringify(state.threads[threadID])));
      currentThread.last_message = message.content;
      currentThread.last_message_on = message.sent_on;

      return {
        ...state,
        messages: {
          ...state.messages,
          [threadID]: [
            ...state.messages[threadID],
            message
          ]
        },
        threads: {
          ...state.threads,
          [threadID]: currentThread
        }
      };
    }

    case UPDATE_SUCCESS: {
      const booking = action.payload['booking'];
      const threadId = action.payload['thread_id'];

      if (!threadId) {

        let threads = Utils.getObjectValues(state.threads);
        for (const thread of threads) {
          const reservation = thread.getBooking();
          if (reservation.id === booking.id) {
            const currentThread = Object.assign(new Thread(), JSON.parse(JSON.stringify(state.threads[thread.id])));
            currentThread['booking']['data'] = booking;
            return {
              ...state,
              threads: {
                ...state.threads,
                [thread.id]: currentThread
              }
            };
          }
        }

      } else {
        const thread = state.threads[threadId];
        if(isNullOrUndefined(thread))
        {
          return state;
        }
        const currentThread = Object.assign(new Thread(), JSON.parse(JSON.stringify(state.threads[threadId])));
        currentThread['booking']['data'] = booking;
        return {
          ...state,
          threads: {
            ...state.threads,
            [threadId]: currentThread
          }
        };

      }

      return state;
    }

    case THREAD_UPDATE_REQUEST: {
      const threadID = action.payload;
      return state;
    }

    case THREAD_UPDATE_SUCCESS: {
      const updatedThread = action.payload.updatedThread;
      return getUpdatedState(updatedThread,state);
    }

    case THREAD_SIDEBAR_UPDATE: {
      return {
        ...state,
        filter:action.payload
      };
    }

    case THREAD_GET_REQUEST: {
      return state;
    }

    case THREAD_GET_SUCCESS: {
      const thread = action.payload;
      return getUpdatedState(thread,state);
    }

    case THREAD_STATUS_UPDATE_SUCCESS: {
      const booking = action.payload.booking;
      const threadId = action.payload.thread_id;
      const oldThread = state.threads[threadId];

      if(isNullOrUndefined(oldThread))
      {
        return state;
      }
      const updatedThread = Utils.getThreadFromBooking(oldThread , booking.status);

      return getUpdatedState(updatedThread,state);
    }

    case UNREAD_THREAD_INDEX_REQUEST: {
      return Object.assign({}, state, {isUnreadThreadLoading: true});
    }

    case UNREAD_THREAD_INDEX_SUCCESS: {
      let threads = action.payload.threads;
      const currentPage = action.payload.currentPage;
      const totalPages = action.payload.totalPages;
      const totalCount = action.payload.totalCount;
      threads = threads.filter(thread => !state.unreadThreadIds.includes(thread.id));
      const threadIds = threads.map(thread => thread.id);
      const existedThreads = Utils.getObjectValues(state.threads);
      const allThreads = [...existedThreads, ...threads];
      const newThreadIds = [...state.unreadThreadIds,...threadIds ];
      const entities = Utils.normalize(allThreads);


      return Object.assign({}, state, {
        unreadThreadIds: newThreadIds,
        threads: entities,
        isUnreadThreadLoaded: true,
        isUnreadThreadLoading: false,
        unreadCurrentPage: currentPage,
        unreadTotalPage: totalPages,
        unreadTotalCount: totalCount
      });
    }

    case FOLLOWUP_THREAD_INDEX_REQUEST: {
      return Object.assign({}, state, {isFollowupThreadLoading: true});
    }

    case FOLLOWUP_THREAD_INDEX_SUCCESS: {
      let threads = action.payload.threads;
      const currentPage = action.payload.currentPage;
      const totalPages = action.payload.totalPages;
      threads = threads.filter(thread => !state.followupThreadIds.includes(thread.id));
      const threadIds = threads.map(thread => thread.id);
      const existedThreads = Utils.getObjectValues(state.threads);
      const allThreads = [...existedThreads, ...threads];
      const newThreadIds = [...state.followupThreadIds,...threadIds ];
      const entities = Utils.normalize(allThreads);

      return Object.assign({}, state, {
        followupThreadIds: newThreadIds,
        threads: entities,
        isFollowupThreadLoaded: true,
        isFollowupThreadLoading: false,
        followupCurrentPage: currentPage,
        followupTotalPage: totalPages,
      });
    }

    case BOOKED_THREAD_INDEX_REQUEST: {
      return Object.assign({}, state, {isBookedThreadLoading: true});
    }

    case BOOKED_THREAD_INDEX_SUCCESS: {
      let threads = action.payload.threads;
      const currentPage = action.payload.currentPage;
      const totalPages = action.payload.totalPages;
      threads = threads.filter(thread => !state.bookedThreadIds.includes(thread.id));
      const threadIds = threads.map(thread => thread.id);
      const existedThreads = Utils.getObjectValues(state.threads);
      const allThreads = [...existedThreads, ...threads];
      const newThreadIds = [...state.bookedThreadIds,...threadIds ];
      const entities = Utils.normalize(allThreads);

      return Object.assign({}, state, {
        bookedThreadIds: newThreadIds,
        threads: entities,
        isBookedThreadLoaded: true,
        isBookedThreadLoading: false,
        bookedCurrentPage: currentPage,
        bookedTotalPage: totalPages,
      });
    }

    case ONGOING_THREAD_INDEX_REQUEST: {
      return Object.assign({}, state, {isOngoingThreadLoading: true});
    }

    case ONGOING_THREAD_INDEX_SUCCESS: {
      let threads = action.payload.threads;
      const currentPage = action.payload.currentPage;
      const totalPages = action.payload.totalPages;
      threads = threads.filter(thread => !state.ongoingThreadIds.includes(thread.id));
      const threadIds = threads.map(thread => thread.id);
      const existedThreads = Utils.getObjectValues(state.threads);
      const allThreads = [...existedThreads, ...threads];
      const newThreadIds = [...state.ongoingThreadIds,...threadIds ];
      const entities = Utils.normalize(allThreads);

      return Object.assign({}, state, {
        ongoingThreadIds: newThreadIds,
        threads: entities,
        isOngoingThreadLoaded: true,
        isOngoingThreadLoading: false,
        ongoingCurrentPage: currentPage,
        ongoingTotalPage: totalPages,
      });
    }

    case REQUESTS_THREAD_INDEX_REQUEST: {
      return Object.assign({}, state, {isRequestsThreadLoading: true});
    }

    case REQUESTS_THREAD_INDEX_SUCCESS: {
      let threads = action.payload.threads;
      const currentPage = action.payload.currentPage;
      const totalPages = action.payload.totalPages;
      threads = threads.filter(thread => !state.requestsThreadIds.includes(thread.id));
      const threadIds = threads.map(thread => thread.id);
      const existedThreads = Utils.getObjectValues(state.threads);
      const allThreads = [...existedThreads, ...threads];
      const newThreadIds = [...state.requestsThreadIds,...threadIds ];
      const entities = Utils.normalize(allThreads);

      return Object.assign({}, state, {
        requestsThreadIds: newThreadIds,
        threads: entities,
        isRequestsThreadLoaded: true,
        isRequestsThreadLoading: false,
        requestsCurrentPage: currentPage,
        requestsTotalPage: totalPages,
      });
    }

    case ARCHIVED_THREAD_INDEX_REQUEST: {
      return Object.assign({}, state, {isArchivedThreadLoading: true});
    }

    case ARCHIVED_THREAD_INDEX_SUCCESS: {
      let threads = action.payload.threads;
      const currentPage = action.payload.currentPage;
      const totalPages = action.payload.totalPages;
      threads = threads.filter(thread => !state.archivedThreadIds.includes(thread.id));
      const threadIds = threads.map(thread => thread.id);
      const existedThreads = Utils.getObjectValues(state.threads);
      const allThreads = [...existedThreads, ...threads];
      const newThreadIds = [...state.archivedThreadIds,...threadIds ];
      const entities = Utils.normalize(allThreads);

      return Object.assign({}, state, {
        archivedThreadIds: newThreadIds,
        threads: entities,
        isArchivedThreadLoaded: true,
        isArchivedThreadLoading: false,
        archivedCurrentPage: currentPage,
        archivedTotalPage: totalPages,
      });
    }

    case OTHER_THREAD_INDEX_REQUEST: {
      return Object.assign({}, state, {isOtherThreadLoading: true});
    }

    case OTHER_THREAD_INDEX_SUCCESS: {
      let threads = action.payload.threads;
      const currentPage = action.payload.currentPage;
      const totalPages = action.payload.totalPages;
      threads = threads.filter(thread => !state.otherThreadIds.includes(thread.id));
      const threadIds = threads.map(thread => thread.id);
      const existedThreads = Utils.getObjectValues(state.threads);
      const allThreads = [...existedThreads, ...threads];
      const newThreadIds = [...state.otherThreadIds,...threadIds ];
      const entities = Utils.normalize(allThreads);

      return Object.assign({}, state, {
        otherThreadIds: newThreadIds,
        threads: entities,
        isOtherThreadLoaded: true,
        isOtherThreadLoading: false,
        otherCurrentPage: currentPage,
        otherTotalPage: totalPages,
      });
    }


    default: {
      return state;
    }
  }
}


const  getUpdatedState = (thread:Thread , state:State) =>
{
  const threadId = thread.id;
  let unreadThreadIds = state.unreadThreadIds;
  let archivedThreadIds = state.archivedThreadIds;
  let requestsThreadIds = state.requestsThreadIds;
  let followUpThreadIds = state.followupThreadIds;
  let bookedThreadIds = state.bookedThreadIds;
  let ongoingThreadIds = state.ongoingThreadIds;
  let otherThreadIds = state.otherThreadIds;

  if(Utils.isUnreadThread(thread)) {
    if(!unreadThreadIds.includes(threadId))
    {
      unreadThreadIds.push(threadId);
    }
  }
  else {
    unreadThreadIds = unreadThreadIds.filter(id => id != threadId);
  }

  if(Utils.isArchivedThread(thread)) {
    if(!archivedThreadIds.includes(threadId))
    {
      archivedThreadIds.push(threadId);
    }
  }
  else {
    archivedThreadIds = archivedThreadIds.filter(id => id != threadId);
  }

  if(Utils.isRequestThread(thread)) {
    if(!requestsThreadIds.includes(threadId))
    {
      requestsThreadIds.push(threadId);
    }
  }
  else {
    requestsThreadIds = requestsThreadIds.filter(id => id != threadId);
  }

  if(Utils.isFollowUpThread(thread)) {
    if(!followUpThreadIds.includes(threadId))
    {
      followUpThreadIds.push(threadId);
    }
  }
  else {
    followUpThreadIds = followUpThreadIds.filter(id => id != threadId);
  }

  if(Utils.isBookedThread(thread)) {
    if(!bookedThreadIds.includes(threadId))
    {
      bookedThreadIds.push(threadId);
    }
  }
  else {
    bookedThreadIds = bookedThreadIds.filter(id => id != threadId);
  }

  if(Utils.isOngoingThread(thread)) {
    if(!ongoingThreadIds.includes(threadId))
    {
      ongoingThreadIds.push(threadId);
    }
  }
  else {
    ongoingThreadIds = ongoingThreadIds.filter(id => id != threadId);
  }

  if(Utils.isBookedThread(thread)) {
    if(!bookedThreadIds.includes(threadId))
    {
      bookedThreadIds.push(threadId);
    }
  }
  else {
    bookedThreadIds = bookedThreadIds.filter(id => id != threadId);
  }

  if(Utils.isOtherThread(thread)) {
    if(!otherThreadIds.includes(threadId))
    {
      otherThreadIds.push(threadId);
    }
  }
  else {
    otherThreadIds = otherThreadIds.filter(id => id != threadId);
  }

  return {
    ...state,
    threads: {
      ...state.threads,
      [thread.id]: thread
    },
    unreadThreadIds:unreadThreadIds,
    archivedThreadIds:archivedThreadIds,
    ongoingThreadIds:ongoingThreadIds,
    otherThreadIds:otherThreadIds,
    bookedThreadIds:bookedThreadIds,
    requestsThreadIds:requestsThreadIds,
    followupThreadIds:followUpThreadIds,

  };
}


export const getIsMessagesLoadingByThreadId = (state: State, threadId: number) => {
  return state.loadingThreadIds.indexOf(threadId) > -1;
};
export const getIsMessagesLoadedByThreadId = (state: State, threadId: number) => {
  return state.loadedThreadIds.indexOf(threadId) > -1;
};

export const getSidebarFilter = (state: State) => state.filter;


export const getMessagesByThreadId = (state: State, threadId: number) => state.messages[threadId];
export const getThreadEntities = (state: State) => state.threads;


export const getUnreadThreadIds = (state: State) => state.unreadThreadIds;
export const getIsUnreadThreadLoading = (state: State) => state.isUnreadThreadLoading;
export const getIsUnreadThreadLoaded = (state: State) => state.isUnreadThreadLoaded;
export const getUnreadCurrentPage = (state: State) => state.unreadCurrentPage;
export const getUnreadTotalPage = (state: State) => state.unreadTotalPage;
export const getUnreadThreads = createSelector(getThreadEntities, getUnreadThreadIds, (entities, ids) => {
  ids = Array.from(new Set(ids));
  return ids.map(id => entities[id]);
});

export const getOtherThreadIds = (state: State) => state.otherThreadIds;
export const getIsOtherThreadLoading = (state: State) => state.isOtherThreadLoading;
export const getIsOtherThreadLoaded = (state: State) => state.isOtherThreadLoaded;
export const getOtherCurrentPage = (state: State) => state.otherCurrentPage;
export const getOtherTotalPage = (state: State) => state.otherTotalPage;
export const getOtherThreads = createSelector(getThreadEntities, getOtherThreadIds, (entities, ids) => {
  ids = Array.from(new Set(ids));
  return ids.map(id => entities[id]);
});


export const getFollowupThreadIds = (state: State) => state.followupThreadIds;
export const getIsFollowupThreadLoading = (state: State) => state.isFollowupThreadLoading;
export const getIsFollowupThreadLoaded = (state: State) => state.isFollowupThreadLoaded;
export const getFollowupCurrentPage = (state: State) => state.followupCurrentPage;
export const getFollowupTotalPage = (state: State) => state.followupTotalPage;
export const getFollowupThreads = createSelector(getThreadEntities, getFollowupThreadIds, (entities, ids) => {
  ids = Array.from(new Set(ids));
  return ids.map(id => entities[id]);
});


export const getBookedThreadIds = (state: State) => state.bookedThreadIds;
export const getIsBookedThreadLoading = (state: State) => state.isBookedThreadLoading;
export const getIsBookedThreadLoaded = (state: State) => state.isBookedThreadLoaded;
export const getBookedCurrentPage = (state: State) => state.bookedCurrentPage;
export const getBookedTotalPage = (state: State) => state.bookedTotalPage;
export const getBookedThreads = createSelector(getThreadEntities, getBookedThreadIds, (entities, ids) => {
  ids = Array.from(new Set(ids));
  return ids.map(id => entities[id]);
});


export const getOngoingThreadIds = (state: State) => state.ongoingThreadIds;
export const getIsOngoingThreadLoading = (state: State) => state.isOngoingThreadLoading;
export const getIsOngoingThreadLoaded = (state: State) => state.isOngoingThreadLoaded;
export const getOngoingCurrentPage = (state: State) => state.ongoingCurrentPage;
export const getOngoingTotalPage = (state: State) => state.ongoingTotalPage;
export const getOngoingThreads = createSelector(getThreadEntities, getOngoingThreadIds, (entities, ids) => {
  ids = Array.from(new Set(ids));
  return ids.map(id => entities[id]);
});


export const getRequestsThreadIds = (state: State) => state.requestsThreadIds;
export const getIsRequestsThreadLoading = (state: State) => state.isRequestsThreadLoading;
export const getIsRequestsThreadLoaded = (state: State) => state.isRequestsThreadLoaded;
export const getRequestsCurrentPage = (state: State) => state.requestsCurrentPage;
export const getRequestsTotalPage = (state: State) => state.requestsTotalPage;
export const getRequestsThreads = createSelector(getThreadEntities, getRequestsThreadIds, (entities, ids) => {
  ids = Array.from(new Set(ids));
  return ids.map(id => entities[id]);
});


export const getArchivedThreadIds = (state: State) => state.archivedThreadIds;
export const getIsArchivedThreadLoading = (state: State) => state.isArchivedThreadLoading;
export const getIsArchivedThreadLoaded = (state: State) => state.isArchivedThreadLoaded;
export const getArchivedCurrentPage = (state: State) => state.archivedCurrentPage;
export const getArchivedTotalPage = (state: State) => state.archivedTotalPage;
export const getArchivedThreads = createSelector(getThreadEntities, getArchivedThreadIds, (entities, ids) => {
  ids = Array.from(new Set(ids));
  return ids.map(id => entities[id]);
});


export const getThreads = createSelector(
  getThreadEntities, getUnreadThreadIds, getFollowupThreadIds,
  getBookedThreadIds, getOngoingThreadIds, getRequestsThreadIds,
  getArchivedThreadIds,getOtherThreadIds,
  (threads, unreadThreadIds, followupThreadIds,
   bookedThreadIds,ongoingThreadIds, requestThreadIds,
   archivedThreadIds,otherThreadIds) => {

    const allThreadIds = [
      ...unreadThreadIds,
      ...followupThreadIds,
      ...bookedThreadIds,
      ...ongoingThreadIds,
      ...requestThreadIds,
      ...archivedThreadIds,
      ...otherThreadIds,
    ];

    const ids = Array.from(new Set(allThreadIds));

    return ids.map(id => threads[id]);

  });

export const getById = (state: State, threadId: number) => state.threads[threadId];
