/**
 * Created by Piyush on 22-Jul-17.
 */
import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {
  addMonthToSDDate, DEFAULT_WEEKEND_DAYS, getDateObj, getFirstDayOfMonth, getMonthCalendar, getWeekViewHeader,
  SDDay
} from './calendar-utils';
import {StayDuvetService} from '../../services/stayduvet';
import {Listing} from '../../models/listing';
import {Store} from '@ngrx/store';
import {
  getCalendarData, getIsCalendarDataLoaded, getIsCalendarDataLoading, getListingById,
  State
} from '../../reducers/index';
import * as addDays from 'date-fns/add_days';
import {Observable} from 'rxjs/Observable';
import {getSourceType} from "../../utils";
import {Booking} from "../../models/booking";
import DateUtils from '../../utils/date';

@Component({
  selector: 'sd-calendar',
  template: `
    <div fxlayout="row"
         style="width: 100%;margin-bottom: 20px;"
         fxLayoutAlign="space-around center"
         fxLayoutGap="10px">
      <a mat-button (click)="previousMonth()" color="accent">
        <mat-icon>keyboard_backspace</mat-icon>
        Previous Month</a>
      <span style="font-weight: bolder;font-size:20px;">{{ currentMonth.date | date:'MMMM, y' }}</span>
      <a mat-button (click)="nextMonth()" color="accent">Next Month
        <mat-icon>trending_flat</mat-icon>
      </a>
    </div>
    <mat-grid-list cols="7" rowHeight="40px">
      <mat-grid-tile
        *ngFor="let weekDay of weekDays"
        class="header">
        {{ weekDay.date | date:'EEEE' }}
      </mat-grid-tile>
    </mat-grid-list>
    <div fxlayout="row" fxLayoutAlign="center center" *ngIf="isLoading">
      <mat-spinner [color]="'accent'" [diameter]="60" [strokeWidth]="5"></mat-spinner>
    </div>
    <mat-grid-list cols="7" rowHeight="150px;" style="margin-bottom: 20px;" *ngIf="isLoaded">
      <mat-grid-tile
        *ngFor="let day of currentCalendar"
        class="date-cell"
        [ngClass]="{
         'same-month': day.inMonth, 
         'different-month': !day.inMonth,
         'past-days': day.inMonth && day.isPast,
         'pointer': (getStatus(day) === 'none' || getStatus(day) === 'block') && !day.isPast,
         'not-allowed': (getStatus(day) === 'none' || getStatus(day) === 'block') && day.isPast
         }">
        <sd-calendar-date-tile
          [amount]="getPrice(day)"
          [status]="getStatus(day)"
          [reason]="getReason(day)"
          [firstBooking]="getFirstBooking(day)"
          [day]="day"
          [color]="getColor(day)"
          [secondBooking]="getSecondBooking(day)"
          [listingId]="listingId"
          style="width:100%"></sd-calendar-date-tile>
      </mat-grid-tile>
    </mat-grid-list>
  `,
  styles: [`
    .header:hover {
      background-color: #e1e1e1;
    }

    .header {
      background-color: #ededed;
    }

    .date-cell {
      border: 1px solid #e1e1e1;
    }

    .same-month {
      color: black;
      font-weight: bolder;
    }

    .same-month:hover {
      background-color: lightgrey;
    }

    .pointer {
      cursor: pointer;
    }

    .not-allowed {
      cursor: not-allowed;
    }

    .different-month {
      color: black;
      opacity: 0.4;
      filter: alpha(opacity=40);
    }

    .past-days {
      color: black;
      opacity: 0.6;
      filter: alpha(opacity=60);
    }


  `]
})
export class CalendarComponent implements OnInit, OnDestroy, OnChanges {

  @Input() listingId: number;
  listing;
  private isAlive = true;

  isLoading = false;
  isLoaded = false;
  events: any[] = [];
  dayKeys: { [date: string]: string } = {};
  colorKeys: { [date: string]: string } = {};
  priceKeys: { [date: string]: number } = {};
  reasonKeys: { [date: string]: string } = {};
  firstBookingKeys: { [date: string]: Booking } = {};
  secondBookingKeys: { [date: string]: Booking } = {};


  weekDays: SDDay[];
  currentCalendar: SDDay[];

  currentMonth: SDDay;

  constructor(private service: StayDuvetService,
              private store: Store<State>) {
    this.weekDays = getWeekViewHeader();
    this.currentMonth = getFirstDayOfMonth();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.store.select((state) => {
      return getListingById(state, this.listingId);
    }).takeWhile(() => this.isAlive).subscribe((listing) => {
      this.listing = listing;
    });

    this.refreshCalendar();
  }

  ngOnInit(): void {
    console.log('onInit sd-calendar');


  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  refreshCalendar() {
    this.currentCalendar = getMonthCalendar(this.currentMonth);

    const monthString = this.currentMonth.date.getFullYear() + '-' + ('0' + (this.currentMonth.date.getMonth() + 1)).slice(-2);

    this.store.select((state) => {
      return getIsCalendarDataLoading(state, this.listingId, monthString);
    }).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.isLoading = loading;
    });

    this.store.select((state) => {
      return getIsCalendarDataLoaded(state, this.listingId, monthString);
    }).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.isLoaded = loading;
    });

    this.store.select((state) => {
      return getCalendarData(state, this.listingId, monthString);
    }).takeWhile(() => this.isAlive).subscribe((calendarData) => {
      if (calendarData) {
        this.events = calendarData;
        this.renderEvents();
        this.renderPricing();
      }
    });


    const combinedObservers = Observable.merge(
      this.store.select((state) => {
        return getIsCalendarDataLoading(state, this.listingId, monthString);
      }),
      this.store.select((state) => {
        return getIsCalendarDataLoaded(state, this.listingId, monthString);
      }),
      this.store.select((state) => {
        return getCalendarData(state, this.listingId, monthString);
      }),
      ((loading, loaded, calendarData) => {
      })
    );

    combinedObservers.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.isLoading && !this.isLoaded) {
          this.service.getCalendar(this.listingId, {month: monthString}).subscribe();
        }
      }
    );
  }

  nextMonth() {
    this.currentMonth = addMonthToSDDate(this.currentMonth, 1);
    this.refreshCalendar();
  }

  previousMonth() {
    this.currentMonth = addMonthToSDDate(this.currentMonth, -1);
    this.refreshCalendar();
  }

  renderEvents() {
    const newEvents = {};
    const reasons = {};
    const firstBookings = {};
    const secondBookings = {};
    const color = {};


    this.events.forEach(event => {

      if (event.type === 'owner_block') {
        // Owners Block
        newEvents[event['start']] = 'block';
        reasons[event['start']] = event['reason'];
      } else {
        // Booking


        let currentDate = getDateObj(event['start']);
        const nights = +event['nights'];


        for (let _i = 0; _i <= nights; _i++) {
          const fullDate = ('0' + currentDate.getDate()).slice(-2);
          const fullMonth = ('0' + (currentDate.getMonth() + 1)).slice(-2);
          const fullYear = currentDate.getFullYear();

          const key = fullYear + '-' + fullMonth + '-' + fullDate;


          if (event.payment_method === 'from_platform' && event.total_paid === 0) {
            color[key] = '#f0a340';
          }


          if (firstBookings[key]) {
            secondBookings[key] = event;
          }
          else {
            firstBookings[key] = event;
          }

          if (_i === 0) {
            if (newEvents[key] === 'first_half') {
              newEvents[key] = 'both_half';

            } else {
              newEvents[key] = 'second_half';
            }
          } else if (_i === nights) {
            if (newEvents[key] === 'second_half') {
              newEvents[key] = 'both_half';

            } else {
              newEvents[key] = 'first_half';
            }
          } else {
            newEvents[key] = 'full_day';
          }

          currentDate = addDays(currentDate, 1);
        }
      }
    });

    this.dayKeys = newEvents;
    this.reasonKeys = reasons;
    this.firstBookingKeys = firstBookings;
    this.secondBookingKeys = secondBookings;
    this.colorKeys = color;
  }

  renderPricing() {
    const newPrices = {};

    let currentDate = this.currentCalendar[0].date;

    let weekendPrice = this.listing.base_price;
    if (this.listing.base_weekend_price) {
      weekendPrice = this.listing.base_weekend_price;
    }

    for (let _i = 1; _i <= this.currentCalendar.length; _i++) {
      const fullDate = ('0' + currentDate.getDate()).slice(-2);
      const fullMonth = ('0' + (currentDate.getMonth() + 1)).slice(-2);
      const fullYear = currentDate.getFullYear();

      const key = fullYear + '-' + fullMonth + '-' + fullDate;

      let price = 0;
      if (currentDate.getDay() === 0 || currentDate.getDay() === 5 || currentDate.getDay() === 6) {
        price = weekendPrice;
      } else {
        price = this.listing.base_price;
      }

      const diff = DateUtils.daysBetweenDates(new Date(), currentDate);

      if (diff >= 0) {
        if (diff <= 3) {
          price -= (price * this.listing.discount_for_last_3_days / 100);
        } else if (diff <= 7) {
          price -= (price * this.listing.discount_for_last_7_days / 100);
        } else if (diff <= 14) {
          price -= (price * this.listing.discount_for_last_14_days / 100);
        } else if (diff <= 21) {
          price -= (price * this.listing.discount_for_last_21_days / 100);
        } else if (diff <= 28) {
          price -= (price * this.listing.discount_for_last_28_days / 100);
        }
      }

      newPrices[key] = price;

      currentDate = addDays(currentDate, 1);
    }

    this.priceKeys = newPrices;
  }

  getColor(day: SDDay): string {
    const currentDate = day.date;
    const fullDate = ('0' + currentDate.getDate()).slice(-2);
    const fullMonth = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const fullYear = currentDate.getFullYear();

    const key = fullYear + '-' + fullMonth + '-' + fullDate;

    if (this.colorKeys[key]) {
      return this.colorKeys[key];
    } else {
      return 'red';
    }
  }

  getReason(day: SDDay): string {
    const currentDate = day.date;
    const fullDate = ('0' + currentDate.getDate()).slice(-2);
    const fullMonth = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const fullYear = currentDate.getFullYear();

    const key = fullYear + '-' + fullMonth + '-' + fullDate;

    if (this.reasonKeys[key]) {
      return this.reasonKeys[key];
    } else {
      return '';
    }
  }

  getFirstBooking(day: SDDay): any {
    const currentDate = day.date;
    const fullDate = ('0' + currentDate.getDate()).slice(-2);
    const fullMonth = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const fullYear = currentDate.getFullYear();

    const key = fullYear + '-' + fullMonth + '-' + fullDate;

    if (this.firstBookingKeys[key]) {
      return this.firstBookingKeys[key];
    } else {
      return null;
    }
  }

  getSecondBooking(day: SDDay): any {
    const currentDate = day.date;
    const fullDate = ('0' + currentDate.getDate()).slice(-2);
    const fullMonth = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const fullYear = currentDate.getFullYear();

    const key = fullYear + '-' + fullMonth + '-' + fullDate;

    if (this.secondBookingKeys[key]) {
      return this.secondBookingKeys[key];
    } else {
      return null;
    }
  }


  getStatus(day: SDDay): string {
    const currentDate = day.date;
    const fullDate = ('0' + currentDate.getDate()).slice(-2);
    const fullMonth = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const fullYear = currentDate.getFullYear();

    const key = fullYear + '-' + fullMonth + '-' + fullDate;

    if (this.dayKeys[key]) {
      return this.dayKeys[key];
    } else {
      return 'none';
    }
  }

  getPrice(day: SDDay): number {
    const currentDate = day.date;
    const fullDate = ('0' + currentDate.getDate()).slice(-2);
    const fullMonth = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const fullYear = currentDate.getFullYear();

    const key = fullYear + '-' + fullMonth + '-' + fullDate;

    return this.priceKeys[key];
  }
}
