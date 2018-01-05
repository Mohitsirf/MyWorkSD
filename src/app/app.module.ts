import '../rxjs-imports';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './containers/app.component';
import {LoginComponent} from './components/login';
import {CheckoutComponent} from './components/checkout';

import {StayDuvetService} from './services/stayduvet';
import {RouterModule} from '@angular/router';
import {routes} from './routes';
import {LayoutMainComponent} from './components/layouts/main';
import {MaterialModule} from './material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HeaderComponent} from './containers/header';
import {FlexAlignmentHackDirective} from './directives/flex-alignment-hack';
import {DashboardComponent} from './containers/dashboard';
import {AuthGuard} from './guards/auth';
import {AnonymousGuard} from './guards/anonymous';
import {NotFoundComponent} from './components/not-found';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {StoreModule} from '@ngrx/store';
import {reducers} from './reducers';
import {BootstrapComponent} from './containers/bootstrap';
import {BootstrapGuard} from './guards/bootstrap';
import {CentreSpinnerComponent} from './components/elements/centre-spinner';
import {ErrorComponent} from './components/error';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ResetPasswordComponent} from './components/reset-password';
import {ForgotPasswordComponent} from './components/forgot-password';
import {OwnerHomeComponent} from './containers/owner/owner-home';
import {OwnerListingsPageComponent} from './containers/owner/owner-listings-page';
import {AirbnbPopupComponent} from './components/elements/owner-add-airbnb-popup';

import {SignUpComponent} from './components/signup-page';
import {OwnerSidebarComponent} from './components/owner-sidebar';
import {ListingDropDownPipe} from './pipes/listing-dropdown-name.pipe';
import {OwnerListingCardComponent} from './components/elements/owner-listing-card';
import {OwnerTasksPageComponent} from './containers/owner/owner-tasks-page';
import {OwnerTaskCardComponent} from './components/elements/owner-task-card';
import {NumberToCurrencyPipe} from './pipes/number-to-currency.pipe';
import {ListingBasicDetailsPopupComponent} from './components/listing/popups/listing-basic-details-popup';
import {ListingAmenitiesPopupComponent} from './components/listing/popups/listing-amenities-popup';
import {CounterComponent} from './components/elements/counter';
import {LayoutNoHeaderComponent} from './components/layouts/noheader';
import {OwnerListingPageComponent} from './containers/owner/owner-listing-page';
import {LayoutOwnerMainComponent} from './components/layouts/owner-main';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {MonthlyBreakdownChartComponent} from './components/monthly-breakdown-chart';
import {ListingRoundImageCardComponent} from './components/elements/listing-round-image-card';
import {UpcomingBookingCardComponent} from './components/upcoming-booking-card';
import {ListingCommonTextPopupComponent} from './components/listing/popups/listing-common-text-popup';
import {CreateContactPopupComponent} from './components/contacts/popups/create-contact-popup';
import {SavedContactViewPopupComponent} from './components/contacts/popups/saved-contact-view';
import {ListingListingTabComponent} from './components/listing/listing-listing-tab';
import {ListingsGuestTabComponent} from './components/listing/listings-guest-tab';
import {ListingHouseTabComponent} from './components/listing/listing-house-tab';
import {ListingLawTabComponent} from './components/listing/listing-law-tab';
import {ListingChannelTabComponent} from './components/listing/listing-channel-tab';
import {ListingCalendarTabComponent} from './components/listing/listing-calendar-tab';
import {ListingPricingTabComponent} from './components/listing/listing-pricing-tab';
import {ListingTasksTabComponent} from './components/listing/listing-tasks-tab';
import {ListingOwnerBlockPopupComponent} from './components/listing/popups/listing-owner-block-popup';
import {ImageSlideShowComponent} from './components/elements/image-slide-show';
import {ContactsTaskComponent} from './components/contacts/contacts-component';
import {ReservationComponent} from './components/reservations/reservation-component';
import {ReservationDetailComponent} from './components/reservations/reservation-detail-component';
import {ReservationUserInfoCardComponent} from './components/reservations/reservation-userinfo-card';
import {
  ReservationFinancialsCardComponent
} from './components/reservations/reservation-financials-card';
import {
  ReservationAddGuestCardComponent
} from './components/reservations/reservation-add-guest-card';
import {UserInfoCardComponent} from './components/inbox/user-info-card';
import {BookingDetailCardComponent} from 'app/components/inbox/booking-detail-card';
import {GuestTypeCardComponent} from './components/inbox/guest-type-card';
import {InboxListComponent} from './components/inbox/inbox-list';
import {ResponseCardComponent} from './components/inbox/response-card';
import {InboxScreenContentComponent} from './components/inbox/inbox-screen-content';
import {MessagesDisplayComponent} from './components/inbox/message-component';
import {DetailsMagnifyComponent} from './components/tasks/details-magnify';
import {MessageBoxComponent} from './components/inbox/message-box';
import {EmailBoxComponent} from './components/inbox/email-box';
import {UserProfileTabComponent} from './components/contacts/tabs/user-profile';
import {BankInfoTabComponent} from './components/contacts/tabs/bank-info';
import {CreateTaskPopupComponent} from './components/tasks/popups/create-task';
import {CalendarComponent} from './components/calendar/calendar';
import {MultiCalendarComponent} from './components/multi-calendar/multi-calendar';
import {MultiCalendarContainerComponent} from './components/multi-calendar/multi-calendar-container';
import {CreateProspectPopupComponent} from './components/multi-calendar/create-prospect-popup';
import {NewReservationPopupComponent} from './components/multi-calendar/new-reservation-popup';
import {CalendarDateTileComponent} from './components/calendar/calendar-date-tile';
import {ListingHouseSecretPopupComponent} from './components/listing/popups/listing-house-secret-popup';
import {ModalPopupLayoutComponent} from './components/layouts/modal-popup-layout';
import {ImageCardComponent} from './components/elements/image-card';
import {ListingImagesPopupComponent} from './components/listing/popups/listing-images-popup';
import {AddCardComponent} from './components/elements/add-card';
import {SettingsComponent} from './components/settings/settings';
import {SettingsChannelsComponent} from './components/settings/settings-channels';
import {SettingsClientsComponent} from './components/settings/settings-clients';
import {SettingsIntegrationsComponent} from './components/settings/settings-integrations';
import {SettingsToolsComponent} from './components/settings/settings-tools';
import {SettingsAutomatedMessagesComponent} from './components/settings/settings-automated-messages';
import {ApproveListingPopupComponent} from './components/contacts/popups/approve-listing-popup';
import {ListingRejectPopupComponent} from './components/listing/popups/listing-reject-popup';
import {TruncatePipe} from './pipes/truncate';
import {AdminHomeComponent} from './containers/admin/admin-home';
import {ListingNamePopupComponent} from './components/listing/popups/listing-listing-name-popup';
import {HttpClientModule} from '@angular/common/http';
import {QuantityInputComponent} from './components/elements/quantity-input';
import {ListingEntertainmentInstructionsPopupComponent} from './components/listing/popups/listing-house-entertainment-instructions-popup';
import {ListingPropertyAccessPopupComponent} from './components/listing/popups/listing-property-access-popup';
import {ListingVendorsMaintenancesPopupComponent} from './components/listing/popups/listing-vendors-maintenances';
import {InboxLoaderComponent} from './components/inbox/inbox-loader';
import {ReservationLogCardComponent} from './components/reservations/reservation-log-card';
import {
  ReservationAutomationCardComponent
} from './components/reservations/reservation-automation-card';
import {TimeAgoPipe} from './pipes/time-ago';
import {ReservationTaskCardComponent} from './components/reservations/reservation-task-card';
import {RentalChannelBreakdownPieChartComponent} from './components/rental-channel-breakdown-pie-chart';
import {RentalChannelBreakdownBarChartComponent} from './components/rental-channel-breakdown-bar-chart';
import {ContactsUserProfileComponent} from './components/contacts/contacts-user-profile';
import {LayoutOwnerMainFullWidthComponent} from './components/layouts/owner-main-fullwidth';
import {NewLinePipe} from './pipes/newline';
import {HTMLPipe} from './pipes/html';
import {RoundOffPipe} from './pipes/round';
import {MessageSpecialOfferPopupComponent} from 'app/components/message-special-offer';
import {AirlockPopupComponent} from './components/airlock-popup';
import {ReservationDetailsMagnifyComponent} from './components/reservations/reservations-details-magnify';
import {SettingsLastMinuteDiscountsComponent} from 'app/components/settings/settings-last-minute-discount';
import {SettingsAddTaskComponent} from './components/settings/settings-auto-tasks';
import {SettingsMinimumStaysEventsComponent} from './components/settings/settings-minimum-stays-events';
import {SettingsAlertPopupComponent} from 'app/components/settings/automated-messages-popup/check-in-instructions-popup';
import {SettingsThreeFourBedroomPopupComponent} from './components/settings/last-minute-discounts/three-four-bedroom-popup';
import {SettingsAutoTaskPopupComponent} from 'app/components/settings/auto-task-popups/auto-task-popup';
import {ReservationGuestComponent} from './components/reservations/reservation-guest-component';
import {ReservationGuestDetailsCardComponent} from './components/reservations/reservation-guest-details-card';
import {ContactDetailsMagnifyComponent} from './components/contacts/popups/detail-magnify-popup';
import {HomeCreateOwnerBlockPopupComponent} from './components/create-owner-block-home-popup';
import {HomeOwnerReportDownloadPopupComponent} from './components/download-report-home-popup';
import {UTCtoLocalTimeZonePipe} from 'app/pipes/utc-to-local-time.pipe';
import {DateFormattingPipe} from './pipes/dateTime-format.pipe';
import {DatePipe} from '@angular/common';
import {OwnerGuard} from './guards/owner';
import {AdminGuard} from './guards/admin';
import {AdminDownloadReportPopupComponent} from './containers/admin/download-report-admin-popup';
import {GenericConfirmationPopupComponent} from './components/elements/confirmation-popup';
import {AttachContactComponent} from './components/attach-contact';
import {DndModule} from 'ng2-dnd';
import {ListingCannedMessagePopupComponent} from './components/listing/popups/listing-canned-message-popup';
import {LayoutOwnerMainGenericComponent} from './components/layouts/owner-main-generic';
import {CreateReservationPopupComponent} from './components/create-reservation-popup';
import {AgmCoreModule} from '@agm/core';
import {environment} from '../environments/environment';
import {ProspectsComponent} from './components/prospects/prospects';
import {QuotesComponent} from './components/quotes/quotes';
import {NewProspectDetailsPopupComponent} from './components/prospects/new-prospect-details-popup';
import {StickyComponent} from './components/elements/sticky-container';
import {ProspectDetailsMagnifyComponent} from './components/prospects/prospect-details-magnify';
import {QuoteDetailsMagnifyComponent} from './components/quotes/quote-details-magnify';
import {MinimumStayComponent} from './components/minimum-stay-component';
import {TasksListComponent} from './components/tasks/tasks-list-component';
import {ReservationInboxComponent} from './components/reservations/reservation-inbox-component';
import {CreateLastMinuteDiscountComponent} from './components/settings/last-minute-discounts/create-disount-popup';
import {
  SettingsCustomVariablesComponent
} from './components/settings/custom-variables/settings-custom-variables';
import {CreateCustomVariablePopup} from './components/settings/custom-variables/create-custom-variable-popup';
import {TasksComponent} from './components/tasks/tasks-component';
import {CheckoutPageComponent} from './components/checkout2';
import {BlankComponent} from './components/blank';
import {MinStayTemplatePopupComponent} from './components/listing/min-stay-template-popup';
import {LastMinDiscountTemplatePopupComponent} from './components/listing/last-min-discount-template-popup';
import {ContactInfoComponent} from './components/contacts/contact-info';
import {ContactBankInfoComponent} from './components/contacts/contact-bank-info';
import {ContactTypeInfoComponent} from './components/contacts/contact-type-info';
import {ContactListingInfoComponent} from './components/contacts/contact-listing-info';
import {ContactLogInfoComponent} from './components/contacts/contact-log-info';
import {ProfileSettingComponent} from './components/profile';
import {ChangePasswordPopupComponent} from './components/change-password-popup';
import {HomeOwnerGuard} from './guards/homeowner';
import {SettingsCannedResponsesComponent} from './components/settings/settings-canned-responses';
import {CreateMinStayTemplatePopup} from './components/settings/create-min-stay-template-popup';
import {MinimumStaysTemplateDetailComponent} from './components/settings/minimum-stays-template-detail';
import {SettingCannedResponsesDetailComponent} from './components/settings/setting-canned-responses-detail';
import {TrimPipe} from './pipes/trim';
import {ListingsContactsTabComponent} from './components/listing/listings-contacts-tab';
import {ListingsHouseKeepingTabComponent} from './components/listing/listings-housekeeping-tab';
import {ListingsManageTabComponent} from './components/listing/listings-manage-tab';
import {ContactReservationsInfoComponent} from './components/contacts/contact-reservations-info';
import {SettingsAutoResponseComponent} from './components/settings/settings-auto-response';
import {ListingAutoResponsePopupComponent} from './components/listing/popups/listing-auto-response-popup';
import {DeductSecurityFeeComponent} from './components/reservations/popups/deduct-security-fee';
import {BookingNotesPopupComponent} from './components/reservations/popups/update-booking-notes';
import {PropertyIncomeReportPopupComponent} from './components/property-income-report-popup';
import {FroalaEditorModule, FroalaViewModule} from 'angular-froala-wysiwyg';
import {CollectPaymentComponent} from './components/reservations/popups/collect-payment';
import {PaymentPageComponent} from './components/payment';
import {CreateQuotePopupComponent} from './components/prospects/create-quote-popup';
import {CheckoutQuoteComponent} from './components/checkout-quote';

@NgModule({
  declarations: [
    /**
     * Layouts
     */
    LayoutNoHeaderComponent,
    LayoutOwnerMainComponent,
    LayoutMainComponent,
    LayoutOwnerMainFullWidthComponent,
    LayoutOwnerMainGenericComponent,


    /**
     * Components
     */
    ListingListingTabComponent,
    ListingsGuestTabComponent,
    ListingHouseSecretPopupComponent,
    ListingHouseTabComponent,
    ListingPricingTabComponent,
    ListingCalendarTabComponent,
    ListingChannelTabComponent,
    ListingTasksTabComponent,
    ListingLawTabComponent,
    MessagesDisplayComponent,
    DetailsMagnifyComponent,
    SettingsComponent,
    SettingsChannelsComponent,
    SettingsAutomatedMessagesComponent,
    SettingsClientsComponent,
    SettingsIntegrationsComponent,
    SettingsToolsComponent,
    CounterComponent,
    AppComponent,
    LoginComponent,
    SignUpComponent,
    CheckoutComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    OwnerHomeComponent,
    ListingBasicDetailsPopupComponent,
    ListingAmenitiesPopupComponent,
    OwnerListingsPageComponent,
    OwnerListingPageComponent,
    OwnerListingCardComponent,
    OwnerTasksPageComponent,
    OwnerTaskCardComponent,
    AirbnbPopupComponent,
    UpcomingBookingCardComponent,
    HeaderComponent,
    DashboardComponent,
    NotFoundComponent,
    FlexAlignmentHackDirective,
    BootstrapComponent,
    CentreSpinnerComponent,
    ErrorComponent,
    OwnerSidebarComponent,
    MonthlyBreakdownChartComponent,
    ListingRoundImageCardComponent,
    ListingCommonTextPopupComponent,
    ListingOwnerBlockPopupComponent,
    CreateContactPopupComponent,
    SavedContactViewPopupComponent,
    ImageSlideShowComponent,
    ContactsTaskComponent,
    ContactsUserProfileComponent,
    ReservationComponent,
    ReservationDetailComponent,
    ReservationUserInfoCardComponent,
    ReservationFinancialsCardComponent,
    ReservationAddGuestCardComponent,
    ReservationGuestComponent,
    ReservationLogCardComponent,
    ReservationTaskCardComponent,
    ReservationAutomationCardComponent,
    UserInfoCardComponent,
    BookingDetailCardComponent,
    MinimumStaysTemplateDetailComponent,
    SettingsCannedResponsesComponent,
    SettingCannedResponsesDetailComponent,
    GuestTypeCardComponent,
    InboxListComponent,
    ResponseCardComponent,
    InboxScreenContentComponent,
    InboxLoaderComponent,
    MessageBoxComponent,
    EmailBoxComponent,
    UserProfileTabComponent,
    BankInfoTabComponent,
    CreateTaskPopupComponent,
    CalendarComponent,
    MultiCalendarComponent,
    MultiCalendarContainerComponent,
    CreateProspectPopupComponent,
    NewReservationPopupComponent,
    CalendarDateTileComponent,
    ModalPopupLayoutComponent,
    ImageCardComponent,
    ListingImagesPopupComponent,
    AddCardComponent,
    ApproveListingPopupComponent,
    ListingRejectPopupComponent,
    SettingsAutomatedMessagesComponent,
    AdminHomeComponent,
    ListingNamePopupComponent,
    QuantityInputComponent,
    ListingEntertainmentInstructionsPopupComponent,
    ListingPropertyAccessPopupComponent,
    ListingVendorsMaintenancesPopupComponent,
    CreateLastMinuteDiscountComponent,
    RentalChannelBreakdownPieChartComponent,
    RentalChannelBreakdownBarChartComponent,
    MessageSpecialOfferPopupComponent,
    AirlockPopupComponent,
    ReservationDetailsMagnifyComponent,
    SettingsLastMinuteDiscountsComponent,
    SettingsAddTaskComponent,
    SettingsMinimumStaysEventsComponent,
    SettingsAlertPopupComponent,
    SettingsThreeFourBedroomPopupComponent,
    SettingsAutoTaskPopupComponent,
    SettingsCannedResponsesComponent,
    SettingsAutoResponseComponent,
    ReservationDetailsMagnifyComponent,
    ReservationGuestDetailsCardComponent,
    ContactDetailsMagnifyComponent,
    HomeCreateOwnerBlockPopupComponent,
    HomeOwnerReportDownloadPopupComponent,
    AdminDownloadReportPopupComponent,
    GenericConfirmationPopupComponent,
    AttachContactComponent,
    ListingCannedMessagePopupComponent,
    CreateReservationPopupComponent,
    NewProspectDetailsPopupComponent,
    ProspectDetailsMagnifyComponent,
    QuoteDetailsMagnifyComponent,
    ProspectsComponent,
    QuotesComponent,
    StickyComponent,
    MinimumStayComponent,
    CheckoutPageComponent,
    BlankComponent,
    TasksListComponent,
    ReservationInboxComponent,
    SettingsCustomVariablesComponent,
    CreateCustomVariablePopup,
    TasksComponent,
    LastMinDiscountTemplatePopupComponent,
    MinStayTemplatePopupComponent,
    ContactInfoComponent,
    ContactBankInfoComponent,
    ContactTypeInfoComponent,
    ContactListingInfoComponent,
    ContactLogInfoComponent,
    ProfileSettingComponent,
    ChangePasswordPopupComponent,
    CreateMinStayTemplatePopup,
    ListingsContactsTabComponent,
    ListingsHouseKeepingTabComponent,
    ListingsManageTabComponent,
    ContactReservationsInfoComponent,
    ListingAutoResponsePopupComponent,
    DeductSecurityFeeComponent,
    BookingNotesPopupComponent,
    PropertyIncomeReportPopupComponent,
    CollectPaymentComponent,
    PaymentPageComponent,
    CreateQuotePopupComponent,
    CheckoutQuoteComponent,


    /**
     * Pipes
     */
    TruncatePipe,
    TrimPipe,
    ListingDropDownPipe,
    NumberToCurrencyPipe,
    TimeAgoPipe,
    NewLinePipe,
    HTMLPipe,
    RoundOffPipe,
    UTCtoLocalTimeZonePipe,
    DateFormattingPipe
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FlexLayoutModule,
    FormsModule,
    NgxChartsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    MaterialModule,
    StoreModule.forRoot(reducers),
    !environment.production ? StoreDevtoolsModule.instrument({maxAge: 50}) : [],
    DndModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: environment.GoogleMaps.apiKey
    }),
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot()

  ],
  providers: [
    StayDuvetService,
    AuthGuard,
    AnonymousGuard,
    BootstrapGuard,
    OwnerGuard,
    AdminGuard,
    HomeOwnerGuard,
    DatePipe
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ListingCommonTextPopupComponent,
    ListingCannedMessagePopupComponent,
    ListingAmenitiesPopupComponent,
    ListingBasicDetailsPopupComponent,
    ListingOwnerBlockPopupComponent,
    ListingHouseSecretPopupComponent,
    AirbnbPopupComponent,
    CreateProspectPopupComponent,
    NewReservationPopupComponent,
    DetailsMagnifyComponent,
    CreateTaskPopupComponent,
    ListingImagesPopupComponent,
    ApproveListingPopupComponent,
    ListingRejectPopupComponent,
    ListingNamePopupComponent,
    CreateContactPopupComponent,
    ListingEntertainmentInstructionsPopupComponent,
    ListingPropertyAccessPopupComponent,
    ListingVendorsMaintenancesPopupComponent,
    MessageSpecialOfferPopupComponent,
    AirlockPopupComponent,
    SettingsAlertPopupComponent,
    SettingsThreeFourBedroomPopupComponent,
    SettingsAutoTaskPopupComponent,
    ReservationDetailsMagnifyComponent,
    ReservationAddGuestCardComponent,
    ContactDetailsMagnifyComponent,
    HomeCreateOwnerBlockPopupComponent,
    HomeOwnerReportDownloadPopupComponent,
    AdminDownloadReportPopupComponent,
    GenericConfirmationPopupComponent,
    CreateReservationPopupComponent,
    NewProspectDetailsPopupComponent,
    ProspectDetailsMagnifyComponent,
    QuoteDetailsMagnifyComponent,
    CreateLastMinuteDiscountComponent,
    CreateCustomVariablePopup,
    LastMinDiscountTemplatePopupComponent,
    MinStayTemplatePopupComponent,
    ContactInfoComponent,
    ContactBankInfoComponent,
    ContactTypeInfoComponent,
    ContactListingInfoComponent,
    ContactLogInfoComponent,
    ChangePasswordPopupComponent,
    CreateMinStayTemplatePopup,
    ListingAutoResponsePopupComponent,
    DeductSecurityFeeComponent,
    BookingNotesPopupComponent,
    PropertyIncomeReportPopupComponent,
    CollectPaymentComponent,
    CreateQuotePopupComponent,
  ]

})
export class AppModule {
  //
}
