import {Routes} from '@angular/router';
import {LoginComponent} from './components/login';
import {DashboardComponent} from './containers/dashboard';
import {AuthGuard} from './guards/auth';
import {AnonymousGuard} from './guards/anonymous';
import {NotFoundComponent} from './components/not-found';
import {BootstrapGuard} from './guards/bootstrap';
import {BootstrapComponent} from './containers/bootstrap';
import {ResetPasswordComponent} from './components/reset-password';
import {ForgotPasswordComponent} from './components/forgot-password';
import {OwnerHomeComponent} from './containers/owner/owner-home';
import {OwnerListingsPageComponent} from './containers/owner/owner-listings-page';
import {SignUpComponent} from './components/signup-page';
import {OwnerTasksPageComponent} from './containers/owner/owner-tasks-page';
import {OwnerListingPageComponent} from './containers/owner/owner-listing-page';
import {ListingListingTabComponent} from './components/listing/listing-listing-tab';
import {ListingHouseTabComponent} from './components/listing/listing-house-tab';
import {ListingPricingTabComponent} from './components/listing/listing-pricing-tab';
import {ListingCalendarTabComponent} from './components/listing/listing-calendar-tab';
import {ListingChannelTabComponent} from './components/listing/listing-channel-tab';
import {ListingTasksTabComponent} from './components/listing/listing-tasks-tab';
import {ListingLawTabComponent} from './components/listing/listing-law-tab';
import {ContactsTaskComponent} from './components/contacts/contacts-component';
import {ReservationComponent} from 'app/components/reservations/reservation-component';
import {ReservationDetailComponent} from 'app/components/reservations/reservation-detail-component';
import {MultiCalendarContainerComponent} from './components/multi-calendar/multi-calendar-container';
import {InboxScreenContentComponent} from './components/inbox/inbox-screen-content';
import {UserProfileTabComponent} from './components/contacts/tabs/user-profile';
import {ListingsGuestTabComponent} from './components/listing/listings-guest-tab';
import {CheckoutComponent} from './components/checkout';
import {SettingsComponent} from './components/settings/settings';
import {SettingsChannelsComponent} from './components/settings/settings-channels';
import {SettingsIntegrationsComponent} from './components/settings/settings-integrations';
import {SettingsToolsComponent} from './components/settings/settings-tools';
import {SettingsClientsComponent} from './components/settings/settings-clients';
import {SettingsAutomatedMessagesComponent} from './components/settings/settings-automated-messages';
import {AdminHomeComponent} from './containers/admin/admin-home';
import {InboxLoaderComponent} from './components/inbox/inbox-loader';
import {ContactsUserProfileComponent} from './components/contacts/contacts-user-profile';
import {ReservationAddGuestCardComponent} from './components/reservations/reservation-add-guest-card';
import {ReservationAutomationCardComponent} from './components/reservations/reservation-automation-card';
import {ReservationTaskCardComponent} from './components/reservations/reservation-task-card';
import {ReservationLogCardComponent} from './components/reservations/reservation-log-card';
import {ReservationFinancialsCardComponent} from './components/reservations/reservation-financials-card';
import {SettingsLastMinuteDiscountsComponent} from './components/settings/settings-last-minute-discount';
import {SettingsAddTaskComponent} from './components/settings/settings-auto-tasks';
import {SettingsMinimumStaysEventsComponent} from './components/settings/settings-minimum-stays-events';
import {ReservationGuestComponent} from './components/reservations/reservation-guest-component';
import {OwnerGuard} from './guards/owner';
import {AdminGuard} from './guards/admin';
import {ProspectsComponent} from './components/prospects/prospects';
import {QuotesComponent} from './components/quotes/quotes';
import {ReservationInboxComponent} from './components/reservations/reservation-inbox-component';
import {SettingsCustomVariablesComponent} from './components/settings/custom-variables/settings-custom-variables';
import {TasksComponent} from './components/tasks/tasks-component';
import {CheckoutPageComponent} from './components/checkout2';
import {BlankComponent} from './components/blank';
import {ProfileSettingComponent} from './components/profile';
import {HomeOwnerGuard} from './guards/homeowner';
import {SettingsCannedResponsesComponent} from './components/settings/settings-canned-responses';
import {ListingsHouseKeepingTabComponent} from './components/listing/listings-housekeeping-tab';
import {ListingsManageTabComponent} from './components/listing/listings-manage-tab';
import {ListingsContactsTabComponent} from './components/listing/listings-contacts-tab';
import {SettingsAutoResponseComponent} from './components/settings/settings-auto-response';
import {PaymentPageComponent} from './components/payment';
import {CheckoutQuoteComponent} from './components/checkout-quote';


export const routes: Routes = [
  {path: '', component: BootstrapComponent, canActivate: [BootstrapGuard]},
  {
    path: 'checkout/:id', component: CheckoutPageComponent
  },
  {
    path: 'payment/:id', component: PaymentPageComponent
  },
  {
    path: 'checkout-quote/:id', component: CheckoutQuoteComponent
  },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],

    children: [
      /**
       * All Routes Accessible by both Admin and Owner
       */
      // Listings,
      {
        path: 'listings', redirectTo: 'listings/approved', pathMatch: 'full'
      },
      {
        path: 'listings/all', component: OwnerListingsPageComponent, data: {filter: null}
      },
      {
        path: 'listings/drafts', component: OwnerListingsPageComponent, data: {filter: 'draft'}
      },
      {
        path: 'listings/waiting', component: OwnerListingsPageComponent, data: {filter: 'pending'}
      },
      {
        path: 'listings/approved', component: OwnerListingsPageComponent, data: {filter: 'accepted'}
      },
      {
        path: 'listings/rejected', component: OwnerListingsPageComponent, data: {filter: 'rejected'}
      },

      // Selected Listings Tab
      {
        path: 'listings/:id',
        component: OwnerListingPageComponent,
        children: [
          {path: '', redirectTo: 'details', pathMatch: 'full'},
          {path: 'details', component: ListingListingTabComponent},
          {path: 'guest', component: ListingsGuestTabComponent},
          {path: 'house', component: ListingHouseTabComponent},
          {path: 'housekeeping', component: ListingsHouseKeepingTabComponent},
          {path: 'manage', component: ListingsManageTabComponent},
          {path: 'contacts', component: ListingsContactsTabComponent},
          {path: 'pricing', component: ListingPricingTabComponent, canActivate: [AdminGuard]},
          {path: 'calendar', component: ListingCalendarTabComponent},
          {path: 'automation', component: ListingChannelTabComponent, canActivate: [AdminGuard]},
          {path: 'tasks', component: ListingTasksTabComponent},
          {path: 'law', component: ListingLawTabComponent, canActivate: [AdminGuard]},
          {path: '**', component: NotFoundComponent}
        ]
      },

      // Profile

      {
        path: 'profile', component: ProfileSettingComponent
      },



      /**
       * All Home Owner Only Routes Here
       */
      {
        path: '',
        component: DashboardComponent,
        canActivate: [HomeOwnerGuard],
        children: [
          {
            path: 'homeowner-home', component: OwnerHomeComponent
          },
        ]
      },


      /**
       * All Owner Only Routes Here
       */
      {
        path: '',
        component: DashboardComponent,
        canActivate: [OwnerGuard],
        children: [
          {
            path: 'home', component: OwnerHomeComponent
          },
        ]
      },



      /**
       * All Admin Only Routes Here
       */
      {
        path: '',
        component: DashboardComponent,
        canActivate: [AdminGuard],
        children: [
          {
            path: 'admin-home', component: AdminHomeComponent
          },

          // Selected Listings Tab
          {
            path: 'listings/:id',
            component: OwnerListingPageComponent,
            children: [
              {path: 'pricing', component: ListingPricingTabComponent},
              {path: 'channel', component: ListingChannelTabComponent},
            ]
          },

          // Reservations
          {
            path: 'reservations', component: ReservationComponent
          },
          {
            path: 'reservations/:id', component: ReservationDetailComponent,
            children: [
              {path: '', redirectTo: 'financials', pathMatch: 'full'},
              {path: 'financials', component: ReservationFinancialsCardComponent},
              {path: 'guest', component: ReservationGuestComponent},
              {path: 'automation', component: ReservationAutomationCardComponent},
              {path: 'tasks', component: ReservationTaskCardComponent},
              {path: 'inbox', component: ReservationInboxComponent},
              {path: 'log', component: ReservationLogCardComponent},
            ]
          },

          // Multi Calendar
          {
            path: 'multi-calendar', component: MultiCalendarContainerComponent
          },

          // Contacts
          {
            path: 'contacts/active', component: ContactsTaskComponent, data: {showActive: true}
          },

          {
            path: 'contacts/inactive', component: ContactsTaskComponent, data: {showActive: false}
          },

          {
            path: 'contacts/:id', component: ContactsUserProfileComponent
          },

          // Inbox
          {
            path: 'inbox', redirectTo: 'inbox/ongoing', pathMatch: 'full'
          },
          {
            path: 'inbox/unread', component: InboxLoaderComponent, data: {filter: 'unread'}
          },
          {
            path: 'inbox/follow-up', component: InboxLoaderComponent, data: {filter: 'followup'}
          },
          {
            path: 'inbox/booked', component: InboxLoaderComponent, data: {filter: 'booked'}
          },
          {
            path: 'inbox/ongoing', component: InboxLoaderComponent, data: {filter: 'ongoing'}
          },
          {
            path: 'inbox/requests', component: InboxLoaderComponent, data: {filter: 'requests'}
          },
          {
            path: 'inbox/archived', component: InboxLoaderComponent, data: {filter: 'archived'}
          },
          {
            path: 'inbox/other', component: InboxLoaderComponent, data: {filter: 'other'}
          },
          {
            path: 'inbox/:thread_id', component: InboxScreenContentComponent
          },

          // Leads
          {
            path: 'leads', redirectTo: 'leads/prospects', pathMatch: 'full'
          },
          {
            path: 'leads/prospects', component: ProspectsComponent
          },
          {
            path: 'leads/quotes', component: QuotesComponent

          },

          // Tasks
          {
            path: 'tasks', component: TasksComponent
          },

          // Settings
          {
            path: 'settings',
            component: SettingsComponent,
            children: [
              {path: '', redirectTo: 'tools', pathMatch: 'full'},
              {path: 'integrations', component: SettingsIntegrationsComponent},
              {path: 'channels', component: SettingsChannelsComponent},
              {path: 'clients', component: SettingsClientsComponent},
              {path: 'tools', component: SettingsToolsComponent},
              {path: 'tools/canned-responses', component: SettingsCannedResponsesComponent},
              {path: 'tools/automated', component: SettingsAutomatedMessagesComponent},
              {path: 'tools/auto-tasks', component: SettingsAddTaskComponent},
              {path: 'tools/last-minute-discounts', component: SettingsLastMinuteDiscountsComponent},
              {path: 'tools/custom-variables', component: SettingsCustomVariablesComponent},
              {path: 'tools/minimum-stays-events', component: SettingsMinimumStaysEventsComponent},
              {path: 'tools/auto-responses', component: SettingsAutoResponseComponent},

            ]
          }
        ]
      },
    ]
  },
  {
    path: '',
    canActivate: [AnonymousGuard],
    children: [
      {
        path: 'signup', component: SignUpComponent
      },
      {
        path: 'login', component: LoginComponent
      },
      {
        path: 'reset-password', component: ResetPasswordComponent
      },
      {
        path: 'forgot-password', component: ForgotPasswordComponent
      }
    ]
  },
  {path: '**', component: NotFoundComponent}
];
