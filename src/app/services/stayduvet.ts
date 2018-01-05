import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, ResponseContentType} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';
import {User} from '../models/user';
import {MatSnackBar} from '@angular/material';
import {Store} from '@ngrx/store';
import {State} from '../reducers';
import {LoginSuccessAction} from '../actions/user';
import {AppStateResetAction} from '../actions/index';
import {isNullOrUndefined, isUndefined} from 'util';
import {Listing} from '../models/listing';
import * as fromUser from '../actions/user';
import {
  AddCheckListSuccessAction,
  AddContactSuccessAction,
  AttachTagSuccessAction,
  BlockSuccessAction,
  CalendarRequestAction,
  CalendarSuccessAction,
  CreateRequestAction,
  CreateSuccessAction,
  DeleteCheckListSuccessAction,
  DeleteContactSuccessAction,
  DeleteImageSuccessAction,
  DeleteTagSuccessAction,
  EditImageSuccessAction,
  ImageSortingSuccessAction,
  IndexAdminStatsRequestAction,
  IndexAdminStatsSuccessAction,
  IndexMonthlyBreakdownRequestAction,
  IndexMonthlyBreakdownSuccessAction,
  IndexStatsRequestAction,
  IndexStatsSuccessAction,
  IndexSuccessAction,
  UnblockSuccessAction,
  UpdateCheckListSuccessAction,
  UpdateRequestAction,
  UpdateSuccessAction,
} from '../actions/listing';
import {Booking} from '../models/booking';
import {
  BookingCreateRequestAction, BookingCreateSuccessAction,
  BookingGuestAddRequestAction,
  BookingGuestAddSuccessAction,
  BookingGuestDeleteRequestAction,
  BookingGuestDeleteSuccessAction,
  BookingGuestUpdateRequestAction,
  BookingGuestUpdateSuccessAction,
  BookingIndexRequestAction,
  BookingIndexSuccessAction, BookingPaymentCreateRequestAction, BookingPaymentCreateSuccessAction,
  BookingScheduledMessageUpdateRequestAction,
  BookingScheduledMessageUpdateSuccessAction,
  BookingSecurityDeductionRequestAction,
  BookingSecurityDeductionSuccessAction,
  BookingShowRequestAction, BookingShowSuccessAction,
  BookingUpdateRequestAction,
  BookingUpdateSuccessAction, OngoingBookingIndexRequestAction,
  OngoingBookingIndexSuccessAction,
  PastBookingIndexRequestAction,
  PastBookingIndexSuccessAction, TodayBookingIndexRequestAction,
  TodayBookingIndexSuccessAction, UpcomingBookingIndexRequestAction, UpcomingBookingIndexSuccessAction,
  UpcomingOwnerBookingIndexRequestAction,
  UpcomingOwnerBookingIndexSuccessAction
} from '../actions/booking';
import Utils from '../utils';
import {
  ActiveContactIndexRequestAction, ActiveContactIndexSuccessAction, ActiveContactSuccessAction,
  AddListingSuccessAction,
  ContactCreateRequestAction, ContactCreateSuccessAction,
  ContactUpdateRequestAction,
  ContactUpdateSuccessAction, InActiveContactIndexRequestAction, InActiveContactIndexSuccessAction,
  InActiveContactSuccessAction, IndexContactSuccessAction,
  RemoveListingSuccessAction
} from '../actions/contact';
import {Task} from '../models/task';
import {
  AutoTaskCreateRequestAction,
  AutoTaskCreateSuccessAction, AutoTaskDeleteRequestAction, AutoTaskDeleteSuccessAction,
  AutoTaskIndexRequestAction,
  AutoTaskIndexSuccessAction,
  AutoTaskUpdateRequestAction,
  AutoTaskUpdateSuccessAction,
  TaskCreateRequestAction,
  TaskCreateSuccessAction, TaskDeleteRequestAction, TaskDeleteSuccessAction,
  TaskIndexRequestAction,
  TaskIndexSuccessAction,
  TaskUpdateRequestAction,
  TaskUpdateSuccessAction
} from '../actions/task';
import {Message} from '../models/message';
import {
  ArchivedThreadIndexRequestAction, ArchivedThreadIndexSuccessAction, BookedThreadIndexRequestAction,
  BookedThreadIndexSuccessAction,
  FollowupThreadIndexRequestAction,
  FollowupThreadIndexSuccessAction,

  MessageCreateRequestAction, MessageCreateSuccessAction, MessageIndexRequestAction, MessageIndexSuccessAction,
  OngoingThreadIndexRequestAction, OngoingThreadIndexSuccessAction, OtherThreadsIndexRequestAction,
  OtherThreadsIndexSuccessAction,
  RequestsThreadIndexRequestAction, RequestsThreadIndexSuccessAction, ThreadBookingUpdateSuccessAction,
  ThreadGetRequest, ThreadGetSuccess, ThreadStatusUpdateSuccessAction,
  ThreadUpdateRequestAction, ThreadUpdateSuccessAction, UnreadThreadIndexRequestAction, UnreadThreadIndexSuccessAction
} from '../actions/message';
import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import {Thread} from '../models/thread';
import {SearchResponse} from '../models/search-response';
import {AirbnbAccount} from '../models/airbnb_account';
import {MultiCalendarIndexRequestAction, MultiCalendarIndexSuccessAction} from 'app/actions/multi-calendar';
import {
  AdminIndexRequestAction,
  AdminIndexSuccessAction,
  LocationsIndexRequestAction,
  LocationsIndexSuccessAction,
  TagAddSuccessAction,
  TagsIndexRequestAction,
  TagsIndexSuccessAction,
  TaskAssigneesIndexRequestAction,
  TaskAssigneesIndexSuccessAction,
  VendorsIndexRequestAction,
  VendorsIndexSuccessAction
} from '../actions/option';
import {Tag} from '../models/tag';
import {OwnerBlock} from '../models/owner-block';
import {Image} from '../models/image';
import {SavedMessage} from '../models/saved-message';
import DateUtils from '../utils/date';
import {Quote} from '../models/quote';
import {CheckList} from '../models/check-list';
import {Prospect} from '../models/prospect';
import {
  ProspectCreateRequestAction, ProspectCreateSuccessAction,
  ProspectIndexTodaySuccessAction, ProspectIndexTodayRequestAction, ProspectIndexUpcomingRequestAction,
  ProspectIndexUpcomingSuccessAction, ProspectIndexExpiredRequestAction, ProspectIndexPassedRequestAction,
  ProspectIndexPassedSuccessAction, ProspectIndexExpiredSuccessAction
} from '../actions/prospect';
import {
  QuoteCreateRequestAction, QuoteCreateSuccessAction, QuoteIndexRequestAction,
  QuoteIndexSuccessAction
} from 'app/actions/quote';
import {
  AirbnbAAccountUpdateSuccessAction,
  AirbnbAccountsFetchRequestAction, AirbnbAccountsFetchSuccessAction
} from '../actions/account';
import {LastMinuteDiscount} from '../models/last-minute-discount';
import {
  DiscountAddRequestAction,
  DiscountADDSuccessAction,
  DiscountIndexRequestAction,
  DiscountIndexSuccessAction,
  DiscountUpdateRequestAction,
  DiscountUpdateSuccessAction,
  DiscountDeleteRequestAction,
  DiscountDeleteSuccessAction
} from '../actions/discount';
import {DiscountRule} from '../models/rule';
import {AutoTask} from 'app/models/auto-task';
import {CustomVariable} from '../models/custom-variable';
import {
  CustomVariableAddRequestAction, CustomVariableAddSuccessAction,
  CustomVariableDeleteRequestAction,
  CustomVariableDeleteSuccessAction, CustomVariableIndexRequestAction,
  CustomVariableIndexSuccessAction, CustomVariableUpdateRequestAction, CustomVariableUpdateSuccessAction
} from '../actions/custom-variable';
import {
  AlertsCreateRequestAction, AlertsCreateSuccessAction, AlertsDeleteRequestAction, AlertsDeleteSuccessAction,
  AlertsIndexRequestAction,
  AlertsIndexSuccessAction, AlertsUpdateRequestAction, AlertsUpdateSuccessAction
} from '../actions/alert';
import {Alert} from '../models/alert';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {
  CreateSavedMessageRequestAction, CreateSavedMessageSuccessAction,
  DeleteSavedMessageRequestAction, DeleteSavedMessageSuccessAction, IndexSavedMessageRequestAction,
  IndexSavedMessageSuccessAction, UpdateSavedMessageRequestAction, UpdateSavedMessageSuccessAction
} from '../actions/canned-response';
import {
  CreateMinStaysTemplateRequestAction,
  DeleteMinStaysTemplateRequestAction,
  UpdateMinStaysTemplateRequestAction,
  CreateMinStaysTemplateSuccessAction,
  DeleteMinStaysTemplateSuccessAction,
  IndexMinStaysTemplateSuccessAction,
  UpdateMinStaysTemplateSuccessAction,
  IndexMinStaysTemplateRequestAction
} from '../actions/min-stays-template';
import {MinimumStay} from '../models/minimum-stay';
import {
  CreateAutoResponseRequestAction, CreateAutoResponseSuccessAction,
  DeleteAutoResponseRequestAction, DeleteAutoResponseSuccessAction, IndexAutoResponseRequestAction,
  IndexAutoResponseSuccessAction, UpdateAutoResponseRequestAction, UpdateAutoResponseSuccessAction
} from '../actions/auto-response';
import {AutoResponse} from '../models/auto-response';
import {SecurityDeduction} from '../models/security-deduction';
import {ScheduledMessage} from '../models/scheduled-message';
import {dateToDateString, getDateObj} from "../components/calendar/calendar-utils";
import {Payment} from '../models/payment';


@Injectable()
export class StayDuvetService {

  /**
   * Constants
   */
  private PROPERTY_INCLUDES = 'managementContacts,tags,owner,assignee,checklists';
  private BASE_URL = environment.apiBaseURL;

  static hasLoginToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  login(data: { email: string, password: string }): Observable<User> {
    return this.get('/authenticate', data).map(res => {
      localStorage.setItem('auth_token', res.json().token);
      const userObject = Object.assign(new User(), res.json().user);
      this.store.dispatch(new LoginSuccessAction(userObject));
      return userObject;
    }).catch(this.handleError.bind(this));
  }

  signupViaEmail(data: { email: string, password: string, first_name: string, last_name: string }): Observable<User> {
    return this.post('/owner/register', data).map(res => {
      localStorage.setItem('auth_token', res.json().token);
      const userObject = Object.assign(new User(), res.json().user);
      this.store.dispatch(new LoginSuccessAction(userObject));
      return userObject;
    }).catch(this.handleError.bind(this));
  }

  signupViaAirbnb(data: { forwarding_email:string , airbnb_username: string, airbnb_password: string }): Observable<any> {
    return this.post('/owner/register', data).map(res => {
      localStorage.setItem('auth_token', res.json().token);
      return res.json();
    }).catch(this.handleError.bind(this));
  }

  forgotPassword(data: { email: string }): Observable<boolean | {}> {
    return this.post('/password/forgot', data).map(res => {
      return true;
    }).catch(this.handleError.bind(this));
  }

  resetPassword(data: { email: string, code: string, password: string, password_confirmation: string }): Observable<boolean | {}> {
    return this.post('/password/reset/code', data).map(res => {
      return true;
    }).catch(this.handleError.bind(this));
  }

  attachAirbnbAccount(data: any): Observable<AirbnbAccount> {
    return this.post('/airbnb/accounts', data).map(res => {
      return Object.assign(new AirbnbAccount(), res.json());
    }).catch(this.handleError.bind(this));
  }

  pingAirbnbAccount(account_id: number): Observable<AirbnbAccount> {
    return this.get('/airbnb/accounts/' + account_id + '/ping').map(res => {
      return Object.assign(new AirbnbAccount(), res.json().data);
    }).catch(this.handleError.bind(this));
  }

  updateAirbnbAccount(id: number,data: any): Observable<AirbnbAccount> {
    return this.put('/airbnb/accounts/' + id, data).map(res => {
      const account = res.json().data;
      this.store.dispatch(new AirbnbAAccountUpdateSuccessAction(account));
      return Object.assign(new AirbnbAccount(), account);
    }).catch(this.handleError.bind(this));
  }

  refreshAirbnbAccount(account_id: number): Observable<boolean | {}> {
    return this.get('/airbnb/accounts/' + account_id + '/refresh').map(res => {
      return true;
    }).catch(this.handleError.bind(this));
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.store.dispatch(new AppStateResetAction());
  }

  me(): Observable<User> {
    return this.get('/me').map(res => {
      const user = res.json().data;
      const userObject = Object.assign(new User(), user);

      this.store.dispatch(new fromUser.UpdateSuccessAction(userObject));

      return userObject;
    }).catch(this.handleError.bind(this));
  }

  updateProfile(data: {
    first_name: string, last_name: string, email: string, secondary_email: string, phone_number: any,
    secondary_phone_number: any, preferred_contact_method: string, description: string
  }): Observable<User> {
    return this.put('/me', data).map((res) => {
      const user = res.json().data;
      const userObject = Object.assign(new User(), user);
      this.store.dispatch(new fromUser.UpdateSuccessAction(userObject));
      return user;
    }).catch(this.handleError.bind(this));
  }

  updateUserPic(data: { image: File }): any {
    const formData: FormData = new FormData();
    formData.append('image', data.image, data.image.name);
    const req = new HttpRequest('POST', this.BASE_URL + '/me/update-pic', formData, {
      headers: new HttpHeaders({
        'Authorization': 'bearer ' + localStorage.getItem('auth_token')
      }), reportProgress: true,
    });
    return this.httpClient.request(req).catch(this.handleError.bind(this));
  }

  changePassword(data: { old_password: string, password: string, password_confirmation: string }): Observable<boolean | {}> {
    return this.put('/me/password', data).map(() => {
      return true;
    }).catch(this.handleError.bind(this));
  }

  createListing(): Observable<Listing> {
    this.store.dispatch(new CreateRequestAction);
    return this.post('/properties?include=' + this.PROPERTY_INCLUDES).map((res) => {
      const listing = Object.assign(new Listing(), res.json().data);

      this.store.dispatch(new CreateSuccessAction(listing));

      return listing;
    }).catch(this.handleError.bind(this));
  }

  getAirbnbAccounts(): Observable<AirbnbAccount[] | {}> {
    this.store.dispatch(new AirbnbAccountsFetchRequestAction());
    return this.get('/airbnb/accounts').map((res) => {
      const accounts = res.json().data;
      this.store.dispatch(new AirbnbAccountsFetchSuccessAction(accounts));
      return accounts;
    }).catch(this.handleError.bind(this));
  }

  getActiveContacts(): Observable<User[] | {}> {
    this.store.dispatch(new ActiveContactIndexRequestAction());
    return this.get('/admin/contacts/active').map((res) => {
      const contacts = res.json().data;
      const contactsArray: User[] = [];
      for (const contact of contacts) {
        contactsArray.push(Object.assign(new User(), contact));
      }

      this.store.dispatch(new ActiveContactIndexSuccessAction(contactsArray));

      return contactsArray;
    }).catch(this.handleError.bind(this));
  }

  getInActiveContacts(): Observable<User[] | {}> {
    this.store.dispatch(new InActiveContactIndexRequestAction());
    return this.get('/admin/contacts/in-active').map((res) => {
      const contacts = res.json().data;
      const contactsArray: User[] = [];
      for (const contact of contacts) {
        contactsArray.push(Object.assign(new User(), contact));
      }

      this.store.dispatch(new InActiveContactIndexSuccessAction(contactsArray));

      return contactsArray;
    }).catch(this.handleError.bind(this));
  }

  getContactById(contactId): Observable<User | {}> {
    return this.get('/admin/contacts/' + contactId).map((res) => {
      let contact = res.json().data;
      contact = Object.assign(new User(), contact);
      this.store.dispatch(new IndexContactSuccessAction(contact));
      return contact;
    }).catch(this.handleError.bind(this));
  }

  activeContact(contactId): Observable<User[] | {}> {
    return this.post('/admin/contacts/' + contactId + '/active').map((res) => {
      let contact = res.json().data;
      console.log(contact);
      contact = Object.assign(new User(), contact);
      this.store.dispatch(new ActiveContactSuccessAction(contact));
      return contact;
    }).catch(this.handleError.bind(this));
  }

  inActiveContact(contactId): Observable<User[] | {}> {
    return this.post('/admin/contacts/' + contactId + '/in-active').map((res) => {
      let contact = res.json().data;
      console.log(contact);
      contact = Object.assign(new User(), contact);
      this.store.dispatch(new InActiveContactSuccessAction(contact));
      return contact;
    }).catch(this.handleError.bind(this));
  }

  getListingLocations(): Observable<string[] | {}> {
    this.store.dispatch(new LocationsIndexRequestAction());
    return this.get('/options/listing-locations').map((res) => {
      const locations = res.json();
      this.store.dispatch(new LocationsIndexSuccessAction(locations));
      return locations;
    }).catch(this.handleError.bind(this));
  }

  getTags(): Observable<string[] | {}> {
    this.store.dispatch(new TagsIndexRequestAction());
    return this.get('/options/tags').map((res) => {
      const tags = res.json();
      this.store.dispatch(new TagsIndexSuccessAction(tags));
      return tags;
    }).catch(this.handleError.bind(this));
  }

  getTaskAssignees(): Observable<User[] | {}> {
    this.store.dispatch(new TaskAssigneesIndexRequestAction());
    return this.get('/options/assignees').map((res) => {
      const assignees = res.json().data;
      this.store.dispatch(new TaskAssigneesIndexSuccessAction(assignees));
      return assignees;
    }).catch(this.handleError.bind(this));
  }

  getAdmins(): Observable<User[] | {}> {
    this.store.dispatch(new AdminIndexRequestAction());
    return this.get('/options/admins').map((res) => {
      const admins = res.json().data;
      const adminsArray = [];
      for (const admin of admins) {
        adminsArray.push(Object.assign(new User(), admin));
      }

      this.store.dispatch(new AdminIndexSuccessAction(adminsArray));

      return adminsArray;
    }).catch(this.handleError.bind(this));
  }

  getVendors(): Observable<User[] | {}> {
    this.store.dispatch(new VendorsIndexRequestAction());
    return this.get('/options/vendors').map((res) => {
      const vendors = res.json().data;

      const vendorArray = [];
      for (const vendor of vendors) {
        vendorArray.push(Object.assign(new User(), vendor));
      }

      this.store.dispatch(new VendorsIndexSuccessAction(vendorArray));

      return vendorArray;
    }).catch(this.handleError.bind(this));
  }

  createContact(data: {
    first_name: string, last_name?: string, email: string, secondary_email?: string, phone_number?: number, secondary_phone_number?: number, category: string, preferred_contact_method: string, listing_ids?: number[], description?: string,
  }): Observable<User> {
    this.store.dispatch(new ContactCreateRequestAction());
    return this.post('/contacts', data).map(res => {
      const dataObj = res.json().data;
      const newContact = Object.assign(new User(), dataObj);
      this.store.dispatch(new ContactCreateSuccessAction(newContact));
      if (newContact.type === 'management') {
        newContact.getManagementContact().properties.forEach(id => {
          this.store.dispatch(new AddContactSuccessAction({
            contact: newContact, listingId: id
          }));
        });
      }

      return newContact;
    }).catch(this.handleError.bind(this));
  }


  downloadOwnerStatement(ownerId: number, data: {
    start_date: string,
    end_date?: string,
    format: string,
  }): Observable<Blob | {}> {
    data.start_date = dateToDateString(getDateObj(data.start_date));
    data.end_date = dateToDateString(getDateObj(data.end_date));
    return this.post('/owners/' + ownerId + '/owner-statement-download', data, ResponseContentType.Blob).map(res => {
      return res.blob();
    }).catch(this.handleError.bind(this));
  }

  mailOwnerStatement(ownerId: number, data: {
    start_date: string,
    end_date?: string,
    format: string,
  }): Observable<any> {
    data.start_date = dateToDateString(getDateObj(data.start_date));
    data.end_date = dateToDateString(getDateObj(data.end_date));
    return this.post('/owners/' + ownerId + '/owner-statement-mail', data).map(res => {
      return res;
    }).catch(this.handleError.bind(this));
  }

  downloadHomeOwnerStatement(homeownerId:number, data: {
    start_date: string,
    end_date?: string,
    format: string,
  }): Observable<Blob | {}> {
    data.start_date = dateToDateString(getDateObj(data.start_date));
    data.end_date = dateToDateString(getDateObj(data.end_date));
    return this.post('/homeowners/'+homeownerId+'/download-homeowner-statement', data, ResponseContentType.Blob).map(res => {
      console.log(res);
      return res.blob();
    }).catch(this.handleError.bind(this));
  }

  downloadPropertyIncomeReport(data: {
    start_date: string,
    end_date?: string,
    format: string,
    property_ids: number[],
  }): Observable<Blob | {}> {
    data.start_date = dateToDateString(getDateObj(data.start_date));
    data.end_date = dateToDateString(getDateObj(data.end_date));
    return this.post('/admin/property-income-report', data, ResponseContentType.Blob).map(res => {
      return res.blob();
    }).catch(this.handleError.bind(this));
  }

  mailHomeOwnerStatement(homeownerId:number,data: {
    start_date: string,
    end_date?: string,
    format: string,
  }): Observable<any> {
    data.start_date = dateToDateString(getDateObj(data.start_date));
    data.end_date = dateToDateString(getDateObj(data.end_date));
    return this.post('/homeowners/'+homeownerId+'/mail-homeowner-statement', data).map(res => {
      return res;
    }).catch(this.handleError.bind(this));
  }

  updateContact(contactId: number, data: {
    first_name?: string,
    last_name?: string,
    email?: string,
    secondary_email?: string,
    phone_number?: number,
    secondary_phone_number?: number,
    management_category?: string,
    preferred_contact_method?: string,
    description?: string,
    bank_name?: string,
    account_number?: string,
    routing_number?: string,

  }): Observable<User> {
    this.store.dispatch(new ContactUpdateRequestAction());
    return this.put('/admin/contacts/' + contactId, data).map(res => {
      const dataObj = res.json().data;
      const newContact = Object.assign(new User(), dataObj);
      this.store.dispatch(new ContactUpdateSuccessAction(newContact));
      return newContact;
    }).catch((error) => {
        this.handleError(error);
        return error;
      }
    );
  }

  updateContactPic(contactId: number, data: { image: File }): any {
    const formData: FormData = new FormData();
    formData.append('image', data.image, data.image.name);
    const req = new HttpRequest('POST', this.BASE_URL + '/admin/contacts/' + contactId + '/update-pic', formData, {
      headers: new HttpHeaders({
        'Authorization': 'bearer ' + localStorage.getItem('auth_token')
      }), reportProgress: true,
    });
    return this.httpClient.request(req).catch(this.handleError.bind(this));
  }

  getListings(): Observable<Listing[] | {}> {
    return this.get('/properties?include=' + this.PROPERTY_INCLUDES).map((res) => {
      const listings = res.json().data;
      const listingsArray = [];
      for (const listing of listings) {
        listingsArray.push(Object.assign(new Listing(), listing));
      }

      this.store.dispatch(new IndexSuccessAction(listingsArray));

      return listingsArray;
    }).catch(this.handleError.bind(this));
  }

  getStats(): Observable<any> {
    this.store.dispatch(new IndexStatsRequestAction());
    return this.get('/total-stats').map((res) => {
      this.store.dispatch(new IndexStatsSuccessAction(res.json()));
    }).catch(this.handleError.bind(this));
  }

  getAdminStats(sources: string[] = []): Observable<any> {
    this.store.dispatch(new IndexAdminStatsRequestAction());
    return this.get('/admin/sales-stats', {
      source: sources
    }).map((res) => {
      this.store.dispatch(new IndexAdminStatsSuccessAction(res.json()));
    }).catch(this.handleError.bind(this));
  }

  getOwnerMonthlyBreakdown(sources: string[] = []): Observable<any> {
    this.store.dispatch(new IndexMonthlyBreakdownRequestAction());
    return this.get('/bookings/monthly-breakdown', {
      source: sources
    }).map((res) => {
      this.store.dispatch(new IndexMonthlyBreakdownSuccessAction(res.json()));
    }).catch(this.handleError.bind(this));
  }

  getHashedBooking(hashedId: string): Observable<Booking> {
    return this.get('/bookings/hashed/' + hashedId + '?include=guest,property').map((res) => {
      const booking = res.json().data;

      return Object.assign(new Booking(), booking);
    }).catch(this.handleError.bind(this));
  }

  getHashedQuote(hashedId: string): Observable<Quote> {
    return this.get('/quotes/hashed/' + hashedId +'?include=property,prospect').map((res) => {
      const quote = res.json().data;
      return Object.assign(new Quote(), quote);
    }).catch(this.handleError.bind(this));
  }

  getHashedPayment(hashedId: string): Observable<Payment> {
    return this.get('/payments/hashed/' + hashedId + '?include=booking,booking.property,booking,guest').map((res) => {
      const payment = res.json().data;
      return Object.assign(new Payment(), payment);
    }).catch(this.handleError.bind(this));
  }

  getBookings(): Observable<Booking[] | {}> {
    this.store.dispatch(new BookingIndexRequestAction());

    return this.get('/admin/bookings?include=guest').map((res) => {
      const bookings = res.json().data;

      const bookingsArray = [];
      for (const booking of bookings) {
        bookingsArray.push(Object.assign(new Booking(), booking));
      }

      this.store.dispatch(new BookingIndexSuccessAction(bookingsArray));

      return bookingsArray;
    }).catch(this.handleError.bind(this));
  }

  getBookingWithPropertyId(propertyId: number): Observable<Booking[] | {}> {
    return this.get('/properties/' + propertyId + '/bookings').map((res) => {
      const bookings = res.json().data;

      const bookingsArray = [];
      for (const booking of bookings) {
        bookingsArray.push(Object.assign(new Booking(), booking));
      }
      return bookingsArray;
    }).catch(this.handleError.bind(this));
  }

  getBookingWithId(bookingId: number): Observable<Booking> {
    this.store.dispatch(new BookingShowRequestAction(bookingId));

    return this.get('/admin/bookings/' + bookingId + '?include=guest,securityDeductions,tasks,logs,payments,scheduledMessages').map((res) => {
      const booking = res.json().data;

      const bookingObject = Object.assign({}, new Booking(), booking);

      this.store.dispatch(new BookingShowSuccessAction(bookingObject));

      return bookingObject;
    }).catch(this.handleError.bind(this));
  }

  updateScheduledMessage(bookingId: number, scheduledMessageId: number, data: any): Observable<boolean | {}> {
    this.store.dispatch(new BookingScheduledMessageUpdateRequestAction());
    return this.put('/admin/scheduled-messages/' + scheduledMessageId, data).map(res => {
      const message = Object.assign(new ScheduledMessage(), res.json().data);
      this.store.dispatch(new BookingScheduledMessageUpdateSuccessAction({
        bookingId: bookingId,
        scheduledMessage: message
      }));
      return true;
    }).catch(this.handleError.bind(this));
  }

  getTodayBookings(page: number): Observable<Booking[] | {}> {
    this.store.dispatch(new TodayBookingIndexRequestAction());

    const offset = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return this.get('/admin/bookings/today?include=guest&page=' + page, {
      timezone: offset
    }).map((res) => {
      const bookings = res.json().data;

      const bookingsArray = [];
      for (const booking of bookings) {
        bookingsArray.push(Object.assign(new Booking(), booking));
      }

      const pagination = res.json().meta.pagination;
      this.store.dispatch(new TodayBookingIndexSuccessAction({
        bookings: bookingsArray,
        currentPage: pagination.current_page,
        totalPages: pagination.total_pages,
        totalCount: pagination.total
      }));

      return bookingsArray;
    }).catch(this.handleError.bind(this));
  }

  getUpcomingBookings(page: number): Observable<Booking[] | {}> {
    this.store.dispatch(new UpcomingBookingIndexRequestAction());

    const offset = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return this.get('/admin/bookings/upcoming?include=guest&page=' + page, {
      timezone: offset
    }).map((res) => {
      const bookings = res.json().data;

      const bookingsArray = [];
      for (const booking of bookings) {
        bookingsArray.push(Object.assign(new Booking(), booking));
      }

      const pagination = res.json().meta.pagination;
      this.store.dispatch(new UpcomingBookingIndexSuccessAction({
        bookings: bookingsArray,
        currentPage: pagination.current_page,
        totalPages: pagination.total_pages,
        totalCount: pagination.total
      }));

      return bookingsArray;
    }).catch(this.handleError.bind(this));
  }

  getOngoingBookings(page: number): Observable<Booking[] | {}> {
    this.store.dispatch(new OngoingBookingIndexRequestAction());

    const offset = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return this.get('/admin/bookings/ongoing?include=guest&page=' + page, {
      timezone: offset
    }).map((res) => {
      const bookings = res.json().data;

      const bookingsArray = [];
      for (const booking of bookings) {
        bookingsArray.push(Object.assign(new Booking(), booking));
      }

      const pagination = res.json().meta.pagination;
      this.store.dispatch(new OngoingBookingIndexSuccessAction({
        bookings: bookingsArray,
        currentPage: pagination.current_page,
        totalPages: pagination.total_pages,
        totalCount: pagination.total
      }));

      return bookingsArray;
    }).catch(this.handleError.bind(this));
  }

  getPastBookings(page: number): Observable<Booking[] | {}> {
    this.store.dispatch(new PastBookingIndexRequestAction());

    const offset = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return this.get('/admin/bookings/past?include=guest&page=' + page, {
      timezone: offset
    }).map((res) => {
      const bookings = res.json().data;

      const bookingsArray = [];
      for (const booking of bookings) {
        bookingsArray.push(Object.assign(new Booking(), booking));
      }

      const pagination = res.json().meta.pagination;
      this.store.dispatch(new PastBookingIndexSuccessAction({
        bookings: bookingsArray,
        currentPage: pagination.current_page,
        totalPages: pagination.total_pages,
        totalCount: pagination.total
      }));

      return bookingsArray;
    }).catch(this.handleError.bind(this));
  }

  getContactReservation(id: number): Observable<any> {
    return this.get('/admin/contacts/' + id + '/reservations').map((res) => {
      const reservations = res.json().data;
      return reservations;
    }).catch(this.handleError.bind(this));
  }

  getReview(bookingId: string): Observable<string | null> {

    return this.get('/admin/bookings/' + bookingId + '/review').map((res) => {
      if (res.text() !== '') {
        return res.json().data.comment;
      }

      return null;
    }).catch(this.handleError.bind(this));
  }

  getTodayProspects(page: number): Observable<Prospect[] | {}> {
    this.store.dispatch(new ProspectIndexTodayRequestAction());

    const offset = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return this.get('/admin/prospects/today?page=' + page, {
      timezone: offset
    }).map((res) => {
      const prospects = res.json().data;

      const prospectsArray = [];
      for (const prospect of prospects) {
        prospectsArray.push(Object.assign(new Prospect(), prospect));
      }

      const pagination = res.json().meta.pagination;

      this.store.dispatch(new ProspectIndexTodaySuccessAction({
        prospects: prospectsArray,
        currentPage: pagination.current_page,
        totalPages: pagination.total_pages,
        totalCount: pagination.total
      }));

      return prospectsArray;
    }).catch(this.handleError.bind(this));
  }

  getUpcomingProspects(page: number): Observable<Prospect[] | {}> {
    this.store.dispatch(new ProspectIndexUpcomingRequestAction());

    const offset = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return this.get('/admin/prospects/upcoming?page=' + page, {
      timezone: offset
    }).map((res) => {
      const prospects = res.json().data;

      const prospectsArray = [];
      for (const prospect of prospects) {
        prospectsArray.push(Object.assign(new Prospect(), prospect));
      }

      const pagination = res.json().meta.pagination;

      this.store.dispatch(new ProspectIndexUpcomingSuccessAction({
        prospects: prospectsArray,
        currentPage: pagination.current_page,
        totalPages: pagination.total_pages,
        totalCount: pagination.total
      }));

      return prospectsArray;
    }).catch(this.handleError.bind(this));
  }

  getExpiredProspects(page: number): Observable<Prospect[] | {}> {
    this.store.dispatch(new ProspectIndexExpiredRequestAction());

    const offset = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return this.get('/admin/prospects/expired?page=' + page, {
      timezone: offset
    }).map((res) => {
      const prospects = res.json().data;

      const prospectsArray = [];
      for (const prospect of prospects) {
        prospectsArray.push(Object.assign(new Prospect(), prospect));
      }

      const pagination = res.json().meta.pagination;

      this.store.dispatch(new ProspectIndexExpiredSuccessAction({
        prospects: prospectsArray,
        currentPage: pagination.current_page,
        totalPages: pagination.total_pages,
        totalCount: pagination.total
      }));

      return prospectsArray;
    }).catch(this.handleError.bind(this));
  }

  getPassedProspects(page: number): Observable<Prospect[] | {}> {
    this.store.dispatch(new ProspectIndexPassedRequestAction());

    const offset = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return this.get('/admin/prospects/passed?page=' + page, {
      timezone: offset
    }).map((res) => {
      const prospects = res.json().data;

      const prospectsArray = [];
      for (const prospect of prospects) {
        prospectsArray.push(Object.assign(new Prospect(), prospect));
      }

      const pagination = res.json().meta.pagination;

      this.store.dispatch(new ProspectIndexPassedSuccessAction({
        prospects: prospectsArray,
        currentPage: pagination.current_page,
        totalPages: pagination.total_pages,
        totalCount: pagination.total
      }));

      return prospectsArray;
    }).catch(this.handleError.bind(this));
  }

  createProspects(data: any): Observable<Prospect[] | {}> {
    this.store.dispatch(new ProspectCreateRequestAction());
    return this.post('/admin/prospects', data).map((res) => {
      const prospect = res.json().data;

      const prospectObj = Object.assign(new Prospect(), prospect);

      this.store.dispatch(new ProspectCreateSuccessAction(prospectObj));

      return prospectObj;
    }).catch(this.handleError.bind(this));
  }

  getQuotes(): Observable<Quote[] | {}> {
    this.store.dispatch(new QuoteIndexRequestAction());
    return this.get('/admin/quotes').map((res) => {
      const quotes = res.json().data;
      const quotesArray = [];
      for (const quote of quotes) {
        quotesArray.push(Object.assign(new Quote(), quote));
      }
      this.store.dispatch(new QuoteIndexSuccessAction(quotesArray));
      return quotesArray;
    }).catch(this.handleError.bind(this));
  }

  createQuote(data: any): Observable<Quote | {}> {
    this.store.dispatch(new QuoteCreateRequestAction());
    return this.post('/admin/quotes', data).map((res) => {
      const quote = res.json().data;
      const quoteObj = Object.assign(new Quote(), quote);

      this.store.dispatch(new QuoteCreateSuccessAction(quoteObj));
      return quoteObj;
    }).catch(this.handleError.bind(this));
  }

  addBooking(data: {
    property_id: number, start: string, end: string, number_of_guests: number,
    security_deposit_fee: number, guest_channel_fee: number, base_amount: number,
    cleaning_fee: number, commission: number, payment_method: string, guest_id?: number,
    first_name?: string, last_name?: string, email?: string, phone?: string
  }): Observable<Booking> {
    this.store.dispatch(new BookingCreateRequestAction());
    data.start = dateToDateString(getDateObj(data.start));
    data.end = dateToDateString(getDateObj(data.end));
    return this.post('/admin/bookings?include=guest,securityDeductions,tasks,logs,payments,scheduledMessages', data).map((res) => {
      const bookingObj = Object.assign({}, new Booking(), res.json().data);
      this.store.dispatch(new BookingCreateSuccessAction(bookingObj));

      return bookingObj;
    }).catch(this.handleError);
  }

  payOverPhone(bookingId: number, stripToken: string): Observable<any> {
    return this.post('/admin/bookings/' + bookingId + '/pay', {card_token: stripToken}).map(
      res => res.json()
    ).catch(this.handleError);
  }

  payForCollection(paymentId: number, stripToken: string): Observable<any> {
    return this.post('/payments/' + paymentId + '/collect', {card_token: stripToken}).map(
      res => res.json()
    ).catch(this.handleError.bind(this));
  }

  payFromPlatform(bookingId: number, stripToken: string): Observable<any> {
    return this.post('/bookings/' + bookingId + '/pay', {card_token: stripToken}).map(
      res => res.json()
    ).catch(this.handleError.bind(this));
  }

  payForQuoteFromPlatform(quoteId: number, stripToken: string): Observable<any> {
    return this.post('/quotes/' + quoteId + '/pay', {card_token: stripToken}).map(
      res => res.json()
    ).catch(this.handleError.bind(this));
  }


  deleteBookingGuest(guestId: string, bookingId: string): Observable<boolean | {}> {
    this.store.dispatch(new BookingGuestDeleteRequestAction());
    return this.delete('/admin/booking-guests/' + guestId).map(res => {
      this.store.dispatch(new BookingGuestDeleteSuccessAction({bookingId: bookingId, guestId: guestId}));
      return true;
    }).catch(this.handleError.bind(this));
  }

  updateBookingGuest(guestId: string, bookingId: string, data: {
    first_name?: string; last_name?: string; email?: string; phone_number?: string;
  }): Observable<boolean | {}> {
    this.store.dispatch(new BookingGuestUpdateRequestAction());
    return this.put('/admin/booking-guests/' + guestId, data).map(res => {
      const guest = res.json().data;
      this.store.dispatch(new BookingGuestUpdateSuccessAction({bookingId: bookingId, guest: guest}));
      return true;
    }).catch(this.handleError.bind(this));
  }

  addBookingGuest(bookingId: string, data: {
    first_name?: string; last_name?: string; email?: string; phone_number?: string;
  }): Observable<boolean | {}> {
    this.store.dispatch(new BookingGuestAddRequestAction());
    return this.post('/admin/bookings/' + bookingId + '/guests', data).map(res => {
      const guest = res.json().data;
      this.store.dispatch(new BookingGuestAddSuccessAction({bookingId: bookingId, guest: guest}));
      return true;
    }).catch(this.handleError.bind(this));
  }

  getBookingAvailability(listingId: string, data: {
    start?: string; end?: string; number_of_guests?: number;
  }): Observable<any> {
    data.start = dateToDateString(getDateObj(data.start));
    data.end = dateToDateString(getDateObj(data.end));
    return this.get('/admin/properties/' + listingId + '/available', data).map(res => {
      return res.json();
    }).catch(this.handleError.bind(this));
  }

  updateBooking(booking_id: number, thread_id: number = null, data: {
    listing_id?: number,
    status?: string,
    check_in_time?: string,
    checked_in?: boolean,
    booking_notes?: string
  }): Observable<Booking> {
    this.store.dispatch(new BookingUpdateRequestAction());
    return this.put('/admin/bookings/' + booking_id + '?include=guest,securityDeductions,tasks,logs,payments,scheduledMessages', data).map((res) => {
      const booking = res.json().data;
      console.log(booking);
      this.store.dispatch(new BookingUpdateSuccessAction({
        booking: Object.assign(new Booking(), booking), thread_id: thread_id
      }));
      this.store.dispatch(new ThreadBookingUpdateSuccessAction({
        booking: Object.assign(new Booking(), booking), thread_id: thread_id
      }));
      if(!isNullOrUndefined(data.status))
      {
        this.store.dispatch(new ThreadStatusUpdateSuccessAction({
          booking: Object.assign(new Booking(), booking), thread_id: thread_id
        }));
      }
      return booking;
    }).catch(this.handleError.bind(this));
  }

  deductSecurityFee(bookingId: number, data: { amount: number, description: string }): Observable<SecurityDeduction> {
    this.store.dispatch(new BookingSecurityDeductionRequestAction());
    return this.post('/admin/bookings/' + bookingId + '/security-deduction', data).map(res => {
      const deductionObj = Object.assign(new SecurityDeduction(), res.json().data);
      this.store.dispatch(new BookingSecurityDeductionSuccessAction({bookingId: bookingId, deduction: deductionObj}));

      return deductionObj
    }).catch(this.handleError.bind(this));
  }

  collectPayment(bookingId: number, data: { amount: number, description: string, method: string, card_token?: string }): Observable<Payment> {
    this.store.dispatch(new BookingPaymentCreateRequestAction(bookingId));
    return this.post('/admin/bookings/' + bookingId + '/collect', data).map(res => {
      const paymentObj = Object.assign(new Payment(), res.json().data);
      this.store.dispatch(new BookingPaymentCreateSuccessAction({bookingId: bookingId, payment: paymentObj}));

      return paymentObj
    }).catch(this.handleError.bind(this));
  }

  refundSecurity(bookingId: number): Observable<boolean | {}> {
    return this.post('/admin/bookings/' + bookingId + '/security-refund').map(res => {
      return true;
    }).catch(this.handleError.bind(this));
  }

  getOwnerUpcomingBookings(): Observable<Booking[] | {}> {
    this.store.dispatch(new UpcomingOwnerBookingIndexRequestAction);
    return this.get('/bookings/upcoming?include=guest').map((res) => {
      const bookings = res.json().data;

      const bookingsArray = [];
      for (const booking of bookings) {
        bookingsArray.push(Object.assign(new Booking(), booking));
      }
      this.store.dispatch(new UpcomingOwnerBookingIndexSuccessAction(bookingsArray));

      return bookingsArray;
    }).catch(this.handleError.bind(this));
  }

  createOwnerBlock(data: { start_date: string, end_date: string, reason: string }, property_id: string): Observable<OwnerBlock[] | {}> {
    data.start_date = dateToDateString(getDateObj(data.start_date));
    data.end_date = dateToDateString(getDateObj(data.end_date));
    return this.post('/properties/' + property_id + '/owners-block', data).map(res => {
      const blocks = res.json().data;
      console.log(blocks);
      const monthKey = blocks[0]['start'].slice(0, -3);
      const blocksArray: OwnerBlock[] = [];
      for (const block of blocks) {
        blocksArray.push(Object.assign(new OwnerBlock(), block));
      }

      this.store.dispatch(new BlockSuccessAction({
        month: String(monthKey), listingId: +property_id, block: blocksArray
      }));

      return blocksArray;
    }).catch(this.handleError.bind(this));
  }

  deleteOwnerBlock(data: { start_date: string, end_date: string }, property_id: string): Observable<boolean | {}> {
    data.start_date = dateToDateString(getDateObj(data.start_date));
    data.end_date = dateToDateString(getDateObj(data.end_date));
    return this.delete('/properties/' + property_id + '/owners-block', data).map(res => {
      const monthKey = data.start_date.slice(0, -3);
      this.store.dispatch(new UnblockSuccessAction({
        month: String(monthKey), listingId: +property_id, date: data.start_date
      }));
      return true;
    }).catch(this.handleError.bind(this));
  }


  sendListingForApproval(property_id: string): Observable<Listing> {
    return this.post('/properties/' + property_id + '/approve-request?include=' + this.PROPERTY_INCLUDES).map(res => {
      const listing = res.json().data;
      const listingObject = Object.assign(new Listing(), listing);

      this.store.dispatch(new UpdateSuccessAction(listingObject));

      return listingObject;
    }).catch(this.handleError.bind(this));
  }


  approveListing(property_id: string, data: {
    assignee_id: number,
    housekeeper_id: number,
    general_maintenance_id: number,
    painter_id: number,
    electrician_id: number,
    plumber_id: number,
    homeowner_id: number,
    cleaner_id: number,
    hvac_id: number
  }): Observable<Listing> {

    return this.post('/admin/properties/' + property_id + '/approve?include=' + this.PROPERTY_INCLUDES, data).map(res => {
      const listing = res.json().data;
      const listingObject = Object.assign(new Listing(), listing);

      this.store.dispatch(new UpdateSuccessAction(listingObject));

      return listingObject;
    }).catch(this.handleError.bind(this));
  }

  rejectListing(property_id: string, data: { reason: string }): Observable<Listing> {
    return this.post('/admin/properties/' + property_id + '/reject?include=' + this.PROPERTY_INCLUDES, data).map(res => {
      const listing = res.json().data;
      const listingObject = Object.assign(new Listing(), listing);

      this.store.dispatch(new UpdateSuccessAction(listingObject));

      return listingObject;
    }).catch(this.handleError.bind(this));
  }


  updateListingDetails(data: any, property_id: string): Observable<Listing> {
    this.store.dispatch(new UpdateRequestAction());
    return this.put('/properties/' + property_id + '?include=' + this.PROPERTY_INCLUDES, data).map(res => {
      const listing = res.json().data;
      this.store.dispatch(new UpdateSuccessAction(Object.assign(new Listing(), listing)));
      return listing;
    }).catch(this.handleError.bind(this));
  }

  updateVendorContacts(propertyId: string, contact: User) {
    return this.put('/properties/' + propertyId + '/contacts/' + contact.getManagementContact().id).map(res => {
      this.store.dispatch(new AddListingSuccessAction({contactId: contact.id, listingId: +propertyId}));
      this.store.dispatch(new AddContactSuccessAction({contact: contact, listingId: +propertyId}));
      return contact;
    }).catch(this.handleError.bind(this));
  }

  removeVendorContacts(propertyId: string, contact: User) {
    return this.delete('/properties/' + propertyId + '/contacts/' + contact['managementContact']['data']['id']).map(res => {
      this.store.dispatch(new RemoveListingSuccessAction({contactId: contact.id, listingId: +propertyId}));
      this.store.dispatch(new DeleteContactSuccessAction({
        listingId: Number(propertyId), contact: contact
      }));
    }).catch(this.handleError.bind(this));
  }

  addImages(data: { image: File, caption?: string }, property_id: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('image', data.image, data.image.name);

    const req = new HttpRequest('POST', this.BASE_URL + '/properties/' + property_id + '/images', formData, {
      headers: new HttpHeaders({
        'Authorization': 'bearer ' + localStorage.getItem('auth_token')
      }), reportProgress: true,
    });

    return this.httpClient.request(req).catch(this.handleError.bind(this));
  }

  removeImages(property_id: string, image_id: string): Observable<boolean | {}> {
    return this.delete('/property-images/' + image_id).map(res => {
      this.store.dispatch(new DeleteImageSuccessAction({listingId: property_id, imageId: image_id}));
      return true;
    }).catch(this.handleError.bind(this));
  }

  editImageCaption(listingId: number, imageId: number, data: { caption: string }): Observable<boolean | {}> {
    return this.put('/property-images/' + imageId, data).map((res) => {
      const image = res.json().data;
      const imageObj = Object.assign(new Image(), image);
      this.store.dispatch(new EditImageSuccessAction({listingId: String(listingId), image: imageObj}));
      return true;
    }).catch(this.handleError.bind(this));
  }

  rearrangeListingImages(listingId: number, data: { sort_order: {} }, images: Image[]): Observable<boolean | {}> {
    return this.post('/properties/' + listingId + '/images/re-arrange', data).map((res) => {
      const sortOrder = data['sort_order'];
      this.store.dispatch(new ImageSortingSuccessAction({listingId: String(listingId), sortOrder, images}));
      return true;
    }).catch(this.handleError.bind(this));
  }

  attachTag(data: { tag_string: string }, property_id: string): Observable<Tag> {
    return this.put('/properties/' + property_id + '/tags', data).map(res => {
      const tag = res.json().data;
      this.store.dispatch(new AttachTagSuccessAction({listingId: property_id, tag: tag}));
      return tag;
    }).catch(this.handleError.bind(this));

  }

  createTag(data: { tag_string: string }): Observable<Tag> {
    return this.post('tags', data).map(res => {
      const tag = res.json().data;
      this.store.dispatch(new TagAddSuccessAction(tag));
      return tag;
    }).catch(this.handleError.bind(this));

  }

  removeTag(property_id: string, tag: Tag): Observable<boolean | {}> {
    const data = {tag_string: tag.title};
    return this.delete('/properties/' + property_id + '/tags', data).map(res => {
      this.store.dispatch(new DeleteTagSuccessAction({listingId: property_id, tagId: String(tag.id)}));
      return true;
    }).catch(this.handleError.bind(this));
  }

  getCalendar(listingId: number, data: { month: string }): any {
    this.store.dispatch(new CalendarRequestAction({month: data.month, listingId: listingId}));
    return this.get('/properties/' + listingId + '/calendar', data).map((res) => {
      const objects = res.json().data;

      const calendarArray = [];
      for (const object of objects) {
        if (object.type === 'owner_block') {
          calendarArray.push(Object.assign(new OwnerBlock(), object));
        } else {
          calendarArray.push(Object.assign(new Booking(), object));
        }
      }

      this.store.dispatch(new CalendarSuccessAction({month: data.month, listingId: listingId, data: calendarArray}));

      return calendarArray;
    });
  }

  getSavedMessages(): any {

    this.store.dispatch(new IndexSavedMessageRequestAction());
    return this.get('/admin/saved-messages').map((res) => {
      const objects = res.json().data;

      const savedMessagesArray = [];
      for (const object of objects) {
        savedMessagesArray.push(Object.assign(new SavedMessage(), object));
      }

      this.store.dispatch(new IndexSavedMessageSuccessAction({messages: savedMessagesArray}));

      return savedMessagesArray;
    }).catch(this.handleError.bind(this));
  }

  deleteSavedMessage(messageId: number): any {
    this.store.dispatch(new DeleteSavedMessageRequestAction());
    return this.delete('/admin/saved-messages/' + messageId).map((res) => {
      this.store.dispatch(new DeleteSavedMessageSuccessAction({messageId: messageId}));
      return true;
    }).catch(this.handleError.bind(this));
  }

  addNewCannedMessage(data: { id?: number, title?: string, message?: string, property_ids: number[] }): any {
    this.store.dispatch(new CreateSavedMessageRequestAction());
    return this.post('/admin/saved-messages', data).map((res) => {
      const message = res.json().data;
      this.store.dispatch(new CreateSavedMessageSuccessAction({
        message: Object.assign(new SavedMessage(), message)
      }));
      return message;
    }).catch(this.handleError.bind(this));
  }

  updateCannedMessage(messageId: number, data: { title?: string, message?: string, property_ids: number[] }): any {
    this.store.dispatch(new UpdateSavedMessageRequestAction());
    return this.put('/admin/saved-messages/' + messageId, data).map((res) => {
      const message = res.json().data;
      this.store.dispatch(new UpdateSavedMessageSuccessAction({
        message: Object.assign(new SavedMessage(), message)
      }));
      return message;
    }).catch(this.handleError.bind(this));
  }

  getAutoResponses(): any {
    this.store.dispatch(new IndexAutoResponseRequestAction());
    return this.get('/admin/auto-responses').map((res) => {
      const objects = res.json().data;

      const autoResponseArray = [];
      for (const object of objects) {
        autoResponseArray.push(Object.assign(new AutoResponse(), object));
      }

      this.store.dispatch(new IndexAutoResponseSuccessAction({responses: autoResponseArray}));

      return autoResponseArray;
    }).catch(this.handleError.bind(this));
  }

  deleteAutoResponse(id: number): any {
    this.store.dispatch(new DeleteAutoResponseRequestAction());
    return this.delete('/admin/auto-responses/' + id).map((res) => {
      this.store.dispatch(new DeleteAutoResponseSuccessAction({responseId: id}));
      return true;
    }).catch(this.handleError.bind(this));
  }

  addNewAutoResponse(data: { id?: number, type?: string, offset?: number, title?: string, message?: string, property_ids: number[] }): any {
    this.store.dispatch(new CreateAutoResponseRequestAction());
    return this.post('/admin/auto-responses', data).map((res) => {
      const response = res.json().data;
      this.store.dispatch(new CreateAutoResponseSuccessAction({
        response: Object.assign(new AutoResponse(), response)
      }));
      return response;
    }).catch(this.handleError.bind(this));
  }

  updateAutoResponse(responseId: number, data: { offset?: number, type?: string, title?: string, message?: string, property_ids: number[] }): any {
    console.log(data);
    this.store.dispatch(new UpdateAutoResponseRequestAction());
    return this.put('/admin/auto-responses/' + responseId, data).map((res) => {
      const response = res.json().data;
      this.store.dispatch(new UpdateAutoResponseSuccessAction({
        response: Object.assign(new AutoResponse(), response)
      }));
      return response;
    }).catch(this.handleError.bind(this));
  }


  getMinStayTemplates(): any {

    this.store.dispatch(new IndexMinStaysTemplateRequestAction());
    return this.get('/admin/min-stays-templates').map((res) => {
      const objects = res.json().data;

      const templatesArray = [];
      for (const object of objects) {
        templatesArray.push(Object.assign(new MinimumStay(), object));
      }

      this.store.dispatch(new IndexMinStaysTemplateSuccessAction({templates: templatesArray}));

      return templatesArray;
    }).catch(this.handleError.bind(this));
  }

  deleteMinStayTemplate(templateId: number): any {
    this.store.dispatch(new DeleteMinStaysTemplateRequestAction());
    return this.delete('/admin/min-stays-templates/' + templateId).map((res) => {
      this.store.dispatch(new DeleteMinStaysTemplateSuccessAction({templateId: templateId}));
      return true;
    }).catch(this.handleError.bind(this));
  }

  addNewMinStayTemplate(data: { start?: string, end?: string, length: number }): any {
    data.start = dateToDateString(getDateObj(data.start));
    data.end = dateToDateString(getDateObj(data.end));
    this.store.dispatch(new CreateMinStaysTemplateRequestAction());
    return this.post('/admin/min-stays-templates', data).map((res) => {
      const template = res.json().data;
      this.store.dispatch(new CreateMinStaysTemplateSuccessAction({
        template: Object.assign(new MinimumStay(), template)
      }));
      return template;
    }).catch(this.handleError.bind(this));
  }

  updateMinStayTemplate(templateId: number, data: { start?: string, end?: string, length: number }): any {
    data.start = dateToDateString(getDateObj(data.start));
    data.end = dateToDateString(getDateObj(data.end));
    this.store.dispatch(new UpdateMinStaysTemplateRequestAction());
    return this.put('/admin/min-stays-templates/' + templateId, data).map((res) => {
      const template = res.json().data;
      this.store.dispatch(new UpdateMinStaysTemplateSuccessAction({
        template: Object.assign(new MinimumStay(), template)
      }));
      return template;
    }).catch(this.handleError.bind(this));
  }


  getMultiCalendar(data: { month: number, year: number }): any {
    const index = data.month + '/' + data.year;

    this.store.dispatch(new MultiCalendarIndexRequestAction(index));
    return this.get('/admin/multi-calendar', data).map((res) => {
      const result = {
        key: index, data: res.json()
      };
      this.store.dispatch(new MultiCalendarIndexSuccessAction(result));
    }).catch(this.handleError.bind(this));
  }


  getTasks(): Observable<Task[] | {}> {
    this.store.dispatch(new TaskIndexRequestAction());
    return this.get('/tasks').map((res) => {
      const tasks = res.json().data;
      const tasksArray = [];
      for (const task of tasks) {
        tasksArray.push(Object.assign(new Task(), task));
      }
      this.store.dispatch(new TaskIndexSuccessAction(tasksArray));
      return tasksArray;
    }).catch(this.handleError.bind(this));
  }

  createTask(data: {
    booking_id?: number, assigned_admin_id?: number, property_id?: number; title?: string, type?: string, status?: string; due_date?: string, due_time?: string; description?: string, amount?: number, payment_by?: string, expenses?: string[], images?: number[]
  }): Observable<Task> {
    this.store.dispatch(new TaskCreateRequestAction());
    return this.post('/tasks', data).map(res => {
      const taskObj = res.json().data;
      const task = Object.assign(new Task(), taskObj);
      this.store.dispatch(new TaskCreateSuccessAction(task));
      return task;
    }).catch(this.handleError.bind(this));
  }

  updateTask(taskId: number, data: {
    booking_id?: number, assigned_admin_id?: number, property_id?: number; title?: string, type?: string, due_date?: string, due_time?: string; description?: string, amount?: number, payment_by?: string, expenses?: string[], images?: number[], status?: string, is_archived?: boolean
  }): Observable<Task> {
    this.store.dispatch(new TaskUpdateRequestAction());
    return this.put('/tasks/' + taskId, data).map(res => {
      const taskObj = res.json().data;
      const task = Object.assign(new Task(), taskObj);
      this.store.dispatch(new TaskUpdateSuccessAction(task));
      return task;
    }).catch(this.handleError.bind(this));
  }


  deleteTask(taskId: number): Observable<any> {
    this.store.dispatch(new TaskDeleteRequestAction());
    return this.delete('/tasks/' + taskId).map(res => {
      this.store.dispatch(new TaskDeleteSuccessAction({taskId:taskId}));
      return true;
    }).catch(this.handleError.bind(this));
  }


  addTaskImages(data: { images: File[], caption?: string }): Observable<any> {
    const formData: FormData = new FormData();
    for (let i = 0; i < data.images.length; i++) {
      formData.append('images[' + i + ']', data.images[i], data.images[i].name);
    }
    const req = new HttpRequest('POST', this.BASE_URL + '/task-images', formData, {
      headers: new HttpHeaders({
        'Authorization': 'bearer ' + localStorage.getItem('auth_token')
      }), reportProgress: true,
    });

    return this.httpClient.request(req).catch(this.handleError.bind(this));
  }


  approveTask(taskId: string): Observable<boolean | {}> {
    return this.post('/tasks/' + taskId + 'approve').map(res => {
      return true;
    }).catch(this.handleError.bind(this));
  }

  changeTaskStatus(data: { status: string }, taskId: string): Observable<boolean | {}> {
    return this.post('/tasks/' + taskId + 'status', data).map(res => {
      return true;
    }).catch(this.handleError.bind(this));
  }

  globalSearch(data: { key: string }): Observable<SearchResponse> {
    return this.get('/admin/search', data).map(res => {
      return res.json().data;
    }).catch(this.handleError.bind(this));
  }


  getOtherThreads(page: number): Observable<Thread[] | {}> {
    this.store.dispatch(new OtherThreadsIndexRequestAction());
    return this.get('/admin/threads/other?include=guest,booking&page=' + page).map((res) => {
      const threads = res.json().data;
      const threadsArray = [];
      for (const thread of threads) {
        thread['guest']['data'] = Object.assign(new User(), thread['guest']['data']);
        threadsArray.push(Object.assign(new Thread(), thread));
      }

      const pagination = res.json().meta.pagination;
      this.store.dispatch(new OtherThreadsIndexSuccessAction({
        threads: threadsArray,
        currentPage: pagination.current_page,
        totalPages: pagination.total_pages,
      }));

      return threadsArray;
    }).catch(this.handleError.bind(this));
  }

  getUnreadThreads(page: number): Observable<Thread[] | {}> {
    this.store.dispatch(new UnreadThreadIndexRequestAction());
    return this.get('/admin/threads/unread?include=guest,booking&page=' + page).map((res) => {
      const threads = res.json().data;
      const threadsArray = [];
      for (const thread of threads) {
        thread['guest']['data'] = Object.assign(new User(), thread['guest']['data']);
        threadsArray.push(Object.assign(new Thread(), thread));
      }

      const pagination = res.json().meta.pagination;
      this.store.dispatch(new UnreadThreadIndexSuccessAction({
        threads: threadsArray,
        currentPage: pagination.current_page,
        totalPages: pagination.total_pages,
      }));

      return threadsArray;
    }).catch(this.handleError.bind(this));
  }

  getFollowupThreads(page: number): Observable<Thread[] | {}> {
    this.store.dispatch(new FollowupThreadIndexRequestAction());
    return this.get('/admin/threads/follow-up?include=guest,booking&page=' + page).map((res) => {
      const threads = res.json().data;
      const threadsArray = [];
      for (const thread of threads) {
        thread['guest']['data'] = Object.assign(new User(), thread['guest']['data']);
        threadsArray.push(Object.assign(new Thread(), thread));
      }

      const pagination = res.json().meta.pagination;

      this.store.dispatch(new FollowupThreadIndexSuccessAction({
        threads: threadsArray,
        currentPage: pagination.current_page,
        totalPages: pagination.total_pages,
      }));
      return threadsArray;
    }).catch(this.handleError.bind(this));
  }

  getBookedThreads(page: number): Observable<Thread[] | {}> {
    this.store.dispatch(new BookedThreadIndexRequestAction());
    const offset = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return this.get('/admin/threads/booked?include=guest,booking&page=' + page,{
      timezone:offset
    }).map((res) => {
      const threads = res.json().data;
      const threadsArray = [];
      for (const thread of threads) {
        thread['guest']['data'] = Object.assign(new User(), thread['guest']['data']);
        threadsArray.push(Object.assign(new Thread(), thread));
      }

      const pagination = res.json().meta.pagination;

      this.store.dispatch(new BookedThreadIndexSuccessAction({
        threads: threadsArray,
        currentPage: pagination.current_page,
        totalPages: pagination.total_pages,
      }));
      return threadsArray;
    }).catch(this.handleError.bind(this));
  }

  getOngoingThreads(page: number): Observable<Thread[] | {}> {
    this.store.dispatch(new OngoingThreadIndexRequestAction());
    const offset = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return this.get('/admin/threads/ongoing?include=guest,booking&page=' + page,{
      timezone:offset
    }).map((res) => {
      const threads = res.json().data;
      const threadsArray = [];
      for (const thread of threads) {
        thread['guest']['data'] = Object.assign(new User(), thread['guest']['data']);
        threadsArray.push(Object.assign(new Thread(), thread));
      }
      const pagination = res.json().meta.pagination;

      this.store.dispatch(new OngoingThreadIndexSuccessAction({
        threads: threadsArray,
        currentPage: pagination.current_page,
        totalPages: pagination.total_pages,
      }));
      return threadsArray;
    }).catch(this.handleError.bind(this));
  }

  getRequestsThreads(page: number): Observable<Thread[] | {}> {
    this.store.dispatch(new RequestsThreadIndexRequestAction());
    return this.get('/admin/threads/requests?include=guest,booking&page=' + page).map((res) => {
      const threads = res.json().data;
      const threadsArray = [];
      for (const thread of threads) {
        thread['guest']['data'] = Object.assign(new User(), thread['guest']['data']);
        threadsArray.push(Object.assign(new Thread(), thread));
      }
      const pagination = res.json().meta.pagination;

      this.store.dispatch(new RequestsThreadIndexSuccessAction({
        threads: threadsArray,
        currentPage: pagination.current_page,
        totalPages: pagination.total_pages,
      }));
      return threadsArray;
    }).catch(this.handleError.bind(this));
  }

  getArchivedThreads(page: number): Observable<Thread[] | {}> {
    this.store.dispatch(new ArchivedThreadIndexRequestAction());
    return this.get('/admin/threads/archived?include=guest,booking&page=' + page).map((res) => {
      const threads = res.json().data;
      const threadsArray = [];
      for (const thread of threads) {
        thread['guest']['data'] = Object.assign(new User(), thread['guest']['data']);
        threadsArray.push(Object.assign(new Thread(), thread));
      }
      const pagination = res.json().meta.pagination;

      this.store.dispatch(new ArchivedThreadIndexSuccessAction({
        threads: threadsArray,
        currentPage: pagination.current_page,
        totalPages: pagination.total_pages,
      }));
      return threadsArray;
    }).catch(this.handleError.bind(this));
  }

  getThread(thread_id: number): Observable<Thread> {
    this.store.dispatch(new ThreadGetRequest(thread_id));
    return this.get('/admin/threads/' + thread_id + '?include=owner,guest,booking,airbnbAccount,assignee').map((res) => {
      const thread = res.json().data;
      const newThread = Object.assign(new Thread(), thread);
      this.store.dispatch(new ThreadGetSuccess(newThread));
      return newThread;
    }).catch(this.handleError.bind(this));
  }

  getThreadBetweenGuestAndOwner(data: { guest_id: number, owner_id: number }): Observable<Thread> {
    return this.get('/admin/thread?include=owner,guest,booking,airbnbAccount,assignee', data).map((res) => {
      const thread = res.json().data;
      thread['guest']['data'] = Object.assign(new User(), thread['guest']['data']);
      const threadObject = Object.assign(new Thread(), thread);
      this.store.dispatch(new ThreadGetSuccess(threadObject));
      return threadObject;
    }).catch(this.handleError.bind(this));
  }

  unreadThread(thread: Thread): Observable<Thread> {
    this.store.dispatch(new ThreadUpdateRequestAction(thread.id));
    return this.post('/admin/threads/' + thread.id + '/unread?include=owner,guest,booking,airbnbAccount,assignee').map((res) => {
      const updatedThread = res.json().data;
      const threadObj = Object.assign(new Thread(), updatedThread);

      this.store.dispatch(new ThreadUpdateSuccessAction({updatedThread: threadObj, oldThread: thread}));
      return threadObj;
    }).catch(this.handleError.bind(this));
  }

  updateThread(thread: Thread, data: any): Observable<Thread> {
    this.store.dispatch(new ThreadUpdateRequestAction(thread.id));
    return this.put('/admin/threads/' + thread.id + '?include=owner,guest,booking,airbnbAccount,assignee', data).map((res) => {
      const updatedThread = res.json().data;
      const threadObj = Object.assign(new Thread(), updatedThread);
      this.store.dispatch(new ThreadUpdateSuccessAction({updatedThread: threadObj, oldThread: thread}));
      return threadObj;
    }).catch(this.handleError.bind(this));
  }

  assignToThread(thread: Thread, adminId: number): Observable<Thread> {
    this.store.dispatch(new ThreadUpdateRequestAction(thread.id));
    return this.put('/admin/threads/' + thread.id + '/assign/' + adminId + '?include=owner,guest,booking,airbnbAccount,assignee').map((res) => {
      const updatedThread = res.json().data;
      const threadObj = Object.assign(new Thread(), updatedThread);

      this.store.dispatch(new ThreadUpdateSuccessAction({updatedThread: threadObj, oldThread: thread}));
      return threadObj;
    }).catch(this.handleError.bind(this));
  }

  preApproveThread(threadId: number): Observable<boolean | {}> {
    return this.post('/admin/threads/' + threadId + '/pre-approve').map((res) => {
      return true;
    }).catch(this.handleError.bind(this));
  }

  declineThread(threadId: number): Observable<boolean | {}> {
    return this.post('/admin/threads/' + threadId + '/decline').map((res) => {
      return true;
    }).catch(this.handleError.bind(this));
  }

  getMessagesForThread(threadId: number): Observable<Message[] | {}> {
    this.store.dispatch(new MessageIndexRequestAction(threadId));
    return this.get('/admin/threads/' + threadId + '/messages').map((res) => {
      const messages = res.json().data;
      const messagesArray = [];
      for (const message of messages) {
        messagesArray.push(Object.assign(new Message(), message));
      }

      this.store.dispatch(new MessageIndexSuccessAction({messages: messagesArray, threadId: threadId}));
      return messagesArray;
    }).catch(this.handleError.bind(this));
  }

  sendAirbnbMessage(data: { content: string }, threadId: number): Observable<Message> {
    this.store.dispatch(new MessageCreateRequestAction(threadId));
    return this.post('/admin/threads/' + threadId + '/messages/airbnb', data).map((res) => {
      const message = res.json().data;
      const messageObj = Object.assign(new Message(), message);

      this.store.dispatch(new MessageCreateSuccessAction({message: messageObj, threadId: threadId}));

      return messageObj;
    }).catch(this.handleError.bind(this));
  }

  sendSMSMessage(data: { content: string }, threadId: number): Observable<Message> {
    this.store.dispatch(new MessageCreateRequestAction(threadId));
    return this.post('/admin/threads/' + threadId + '/messages/sms', data).map((res) => {
      const message = res.json().data;
      const messageObj = Object.assign(new Message(), message);

      this.store.dispatch(new MessageCreateSuccessAction({message: messageObj, threadId: threadId}));

      return messageObj;
    }).catch(this.handleError.bind(this));
  }

  sendEmailMessage(data: { subject:string, content: string }, threadId: number): Observable<Message> {
    this.store.dispatch(new MessageCreateRequestAction(threadId));
    return this.post('/admin/threads/' + threadId + '/messages/email', data).map((res) => {
      const message = res.json().data;
      const messageObj = Object.assign(new Message(), message);

      this.store.dispatch(new MessageCreateSuccessAction({message: messageObj, threadId: threadId}));

      return messageObj;
    }).catch(this.handleError.bind(this));
  }

  addCheckList(listingId: number, data: { title: string }): Observable<CheckList[] | {}> {
    return this.post('/admin/properties/' + listingId + '/checklists', data).map((res) => {
      const checklist = res.json().data;
      this.store.dispatch(new AddCheckListSuccessAction({listingId, checklist}));
      console.log(checklist);
      return checklist;
    }).catch(this.handleError.bind(this));
  }

  updateCheckList(listingId: number, checklistId: number, data: { is_complete: boolean }): Observable<CheckList> {
    return this.put('/admin/checklists/' + checklistId, data).map((res) => {
      const checklist = res.json().data;
      this.store.dispatch(new UpdateCheckListSuccessAction({listingId, checklist}));
      return checklist;
    }).catch(this.handleError.bind(this));
  }

  deleteCheckList(listingId: number, checklistId: number): any {
    return this.delete('/admin/checklists/' + checklistId).map(() => {
      this.store.dispatch(new DeleteCheckListSuccessAction({listingId, checklistId}));
      return true;
    }).catch(this.handleError.bind(this));
  }

  getQuote(listingId: number, start: Date, end: Date, petsCount: number = 0, extraGuestCount: number = 0): Observable<Quote> {
    return this.get('/admin/properties/' + listingId + '/quote', {
      start: DateUtils.toISODateString(start),
      end: DateUtils.toISODateString(end),
      pets_count: petsCount,
      extra_guest_count: extraGuestCount
    }).map(res => Object.assign(new Quote(), res.json())).catch(this.handleError.bind(this));
  }

  fetchSpecialDiscounts(): Observable<LastMinuteDiscount[] | {}> {
    this.store.dispatch(new DiscountIndexRequestAction());
    return this.get('/admin/special-discounts').map((res) => {
      const discounts = res.json().data;
      this.store.dispatch(new DiscountIndexSuccessAction(discounts));
      return discounts;
    }).catch(this.handleError.bind(this));
  }

  getCustomVariables(): Observable<CustomVariable[] | {}> {
    this.store.dispatch(new CustomVariableIndexRequestAction());
    return this.get('/admin/custom-variables').map((res) => {
      const customVariables = res.json().data;
      this.store.dispatch(new CustomVariableIndexSuccessAction(customVariables));
      return customVariables;
    }).catch(this.handleError.bind(this));
  }

  deleteCustomVariable(id: number): Observable<any> {
    this.store.dispatch(new CustomVariableDeleteRequestAction());
    return this.delete('/admin/custom-variables/' + id).map((res) => {
      this.store.dispatch(new CustomVariableDeleteSuccessAction(id));
      return true;
    }).catch(this.handleError.bind(this));
  }

  addNewCustomVariable(data: { key?: string, replacement_text?: string }): any {
    this.store.dispatch(new CustomVariableAddRequestAction());
    return this.post('/admin/custom-variables', data).map((res) => {
      const customVariables = res.json().data;
      this.store.dispatch(new CustomVariableAddSuccessAction(customVariables));
      return customVariables;
    }).catch(this.handleError.bind(this));
  }

  updateCustomVariable(id: number, data: { key?: string, replacement_text?: string }): any {
    this.store.dispatch(new CustomVariableUpdateRequestAction());
    return this.put('/admin/custom-variables/' + id, data).map((res) => {
      const customVariables = res.json().data;
      this.store.dispatch(new CustomVariableUpdateSuccessAction(customVariables));
      return customVariables;
    }).catch(this.handleError.bind(this));
  }

  getAlerts(): Observable<Alert[] | {}> {
    this.store.dispatch(new AlertsIndexRequestAction());
    return this.get('/admin/alerts').map((res) => {
      const alerts = res.json().data;
      const alertsArray = [];
      for (const alert of alerts) {
        alertsArray.push(Object.assign(new Alert(), alert));
      }
      this.store.dispatch(new AlertsIndexSuccessAction(alertsArray));
      return alertsArray;
    }).catch(this.handleError.bind(this));
  }

  createAlert(data: any): Observable<Alert> {
    console.log(data);
    this.store.dispatch(new AlertsCreateRequestAction());
    return this.post('/admin/alerts', data).map((res) => {
      const alert = res.json().data;
      const alertObj = Object.assign(new Alert(), alert);
      this.store.dispatch(new AlertsCreateSuccessAction(alertObj));
      return alertObj;
    }).catch(this.handleError.bind(this));
  }

  updateAlert(id: number, data: any): Observable<Alert> {
    this.store.dispatch(new AlertsUpdateRequestAction(id));
    return this.put('/admin/alerts/' + id, data).map((res) => {
      const alert = res.json().data;
      const alertObj = Object.assign(new Alert(), alert);
      this.store.dispatch(new AlertsUpdateSuccessAction(alertObj));
      return alertObj;
    }).catch(this.handleError.bind(this));
  }

  deleteAlert(id: number): Observable<any> {
    this.store.dispatch(new AlertsDeleteRequestAction(id));
    return this.delete('/admin/alerts/' + id).map((res) => {
      this.store.dispatch(new AlertsDeleteSuccessAction(id));
      return true;
    }).catch(this.handleError.bind(this));
  }

  addSpecialDiscount(data: { title: string, description: string, rules: DiscountRule[] }): Observable<LastMinuteDiscount> {
    this.store.dispatch(new DiscountAddRequestAction());
    return this.post('/admin/special-discounts', data).map((res) => {
      const discount = res.json().data;
      this.store.dispatch(new DiscountADDSuccessAction(discount));
      return discount;
    }).catch(this.handleError.bind(this));
  }

  updateSpecialDiscount(discountId: number, data: { title: string, description: string, rules: DiscountRule[] }): Observable<LastMinuteDiscount> {
    this.store.dispatch(new DiscountUpdateRequestAction());
    return this.put('/admin/special-discounts/' + discountId, data).map((res) => {
      const discount = res.json().data;
      this.store.dispatch(new DiscountUpdateSuccessAction(discount));
      return discount;
    }).catch(this.handleError.bind(this));
  }

  deleteSpecialDiscount(discountId: number): Observable<any> {
    this.store.dispatch(new DiscountDeleteRequestAction());
    return this.delete('/admin/special-discounts/' + discountId).map((res) => {
      this.store.dispatch(new DiscountDeleteSuccessAction(discountId));
      return true;
    }).catch(this.handleError.bind(this));
  }

  // Auto Tasks

  getAutoTasks(): Observable<AutoTask[] | {}> {
    this.store.dispatch(new AutoTaskIndexRequestAction());
    return this.get('/admin/auto-tasks').map((res) => {
      const autoTasks = res.json().data;
      const autoTasksArray = [];
      for (const autoTask of autoTasks) {
        autoTasksArray.push(Object.assign(new AutoTask(), autoTask));
      }

      this.store.dispatch(new AutoTaskIndexSuccessAction(autoTasksArray));

      return autoTasksArray;
    }).catch(this.handleError.bind(this));
  }

  createAutoTask(data: any): Observable<any> {
    this.store.dispatch(new AutoTaskCreateRequestAction());
    return this.post('/admin/auto-tasks', data).map(res => {
      const autoTaskObj = res.json().data;
      const autoTask = Object.assign(new AutoTask(), autoTaskObj);
      this.store.dispatch(new AutoTaskCreateSuccessAction(autoTask));

      return autoTask;
    }).catch(this.handleError.bind(this));
  }

  updateAutoTask(id: number, data: any): Observable<any> {
    this.store.dispatch(new AutoTaskUpdateRequestAction());

    return this.put('/admin/auto-tasks/' + id, data).map(res => {
      const autoTaskObj = res.json().data;
      const autoTask = Object.assign(new AutoTask(), autoTaskObj);

      this.store.dispatch(new AutoTaskUpdateSuccessAction(autoTask));

      return autoTask;
    }).catch(this.handleError.bind(this));
  }
  deleteAutoTask(id: number): Observable<any> {
    this.store.dispatch(new AutoTaskDeleteRequestAction());
    return this.delete('/admin/auto-tasks/'+id).map(res => {
      this.store.dispatch(new AutoTaskDeleteSuccessAction({taskId:id}));
      return true;
    }).catch(this.handleError.bind(this));
  }


  constructor(private http: Http, private httpClient: HttpClient, private snackBar: MatSnackBar, private store: Store<State>) {
  }

  private get (url: string, data?: any, responseType: ResponseContentType = ResponseContentType.Json) {

    const options = this.buildRequestOptions();

    if (data) {
      options.params = Utils.objToSearchParams(data);
    }

    options.responseType = responseType;

    return this.http.get(this.BASE_URL + url, options);
  }

  private post(url: string, data?: any, responseType: ResponseContentType = ResponseContentType.Json) {

    const options = this.buildRequestOptions();

    options.responseType = responseType;

    return this.http.post(this.BASE_URL + url, data, options);
  }

  private put(url: string, data?: any) {

    const options = this.buildRequestOptions();

    return this.http.put(this.BASE_URL + url, data, options);
  }

  private delete(url: string, data?: any) {

    const options = this.buildRequestOptions();
    if (data) {
      options.params = Utils.objToSearchParams(data);
    }

    return this.http.delete(this.BASE_URL + url, options);
  }

  private buildRequestOptions(): RequestOptions {
    const options = new RequestOptions({headers: new Headers()});

    const authToken = localStorage.getItem('auth_token');
    if (authToken) {
      options.headers.append('Authorization', 'bearer ' + authToken);
    }

    return options;
  }

  private handleError(error: Response): ErrorObservable {
    console.log('[sd-error] start');
    console.log(error);
    console.log('[sd-error] end');

    if (error.status === 401) {
      localStorage.removeItem('auth_token');
      this.snackBar.open('Unauthorized', '', {
        duration: 4000,
      });
      return Observable.throw({messages: ['Unauthorized'], error: null});
    }

    const errorObject = error.json();
    const errorResponse = errorObject['errors'];

    const messages = [];

    if (isUndefined(errorResponse)) {
      messages.push(errorObject['message']);
    } else {
      if (typeof errorResponse === 'string') {
        return Observable.throw({messages: [errorResponse], error: errorObject});
      } else {
        for (const key in errorResponse) {
          if (errorResponse.hasOwnProperty(key)) {
            messages.push(errorResponse[key]);
          }
        }
      }
    }

    console.log(messages);
      this.snackBar.open(messages[0], '', {
        duration: 4000,
      });
    return Observable.throw({messages: messages, error: errorObject});
  }
}
