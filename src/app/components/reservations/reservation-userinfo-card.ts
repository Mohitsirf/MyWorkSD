import {Component, Input, OnInit} from '@angular/core';
import {Booking} from "../../models/booking";
import {Listing} from "../../models/listing";
import {Store} from '@ngrx/store';
import {User} from '../../models/user';
import {getListings, State} from '../../reducers/index';
import {StayDuvetService} from '../../services/stayduvet';
import {getSourceIcon, getSourceType} from "../../utils";
import {getDateObj} from "../calendar/calendar-utils";
import {MatDialog, MatDialogRef} from '@angular/material';
import {NewReservationPopupComponent} from '../multi-calendar/new-reservation-popup';
import {BookingNotesPopupComponent} from './popups/update-booking-notes';
import {Router} from "@angular/router";

@Component({
  selector: 'sd-reservation-userinfo-card',
  template: `
    <mat-card class="common-card" fxLayout="column" >
      <mat-card-header (click)="openGuest()" style="cursor: pointer">
        <img mat-card-avatar class="avatar" src="{{guest?.pic_thumb_url || 'https://i.imgur.com/1o1zEDM.png'}}">
        <mat-card-title><p><b>{{guest?.first_name || 'Guest'}} {{guest?.last_name}}</b></p></mat-card-title>
        <mat-card-subtitle><p>{{guest?.guest.data.verifications.length}} Verification</p></mat-card-subtitle>
      </mat-card-header>
      <hr class="full-width">

      <p style="font-size: 13px !important;"><b>{{guest?.email}}</b></p>
      <p style="font-size: 13px !important;"><b>{{guest?.phone_number}}</b></p>

      <mat-form-field>
        <mat-select placeholder="Listing"
                    [disabled]="isListingChanging"
                    [(ngModel)]="listing"
                    (ngModelChange)="selectedListingChanged()"
                    style="padding-top: 5px;padding-bottom: 10px"
                    floatPlaceholder="never">
          <mat-option *ngFor="let listing of allListings" [value]="listing">
            {{ listing.title }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <mat-spinner *ngIf="isListingChanging" class="spinner" fxFlexAlign="center" [diameter]="30"
                   [strokeWidth]="4"></mat-spinner>

      <div fxLayoutAlign="space-between center" style="padding-top: 20px">
        <p style="font-size: 13px">Arrival Time: </p>

        <div fxLayoutGap="5px" style="padding-right: 10px">
          <mat-form-field style="width: 50px">
            <mat-select placeholder="HH"
                        [(ngModel)]="hourSelected"
                        [disabled]="isTimeChanging"
                        (ngModelChange)="selectedTimeChanged()"
                        [ngModelOptions]="{standalone: true}">
              <mat-option *ngFor="let hour of hours" [value]="hour">{{hour}}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field style="width: 50px">
            <mat-select placeholder="MM"
                        [disabled]="isTimeChanging"
                        [(ngModel)]="minuteSelected"
                        (ngModelChange)="selectedTimeChanged()"
                        [ngModelOptions]="{standalone: true}">
              <mat-option *ngFor="let minute of minutes" [value]="minute">{{minute}}</mat-option>
            </mat-select>
          </mat-form-field>

        </div>
      </div>
      <mat-spinner *ngIf="isTimeChanging" class="spinner" fxFlexAlign="center" [diameter]="30"
                   [strokeWidth]="4"></mat-spinner>


      <hr class="full-width">


      <div fxLayoutAlign="space-between center">
        <div fxLayout="column" fxLayoutAlign=" center">
          <span><b>{{booking.start | date:'MM/dd/yy'}}</b></span>
          <span>check in:</span>
        </div>
        <span id="right-arrow-font">&#10095;</span>
        <div fxLayout="column" fxLayoutAlign=" center">
          <span><b>{{booking.end | date:'MM/dd/yy'}}</b></span>
          <span>check out:</span>
        </div>
      </div>

      <hr class="full-width">

      <div fxLayoutAlign="space-between center">
        <div fxLayout="column" fxLayoutAlign=" center">
          <span><b>{{booking.nights}}</b></span>
          <span>nights:</span>
        </div>
        <div fxLayout="column" fxLayoutAlign=" center">
          <span><b>{{booking.number_of_guests}}</b></span>
          <span>guests: </span>
        </div>
        <div fxLayout="column" fxLayoutAlign=" center">
          <span><b>$ {{booking.payout_amount | number : '1.2-2'}}</b></span>
          <span>amount:</span>
        </div>
      </div>

      <hr class="full-width">

      <div fxLayoutAlign="space-between" fxLayoutGap="30px">
        <div fxLayout="row" class="lhalf-width">
          <span class="subPart">Source</span>
        </div>
        <div fxLayout="row" [matTooltip]="getSourceTitle(booking.source)">
          <div>
            <img class="source-icon"
                 src="{{getSourceIcon(booking.source)}}"
            />
          </div>
        </div>
      </div>
    </mat-card>
    <div style="margin-top:25px"></div>
    
    <mat-card fxLayout="column" class="common-card">
      <div fxLayout="row" fxLayoutAlign="space-between center">
        <span style="color:#194267;font-size: 16px"><b>Notes:</b></span>
        <button mat-icon-button (click)="openNotes()">
          <mat-icon>border_color</mat-icon>
        </button>
      </div>
      <hr>
      <span class="multi-line-content">{{booking.booking_notes}}</span>
    </mat-card>
  `,
  styles: [`
    .subPart {
      font-size: 13px !important;
    }

    .multi-line-content {
      font-family: 'Roboto', sans-serif;
      white-space: pre-line;
      padding-left: 15px;
      color: gray;
    }

    .successSpan {
      color: white;
      letter-spacing: 0.5px;
    }

    .full-width {
      width: 100%;
    }

    .lhalf-width {
      width: 45%;
    }

    #right-arrow-font {
      font-size: 25px;
    }

    span {
      font-size: 14px;
    }

    p {
      word-break: break-all
    }

    mat-card > p {
      font-size: 14px;
    }

    .avatar {
      margin-top: 10px;
      height: 45px;
      width: 45px;
    }

    mat-card {
      padding: 15px !important;

    }

    .spinner {
      height: 20px;
      width: 20px;
    }

    .common-card {
      max-width: 90%;
      background: -webkit-linear-gradient(top, #ffffff 0%, #ffffff 100%);
    }

    /deep/
    .mat-select-trigger {
      min-width: 40px !important;
    }

    .source-icon {
      height: 30px;
      width: 30px;
    }
  `]
})

export class ReservationUserInfoCardComponent implements OnInit {

  @Input() listing: Listing;
  @Input() booking: Booking;
  @Input() guest: User;

  dialogRef: MatDialogRef<any>;


  hourSelected;
  minuteSelected;
  hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09'];
  minutes = ['00', '15', '30', '45'];
  allListings: Listing[];
  isListingChanging: Boolean = false;
  isTimeChanging: Boolean = false;

  getSourceIcon = getSourceIcon;

  constructor(private store: Store<State>,
              private service: StayDuvetService,
              private dialog: MatDialog,
              private router: Router) {
    for (let i = 10; i < 24; i++) {
      this.hours.push(String(i));
    }
  }

  ngOnInit(): void {
    console.log('onInit sd-reservation-userinfo-card');
    console.log(this.booking);
    console.log(this.guest);
    console.log(this.listing);
    this.store.select(getListings).subscribe((listings) => {
      this.allListings = listings;
    });
    const timeArr = this.booking.check_in_time.split(':');
    this.hourSelected = timeArr[0];
    this.minuteSelected = timeArr[1];
  }

  selectedListingChanged() {
    this.isListingChanging = true;
    this.service.updateBooking(this.booking.id, null, {listing_id: this.listing.id}).subscribe(() => {
      this.isListingChanging = false;
    });
  }

  selectedTimeChanged() {
    this.isTimeChanging = true;
    const time = this.hourSelected + ':' + this.minuteSelected;
    this.service.updateBooking(this.booking.id, null, {check_in_time: time}).subscribe(() => {
      this.isTimeChanging = false;
    });
  }


  openGuest()
  {
    this.router.navigate(['/contacts',this.guest.id]);
  }


  getSourceTitle(source) {
    return getSourceType(source).title;
  }

  openNotes() {
    this.dialogRef = this.dialog.open(BookingNotesPopupComponent, {
      data: this.booking
    });
    this.dialogRef.updateSize('100%');
  }
}
