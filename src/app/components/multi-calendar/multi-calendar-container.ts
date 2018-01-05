import {Component, OnDestroy, OnInit,} from '@angular/core';

import {Store} from '@ngrx/store';
import {
  State, getListings, getIsMultiCalendarLoading, getIsMultiCalendarLoaded, getMultiCalendarByMonth,
  getIsLocationsLoading, getLocations, getIsLocationsLoaded, getIsTagsLoading, getTags, getIsTagsLoaded
} from '../../reducers/index';
import {Listing} from '../../models/listing';
import {CreateProspectPopupComponent} from './create-prospect-popup';
import {MatDialog, MatDialogRef} from '@angular/material';
import {NewReservationPopupComponent} from './new-reservation-popup';
import {Observable} from 'rxjs/Observable';
import {StayDuvetService} from '../../services/stayduvet';
import {MultiCalendar} from '../../models/multi-calendar';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {months} from '../../utils/constants';
import ObjectUtils from '../../utils/object';
import ArrayUtils from '../../utils/array';
import DateUtils from '../../utils/date';
import {getDateObj} from "../calendar/calendar-utils";

@Component({
  selector: 'sd-multi-calendar-container',
  template: `

    <sd-owner-main-layout>
      <div *ngIf="calendarLoading" fxLayout="column" id="spinner" fxLayoutAlign="center center" fxFlex="100%">
        <mat-spinner [color]="'accent'" [diameter]="60" [strokeWidth]="5"></mat-spinner>
      </div>
      <div *ngIf="calendarLoaded" fxLayout="column" class="requiredHeight" fxFlex="100%"
           fxLayoutAlign="center stretch" fxLayoutGap="20px"
           class="main-container">
        <span style="font-size: 25px; font-weight: bolder">Multi Calendar</span>
        <form fxLayout="row" fxLayoutAlign="start start" [formGroup]="formGroup" fxLayoutGap="20px">
          <mat-form-field dividerColor="accent" fxFlex="120px">
            <input matInput [matDatepicker]="checkin"
                   [min]="minStartDate"
                   placeholder="Check in"
                   formControlName="start_date">
            <mat-datepicker-toggle matSuffix [for]="checkin"></mat-datepicker-toggle>
            <mat-datepicker #checkin></mat-datepicker>
          </mat-form-field>

          <mat-form-field dividerColor="accent" fxFlex="120px">

            <input matInput [matDatepicker]="checkout"
                   [min]="minEndDate"
                   placeholder="Check out"
                   formControlName="end_date">
            <mat-datepicker-toggle matSuffix [for]="checkout"></mat-datepicker-toggle>
            <mat-datepicker #checkout></mat-datepicker>
          </mat-form-field>

          <mat-form-field dividerColor="accent" fxFlex="130px">
            <input formControlName='no_of_guests' matInput type="number" min="1"
                   placeholder="No. of guests?">
            <mat-error> Required</mat-error>
          </mat-form-field>

          <mat-form-field dividerColor="accent" fxFlex="130px">
            <input formControlName='no_of_pets' matInput type="number" min="0"
                   placeholder="No. of pets?">
            <mat-error> Required</mat-error>
          </mat-form-field>
          <button mat-icon-button type="button" color="accent" fxFlexAlign="center" (click)="formGroup.reset({no_of_pets: 0})">
            <mat-icon>close</mat-icon>
          </button>
          <span fxFlex="1 1 auto"></span>
          <button
            [disabled]="selectedListings.length === 0"
            (click)="formGroup.valid && openCreateProspectPopup(); formGroup.markAsTouched()"
            style="height: 50px !important;" mat-raised-button
            type="submit"
            color="primary" color="accent">Create Prospect
          </button>
          <button
            [disabled]="selectedListings.length !== 1"
            (click)="formGroup.valid && openNewReservationPopup(); formGroup.markAsTouched()"
            style="height: 50px !important;"
            type="submit"
            mat-raised-button
            color="primary" color="accent">New Reservation
          </button>
        </form>

        <hr>

        <sd-sticky-container
          [sticky-offset-top]="78"
          [sticky-start]="78"
          style="margin-top: 10px; background-color: rgba(249, 249, 249, 1);">
          <div fxLayout="column"
               style="width: 100%"
               class="calendar-header"
               fxLayoutAlign="center center"
               fxLayoutGap="2px">
            <div fxFlexAlign="end" fxLayout="row"  fxLayoutGap="10px">
              <mat-form-field fxFlex="35%">
                <mat-select
                  multiple
                  [(ngModel)]="selectedLocationFilter"
                  color="accent"
                  placeholder="Filter City"
                  (ngModelChange)="updateFilteredListings()"
                  [ngModelOptions]="{standalone: true}">
                  <div fxLayout="column">
                    <button class="select-button" mat-button (click)="onSelectAll()">Select All</button>
                    <button class="select-button" mat-button (click)="onSelectNone()">Select None</button>
                  </div>
                  <mat-option *ngFor="let location of locations" [value]="location">
                    {{ location }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
              
              <mat-form-field fxFlex="45%">
                <mat-select
                  [(ngModel)]="selectedTagFilter"
                  color="accent"
                  placeholder="Filter By Tag"
                  (ngModelChange)="updateFilteredListings()"
                  [ngModelOptions]="{standalone: true}">
                  <mat-option value="show_all">
                    Show All
                  </mat-option>
                  <mat-option *ngFor="let tag of tags" [value]="tag">
                    {{ tag }}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <div fxLayout="row" fxLayoutAlign="end none" >
                <div>
                  <button mat-raised-button color="accent" [matMenuTriggerFor]="sortMenu" class="my-menu">
                    Sort By: {{selectedSortingBy.title}}
                    <mat-icon>{{ selectedSortingBy.order === 'asc' ? 'arrow_drop_down' : 'arrow_drop_up' }}
                    </mat-icon>
                  </button>
                </div>
              </div>
              <mat-menu #sortMenu="matMenu">
                <button mat-menu-item color="accent" *ngFor="let item of sortingByTypes"
                        (click)="selectedSortByChanged(item)">
                  {{item.title}}
                  <mat-icon>{{ item.order === 'asc' ? 'arrow_drop_down' : 'arrow_drop_up' }}</mat-icon>
                </button>
              </mat-menu>
            </div>

            <div fxlayout="row"
                 style="width: 100%;margin-bottom: 20px;"
                 fxLayoutAlign="space-between"
                 fxLayoutGap="10px">
              <button color="accent"
                      mat-button
                      style="width: 200px !important;"
                      matTooltip="Previous Date"
                      [matTooltipPosition]="'above'"
                      (click)="previousDates()"
                      [disabled]="startDateToShow <= 1">
                <mat-icon>keyboard_backspace</mat-icon>
                Previous
              </button>

              <div fxFlex="40%" fxLayoutAlign="center center" fxLayoutGap="10px">
                  <mat-select
                    style="width: 200px !important;"
                    [(ngModel)]="currentMonth"
                    (ngModelChange)="updateCalendarData()"
                    color="accent">
                    <mat-option *ngFor="let month of months" [value]="month.id">
                      {{month.title}}
                    </mat-option>
                  </mat-select>
                  <mat-select
                    style="width: 200px !important;"
                    [(ngModel)]="currentYear"
                    (ngModelChange)="updateCalendarData()"
                    color="accent">
                    <mat-option *ngFor="let year of years" [value]="year">
                      {{year}}
                    </mat-option>
                  </mat-select>
              </div>

              <button color="accent"
                      mat-button
                      style="width: 130px !important;"
                      matTooltip="Next Date"
                      [matTooltipPosition]="'above'"
                      (click)="nextDates()"
                      [disabled]="endDateToShow >= daysInCurrentMonth">
                <b>Next</b>
                <mat-icon>trending_flat</mat-icon>
              </button>
            </div>
          </div>

          <div div fxLayout="column" *ngIf="calendarLoaded">
            <mat-grid-list cols="26">
              <mat-grid-tile [colspan]="8"></mat-grid-tile>
              <mat-grid-tile
                *ngFor="let iterator of currentDatesOnDisplay"
                [colspan]="1"
                [ngClass]="{'today-cell': iterator.getDate() === today.getDate() && iterator.getMonth() === today.getMonth() && iterator.getFullYear() === today.getFullYear()}">
                <p align="center" style="font-size: 12px;color:#007a99;">
                  <b>{{ iterator | date:'dd'}}</b><br>{{ iterator | date:'EEE'}}
                </p>
              </mat-grid-tile>
            </mat-grid-list>
          </div>

          <div fxLayout="row" *ngIf="filteredListings.length > 0" fxLayoutAlign="end center">

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
                
            <span style="font-size:xx-small; font-style:bolder;">{{start + 1}} - {{end}} of {{total}}</span>
            <button mat-button [disabled]="isPrevDisabled" (click)="onPrev()">
              <mat-icon>navigate_before</mat-icon>
              Prev
            </button>
            <button mat-button [disabled]="isNextDisabled" (click)="onNext(false)">Next
              <mat-icon>navigate_next</mat-icon>
            </button>
          </div>

        </sd-sticky-container>


        <div fxLayout="column" *ngIf="calendarLoaded">

          <div *ngFor="let listing of filteredListings">
            <sd-multi-calendar
              [listing]="listing"
              [bookings]="calendarData[listing.id].bookings"
              [startDate]="startDateToShow"
              [endDate]="endDateToShow"
              [blocks]="calendarData[listing.id].blocks"
              [daysInMonth]="daysInCurrentMonth"
              [checked]="ArrayUtils.contains(selectedListings, listing)"
              (onSelectChanged)="onselectChanged($event)">
            </sd-multi-calendar>
          </div>

          <div style="padding-top:20px"></div>
        </div>

      </div>
    </sd-owner-main-layout>
  `,
  styles: [`

    #qwer {
      max-height: 50px !important;
    }

    #spinner {
      position: fixed;
      top: 45%;
      right: 40%
    }

    .select-button {
      padding: 6px;
      text-align: left;
      font-size: 17px;
      padding-left: 10px;
      font-weight: bolder;
      background-color: yello;
    }

    hr {
      display: block;
      height: 1px;
      border: 0;
      border-top: 1px solid #ccc;
      margin: 1em 0;
      padding: 0;
    }

    #dropdown {
      color: #00a3cc;
      cursor: pointer;
      font-size: 18px;
      margin-top: 10px;
      font-weight: bolder;

    }

    .main-container {
      margin: 30px;
      margin-top: 90px;
    }

    .today-cell {
      background-color: #f0a340;
    }
  `]
})
export class MultiCalendarContainerComponent implements OnInit, OnDestroy {

  private dialogRef: MatDialogRef<any>;
  private isAlive: boolean = true;

  listings: Listing[] = [];
  filteredListings: Listing[] = [];
  rawListings: Listing[] = [];


  locations: string[] = [];
  selectedLocationFilter: string[];

  tags = [];
  selectedTagFilter = 'show_all';
  tagsLoading = false;
  tagsLoaded = false;


  isPrevDisabled: boolean = true;
  isNextDisabled: boolean = false;

  itemsPerPage = 5;
  currentPage: number = -1;

  start: number = 0;
  end: number = 0;
  total: number;

  sortingByTypes = [
    {
      title: 'Title Asc.',
      slug: 'title_asc',
      order: 'asc',
      param: 'title'
    },
    {
      title: 'Title Dsc.',
      slug: 'title_dsc',
      order: 'dsc',
      param: 'title'
    },
    {
      title: 'City Asc.',
      slug: 'city_asc',
      order: 'asc',
      param: 'city'
    },
    {
      title: 'City Dsc.',
      slug: 'city_dsc',
      order: 'dsc',
      param: 'city'
    }
  ];
  selectedSortingBy = this.sortingByTypes[0];

  formGroup: FormGroup;
  startDate: FormControl;
  endDate: FormControl;
  guests: FormControl;
  pets: FormControl;

  minStartDate: Date;
  minEndDate: Date;

  selectedListings: Listing[] = [];

  calendarLoading = true;
  calendarLoaded = false;
  calendarData: MultiCalendar;

  calendarWidth = 18;
  startDateToShow = 1;
  endDateToShow = this.calendarWidth;
  currentDatesOnDisplay: Date[];

  daysInCurrentMonth: number;
  today;
  currentMonth;
  currentYear;
  months = months;
  ArrayUtils = ArrayUtils;
  years = [2017, 2018];

  constructor(private store: Store<State>,
              private dialog: MatDialog,
              private service: StayDuvetService) {
    const currentDate = getDateObj();
    this.currentMonth = currentDate.getMonth() + 1;
    this.currentYear = currentDate.getFullYear();
    this.today = currentDate;

    this.updateCalendarData();

    this.minStartDate = getDateObj();
    this.minEndDate = getDateObj();
    this.minEndDate.setDate(this.minEndDate.getDate() + 1);

    this.startDate = new FormControl(this.minStartDate, [Validators.required]);
    this.endDate = new FormControl(null, [Validators.required]);
    this.guests = new FormControl(null, [Validators.required]);
    this.pets = new FormControl(null, [Validators.required]);

    this.formGroup = new FormGroup({
      start_date: this.startDate,
      end_date: this.endDate,
      no_of_guests: this.guests,
      no_of_pets: this.pets,
    });

    this.pets.setValue(0);

    this.startDate.valueChanges.takeWhile(() => this.isAlive).subscribe((value) => {
      if (this.startDate.valid) {
        if (this.endDate.invalid || DateUtils.daysBetweenDates(value, this.endDate.value) <= 0) {
          this.endDate.setValue(DateUtils.addDays(value, 1));
        }

        this.minEndDate = DateUtils.addDays(value, 1);
      }
    });

    this.formGroup.valueChanges.takeWhile(() => this.isAlive).subscribe(() => {
      this.updateFilteredListings();
    });
  }

  ngOnInit(): void {
    console.log('onInit sd-calendar');
    this.setUpTags();
    this.setUpLocations();
    this.store.select(getListings).takeWhile(() => this.isAlive).subscribe((listings) => {
      this.listings = listings;
      this.updateFilteredListings();

    });
  }


  openCreateProspectPopup() {
    this.dialogRef = this.dialog.open(CreateProspectPopupComponent);
    const instance = this.dialogRef.componentInstance;
    instance.checkedListings = this.selectedListings;
    instance.noOfGuests = this.guests.value;
    instance.checkInDate = this.startDate.value;
    instance.checkOutDate = this.endDate.value;
    instance.numberOfDays = DateUtils.daysBetweenDates(this.startDate.value, this.endDate.value);
    this.dialogRef.updateSize('100%', '100%');
  }

  openNewReservationPopup() {
    const data = {
      listing: this.selectedListings[0],
      check_in: this.startDate.value,
      check_out: this.endDate.value,
      guest_count: this.guests.value,
      pet_count: this.pets.value
    };
    this.dialogRef = this.dialog.open(NewReservationPopupComponent, {
      data: data
    });
    this.dialogRef.updateSize('100%', '100%');
  }

  nextDates() {
    this.startDateToShow = this.startDateToShow + 1;
    this.endDateToShow = this.endDateToShow + 1;

    this.updateCalendar();
  }

  previousDates() {
    this.startDateToShow = this.startDateToShow - 1;
    this.endDateToShow = this.endDateToShow - 1;

    this.updateCalendar();
  }

  resetDates() {
    const isCurrentMonth = this.currentMonth === (this.today.getMonth() + 1);

    if (isCurrentMonth && this.today.getDate() >= this.calendarWidth) {
      this.startDateToShow = this.daysInCurrentMonth - this.calendarWidth + 1;
      this.endDateToShow = this.daysInCurrentMonth;
    } else {
      this.startDateToShow = 1;
      this.endDateToShow = this.calendarWidth;
    }

    this.updateCalendar();
  }

  // Update Calendar's view because change of date
  updateCalendar() {
    const currentDatesOnDisplay = [];
    for (let _i = this.startDateToShow; _i <= this.endDateToShow; _i++) {
      const date = new Date(this.currentYear, this.currentMonth - 1, _i);
      currentDatesOnDisplay.push(date);
    }

    this.currentDatesOnDisplay = currentDatesOnDisplay;
  }

  // Update Calendar's view because change of month/year
  updateCalendarData() {
    this.daysInCurrentMonth = DateUtils.daysInMonth(this.currentMonth, this.currentYear);

    this.store.select((state) => {
      return getIsMultiCalendarLoading(state, this.currentMonth, this.currentYear);
    }).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.calendarLoading = loading;
    });

    this.store.select((state) => {
      return getIsMultiCalendarLoaded(state, this.currentMonth, this.currentYear);
    }).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.calendarLoaded = loading;
    });

    this.store.select((state) => {
      return getMultiCalendarByMonth(state, this.currentMonth, this.currentYear);
    }).takeWhile(() => this.isAlive).subscribe((multiCalendarData) => {
      if (multiCalendarData) {
        this.calendarData = multiCalendarData;
        this.resetDates();
      }
    });


    const combinedObservers = Observable.merge(
      this.store.select((state) => {
        return getIsMultiCalendarLoading(state, this.currentMonth, this.currentYear);
      }),
      this.store.select((state) => {
        return getIsMultiCalendarLoaded(state, this.currentMonth, this.currentYear);
      }),
      this.store.select((state) => {
        return getMultiCalendarByMonth(state, this.currentMonth, this.currentYear);
      }),
      ((loading, loaded, threads) => {
      })
    );

    combinedObservers.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.calendarLoading && !this.calendarLoaded) {
          this.service.getMultiCalendar({month: this.currentMonth, year: this.currentYear}).subscribe();
        }
      }
    );

    this.updateCalendar();
  }

  updateFilteredListings() {
    this.currentPage = -1;
    this.onNext(true, true);

  }

  selectedSortByChanged(order) {
    this.selectedSortingBy = order;
    this.currentPage = -1;
    this.onNext(false, true);
  }

  sortListings() {

    this.rawListings = ObjectUtils.sortByKey(this.rawListings, this.selectedSortingBy.param, this.selectedSortingBy.order);
  }


  private setUpLocations() {

    this.store.select(getLocations).combineLatest(this.store.select(getIsLocationsLoading), this.store.select(getIsLocationsLoaded),
      (locations, loading, loaded) => {
        return {locations, loading, loaded};
      }).takeWhile(() => this.isAlive).subscribe((data) => {
      if (!data.loaded && !data.loading) {
        this.service.getListingLocations().subscribe();
      } else if (data.loaded) {
        this.locations = data.locations;
        if (!this.selectedLocationFilter) {
          this.selectedLocationFilter = this.locations;
        }
      }
    });
  }

  private setUpTags() {

    this.store.select(getIsTagsLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.tagsLoading = loading;
    });
    this.store.select(getIsTagsLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.tagsLoaded = loaded;
    });
    this.store.select(getTags).takeWhile(() => this.isAlive).subscribe((tags) => {
      this.tags = tags;
    });

    const combinedObservable = Observable.merge(
      this.store.select(getIsTagsLoading),
      this.store.select(getIsTagsLoaded),
      this.store.select(getTags),
      ((tags, loading, loaded) => {
      })
    );

    combinedObservable.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.tagsLoaded && !this.tagsLoading) {
          this.service.getTags().subscribe();
        }
      });
  }

  onSelectAll() {

    this.selectedLocationFilter = this.locations;
    this.updateFilteredListings();
  }

  onSelectNone() {
    this.selectedLocationFilter = [];
    this.updateFilteredListings();
  }


  onselectChanged(data) {
    if (data.checked) {
      this.selectedListings.push(data.listing);
    }
    else {
      this.selectedListings = this.selectedListings.filter(listing => listing.id !== data.listing.id);
    }
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  itemsPerPageChanged() {
    this.currentPage = -1;
    this.onNext(false, false);
  }

  onNext(filterListings: boolean, sortListings: boolean) {
    this.currentPage++;
    this.start = this.currentPage * this.itemsPerPage;
    this.end = this.itemsPerPage + this.start;

    if (filterListings) {
      this.processListings();
    }

    if (sortListings) {
      this.sortListings();
    }


    this.isPrevDisabled = false;
    this.isNextDisabled = false;
    if (this.start == 0) {
      this.isPrevDisabled = true;
    }
    if (this.end >= this.rawListings.length) {
      this.isNextDisabled = true;
      this.end = this.rawListings.length;
    }
    this.total = this.rawListings.length;
    this.filteredListings = this.rawListings.slice(this.start, this.end);
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

    if (this.currentPage == 0) {
      this.isPrevDisabled = true;
    }
    this.total = this.rawListings.length;
    this.filteredListings = this.rawListings.slice(this.start, this.end);
  }

  processListings() {
    this.rawListings = this.listings;
    this.selectedListings = [];

    if (this.startDate.valid && this.endDate.valid) {
      const bookingNights = DateUtils.daysBetweenDates(this.startDate.value, this.endDate.value);

      this.rawListings = this.rawListings.filter(listing => {
        console.log(listing);
        if (bookingNights < listing.min_nights || bookingNights > listing.max_nights) {
          return false;
        }

        const bookings = this.calendarData[listing.id].bookings;
        const blocks = this.calendarData[listing.id].blocks;

        for (const booking of bookings) {
          const bookingStart = getDateObj(booking.start);
          const bookingEnd = getDateObj(booking.end);
          if (DateUtils.daysBetweenDates(this.startDate.value, bookingEnd) > 0
            && DateUtils.daysBetweenDates(bookingStart, this.endDate.value) > 0) {
            console.log('came$$');
            return false;
          }
        }

        for (const block of blocks) {
          const date = getDateObj(block.date);
          if (DateUtils.daysBetweenDates(this.startDate.value, date) > 0 && DateUtils.daysBetweenDates(date, this.endDate.value) > 0) {
            return false;
          }
        }

        return true;
      });
    }

    if (this.guests.valid) {
      this.rawListings = this.rawListings.filter(listing => this.guests.value < listing.maximum_guest_number);
    }

    if (this.selectedLocationFilter) {
      this.rawListings = this.rawListings.filter(listing =>
        this.selectedLocationFilter.includes(listing.city)
      );
    }

    if (this.selectedTagFilter !== 'show_all') {
      this.rawListings = this.rawListings.filter(listing => {
        const tags = listing.getTags().map(tag => tag.title);
        return tags.includes(this.selectedTagFilter);
      });
    }

  }


}

