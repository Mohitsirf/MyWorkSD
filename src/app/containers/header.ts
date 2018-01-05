import {Component, OnInit} from '@angular/core';
import {StayDuvetService} from '../services/stayduvet';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {getUser, State, getAppIsMenuHidden} from '../reducers/index';
import {Listing} from '../models/listing';
import {Subject} from 'rxjs/Subject';
import {getContactMaintenanceCatagoryType} from '../utils';
import {User} from '../models/user';
import {isNullOrUndefined} from 'util';
import {MenuHiddenChangeAction} from '../actions/app';
import {Booking} from "../models/booking";
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'sd-header',
  template: `
    <div style="width:100% ;position:fixed;z-index:1000;top:0px">
      <mat-toolbar id="mainToolbar" color="primary">
        <button style="z-index:99999;position:fixed;top:4%;left:1%;"
                (click)="toggleWidth()"
                [style.color]="hamburgerColor"
                mat-icon-button>
          <mat-icon>format_list_bulleted</mat-icon>
        </button>
        <img style="margin-left: 50px" class="logo"
             src="/assets/images/logo.png"
             fxFlex="10%"
             alt="Stay Duvet">
        <span class="fill"></span>
        <mat-form-field fxFlex="50%" *ngIf="loggedInUser.is_admin">
          <mat-placeholder>
            <mat-icon>search</mat-icon>
            Search
          </mat-placeholder>
          <input matInput [matAutocomplete]="auto" (input)="search($event)">
        </mat-form-field>
        <mat-autocomplete #auto="matAutocomplete">
          <mat-option *ngFor="let listing of listings" [value]="listing?.title"
                      (onSelectionChange)="onListingSelected(listing)">
            <span style="color:#fff;font-weight: bold">{{ listing?.title }} {{ listing?.city }} | LISTING</span>
          </mat-option>
          <mat-option *ngFor="let user of users" [value]="user?.first_name"
                      (onSelectionChange)="onUserSelected(user)" [matTooltip]="getUser(user)">
            <span style="color:#fff;font-weight: bold">{{ user?.first_name
              }} {{ user?.last_name}} | {{getContactType(user)}}</span>
          </mat-option>

          <div *ngFor="let guest of guests">
            <mat-option *ngFor="let booking of guest['bookings']" [value]="guest?.first_name"
                        (onSelectionChange)="onGuestSelected(booking)" [matTooltip]="getUser(guest)">
            <span style="color:#fff;font-weight: bold">{{ guest?.first_name
              }} {{ guest?.last_name}} | GUEST | <span
                style="font-style: italic; font-weight: 100; color:#fff;"> {{getListingTitle(booking)}} on dates {{booking.start | date}} - {{booking.end | date}}</span></span>
            </mat-option>

          </div>

          <mat-option *ngFor="let booking of bookings" [value]="booking?.confirmation_code"
                      (onSelectionChange)="onReservationSelected(booking)">
            <span style="color:#fff;font-weight: bold">{{ booking?.confirmation_code}} | RESERVATION | <span
              style="font-style: italic; font-weight: 100; color:#fff;"> {{getListingTitle(booking)}} on dates {{booking.start | date}} - {{booking.end | date}}</span></span>
          </mat-option>


        </mat-autocomplete>
        <div fxFlex="10%">
          <mat-spinner *ngIf="loading" color="accent" [diameter]="30" [strokeWidth]="4"></mat-spinner>
        </div>


        <span class="fill"></span>
        <button mat-button [matMenuTriggerFor]="userSettingsMenu" fxFlex="10%">
          {{first_name$ | async | titlecase}}
          <mat-icon matSuffix>keyboard_arrow_down</mat-icon>
        </button>
      </mat-toolbar>
    </div>

    <mat-menu [overlapTrigger]="false" #userSettingsMenu="matMenu">
      <button mat-menu-item (click)="openUserSettings()">profile settings</button>
      <button mat-menu-item (click)="logout()">Logout</button>
    </mat-menu>
  `,
  styles: [`
    mat-toolbar {
      padding: 10px;
    }

    .header-container {
      height: 50px;
    }

    .logo {
      height: 45px;
      margin: 0 4px 3px 0;
      vertical-align: middle;
    }

    mat-spinner {
      height: 40px;
    }


  `]
})
export class HeaderComponent implements OnInit {

  first_name$: Observable<string>;
  loggedInUser: User;

  users: User[];
  listings: Listing[];
  guests: User[];
  bookings: Booking[];
  loading: boolean = false;
  hamburgerColor = '#000000';

  private searchTerms = new Subject<string>();
  private _globalSubscription: Subscription;

  constructor(private service: StayDuvetService,
              private router: Router,
              private store: Store<State>) {
  }

  ngOnInit() {
    console.log('onInit sd-header');
    this.first_name$ = this.store.select(getUser).map((user) => {
      return user.first_name;
    });

    this.store.select(getUser).subscribe((user) => {
      this.loggedInUser = user;
    });

    this.searchTerms
      .distinctUntilChanged()
      .map(term => {
        term = term.trim();
        if (term !== '') {
          if (!isNullOrUndefined(this._globalSubscription)) {
            this._globalSubscription.unsubscribe();
          }

          this.loading = true;
          this._globalSubscription = this.service.globalSearch({key: term}).subscribe(result => {
            this.listings = result[0].properties;
            this.users = result[0].users;
            this.guests = result[0].guests;
            this.bookings = result[0].bookings;
            this.loading = false;
          });
        }

      }).subscribe();

    this.store.select(getAppIsMenuHidden).subscribe((value) => {
      if (value) {
        this.hamburgerColor = '#F7DC6F';
      } else {
        this.hamburgerColor = '#000000';
      }
    });
  }

  search($event) {
    const val = $event.target.value;

    if (val === '') {
      this.users = null;
      this.listings = null;
      this.guests = null;
      this.bookings = null;
      return;
    }

    this.searchTerms.next(val);
  }

  toggleWidth() {
    this.store.dispatch(new MenuHiddenChangeAction());
  }

  logout() {
    this.service.logout();

    this.router.navigate(['/login']);
  }

  home() {
    this.router.navigate(['/']);
  }

  openUserSettings() {
    this.router.navigate(['/profile']);
  }

  onUserSelected(contact: User) {
    this.router.navigate(['/contacts/', contact.id]);
  }

  onListingSelected(listing: Listing) {
    this.router.navigate(['/listings/' + listing.id + '/details']);

  }

  onReservationSelected(booking: Booking) {
    this.router.navigate(['/reservations/' + booking.id]);

  }

  onGuestSelected(booking) {
    this.router.navigate(['/reservations/' + booking.id + '/financials']);
  }

  getContactType(contact: User) {


    if (contact.type === 'management') {
      return getContactMaintenanceCatagoryType(contact['managementContact']['category']).title.toUpperCase();
    }
    return contact.type.toUpperCase();
  }

  getListingTitle(booking) {
    const listing = booking['property'];
    if (isNullOrUndefined(listing)) {
      return null;
    }
    return listing.title;
  }

  getUser(user: User) {
    let returnString = '';

    returnString = 'Name : ' + user.first_name;
    if (user.last_name) {
      returnString = returnString + ' ' + user.last_name + '\n';
    } else {
      returnString = returnString + '\n';
    }

    if (user.phone_number) {
      returnString = returnString + 'Phone : ' + user.phone_number + '\n';
    }

    if (user.secondary_phone_number) {
      returnString = returnString + 'Secondary Phone : ' + user.secondary_phone_number + '\n';
    }

    if (user.email) {
      returnString = returnString + 'Email : ' + user.email + '\n';
    }

    if (user.secondary_email) {
      returnString = returnString + 'Secondary Email : ' + user.secondary_email + '\n';
    }

    return returnString;
  }
}
