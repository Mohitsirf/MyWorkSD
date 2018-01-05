import {createSelector} from 'reselect';


/**
 * Every reducer module's default export is the reducer function itself. In
 * addition, each module should export a type or interface that describes
 * the state of the reducer plus any selector functions. The `* as`
 * notation packages up all of the exports into a single object.
 */
import * as fromUser from './user';
import * as fromAccount from './account';
import * as fromApp from './app';
import * as fromListing from './listing';
import * as fromBooking from './booking';
import * as fromContact from './contact';
import * as fromDiscount from './discount';
import * as fromTask from './task';
import * as fromMessage from './message';
import * as fromMultiCalendar from './multi-calendar';
import * as fromOption from './option';
import * as fromProspect from './prospect';
import * as fromQuote from './quote';
import * as fromCustomVariable from './custom-variable';
import * as fromAlert from './alert';
import * as fromCannedResponse from './canned-response';
import * as fromMinStayTemplate from './min-stay-templates';
import * as fromAutoResponse from './auto-response';





/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface State {
  user: fromUser.State;
  account: fromAccount.State;
  app: fromApp.State;
  listing: fromListing.State;
  booking: fromBooking.State;
  contact: fromContact.State;
  discount: fromDiscount.State;
  task: fromTask.State;
  message: fromMessage.State;
  option: fromOption.State;
  multiCalendar: fromMultiCalendar.State;
  prospect: fromProspect.State;
  quote: fromQuote.State;
  customVariable: fromCustomVariable.State;
  alert: fromAlert.State;
  cannedResponse: fromCannedResponse.State;
  minStayTemplate: fromMinStayTemplate.State;
  autoResponse: fromAutoResponse.State;

}


/**
 * Because metareducers take a reducer function and return a new reducer,
 * we can use our compose helper to chain them together. Here we are
 * using combineReducers to make our top level reducer, and then
 * wrapping that in storeLogger. Remember that compose applies
 * the result from right to left.
 */
export const reducers = {
  user: fromUser.reducer,
  account: fromAccount.reducer,
  app: fromApp.reducer,
  listing: fromListing.reducer,
  booking: fromBooking.reducer,
  contact: fromContact.reducer,
  discount: fromDiscount.reducer,
  task: fromTask.reducer,
  option: fromOption.reducer,
  message: fromMessage.reducer,
  multiCalendar: fromMultiCalendar.reducer,
  prospect: fromProspect.reducer,
  quote: fromQuote.reducer,
  customVariable : fromCustomVariable.reducer,
  alert : fromAlert.reducer,
  cannedResponse:fromCannedResponse.reducer,
  minStayTemplate:fromMinStayTemplate.reducer,
  autoResponse:fromAutoResponse.reducer,


};


/**
 * A selector function is a map function factory. We pass it parameters and it
 * returns a function that maps from the larger state tree into a smaller
 * piece of state. This selector simply selects the `books` state.
 *
 * Selectors are used with the `select` operator.
 *
 * ```ts
 * class MyComponent  {
 * 	constructor(state$: Observable<State>) {
 * 	  this.booksState$ = state$.select(getBooksState);
 * 	}
 * }
 * ```
 */


export const getUserState = (state: State) => state.user;
export const getAccountState = (state: State) => state.account;
export const getAppState = (state: State) => state.app;
export const getOptionState = (state: State) => state.option;
export const getListingState = (state: State) => state.listing;
export const getDiscountState = (state: State) => state.discount;
export const getBookingState = (state: State) => state.booking;
export const getContactsState = (state: State) => state.contact;
export const getTasksState = (state: State) => state.task;
export const getMessagesState = (state: State) => state.message;
export const getMultiCalendarState = (state: State) => state.multiCalendar;
export const getProspectState = (state: State) => state.prospect;
export const getQuoteState = (state: State) => state.quote;
export const getCustomVariableState = (state: State) => state.customVariable;
export const getAlertState = (state: State) => state.alert;
export const getCannedResponseState = (state: State) => state.cannedResponse;
export const getMinStayTemplateState = (state: State) => state.minStayTemplate;
export const getAutoResponseState = (state: State) => state.autoResponse;







/**
 * All the selectors from app state
 */
export const getAppLandingUrl = createSelector(getAppState, fromApp.getLandingUrl);
export const getAppIsBootstrapped = createSelector(getAppState, fromApp.getIsBootstrapped);
export const getAppIsMenuHidden = createSelector(getAppState, fromApp.getIsMenuHidden);

/**
 * All the selectors from user state
 */
export const getUser = createSelector(getUserState, fromUser.getUser);
export const isLoggingIn = createSelector(getUserState, fromUser.isLoggingIn);
export const isLoggedIn = createSelector(getUserState, fromUser.isLoggedIn);
export const isUserUpdating = createSelector(getUserState, fromUser.isUpdating);


/**
 * All the selectors from message state
 */
export const getIsMessagesLoadingByThreadId = (state: State, threadId: number) => {
  return fromMessage.getIsMessagesLoadingByThreadId(getMessagesState(state), threadId);
};
export const getIsMessagesLoadedByThreadId = (state: State, threadId: number) => {
  return fromMessage.getIsMessagesLoadedByThreadId(getMessagesState(state), threadId);
};
export const getMessagesByThreadId = (state: State, threadId: number) => {
  return fromMessage.getMessagesByThreadId(getMessagesState(state), threadId);
};


export const getSidebarSelectedOption = createSelector(getMessagesState, fromMessage.getSidebarFilter);


export const getThreads = createSelector(getMessagesState, fromMessage.getThreads);

export const getThreadById = (state: State, threadId: number) => {
  return fromMessage.getById(getMessagesState(state), threadId);
};

export const getUnreadThreads = createSelector(getMessagesState, fromMessage.getUnreadThreads);
export const getIsUnreadThreadLoading = createSelector(getMessagesState, fromMessage.getIsUnreadThreadLoading);
export const getIsUnreadThreadLoaded = createSelector(getMessagesState, fromMessage.getIsUnreadThreadLoaded);
export const getUnreadThreadIds = createSelector(getMessagesState, fromMessage.getUnreadThreadIds);
export const getUnreadCurrentPage = createSelector(getMessagesState, fromMessage.getUnreadCurrentPage);
export const getUnreadTotalPage = createSelector(getMessagesState, fromMessage.getUnreadTotalPage);

export const getFollowupThreads = createSelector(getMessagesState, fromMessage.getFollowupThreads);
export const getIsFollowupThreadLoading = createSelector(getMessagesState, fromMessage.getIsFollowupThreadLoading);
export const getIsFollowupThreadLoaded = createSelector(getMessagesState, fromMessage.getIsFollowupThreadLoaded);
export const getFollowupThreadIds = createSelector(getMessagesState, fromMessage.getFollowupThreadIds);
export const getFollowupCurrentPage = createSelector(getMessagesState, fromMessage.getFollowupCurrentPage);
export const getFollowupTotalPage = createSelector(getMessagesState, fromMessage.getFollowupTotalPage);

export const getBookedThreads = createSelector(getMessagesState, fromMessage.getBookedThreads);
export const getIsBookedThreadLoading = createSelector(getMessagesState, fromMessage.getIsBookedThreadLoading);
export const getIsBookedThreadLoaded = createSelector(getMessagesState, fromMessage.getIsBookedThreadLoaded);
export const getBookedThreadIds = createSelector(getMessagesState, fromMessage.getBookedThreadIds);
export const getBookedCurrentPage = createSelector(getMessagesState, fromMessage.getBookedCurrentPage);
export const getBookedTotalPage = createSelector(getMessagesState, fromMessage.getBookedTotalPage);

export const getOngoingThreads = createSelector(getMessagesState, fromMessage.getOngoingThreads);
export const getIsOngoingThreadLoading = createSelector(getMessagesState, fromMessage.getIsOngoingThreadLoading);
export const getIsOngoingThreadLoaded = createSelector(getMessagesState, fromMessage.getIsOngoingThreadLoaded);
export const getOngoingThreadIds = createSelector(getMessagesState, fromMessage.getOngoingThreadIds);
export const getOngoingThreadsCurrentPage = createSelector(getMessagesState, fromMessage.getOngoingCurrentPage);
export const getOngoingThreadsTotalPage = createSelector(getMessagesState, fromMessage.getOngoingTotalPage);

export const getRequestsThreads = createSelector(getMessagesState, fromMessage.getRequestsThreads);
export const getIsRequestsThreadLoading = createSelector(getMessagesState, fromMessage.getIsRequestsThreadLoading);
export const getIsRequestsThreadLoaded = createSelector(getMessagesState, fromMessage.getIsRequestsThreadLoaded);
export const getRequestsThreadIds = createSelector(getMessagesState, fromMessage.getRequestsThreadIds);
export const getRequestsCurrentPage = createSelector(getMessagesState, fromMessage.getRequestsCurrentPage);
export const getRequestsTotalPage = createSelector(getMessagesState, fromMessage.getRequestsTotalPage);

export const getArchivedThreads = createSelector(getMessagesState, fromMessage.getArchivedThreads);
export const getIsArchivedThreadLoading = createSelector(getMessagesState, fromMessage.getIsArchivedThreadLoading);
export const getIsArchivedThreadLoaded = createSelector(getMessagesState, fromMessage.getIsArchivedThreadLoaded);
export const getArchivedThreadIds = createSelector(getMessagesState, fromMessage.getArchivedThreadIds);
export const getArchivedCurrentPage = createSelector(getMessagesState, fromMessage.getArchivedCurrentPage);
export const getArchivedTotalPage = createSelector(getMessagesState, fromMessage.getArchivedTotalPage);


export const getOtherThreads = createSelector(getMessagesState, fromMessage.getOtherThreads);
export const getIsOtherThreadLoading = createSelector(getMessagesState, fromMessage.getIsOtherThreadLoading);
export const getIsOtherThreadLoaded = createSelector(getMessagesState, fromMessage.getIsOtherThreadLoaded);
export const getOtherThreadIds = createSelector(getMessagesState, fromMessage.getOtherThreadIds);
export const getOtherCurrentPage = createSelector(getMessagesState, fromMessage.getOtherCurrentPage);
export const getOtherTotalPage = createSelector(getMessagesState, fromMessage.getOtherTotalPage);

/**
 * All the selectors from listing state
 */
export const getListings = createSelector(getListingState, fromListing.getAll);
export const getIsListingsLoading = createSelector(getListingState, fromListing.getIsLoading);
export const getIsListingsLoaded = createSelector(getListingState, fromListing.getIsLoaded);
export const getListingEntities = createSelector(getListingState, fromListing.getEntities);
export const getListingById = (state: State, listingId: number) => {
  return fromListing.getById(getListingState(state), listingId);
};

export const getAdminStats = createSelector(getListingState, fromListing.getAllAdminStats);


export const getStats = createSelector(getListingState, fromListing.getAllStats);
export const getBreakdown = createSelector(getListingState, fromListing.getAllBreakdown);

export const getIsStatsLoading = createSelector(getListingState, fromListing.getIsStatsLoading);
export const getIsStatsLoaded = createSelector(getListingState, fromListing.getIsStatsLoaded);
export const getIsAdminStatsLoading = createSelector(getListingState, fromListing.getIsAdminStatsLoading);
export const getIsAdminStatsLoaded = createSelector(getListingState, fromListing.getIsAdminStatsLoaded);
export const getIsBreakdownLoading = createSelector(getListingState, fromListing.getIsMonthlyBreakdownLoading);
export const getIsBreakdownLoaded = createSelector(getListingState, fromListing.getIsMonthlyBreakdownLoaded);


export const getIsCalendarDataLoading = (state: State, listingId: number, month: string) => {
  return fromListing.isCalendarDataLoading(getListingState(state), listingId, month);
};
export const getIsCalendarDataLoaded = (state: State, listingId: number, month: string) => {
  return fromListing.isCalendarDataLoaded(getListingState(state), listingId, month);
};
export const getCalendarData = (state: State, listingId: number, month: string) => {
  return fromListing.getCalendarData(getListingState(state), listingId, month);
};



/**
 * All the selectors from saved message state
 */
export const getSavedMessages = createSelector(getCannedResponseState, fromCannedResponse.getSavedMessages);
export const getIsSavedMessagesLoading = createSelector(getCannedResponseState, fromCannedResponse.isSavedMessagesLoading);
export const getIsSavedMessagesLoaded = createSelector(getCannedResponseState, fromCannedResponse.isSavedMessagesLoaded);

/**
 * All the selectors from auto response state
 */
export const getAutoResponses = createSelector(getAutoResponseState, fromAutoResponse.getAutoResponses);
export const getIsAutoResponseLoading = createSelector(getAutoResponseState, fromAutoResponse.isAutoResponsesLoading);
export const getIsAutoResponseLoaded = createSelector(getAutoResponseState, fromAutoResponse.isAutoResponsesLoaded);



/**
 * All the selectors from min stay template state
 */
export const getMinStayTemplates = createSelector(getMinStayTemplateState, fromMinStayTemplate.getMinStaysTemplates);
export const getIsMinStayTemplatesLoading = createSelector(getMinStayTemplateState, fromMinStayTemplate.isMinStaysTemplatesLoading);
export const getIsMinStayTemplatesLoaded = createSelector(getMinStayTemplateState, fromMinStayTemplate.isMinStaysTemplatesLoaded);


/**
 * All the selectors from booking state
 */
export const getOwnerUpcomingBookings = createSelector(getBookingState, fromBooking.getOwnerUpcomingAll);
export const getUpcomingBookingEntities = createSelector(getBookingState, fromBooking.getOwnerUpcomingEntities);

export const getIsOwnerUpcomingBookingLoading = createSelector(getBookingState, fromBooking.getIsOwnerUpcomingLoading);
export const getIsOwnerUpcomingBookingLoaded = createSelector(getBookingState, fromBooking.getIsOwnerUpcomingLoaded);


export const getBookings = createSelector(getBookingState, fromBooking.getAll);
export const getBookingEntities = createSelector(getBookingState, fromBooking.getEntities);
export const getIsBookingLoading = createSelector(getBookingState, fromBooking.getIsLoading);
export const getIsBookingLoaded = createSelector(getBookingState, fromBooking.getIsLoaded);
export const getBookingById = (state: State, bookingId: number) => {
  return fromBooking.getById(getBookingState(state), bookingId);
};
export const getIsShowingById = (state: State, bookingId: number) => {
  return fromBooking.getIsShowing(getBookingState(state), bookingId);
};
export const getIsShowedById = (state: State, bookingId: number) => {
  return fromBooking.getIsShowed(getBookingState(state), bookingId);
};

export const getTodayBookings = createSelector(getBookingState, fromBooking.getTodayAll);
export const getIsTodayBookingLoading = createSelector(getBookingState, fromBooking.getIsTodayLoading);
export const getIsTodayBookingLoaded = createSelector(getBookingState, fromBooking.getIsTodayLoaded);
export const getTodayCurrentPage = createSelector(getBookingState, fromBooking.getTodayCurrentPage);
export const getTodayTotalPage = createSelector(getBookingState, fromBooking.getTodayTotalPage);
export const getTodayTotalCount = createSelector(getBookingState, fromBooking.getTodayTotalCount);

export const getUpcomingBookings = createSelector(getBookingState, fromBooking.getUpcomingAll);
export const getIsUpcomingBookingLoading = createSelector(getBookingState, fromBooking.getIsUpcomingLoading);
export const getIsUpcomingBookingLoaded = createSelector(getBookingState, fromBooking.getIsUpcomingLoaded);
export const getUpcomingCurrentPage = createSelector(getBookingState, fromBooking.getUpcomingCurrentPage);
export const getUpcomingTotalPage = createSelector(getBookingState, fromBooking.getUpcomingTotalPage);
export const getUpcomingTotalCount = createSelector(getBookingState, fromBooking.getUpcomingTotalCount);

export const getOngoingBookings = createSelector(getBookingState, fromBooking.getOngoingAll);
export const getIsOngoingBookingLoading = createSelector(getBookingState, fromBooking.getIsOngoingLoading);
export const getIsOngoingBookingLoaded = createSelector(getBookingState, fromBooking.getIsOngoingLoaded);
export const getOngoingCurrentPage = createSelector(getBookingState, fromBooking.getOngoingCurrentPage);
export const getOngoingTotalPage = createSelector(getBookingState, fromBooking.getOngoingTotalPage);
export const getOngoingTotalCount = createSelector(getBookingState, fromBooking.getOngoingTotalCount);

export const getPastBookings = createSelector(getBookingState, fromBooking.getPastAll);
export const getIsPastBookingLoading = createSelector(getBookingState, fromBooking.getIsPastLoading);
export const getIsPastBookingLoaded = createSelector(getBookingState, fromBooking.getIsPastLoaded);
export const getPastCurrentPage = createSelector(getBookingState, fromBooking.getPastCurrentPage);
export const getPastTotalPage = createSelector(getBookingState, fromBooking.getPastTotalPage);
export const getPastTotalCount = createSelector(getBookingState, fromBooking.getPastTotalCount);


/**
 * All the selectors from multicalendar state
 */
export const getIsMultiCalendarLoading = (state: State, month: number, year: number) => {
  return fromMultiCalendar.getIsMonthCalendarLoading(getMultiCalendarState(state), month, year);
};
export const getIsMultiCalendarLoaded = (state: State, month: number, year: number) => {
  return fromMultiCalendar.getIsMonthCalendarLoaded(getMultiCalendarState(state), month, year);
};
export const getMultiCalendarByMonth = (state: State, month: number, year: number) => {
  return fromMultiCalendar.getByMonth(getMultiCalendarState(state), month, year);
};


/**
 * All the selectors from the contact state
 */

export const getContacts = createSelector(getContactsState, fromContact.getContacts);
export const getContactById = (state: State, contactId: number) => {
  return fromContact.getById(getContactsState(state), contactId);
};

export const getActiveContacts = createSelector(getContactsState, fromContact.getActiveContacts);
export const getIsActiveContactLoading = createSelector(getContactsState, fromContact.getIsActiveContactsLoading);
export const getIsActiveContactLoaded = createSelector(getContactsState, fromContact.getIsActiveContactsLoaded);


export const getInActiveContacts = createSelector(getContactsState, fromContact.getInActiveContacts);
export const getIsInActiveContactLoading = createSelector(getContactsState, fromContact.getIsInActiveContactsLoading);
export const getIsInActiveContactLoaded = createSelector(getContactsState, fromContact.getIsInActiveContactsLoaded);


// All Selectors from Option State

export const getAdmins = createSelector(getOptionState, fromOption.getAllAdmins);
export const getAdminEntities = createSelector(getOptionState, fromOption.getAdminEntities);
export const getIsAdminLoading = createSelector(getOptionState, fromOption.getIsAdminsLoading);
export const getIsAdminLoaded = createSelector(getOptionState, fromOption.getIsAdminsLoaded);

export const getLocations = createSelector(getOptionState, fromOption.getLocationEntities);
export const getIsLocationsLoading = createSelector(getOptionState, fromOption.getIsLocationsLoading);
export const getIsLocationsLoaded = createSelector(getOptionState, fromOption.getIsLocationsLoaded);

export const getTags = createSelector(getOptionState, fromOption.getTagsEntities);
export const getIsTagsLoading = createSelector(getOptionState, fromOption.getIsTagsLoading);
export const getIsTagsLoaded = createSelector(getOptionState, fromOption.getIsTagsLoaded);


export const getCustomVariables = createSelector(getCustomVariableState, fromCustomVariable.getAll);
export const getIsCustomVariablesLoading = createSelector(getCustomVariableState, fromCustomVariable.getIsLoading);
export const getIsCustomVariablesLoaded = createSelector(getCustomVariableState, fromCustomVariable.getIsLoaded);

export const getVendors = createSelector(getOptionState, fromOption.getVendorsEntities);
export const getIsVendorsLoading = createSelector(getOptionState, fromOption.getIsVendorsLoading);
export const getIsVendorsLoaded = createSelector(getOptionState, fromOption.getIsVendorsLoaded);


export const getAssigness = createSelector(getOptionState, fromOption.getTaskAssigneesEntities);
export const getIsAssigneesLoading = createSelector(getOptionState, fromOption.getIsTaskAssigneesLoading);
export const getIsAssgineesLoaded = createSelector(getOptionState, fromOption.getIsTaskAssigneesLoaded);


/**
 * All the selectors from the task state
 */
export const getIsTasksLoading = createSelector(getTasksState, fromTask.getIsLoading);
export const getIsTasksLoaded = createSelector(getTasksState, fromTask.getIsLoaded);
export const getTasks = createSelector(getTasksState, fromTask.getAll);
export const getTaskEntities = createSelector(getTasksState, fromTask.getEntities);
export const getTaskById = (state: State, taskId: number) => {
  return fromTask.getById(getTasksState(state), taskId);
};


export const getIsAutoTasksLoading = createSelector(getTasksState, fromTask.getIsAutoTaskLoading);
export const getIsAutoTasksLoaded = createSelector(getTasksState, fromTask.getIsAutoTaskLoaded);
export const getAutoTasks = createSelector(getTasksState, fromTask.getAllAutoTasks);
export const getAutoTaskEntities = createSelector(getTasksState, fromTask.getAutoTaskEntities);
export const getAutoTaskById = (state: State, taskId: number) => {
  return fromTask.getAutoTaskById(getTasksState(state), taskId);
};

/**
 * All the selectors from prospect state
 */
export const getTodayProspects = createSelector(getProspectState, fromProspect.getTodayAll);
export const getIsTodayProspectLoading = createSelector(getProspectState, fromProspect.getIsTodayLoading);
export const getIsTodayProspectLoaded = createSelector(getProspectState, fromProspect.getIsTodayLoaded);
export const getTodayProspectCurrentPage = createSelector(getProspectState, fromProspect.getTodayCurrentPage);
export const getTodayProspectTotalPage = createSelector(getProspectState, fromProspect.getTodayTotalPage);
export const getTodayProspectTotalCount = createSelector(getProspectState, fromProspect.getTodayTotalCount);

export const getUpcomingProspects = createSelector(getProspectState, fromProspect.getUpcomingAll);
export const getIsUpcomingProspectLoading = createSelector(getProspectState, fromProspect.getIsUpcomingLoading);
export const getIsUpcomingProspectLoaded = createSelector(getProspectState, fromProspect.getIsUpcomingLoaded);
export const getUpcomingProspectCurrentPage = createSelector(getProspectState, fromProspect.getUpcomingCurrentPage);
export const getUpcomingProspectTotalPage = createSelector(getProspectState, fromProspect.getUpcomingTotalPage);
export const getUpcomingProspectTotalCount = createSelector(getProspectState, fromProspect.getUpcomingTotalCount);

export const getExpiredProspects = createSelector(getProspectState, fromProspect.getExpiredAll);
export const getIsExpiredProspectLoading = createSelector(getProspectState, fromProspect.getIsExpiredLoading);
export const getIsExpiredProspectLoaded = createSelector(getProspectState, fromProspect.getIsExpiredLoaded);
export const getExpiredProspectCurrentPage = createSelector(getProspectState, fromProspect.getExpiredCurrentPage);
export const getExpiredProspectTotalPage = createSelector(getProspectState, fromProspect.getExpiredTotalPage);
export const getExpiredProspectTotalCount = createSelector(getProspectState, fromProspect.getExpiredTotalCount);

export const getPassedProspects = createSelector(getProspectState, fromProspect.getPassedAll);
export const getIsPassedProspectLoading = createSelector(getProspectState, fromProspect.getIsPassedLoading);
export const getIsPassedProspectLoaded = createSelector(getProspectState, fromProspect.getIsPassedLoaded);
export const getPassedProspectCurrentPage = createSelector(getProspectState, fromProspect.getPassedCurrentPage);
export const getPassedProspectTotalPage = createSelector(getProspectState, fromProspect.getPassedTotalPage);
export const getPassedProspectTotalCount = createSelector(getProspectState, fromProspect.getPassedTotalCount);


/**
 * All the selectors from quote state
 */

export const getQuotes = createSelector(getQuoteState, fromQuote.getAll);
export const getQuoteEntities = createSelector(getQuoteState, fromQuote.getEntities);

export const getIsQuotesLoading = createSelector(getQuoteState, fromQuote.getIsLoading);
export const getIsQuotesLoaded = createSelector(getQuoteState, fromQuote.getIsLoaded);

/**
 * All the selectors from accounts state
 */

export const getAirbnbAccounts = createSelector(getAccountState, fromAccount.getAll);
export const getIsAccountsLoading = createSelector(getAccountState, fromAccount.getIsLoading);
export const getIsAccountsLoaded = createSelector(getAccountState, fromAccount.getIsLoaded);

/**
 * All the selectors from discount state
 */

export const getDiscounts = createSelector(getDiscountState, fromDiscount.getAll);
export const getDiscountEntities = createSelector(getDiscountState, fromDiscount.getEntities);
export const getIsDiscountsLoading = createSelector(getDiscountState, fromDiscount.getIsLoading);
export const getIsDiscountsLoaded = createSelector(getDiscountState, fromDiscount.getIsLoaded);
export const getDiscountById = (state: State, discountId: number) => {
  return fromDiscount.getById(getDiscountState(state), discountId);
};

/**
 * All the selectors from Alerts state
 */
export const getAlerts = createSelector(getAlertState, fromAlert.getAll);
export const getIsAlertsLoading = createSelector(getAlertState, fromAlert.getIsLoading);
export const getIsAlertsLoaded = createSelector(getAlertState, fromAlert.getIsLoaded);
