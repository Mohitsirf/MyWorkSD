import {Booking} from '../models/booking';
import {
  ADD_NEW_GUEST_SUCCESS, DELETE_GUEST_SUCCESS, EDIT_GUEST_SUCCESS,
  INDEX_REQUEST, INDEX_SUCCESS, ONGOING_INDEX_REQUEST, ONGOING_INDEX_SUCCESS, PAST_INDEX_REQUEST, PAST_INDEX_SUCCESS,
  SHOW_REQUEST, SHOW_SUCCESS,
  TODAY_INDEX_REQUEST,
  TODAY_INDEX_SUCCESS,
  UPCOMING_INDEX_REQUEST,
  UPCOMING_INDEX_SUCCESS,
  UPCOMING_OWNER_INDEX_REQUEST,
  UPCOMING_OWNER_INDEX_SUCCESS,
  UPDATE_SUCCESS,
  SECURITY_DEDUCTION_REQUEST, SCHEDULED_MESSAGE_UPDATE_REQUEST, BOOKING_CREATE_REQUEST, BOOKING_CREATE_SUCCESS,
  BOOKING_PAYMENT_CREATE_REQUEST, BOOKING_PAYMENT_CREATE_SUCCESS,
} from '../actions/booking';

import Utils from '../utils';
import {createSelector} from 'reselect';
import {Action} from '../actions/action';
import {SECURITY_DEDUCTION_SUCCESS, SCHEDULED_MESSAGE_UPDATE_SUCCESS} from '../actions/booking';
import {getDateObj} from '../components/calendar/calendar-utils';
import * as moment from 'moment';

/**
 * Created by piyushkantm on 08/07/17.
 */

export interface State {
  ownerUpcomingIds: number[];
  ownerUpcomingEntities: { [id: number]: Booking };
  ownerUpcomingLoading: boolean;
  ownerUpcomingLoaded: boolean;

  ids: number[];
  entities: { [id: number]: Booking };
  loading: boolean;
  loaded: boolean;

  showingIds: number[];
  showedIds: number[];

  todayLoading: boolean;
  todayLoaded: boolean;
  todayCurrentPage: number;
  todayTotalPage: number;
  todayTotalCount: number;
  todayIds: number[];

  upcomingLoading: boolean;
  upcomingLoaded: boolean;
  upcomingCurrentPage: number;
  upcomingTotalPage: number;
  upcomingTotalCount: number;
  upcomingIds: number[];

  ongoingLoading: boolean;
  ongoingLoaded: boolean;
  ongoingCurrentPage: number;
  ongoingTotalPage: number;
  ongoingTotalCount: number;
  ongoingIds: number[];

  pastLoading: boolean;
  pastCurrentPage: number;
  pastTotalPage: number;
  pastTotalCount: number;
  pastLoaded: boolean;
  pastIds: number[];
}

export const initialState: State = {
  ownerUpcomingIds: [],
  ownerUpcomingEntities: {},
  ownerUpcomingLoading: false,
  ownerUpcomingLoaded: false,

  ids: [],
  entities: {},
  loading: false,
  loaded: false,

  showingIds: [],
  showedIds: [],

  todayLoading: false,
  todayLoaded: false,
  todayCurrentPage: 0,
  todayTotalPage: 1,
  todayTotalCount: 0,
  todayIds: [],

  upcomingLoading: false,
  upcomingLoaded: false,
  upcomingCurrentPage: 0,
  upcomingTotalPage: 1,
  upcomingTotalCount: 0,
  upcomingIds: [],

  ongoingLoading: false,
  ongoingLoaded: false,
  ongoingCurrentPage: 0,
  ongoingTotalPage: 1,
  ongoingTotalCount: 0,
  ongoingIds: [],

  pastLoading: false,
  pastLoaded: false,
  pastCurrentPage: 0,
  pastTotalPage: 1,
  pastTotalCount: 0,
  pastIds: [],
};

export function reducer(state = initialState, action: Action): State {
  switch (action.type) {
    case UPCOMING_OWNER_INDEX_REQUEST: {
      return Object.assign({}, state, {ownerUpcomingLoading: true});
    }
    case UPCOMING_OWNER_INDEX_SUCCESS: {
      const bookings = action.payload;
      const bookingIds = bookings.map(booking => booking.id);
      const entities = Utils.normalize(bookings);
      return Object.assign({}, state, {
        ownerUpcomingLoading: false,
        ownerUpcomingIds: bookingIds,
        ownerUpcomingLoaded: true,
        ownerUpcomingEntities: entities
      });
    }
    case INDEX_REQUEST: {
      return Object.assign({}, state, {loading: true});
    }
    case INDEX_SUCCESS: {
      const bookings = action.payload;
      const bookingIds = bookings.map(booking => booking.id);
      const entities = Utils.normalize(bookings);
      return Object.assign({}, state, {loading: false, ids: bookingIds, loaded: true, entities: entities});
    }


    case TODAY_INDEX_REQUEST: {
      return Object.assign({}, state, {todayLoading: true});
    }

    case TODAY_INDEX_SUCCESS: {
      let bookings = action.payload.bookings;
      bookings = bookings.filter(booking => !state.todayIds.includes(booking.id));
      const currentPage = action.payload.currentPage;
      const totalPages = action.payload.totalPages;
      const totalCount = action.payload.totalCount;
      const bookingIds = bookings.map(booking => booking.id);
      const entities = Utils.normalize(bookings);

      return Object.assign({}, state, {
        todayIds: [
          ...state.todayIds,
          ...bookingIds
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

    case UPCOMING_INDEX_REQUEST: {
      return Object.assign({}, state, {upcomingLoading: true});
    }

    case UPCOMING_INDEX_SUCCESS: {
      let bookings = action.payload.bookings;
      bookings = bookings.filter(booking => !state.upcomingIds.includes(booking.id));
      const currentPage = action.payload.currentPage;
      const totalPages = action.payload.totalPages;
      const totalCount = action.payload.totalCount;
      const bookingIds = bookings.map(booking => booking.id);
      const entities = Utils.normalize(bookings);

      return Object.assign({}, state, {
        upcomingIds: [
          ...state.upcomingIds,
          ...bookingIds
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

    case ONGOING_INDEX_REQUEST: {
      return Object.assign({}, state, {ongoingLoading: true});
    }

    case ONGOING_INDEX_SUCCESS: {
      let bookings = action.payload.bookings;
      bookings = bookings.filter(booking => !state.ongoingIds.includes(booking.id));
      const currentPage = action.payload.currentPage;
      const totalPages = action.payload.totalPages;
      const totalCount = action.payload.totalCount;
      const bookingIds = bookings.map(booking => booking.id);
      const entities = Utils.normalize(bookings);

      return Object.assign({}, state, {
        ongoingIds: [
          ...state.ongoingIds,
          ...bookingIds
        ],
        entities: {
          ...state.entities,
          ...entities
        },
        ongoingLoaded: true,
        ongoingLoading: false,
        ongoingCurrentPage: currentPage,
        ongoingTotalPage: totalPages,
        ongoingTotalCount: totalCount
      });
    }

    case PAST_INDEX_REQUEST: {
      return Object.assign({}, state, {pastLoading: true});
    }

    case PAST_INDEX_SUCCESS: {
      let bookings = action.payload.bookings;
      bookings = bookings.filter(booking => !state.pastIds.includes(booking.id));
      const currentPage = action.payload.currentPage;
      const totalPages = action.payload.totalPages;
      const totalCount = action.payload.totalCount;
      const bookingIds = bookings.map(booking => booking.id);
      const entities = Utils.normalize(bookings);

      return Object.assign({}, state, {
        pastIds: [
          ...state.pastIds,
          ...bookingIds
        ],
        entities: {
          ...state.entities,
          ...entities
        },
        pastLoaded: true,
        pastLoading: false,
        pastCurrentPage: currentPage,
        pastTotalPage: totalPages,
        pastTotalCount: totalCount
      });
    }



    case  UPDATE_SUCCESS: {
      const booking = action.payload['booking'];
      const newBookingId = booking.id;

      return {
        ...state,
        entities: {
          ...state.entities,
          [newBookingId]: booking
        },
      };
    }


    case ADD_NEW_GUEST_SUCCESS: {
      const guest = action.payload.guest;
      const bookingId = action.payload.bookingId;
      const booking = Object.assign(new Booking(), JSON.parse(JSON.stringify(state.entities[bookingId])));
      booking['guests']['data'] = [
        ...booking['guests']['data'],
        guest
      ];

      return {
        ...state,
        entities: {
          ...state.entities,
          [bookingId]: booking
        }
      };
    }
    case EDIT_GUEST_SUCCESS: {
      const guest = action.payload.guest;
      const bookingId = action.payload.bookingId;
      const booking = Object.assign(new Booking(), JSON.parse(JSON.stringify(state.entities[bookingId])));


      const index = booking.getBookingGuests().findIndex(item => {
        return String(item.id) == guest.id;
      });


      if (index > -1) {
        booking['guests']['data'] = [
          ...booking['guests']['data'].slice(0, index),
          guest,
          ...booking['guests']['data'].slice(index + 1),
        ];
      }

      return {
        ...state,
        entities: {
          ...state.entities,
          [bookingId]: booking
        }
      };
    }
    case DELETE_GUEST_SUCCESS: {
      const guestId = action.payload.guestId;
      const bookingId = action.payload.bookingId;

      const booking = Object.assign(new Booking(), JSON.parse(JSON.stringify(state.entities[bookingId])));

      const guests = booking.getBookingGuests();

      const index = guests.findIndex(item => {
        return String(item.id) == guestId;
      });

      if (index > -1) {
        booking['guests']['data'] = [
          ...booking['guests']['data'].slice(0, index),
          ...booking['guests']['data'].slice(index + 1),
        ];
      }

      return {
        ...state,
        entities: {
          ...state.entities,
          [bookingId]: booking
        }
      };

    }
    case SHOW_REQUEST: {
      const bookingId = action.payload;

      const showingIds = state.showingIds;

      const loadingIndex = showingIds.findIndex(id => {
        return id === bookingId;
      });

      let newIds = state.showingIds;

      if (loadingIndex === -1) {
        newIds = [
          ...state.showingIds,
          bookingId
        ];
      }

      return {
        ...state,
        showingIds: newIds,
      };
    }
    case SHOW_SUCCESS: {
      const booking = action.payload;
      const bookingId = booking.id;



      const showingIds = state.showingIds;

      const loadingIndex = showingIds.findIndex(id => {
        return id === booking.id;
      });

      let newIds = state.showingIds;

      if (loadingIndex > -1) {
        newIds = [
          ...state.showingIds.slice(0, loadingIndex),
          ...state.showingIds.slice(loadingIndex + 1),
        ];
      }

      const showedIds = state.showedIds;

      const loadedIndex = showedIds.findIndex(id => {
        return id === booking.id;
      });

      let newShowedIds = state.showedIds;

      if (loadedIndex === -1) {
        newShowedIds = [
          ...state.showedIds,
          booking.id
        ];
      }

      const bookingType = Utils.getBookingType(booking);

      let todayIds = state.todayIds;
      let upcomingIds = state.upcomingIds;
      let pastIds = state.pastIds;
      let ongoingIds = state.ongoingIds;


      switch (bookingType)
      {
        case 'today':
          todayIds = [...todayIds , bookingId];
          break;
        case 'past':
          pastIds = [...pastIds , bookingId];
          break;
        case 'upcoming':
          upcomingIds = [...upcomingIds , bookingId];
          break;
        case 'ongoing':
          ongoingIds = [...ongoingIds , bookingId];
          break;

      }

      return {
        ...state,
        entities: {
          ...state.entities,
          [bookingId]: booking
        },
        showingIds: newIds,
        showedIds: newShowedIds,
        todayIds:todayIds,
        upcomingIds:upcomingIds,
        pastIds:pastIds,
        ongoingIds:ongoingIds
      };
    }

    case SECURITY_DEDUCTION_REQUEST: {
      return state;
    }
    case SECURITY_DEDUCTION_SUCCESS: {
      const deduction = action.payload.deduction;
      const bookingId = action.payload.bookingId;

      const booking = Object.assign(new Booking(), JSON.parse(JSON.stringify(state.entities[bookingId])));

      booking['securityDeductions']['data'] = [
        ...booking['securityDeductions']['data'],
        deduction
      ];

      return {
        ...state,
        entities: {
          ...state.entities,
          [bookingId]: booking
        }
      };
    }

    case SCHEDULED_MESSAGE_UPDATE_REQUEST: {
      return state;
    }
    case SCHEDULED_MESSAGE_UPDATE_SUCCESS: {
      const scheduledMessage = action.payload.scheduledMessage;
      const bookingId = action.payload.bookingId;

      const booking = Object.assign(new Booking(), JSON.parse(JSON.stringify(state.entities[bookingId])));

      const index = booking.scheduledMessages.data.findIndex(message => {
        return message.id === scheduledMessage.id;
      });

      booking['scheduledMessages']['data'] = [
        ...booking['scheduledMessages']['data'].slice(0, index),
        scheduledMessage,
        ...booking['scheduledMessages']['data'].slice(index + 1),
      ];

      return {
        ...state,
        entities: {
          ...state.entities,
          [bookingId]: booking
        }
      };
    }

    case BOOKING_CREATE_REQUEST: {
      return state;
    }
    case BOOKING_CREATE_SUCCESS: {
      const booking = action.payload;

      const date = getDateObj();
      const fullDate = ('0' + date.getDate()).slice(-2);
      const fullMonth = ('0' + (date.getMonth() + 1)).slice(-2);
      const fullYear = date.getFullYear();
      const currentDateString = fullYear + '-' + fullMonth + '-' + fullDate;

      if (currentDateString === booking.start) {
        // Today Booking
        return Object.assign({}, state, {
          todayIds: [
            booking.id,
            ...state.todayIds,
          ],
          entities: {
            ...state.entities,
            [booking.id]: booking
          },
        });
      } else {
        // Upcoming
        return Object.assign({}, state, {
          upcomingIds: [
            booking.id,
            ...state.upcomingIds,
          ],
          entities: {
            ...state.entities,
            [booking.id]: booking
          },
        });
      }
    }

    case BOOKING_PAYMENT_CREATE_REQUEST: {
      return state;
    }

    case BOOKING_PAYMENT_CREATE_SUCCESS: {
      const bookingId = action.payload.bookingId;
      const payment = action.payload.payment;

      const booking = state.entities[bookingId];

      const payments = booking.payments.data;
      payments.push(payment);

      booking.payments.data = payments;

      return {
        ...state,
        entities: {
          ...state.entities,
          [bookingId]: booking
        }
      }
    }
    default: {
      return state;
    }
  }
}


export const getIsOwnerUpcomingLoading = (state: State) => state.ownerUpcomingLoading;
export const getIsOwnerUpcomingLoaded = (state: State) => state.ownerUpcomingLoaded;

export const getOwnerUpcomingEntities = (state: State) => state.ownerUpcomingEntities;

export const getOwnerUpcomingIds = (state: State) => state.ownerUpcomingIds;

export const getOwnerUpcomingAll = createSelector(getOwnerUpcomingEntities, getOwnerUpcomingIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});

export const getIsLoading = (state: State) => state.loading;
export const getIsLoaded = (state: State) => state.loaded;

export const getEntities = (state: State) => state.entities;

export const getIds = (state: State) => state.ids;

export const getAll = createSelector(getEntities, getIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});

export const getById = (state: State, bookingId: number) => state.entities[bookingId];

export const getIsShowing = (state: State, bookingId: number) => {
  const isPresent = state.showingIds.findIndex(id => {
    return id === bookingId;
  });

  return isPresent > -1;
};
export const getIsShowed = (state: State, bookingId: number) => {
  const isPresent = state.showedIds.findIndex(id => {
    return id === bookingId;
  });

  return isPresent > -1;
};



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

export const getIsOngoingLoading = (state: State) => state.ongoingLoading;
export const getIsOngoingLoaded = (state: State) => state.ongoingLoaded;
export const getOngoingCurrentPage = (state: State) => state.ongoingCurrentPage;
export const getOngoingTotalPage = (state: State) => state.ongoingTotalPage;
export const getOngoingTotalCount = (state: State) => state.ongoingTotalCount;

export const getOngoingIds = (state: State) => state.ongoingIds;

export const getOngoingAll = createSelector(getEntities, getOngoingIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});

export const getIsPastLoading = (state: State) => state.pastLoading;
export const getIsPastLoaded = (state: State) => state.pastLoaded;
export const getPastCurrentPage = (state: State) => state.pastCurrentPage;
export const getPastTotalPage = (state: State) => state.pastTotalPage;
export const getPastTotalCount = (state: State) => state.pastTotalCount;

export const getPastIds = (state: State) => state.pastIds;

export const getPastAll = createSelector(getEntities, getPastIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});
