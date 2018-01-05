import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {DataSource} from '@angular/cdk/table';
import {StayDuvetService} from '../../services/stayduvet';
import {Store} from '@ngrx/store';
import {
  getBookings,
  getActiveContacts,
  getIsBookingLoaded,
  getIsBookingLoading,
  getIsActiveContactLoaded,
  getIsActiveContactLoading,
  getIsTodayBookingLoaded,
  getIsTodayBookingLoading,
  getIsUpcomingBookingLoaded,
  getIsUpcomingBookingLoading,
  getListings,
  getTodayBookings,
  getTodayCurrentPage,
  getTodayTotalPage,
  getUpcomingBookings,
  State,
  getUpcomingTotalPage,
  getTodayTotalCount,
  getUpcomingTotalCount,
  getOngoingTotalCount,
  getPastTotalCount
} from '../../reducers/index';
import {Booking} from '../../models/booking';
import {Listing} from '../../models/listing';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ReservationDetailsMagnifyComponent} from './reservations-details-magnify';
import {Router} from '@angular/router';
import {NewReservationPopupComponent} from 'app/components/multi-calendar/new-reservation-popup';
import {User} from '../../models/user';
import {getSourceType} from '../../utils';
import {CreateReservationPopupComponent} from '../create-reservation-popup';
import {isNullOrUndefined} from 'util';
import * as moment from 'moment';
import {getDateObj} from '../calendar/calendar-utils';
import {getUpcomingCurrentPage} from '../../reducers/index';
import {getIsOngoingBookingLoading} from '../../reducers/index';
import {getIsOngoingBookingLoaded} from '../../reducers/index';
import {getOngoingCurrentPage} from '../../reducers/index';
import {getOngoingTotalPage} from '../../reducers/index';
import {getOngoingBookings} from '../../reducers/index';
import {getIsPastBookingLoading} from '../../reducers/index';
import {getIsPastBookingLoaded} from '../../reducers/index';
import {getPastCurrentPage} from '../../reducers/index';
import {getPastBookings} from '../../reducers/index';
import {getPastTotalPage} from '../../reducers/index';

@Component({
  selector: 'sd-reservation-component',
  template: `
    <sd-owner-main-layout style="font-size:x-small;">

      <div *ngIf="isCurrentlyLoading()" id="spinner" fxLayoutAlign="center center" fxFlex="100%">
        <mat-spinner color="accent" [diameter]="60" [strokeWidth]="5"></mat-spinner>
      </div>

      <div fxLayout="column" fxLayoutGap="20px" class="main-container requiredHeight"
           *ngIf="!isCurrentlyLoading()" fxFlex=100%>
        <div fxLayoutAlign="space-between center">
          <div fxLayout="column" fxLayoutAlign="center start" fxLayoutGap="10px" fxFlex="70%">
            <span style="font-size: 25px; font-weight: bolder">Reservations</span>
            <mat-form-field style="width: 30%">
              <mat-select
                [(ngModel)]="currentFilter"
                (ngModelChange)="filterChanged()">
                <mat-option *ngFor="let filter of filters" [value]="filter">
                  {{ filter.title }}
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>
          <div>
            <button mat-raised-button color="accent" (click)="createNewReservation()">NEW RESERVATION</button>
          </div>
        </div>
        <hr id="line">


        <div>

          <div fxLayout="column">
            <div id="description" fxLayout="column" fxLayoutGap="10px">
              <p class="pHeading">You have Check-ins Today ,and 3 turnovers.</p>
              <span class="spanSubHeading" style="width: 80%;">
                  You are able to confirm all Guests are checked in via the toggle.
                  That way you can rest at night an know everyone is accommodated. Checked means good!
                </span>
            </div>
            <mat-card fxFlex="100%" class="table-container">
              <div fxLayout="column">
                <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px" id="heading">
                  <span class="halfcellWidth"></span>
                  <span class="doublecellWidth"><b>Listing</b></span>
                  <span class="cellWidth"><b>Guest</b></span>
                  <span class="cellWidth"><b>Confirmation</b></span>
                  <span class="cellWidth"><b>Source</b></span>
                  <span class="cellWidth"><b>Arrival Time</b></span>
                  <span class="cellWidth"><b>Check In</b></span>
                  <span class="cellWidth"><b>Check Out</b></span>
                  <span class="halfcellWidth"><b>View</b></span>
                </div>
                <div>
                  <hr>
                </div>
                <div *ngFor="let reservation of reservations">
                  <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px">
                    <div class="halfcellWidth">
                      <mat-checkbox [checked]="reservation.checked_in"
                                    *ngIf="!isCheckingIn[reservation.id]"
                                    [disabled]="!canToggleCheckIn(reservation)"
                                    [matTooltip]="tooltipText(reservation)"
                                    [matTooltipPosition]="'above'"
                                    (change)="onCheckedStateChange($event,reservation)">
                      </mat-checkbox>
                      <mat-spinner *ngIf="isCheckingIn[reservation.id]" style="height:30px;width:30px" 
                                   color="accent" [diameter]="30" [strokeWidth]="4">
                      </mat-spinner>
                    </div>
                    <span class="doublecellWidth" style="cursor: pointer"
                          (click)="openReservationDetails(reservation)">
                      {{getListing(reservation.property_id).title}}
                    </span>
                    <span class="cellWidth" style="cursor: pointer"
                          (click)="openReservationDetails(reservation)">
                      {{ reservation.guest.data.first_name}} {{ reservation.guest.data.last_name || '' }}
                    </span>
                    <span class="cellWidth" style="cursor: pointer"
                          (click)="openReservationDetails(reservation)">
                      {{reservation?.confirmation_code || '######'}}
                    </span>
                    <span class="cellWidth" style="cursor: pointer"
                          (click)="openReservationDetails(reservation)">
                      {{getSourceTitle(reservation)}}
                    </span>
                    <span class="cellWidth">{{reservation.check_in_time }}</span>
                    <span class="cellWidth">{{reservation.start | date:'mediumDate' }}</span>
                    <span class="cellWidth">{{reservation.end | date:'mediumDate' }}</span>
                    <div class="halfcellWidth">
                      <button mat-icon-button (click)="showDetails(reservation)">
                        <mat-icon>search</mat-icon>
                      </button>
                    </div>
                  </div>
                  <hr>

                </div>


                <div fxLayout="row" *ngIf="reservations.length === 0" fxLayoutAlign="center center">
                  <p> No Reservations</p>
                </div>

                <div fxLayout="row" *ngIf="reservations.length > 0" fxLayoutAlign="end center">

                  <div fxFlex fxLayoutAlign="start start">
                    <mat-form-field [color]="'accent'">
                      <mat-select
                        placeholder="Items per page"
                        [(ngModel)]="itemsPerPage"
                        fxFlex="100%"
                        (ngModelChange)="itemsPerPageChanged()"
                        [ngModelOptions]="{standalone: true}">
                        <mat-option [value]="5">5</mat-option>
                        <mat-option [value]="10">10</mat-option>
                        <mat-option [value]="15">15</mat-option>
                        <mat-option [value]="20">20</mat-option>
                        <mat-option [value]="30">30</mat-option>
                        <mat-option [value]="50">50</mat-option>
                      </mat-select>
                    </mat-form-field>
                  </div>

                  <h4>{{start + 1}} - {{end}} of {{total}}</h4>
                  <button mat-button [disabled]="isPrevDisabled" (click)="onPrev()">
                    <mat-icon>navigate_before</mat-icon>
                    Prev
                  </button>
                  <button mat-button [disabled]="isNextDisabled" (click)="onNext()">Next
                    <mat-icon>navigate_next</mat-icon>
                  </button>
                </div>
                <hr>
              </div>

            </mat-card>
          </div>
        </div>
      </div>
    </sd-owner-main-layout>
  `,
  styles: [`
    .main-container {
      margin: 30px;
      margin-top: 10px;
    }

    #description {
      padding-left: 10px;
    }

    #text {
      font-size: 15px;
    }

    #line {
      border: none;
      width: 100%;
      height: 5px;
      /* Set the hr color */
      color: lightgrey; /* old IE */
      background-color: lightgrey; /* Modern Browsers */
    }

    #table-heading {
      padding-left: 10px;
      padding-top: 5px;
      font-weight: bold;
    }

    .table-container {
      width: 100%;
      background: -webkit-linear-gradient(top, #ffffff 0%, #ffffff 100%);
      padding: 30px;
      font-size: 13px;
    }

    #spinner {
      position: fixed;
      top: 45%;
      right: 40%
    }

    #heading {
      font-weight: bolder;
    }

    .cellWidth {
      width: 110px;
      text-align: start;
    }

    .halfcellWidth {
      width: 60px;
      text-align: center;
    }

    .doublecellWidth {
      width: 170px;
    }

    span > b {
      font-size: 14px !important;
    }
  `]
})

export class ReservationComponent implements OnInit, OnDestroy {

  heading: string = 'Today\'s Reservations';
  isCheckingIn: {[id: number]: boolean} = {};

  filters = [
    {
      title: 'Today\'s Reservations',
      slug: 'today_bookings'
    },
    {
      title: 'Upcoming Reservations',
      slug: 'upcoming_bookings'
    },
    {
      title: 'Past Reservations',
      slug: 'past_bookings'
    },
    {
      title: 'Ongoing Reservations',
      slug: 'ongoing_bookings'
    }
  ];

  reservationsToShow: Booking[];
  reservations: Booking[] = [];
  currentFilter: { title: string, slug: string };

  todayReservations: Booking[] = [];
  todayLoading = false;
  todayLoaded = false;
  todayCurrentPage = 0;
  todayTotalPage = 1;
  todayCount = 0;

  upcomingReservations: Booking[] = [];
  upcomingLoading = false;
  upcomingLoaded = false;
  upcomingCurrentPage = 0;
  upcomingTotalPage = 1;
  upcomingCount = 0;

  ongoingReservations: Booking[] = [];
  ongoingLoading = false;
  ongoingLoaded = false;
  ongoingCurrentPage = 0;
  ongoingTotalPage = 1;
  ongoingCount = 0;

  pastReservations: Booking[] = [];
  pastLoading = false;
  pastLoaded = false;
  pastCurrentPage = 0;
  pastTotalPage = 1;
  pastCount = 0;

  listings: Listing[];

  private dialogRef: MatDialogRef<any>;
  private isAlive: boolean = true;

  isPrevDisabled: boolean = true;
  isNextDisabled: boolean = false;

  itemsPerPage = 15;
  currentPage: number = -1;
  currentLoadedPage: number = 0;
  currentTotalPage: number = 0;
  currentTotalCount: number = 0;

  start: number = 0;
  end: number = 0;
  total: number = 0;

  constructor(public service: StayDuvetService,
              private router: Router,
              private store: Store<State>, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.currentFilter = this.filters[0];

    this.setUpListing();

    this.filterChanged();
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  filterChanged() {
    let isLoaded = true;
    this.currentPage = -1;

    switch (this.currentFilter.slug) {
      case 'upcoming_bookings': {
        isLoaded = this.upcomingLoaded;
        if (!isLoaded) {
          this.setupUpcomingReservations();
        }
        break;
      }
      case 'ongoing_bookings': {
        isLoaded = this.ongoingLoaded;
        if (!isLoaded) {
          this.setupOngoingReservations();
        }
        break;
      }
      case 'past_bookings': {
        isLoaded = this.pastLoaded;
        if (!isLoaded) {
          this.setupPastReservations();
        }
        break;
      }
      case 'today_bookings': {
        isLoaded = this.todayLoaded;
        if (!isLoaded) {
          this.setupTodayReservations();
        }
        break;
      }
    }

    if (isLoaded) {
      this.refreshData();
    }
  }

  private refreshData() {
    switch (this.currentFilter.slug) {
      case 'upcoming_bookings': {
        this.reservationsToShow = this.upcomingReservations;
        this.currentLoadedPage = this.upcomingCurrentPage;
        this.currentTotalPage = this.upcomingTotalPage;
        this.currentTotalCount = this.upcomingCount;
        break;
      }
      case 'ongoing_bookings': {
        this.reservationsToShow = this.ongoingReservations;
        this.currentLoadedPage = this.ongoingCurrentPage;
        this.currentTotalPage = this.ongoingTotalPage;
        this.currentTotalCount = this.ongoingCount;
        break;
      }
      case 'past_bookings': {
        this.reservationsToShow = this.pastReservations;
        this.currentLoadedPage = this.pastCurrentPage;
        this.currentTotalPage = this.pastTotalPage;
        this.currentTotalCount = this.pastCount;
        break;
      }
      case 'today_bookings': {
        this.reservationsToShow = this.todayReservations;
        this.currentLoadedPage = this.todayCurrentPage;
        this.currentTotalPage = this.todayTotalPage;
        this.currentTotalCount = this.todayCount;
        break;
      }
    }

    this.onNext();
  }

  private setUpListing() {
    this.store.select(getListings).takeWhile(() => this.isAlive).subscribe((listings) => {
      this.listings = listings;
    });
  }

  private loadNextData() {
    switch (this.currentFilter.slug) {
      case 'today_bookings': {
        this.service.getTodayBookings(this.todayCurrentPage + 1).subscribe();
        break;
      }
      case 'upcoming_bookings': {
        this.service.getUpcomingBookings(this.upcomingCurrentPage + 1).subscribe();
        break;
      }
      case 'ongoing_bookings': {
        this.service.getOngoingBookings(this.ongoingCurrentPage + 1).subscribe();
        break;
      }
      case 'past_bookings': {
        this.service.getPastBookings(this.pastCurrentPage + 1).subscribe();
        break;
      }
    }
  }

  private setupTodayReservations() {
    this.store.select(getIsTodayBookingLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.todayLoading = loading;
    });

    this.store.select(getIsTodayBookingLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.todayLoaded = loaded;
    });

    this.store.select(getTodayCurrentPage).takeWhile(() => this.isAlive).subscribe((currentPage) => {
      this.todayCurrentPage = currentPage;
    });

    this.store.select(getTodayTotalPage).takeWhile(() => this.isAlive).subscribe((totalPage) => {
      this.todayTotalPage = totalPage;
    });

    this.store.select(getTodayTotalCount).takeWhile(() => this.isAlive).subscribe((count) => {
      this.todayCount = count;
    });

    this.store.select(getTodayBookings).takeWhile(() => this.isAlive).subscribe((bookings) => {
      this.todayReservations = bookings;
      if (this.currentFilter.slug === 'today_bookings') {
        this.currentPage = -1;
        this.refreshData();
      }
    });

    const reservationsCombined = Observable.merge(
      this.store.select(getIsTodayBookingLoading),
      this.store.select(getIsTodayBookingLoaded),
      this.store.select(getTodayBookings),
      ((loading, loaded, bookings) => {
      })
    );

    reservationsCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.todayLoading && !this.todayLoaded) {
          this.service.getTodayBookings(this.todayCurrentPage + 1).subscribe();
        }
      }
    );
  }

  private setupUpcomingReservations() {
    this.store.select(getIsUpcomingBookingLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.upcomingLoading = loading;
    });

    this.store.select(getIsUpcomingBookingLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.upcomingLoaded = loaded;
    });

    this.store.select(getUpcomingCurrentPage).takeWhile(() => this.isAlive).subscribe((currentPage) => {
      this.upcomingCurrentPage = currentPage;
    });

    this.store.select(getUpcomingTotalPage).takeWhile(() => this.isAlive).subscribe((totalPage) => {
      this.upcomingTotalPage = totalPage;
    });

    this.store.select(getUpcomingTotalCount).takeWhile(() => this.isAlive).subscribe((count) => {
      this.upcomingCount = count;
    });

    this.store.select(getUpcomingBookings).takeWhile(() => this.isAlive).subscribe((bookings) => {
      this.upcomingReservations = bookings;
      if (this.currentFilter.slug === 'upcoming_bookings') {
        this.currentPage = -1;
        this.refreshData();
      }
    });

    const reservationsCombined = Observable.merge(
      this.store.select(getIsUpcomingBookingLoading),
      this.store.select(getIsUpcomingBookingLoaded),
      this.store.select(getUpcomingBookings),
      ((loading, loaded, bookings) => {
      })
    );

    reservationsCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.upcomingLoading && !this.upcomingLoaded) {
          this.service.getUpcomingBookings(this.upcomingCurrentPage + 1).subscribe();
        }
      }
    );
  }

  private setupOngoingReservations() {
    this.store.select(getIsOngoingBookingLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.ongoingLoading = loading;
    });

    this.store.select(getIsOngoingBookingLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.ongoingLoaded = loaded;
    });

    this.store.select(getOngoingCurrentPage).takeWhile(() => this.isAlive).subscribe((currentPage) => {
      this.ongoingCurrentPage = currentPage;
    });

    this.store.select(getOngoingTotalPage).takeWhile(() => this.isAlive).subscribe((totalPage) => {
      this.ongoingTotalPage = totalPage;
    });

    this.store.select(getOngoingTotalCount).takeWhile(() => this.isAlive).subscribe((count) => {
      this.ongoingCount = count;
    });

    this.store.select(getOngoingBookings).takeWhile(() => this.isAlive).subscribe((bookings) => {
      this.ongoingReservations = bookings;
      if (this.currentFilter.slug === 'ongoing_bookings') {
        this.currentPage = -1;
        this.refreshData();
      }
    });

    const reservationsCombined = Observable.merge(
      this.store.select(getIsOngoingBookingLoading),
      this.store.select(getIsOngoingBookingLoaded),
      this.store.select(getOngoingBookings),
      ((loading, loaded, bookings) => {
      })
    );

    reservationsCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.ongoingLoading && !this.ongoingLoaded) {
          this.service.getOngoingBookings(this.ongoingCurrentPage + 1).subscribe();
        }
      }
    );
  }

  private setupPastReservations() {
    this.store.select(getIsPastBookingLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.pastLoading = loading;
    });

    this.store.select(getIsPastBookingLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.pastLoaded = loaded;
    });

    this.store.select(getPastCurrentPage).takeWhile(() => this.isAlive).subscribe((currentPage) => {
      this.pastCurrentPage = currentPage;
    });

    this.store.select(getPastTotalPage).takeWhile(() => this.isAlive).subscribe((totalPage) => {
      this.pastTotalPage = totalPage;
    });

    this.store.select(getPastTotalCount).takeWhile(() => this.isAlive).subscribe((count) => {
      this.pastCount = count;
    });

    this.store.select(getPastBookings).takeWhile(() => this.isAlive).subscribe((bookings) => {
      this.pastReservations = bookings;
      if (this.currentFilter.slug === 'past_bookings') {
        this.currentPage = -1;
        this.refreshData();
      }
    });

    const reservationsCombined = Observable.merge(
      this.store.select(getIsPastBookingLoading),
      this.store.select(getIsPastBookingLoaded),
      this.store.select(getPastBookings),
      ((loading, loaded, bookings) => {
      })
    );

    reservationsCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.pastLoading && !this.pastLoaded) {
          this.service.getPastBookings(this.pastCurrentPage + 1).subscribe();
        }
      }
    );
  }

  tooltipText(reservation: Booking) {
    const startDate = getDateObj(reservation.start);
    const endDate = getDateObj(reservation.end);
    const currentDate = getDateObj();

    if (startDate > currentDate) {
      return 'Guests cannot check-in before check-in date';
    } else if (endDate < currentDate) {
      return 'Guests cannot check-in after reservation has ended';
    }

    if (reservation.payment_method === 'from_platform' && reservation.total_paid == 0) {
      return 'Waiting For Payment';
    }
    return '';
  }

  itemsPerPageChanged() {
    this.currentPage = -1;
    this.onNext();
  }

  getListing(id: number) {
    return this.listings.find(listing => listing.id === id);
  }

  onCheckedStateChange($event, reservation) {
    this.isCheckingIn[reservation.id] = true;
    this.service.updateBooking(reservation.id, null, {checked_in: $event.checked}).subscribe(() => {
      this.isCheckingIn[reservation.id] = false;
    });
  }


  canToggleCheckIn(reservation: Booking) {
    const date = getDateObj(reservation.start);
    const today = getDateObj();

    const isToday = date.toDateString() === today.toDateString();
    const isNotPaid = reservation.payment_method === 'from_platform' && reservation.total_paid === 0;

    return isToday && !isNotPaid;
  }

  createNewReservation() {
    this.dialogRef = this.dialog.open(CreateReservationPopupComponent);
    this.dialogRef.updateSize('100%');
  }

  showDetails(reservation) {
    this.dialogRef = this.dialog.open(ReservationDetailsMagnifyComponent);
    this.dialogRef.componentInstance.booking = reservation;
    this.dialogRef.componentInstance.listing = this.getListing(reservation.property_id);
    this.dialogRef.componentInstance.guest = Object.assign({}, new User(), reservation.guest.data);
    this.dialogRef.componentInstance.showDetails.subscribe(booking => {
      this.router.navigate(['/reservations/' + booking.id + '/financials']);
      this.dialogRef.close();
    });
    this.dialogRef.componentInstance.showListing.subscribe(listing => {
      this.router.navigate(['/listings/' + listing.id + '/details']);
      this.dialogRef.close();

    });
    this.dialogRef.updateSize('100%');
  }

  openReservationDetails(reservation: Booking) {
    this.router.navigate(['/reservations/' + reservation.id + '/financials']);
  }

  getSourceTitle(reservation) {
    return getSourceType(reservation.source).title;
  }

  onNext() {
    const reservationsLoadedCount = this.currentLoadedPage * 50;

    if ((this.currentPage + 2) * this.itemsPerPage > reservationsLoadedCount) {
      this.loadNextData();
      return;
    }

    console.log(this.currentPage);

    this.currentPage++;
    this.start = this.currentPage * this.itemsPerPage;
    this.end = this.itemsPerPage + this.start;

    this.isPrevDisabled = false;
    this.isNextDisabled = false;
    if (this.start === 0) {
      this.isPrevDisabled = true;
    }

    if (this.end >= this.currentTotalCount) {
      this.isNextDisabled = true;
      this.end = this.reservationsToShow.length;
    }
    this.total = this.currentTotalCount;

    this.reservations = this.reservationsToShow.slice(this.start, this.end);
  }

  onPrev() {
    this.currentPage--;

    this.start = this.currentPage * this.itemsPerPage;
    this.end = this.itemsPerPage + this.start;

    if (this.currentPage < 0) {
      return;
    }

    this.isPrevDisabled = false;
    this.isNextDisabled = false;

    if (this.currentPage === 0) {
      this.isPrevDisabled = true;
    }
    this.total = this.currentTotalCount;

    this.reservations = this.reservationsToShow.slice(this.start, this.end);
  }

  isCurrentlyLoading(): boolean {
    switch (this.currentFilter.slug) {
      case 'upcoming_bookings': {
        return this.upcomingLoading;
      }
      case 'ongoing_bookings': {
        return this.ongoingLoading;
      }
      case 'past_bookings': {
        return this.pastLoading;
      }
      case 'today_bookings': {
        return this.todayLoading;
      }
    }
  }
}

