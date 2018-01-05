/**
 * Created by Piyush on 22-Jul-17.
 */
import {Component, Input, OnInit} from '@angular/core';
import {getDateObj, SDDay} from './calendar-utils';
import * as addDays from 'date-fns/add_days';
import {StayDuvetService} from '../../services/stayduvet';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ListingOwnerBlockPopupComponent} from '../listing/popups/listing-owner-block-popup';
import {Booking} from "../../models/booking";
import {getSourceType} from "../../utils";
import {Router} from '@angular/router';
import {isNullOrUndefined} from 'util';


@ Component({
  selector: 'sd-calendar-date-tile',
  template: `
    <div fxLayout="column"
         *ngIf="!isBlocking"
         [ngClass]="{'owners-block': status === 'block', 'pointer': status === 'none'}"
         fxLayoutAlign="start start"
         [matTooltip]="(status === 'block' || status === 'none') && !day.isPast ? 'Click to alter Owner\\'s block!': ''"
         (click)="blockingEvent()"
         style="height: 150px">
      <!--date-->
      <div fxLayout="row" fxLayoutAlign="start center" fxFlexOffset="10%" fxFlex="30%" style="width:100%;">
        {{ day.date | date:'d' }}
      </div>

      <!--start of booking-->
      <div fxLayout="row"
           fxLayoutAlign="start center"
           fxFlex="33.33%"
           style="width: 100%"
           *ngIf="status === 'second_half'">
        <div fxLayout="column" fxLayoutAlign="center center" fxFlex="40%" style="height: 100%"></div>
        <div fxLayout="column" [matTooltipPosition]="'above'"
             [matTooltip]="firstBookingDetails"
             (click)="openFirstReservation()" class="second-half" fxFlex="60%"
             [ngStyle]="{'background': getBackground()}"
             style="height: 100%">
        </div>
      </div>

      <!--end of booking-->
      <div fxLayout="row"
           fxLayoutAlign="start center"
           fxFlex="33.33%"
           style="width: 100%"
           *ngIf="status === 'first_half'">
        <div fxLayout="column" [matTooltipPosition]="'above'"
             [matTooltip]="firstBookingDetails"
             (click)="openFirstReservation()" class="first-half" fxLayoutAlign="center center" fxFlex="40%"
             [ngStyle]="{'background': getBackground()}"
             style="height: 100%"></div>
        <div fxLayout="column" fxLayoutAlign="center center" fxFlex="60%" style="height: 100%">
        <span class="price-container">
          {{amount | numberToCurrency:'$'}}
        </span>
        </div>
      </div>

      <!--Both Half of booking-->
      <div fxLayout="row"
           fxLayoutAlign="start center"
           fxFlex="33.33%"
           fxLayoutGap="10%"
           style="width: 100%"
           *ngIf="status === 'both_half'">
        <div fxLayout="column" [matTooltipPosition]="'left'"
             [matTooltip]="firstBookingDetails"
             (click)="openFirstReservation()" class="first-half" fxLayoutAlign="center center" fxFlex="35%"
             [ngStyle]="{'background': getBackground()}"
             style="height: 100%"></div>
        <div fxLayout="column" [matTooltipPosition]="'right'"
             [matTooltip]="secondBookingDetails"
             (click)="openSecondReservation()" class="second-half" fxFlex="55%"
             [ngStyle]="{'background': getBackground()}"
             style="height: 100%">
        </div>
      </div>

      <!--full day of booking-->
      <div fxLayout="row"
           fxLayoutAlign="center center"
           fxFlex="33.33%"
           style="width: 100%"
           [matTooltipPosition]="'above'"
           [matTooltip]="bookingDetails"
           (click)="openReservation()"
           *ngIf="status === 'full_day'">
        <div [matTooltipPosition]="'above'"
             [matTooltip]="firstBookingDetails"
             (click)="openFirstReservation()" fxLayout="column" fxLayoutAlign="center center" fxFlex="100%"
             [ngStyle]="{'background': getBackground()}"
             style="height: 100%"></div>
      </div>
      <div fxLayout="row"
           fxLayoutAlign="center center"
           fxFlex="33.33%"
           style="width: 100%"
           *ngIf="status === 'none'">
        <span class="price-container">
          {{amount | numberToCurrency:'$'}}
        </span>
      </div>

      <!--owner block-->
      <div fxLayout="row"
           fxLayoutAlign="center center"
           fxFlex="100%"
           style="width: 100%"
           [matTooltipPosition]="'above'"
           [matTooltip]="!day.isPast ? reason: ''"
           *ngIf="status === 'block'">
        Blocked
      </div>

    </div>
    <div fxLayout="column" *ngIf="isBlocking" fxLayoutAlign="center center"
         style="height: 150px">
      <mat-spinner [color]="'accent'" [diameter]="30" [strokeWidth]="4"></mat-spinner>
    </div>

  `,
  styles: [
      `
      .pointer: {
        cursor: pointer;
      }

      .owners-block {
        background: repeating-linear-gradient(
          135deg,
          #A0A0A0,
          #A0A0A0 10px,
          #D3D3D3 10px,
          #D3D3D3 20px
        );
        opacity: 0.5;
      }

      .first-half {
        border-bottom-right-radius: 10px;
        border-top-right-radius: 10px;
        overflow: hidden;
      }

      .second-half {
        border-bottom-left-radius: 10px;
        border-top-left-radius: 10px;
        overflow: hidden;
      }

      .price-container {
        font-size: 20px;
        color: #1a1a1a;
        font-family: 'Montserrat', sans-serif;
        font-weight: bolder;
      }
    `
  ]
})
export class CalendarDateTileComponent implements OnInit {
  @Input() day: SDDay;
  @Input() status: string;
  @Input() reason: string;
  @Input() firstBooking: Booking;
  @Input() secondBooking: Booking;

  @Input() listingId: number;
  @Input() amount;
  @Input() color;

  isBlocking = false;
  firstBookingDetails: string = '';
  secondBookingDetails: string = '';

  private dialogRef: MatDialogRef<any>;

  constructor(private service: StayDuvetService,
              private dialog: MatDialog, private router: Router) {
  }

  ngOnInit(): void {
    console.log('onInit sd-calendar-date-tile');
    if (this.firstBooking != null) {
      if (!isNullOrUndefined(this.firstBooking.guest_full_name)) {
        this.firstBookingDetails = this.firstBookingDetails +
          'Guest Name : ' + this.firstBooking.guest_full_name + '\n';
      }
      this.firstBookingDetails = this.firstBookingDetails +
        'Payout Amount : $' + this.firstBooking.payout_amount + '\n' +
        'Guests: ' + this.firstBooking.number_of_guests + '\n' +
        'Checkout : ' + this.firstBooking.check_out_time + '\n' +
        'Source : ' + getSourceType(this.firstBooking.source).title;
    }

    if (this.secondBooking != null) {
      if (!isNullOrUndefined(this.secondBooking.guest_full_name)) {
        this.secondBookingDetails = this.secondBookingDetails +
          'Guest Name : ' + this.secondBooking.guest_full_name + '\n';
      }

      this.secondBookingDetails = this.secondBookingDetails +
        'Payout Amount : $' + this.secondBooking.payout_amount + '\n' +
        'Guests: ' + this.secondBooking.number_of_guests + '\n' +
        'Checkout : ' + this.secondBooking.check_out_time + '\n' +
        'Source : ' + getSourceType(this.secondBooking.source).title;
    }


  }

  blockingEvent() {
    if (this.day.isPast) {
      return;
    }

    if (this.status === 'first_half' ||
      this.status === 'second_half' ||
      this.status === 'both_half' ||
      this.status === 'full_day') {
      return;
    }

    const startDate = this.day.date;
    const startFullDate = ('0' + startDate.getDate()).slice(-2);
    const startFullMonth = ('0' + (startDate.getMonth() + 1)).slice(-2);
    const startFullYear = startDate.getFullYear();
    const startDateString = startFullYear + '-' + startFullMonth + '-' + startFullDate;

    const endDate = addDays(startDate, 1);
    const endFullDate = ('0' + endDate.getDate()).slice(-2);
    const endFullMonth = ('0' + (endDate.getMonth() + 1)).slice(-2);
    const endFullYear = endDate.getFullYear();
    const endDateString = endFullYear + '-' + endFullMonth + '-' + endFullDate;

    if (this.status === 'none') {
      const data = {
        startDate: getDateObj(startDateString),
        endDate: getDateObj(endDateString),
        reason: 'Applied From Calendar',
        listingId: this.listingId
      };
      this.dialogRef = this.dialog.open(ListingOwnerBlockPopupComponent, {
        data: data, width: '80%'
      });
    }

    if (this.status === 'block') {
      this.isBlocking = true;
      this.service.deleteOwnerBlock({
        start_date: startDateString,
        end_date: endDateString
      }, String(this.listingId)).subscribe((response) => {
        this.isBlocking = false;
      });
    }
  }


  getBackground() {
    return this.color;
  }

  openFirstReservation() {
    this.router.navigate(['/reservations/', this.firstBooking.id]);
  }

  openSecondReservation() {
    this.router.navigate(['/reservations/', this.secondBooking.id]);
  }
}
