import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Booking} from '../models/booking';
import {Listing} from '../models/listing';
import {Store} from '@ngrx/store';
import {getListingById, getUser, State} from '../reducers/index';
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {User} from "../models/user";
/**
 * Created by piyushkantm on 06/07/17.
 */

@Component({
  selector: 'sd-upcoming-booking-card',
  template: `
    <div class="dash-row">
      <div class="example-1 dash-card">
        <div class="wrapper" fxFlex="100%">
          <img mat-card-image style="width: auto;height: auto;display: block; max-width: 350px; object-fit: contain"
               src="{{ listing.getThumbnails()[0].medium_url  }}">
          <div class="date">
            <span class="day" *ngIf="user.is_admin">{{ booking.payout_amount | numberToCurrency }}</span>
            <span class="day" *ngIf="!user.is_admin">{{ booking.owners_revenue | numberToCurrency }}</span>

          </div>
          <div class="data">
            <div fxLayout="column" class="content dash-test-card">

              <p class="title"><b>{{ listing.title }}</b></p>
              <div style="margin-bottom:40px" fxLayout="row" fxLayoutAlign="space-between none" fxFlex="100%">

                <time class="date-as-calendar inline-flex size1_25x">
                  <span class="weekday">{{booking.start | date:'EEEE'}}</span>
                  <span class="day">{{booking.start | date:'d'}}</span>
                  <span class="month">{{booking.start | date:'MMMM' | trim: 3}} </span>
                  <span class="year">{{booking.start | date:'y'}} </span>
                </time>

                <div>
                  <mat-icon style="margin-top:135%;color:#5a6e81">fast_forward</mat-icon>
                </div>

                <time class="date-as-calendar inline-flex size1_25x">
                  <span class="weekday">{{booking.end | date:'EEEE'}}</span>
                  <span class="day">{{booking.end | date:'d'}}</span>
                  <span class="month">{{booking.end | date:'MMMM' | trim: 3}} </span>
                  <span class="year">{{booking.end | date:'y'}} </span>
                </time>

              </div>
              <p (click)="openBookingDetails()" style="color:#364f66;cursor:pointer" align="right"><b>know more</b></p>
              <div fxLayout="row" fxLayoutAlign="space-between">
                <strong>Guest name:</strong>
                <strong>{{booking.guest_full_name}}</strong>
              </div>
              
              <div fxLayout="row" fxLayoutAlign="space-between">
                <strong>No. of Guests:</strong>
                <strong>{{booking.number_of_guests}}</strong>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
/*Booking Card*/
.dash-row {
  max-width: 900px;
  margin: 50px auto 0;
}
.dash-card {
  float: left;
  width: 100%;
}
.dash-card .dash-menu-content {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
.dash-card .dash-menu-content::before, .dash-card .dash-menu-content::after {
  content: '';
  display: table;
}
.dash-card .dash-menu-content::after {
  clear: both;
}
.dash-card .dash-menu-content li {
  display: inline-block;
}
.dash-card .dash-menu-content a {
  color: #fff;
}
.dash-card .dash-menu-content span {
  position: absolute;
  left: 50%;
  top: 0;
  font-size: 10px;
  font-weight: 700;
  font-family: 'Open Sans';
  transform: translate(-50%, 0);
}
.dash-card .wrapper {
  background-color: #fff;
  min-height: 410px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.2);
}
.dash-card .wrapper:hover .data {
  transform: translateY(0);
}
.dash-card .data {
  position: absolute;
  bottom: 0;
  width: 100%;
  transform: translateY(calc(70px + 1em));
  transition: transform 0.3s;
}
.dash-card .data .content {
  padding: 1em;
  position: relative;
  z-index: 1;
}
.dash-card .author {
  font-size: 12px;
}
.dash-card .title {
  margin-top: 10px;
}
.dash-card .text {
  height: 70px;
  margin: 0;
}
.dash-card input[type='checkbox'] {
  display: none;
}
.dash-card input[type='checkbox']:checked + .menu-content {
  transform: translateY(-60px);
}
.example-1 .date {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #77d7b9;
  color: #fff;
  padding: 0.8em;
}
.example-1 .date span {
  display: block;
  text-align: center;
}
.example-1 .date .day {
  font-weight: 700;
  font-size: 24px;
  text-shadow: 2px 3px 2px rgba(0, 0, 0, 0.18);
}
.example-1 .date .month {
  text-transform: uppercase;
}
.example-1 .date .month, .example-1 .date .year {
  font-size: 12px;
}
.example-1 .content {
  background-color: #fff;
  box-shadow: 0 5px 30px 10px rgba(0, 0, 0, 0.3);
}
.example-1 .title a {
  color: #808080;
}

/*Calendar Badge*/
.date-as-calendar {
  font-variant: normal;
  font-style: normal;
  font-weight: normal;
  font-family: "Helvetica", "Arial", sans-serif;
  vertical-align: top;
  color: black;
  background: white;
  background : linear-gradient(to bottom right, #FFF 0%, #EEE 100%);
  border: 1px solid #888;
  border-radius: 3px;
  overflow: hidden;
  box-shadow: 2px 2px 2px -2px black;
}
.date-as-calendar .weekday,
.date-as-calendar .day,
.date-as-calendar .month,
.date-as-calendar .year {
  text-align: center;
  line-height: 1.0;
}
.date-as-calendar .month {
  font-family: "Oswald", sans-serif;
  text-transform: uppercase;
  background: #13304b;
  background : linear-gradient(to bottom right, #13304b 0%, #5a6e81 100%);
  color: white;
}
.position-em.date-as-calendar {
  display: inline-block;
  position: relative;  
  width: 4em; 
  height: 4em; 
}
.position-em.date-as-calendar .weekday,
.position-em.date-as-calendar .day,
.position-em.date-as-calendar .month,
.position-em.date-as-calendar .year {
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: 1em;
}
.position-em.date-as-calendar .month {
  top: 0px;
  font-size: 0.75em;
  padding: 0.1em 0;
}
.position-em.date-as-calendar .weekday {
  top: 1.6em;
  font-size: 0.6125em;
}
.position-em.date-as-calendar .day {
  top: 1.1em;
  font-size: 1.5em
}
.position-em.date-as-calendar .year {
  bottom: 0px;
  font-size: 0.87750em;
}
/* Layout rules using display: inline-flex and relative dimensions using em. */
.inline-flex.date-as-calendar {
  display: inline-flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;  
  width: 4em; 
  height: 4em; 
}
.inline-flex.date-as-calendar .weekday,
.inline-flex.date-as-calendar .day,
.inline-flex.date-as-calendar .month,
.inline-flex.date-as-calendar .year {
  display: block;
  flex: 1 1 auto;
}
.inline-flex.date-as-calendar .month {
  order: 1;
  font-size: 0.75em;
  padding: 0.1em 0;
}
.inline-flex.date-as-calendar .weekday {
  order: 2;
  font-size: 0.6125em;
}
.inline-flex.date-as-calendar .day {
  order: 3;
  font-size: 1.5em;
}
.inline-flex.date-as-calendar .year {
  order: 4;
  font-size: 0.87750em;
}
/* Multiple sizes. */
.date-as-calendar.size0_5x {
  font-size: 8px;
}
.date-as-calendar.size0_75x {
  font-size: 12px;
}
.date-as-calendar.size1x {
  font-size: 16px;
}
.date-as-calendar.size1_25x {
  font-size: 20px;
}
.date-as-calendar.size1_5x {
  font-size: 24px;
}
.date-as-calendar.size1_75x {
  font-size: 28px;
}
.date-as-calendar.size2x {
  font-size: 32px;
}
.date-as-calendar.size3x {
  font-size: 48px;
}

  `]
})
export class UpcomingBookingCardComponent implements OnInit,OnDestroy {


  @Input() booking: Booking;
  listing: Listing;
  private isAlive:boolean = true;
  user:User;

  constructor(private store: Store<State>,private router:Router) {
  }

  ngOnInit(): void {
    console.log('onInit sd-upcoming-booking-card');
   this.store.select((state) => {
      return getListingById(state, this.booking.property_id);
    }).takeWhile(()=>this.isAlive).subscribe((listing) => {
      this.listing = listing;
    });

    this.store.select(getUser).takeWhile(() => this.isAlive).subscribe((user) => {
      this.user = user;
    });


  }

  openBookingDetails()
  {
    this.router.navigate(['/reservations/' + this.booking.id + '/financials']);

  }
  ngOnDestroy(): void {
    this.isAlive = false;
  }

}
