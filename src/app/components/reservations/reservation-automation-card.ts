import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Booking} from '../../models/booking';
import {Store} from '@ngrx/store';
import {StayDuvetService} from '../../services/stayduvet';
import {getIsShowingById, State, getBookingById, getIsShowedById} from '../../reducers/index';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material';
import {isNullOrUndefined} from "util";
import {Observable} from 'rxjs/Observable';
import {ScheduledMessage} from '../../models/scheduled-message';

@Component({
  selector: 'sd-reservation-automation-card',
  template: `
    <mat-card class="generalCard">
      <span style="color:#194267;font-size: 16px"><b>AUTOMATION SCHEDULE</b></span>
      <br>
      <span style="color:gray;font-weight:100 !important;">If the checkbox is not checked the hook will not go off (default is on)*</span>
      <div style="padding-top: 30px"></div>
      <div fxLayout="column" style="margin-left:10px" fxLayoutGap="10px">

        <div *ngFor="let message of reservation.scheduledMessages.data"
             class="BorderBox"
             fxLayout="row"
             fxLayoutAlign="space-between"
             fxFlex="100%">
          <div fxFlex="5%">
            <mat-checkbox *ngIf="!updating[message.id]" [disabled]="message.sent"
                          [matTooltip]="message.sent ? 'Automation already sent' : (message.is_active ? 'Automation will not be sent' : 'Automation will be sent immediately if due date has already passed.')"
                          [checked]="message.is_active" (change)="alterActive(message)">
            </mat-checkbox>
            <mat-spinner *ngIf="updating[message.id]" [color]="'accent'" [diameter]="30"
                         [strokeWidth]="4"></mat-spinner>
          </div>
          <div class="list" fxFlex="80%">
            <span>{{ message.title }}</span>
          </div>
          <div class="status" fxFlex="20%">
            <span fxFlexAlign="start" [matTooltip]="message.send_via"
                  *ngIf="!message.sent">{{message.due_time | date:'short'}}</span>
            <span fxFlexAlign="end" [matTooltip]="message.send_via" *ngIf="message.sent">Sent</span>
          </div>
        </div>

        <div fxLayoutAlign="center" *ngIf="reservation.scheduledMessages.data.length === 0">
          <span>No Automated Messages with this reservation.</span>
        </div>
        <div style="padding-top:10px" fxLayout="row" fxFlex="100%">
          <hr class="contentBorder">
        </div>

      </div>
      <div style="padding-top:20px"></div>
      <span style="color:#194267;font-size: 16px"><b>AUTO REVIEW</b></span>
      <br>
      <span
        style="color:gray;font-weight:100 !important;">If the checkbox is not checked rate and write a custom review</span>
      <div style="padding-top: 30px"></div>
      <div fxLayout="column" style="margin-left:10px" fxLayoutGap="10px">

        <div class="BorderBox" fxLayout="row" fxLayoutAlign="space-between" fxFlex="100%">

          <div fxFlex="5%">

            <mat-checkbox></mat-checkbox>

          </div>
          <div class="list" fxFlex="85%">
            <span>REVIEW </span>
            <br>
            <textarea rows="6" placeholder="<guets_first> we a great guest and is recommended to all host">

                </textarea>
            <button mat-raised-button color="accent">
              <span style="color:white;letter-spacing: 0.5px;"><b>SAVE</b></span>
            </button>

          </div>
          <div class="status" fxLayoutAlign="end" fxFlex="15%">
            <span>*****</span>
          </div>

        </div>

      </div>

    </mat-card>
  `,
  styles: [`

    textarea {
      border-color: blue;
      padding: 5px;
      border-style: solid;
      margin: 2px;
      border-width: 1px;
      margin-top: 10px;
      width: 100%;
      border-color: rgb(160, 160, 255);
      border-radius: 5px;
    }

    .BorderBox {
      border: 0.5px solid gray;
      padding: 5px;
      box-shadow: 1px 1px lightgrey !important;
    }

    .list span {
      color: #194267;
    }

    .status span {
      color: gray;
      font-weight: 100 !important;
    }

    span {
      font-size: 14px !important;
      font-weight: bold;
    }

    .generalCard {
      background: -webkit-linear-gradient(top, #ffffff 0%, #ffffff 100%); /* Chrome10+,Safari5.1+ */;
      padding: 15px !important;
    }

    .financialsText span {
      font-size: 13px;
    !important;

    }

    .contentBorder {
      border: none;
      /* Set the hr color */
      color: #cccccc; /* old IE */
      background-color: #cccccc; /* Modern Browsers */
      height: 1px;
      width: 100%;
    }

  `]
})

export class ReservationAutomationCardComponent implements OnInit,OnDestroy {
  private isAlive: boolean = true;

  reservationsLoaded = false;
  reservationsLoading = false;

  updating: { [id: number]: boolean } = {};

  reservation: Booking = {} as Booking;

  constructor(private service: StayDuvetService,
              private store: Store<State>,
              private router: ActivatedRoute,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.router.parent.params.subscribe(params => {
      const reservationId = +params['id'];

      this.store.select((state) => {
        return getIsShowingById(state, reservationId);
      }).takeWhile(() => this.isAlive).subscribe((isShowing) => {
        this.reservationsLoading = isShowing;
      });

      this.store.select((state) => {
        return getIsShowedById(state, reservationId);
      }).takeWhile(() => this.isAlive).subscribe((isShowed) => {
        this.reservationsLoaded = isShowed;
      });

      this.store.select((state) => {
        return getBookingById(state, reservationId);
      }).takeWhile(() => this.isAlive).subscribe((booking) => {
        if (!isNullOrUndefined(booking) && booking.showFull) {
          this.reservation = booking;
        }
      });

      const combinedObs = Observable.merge(
        this.store.select((state) => {
          return getIsShowingById(state, reservationId);
        }),
        this.store.select((state) => {
          return getIsShowedById(state, reservationId);
        }),
        this.store.select((state) => {
          return getBookingById(state, reservationId);
        }),
        ((isShowing, isShowed, booking) => {
        })
      );

      combinedObs.takeWhile(() => this.isAlive).subscribe(
        (data) => {
          if (!this.reservationsLoading && !this.reservationsLoaded) {
            this.service.getBookingWithId(reservationId).subscribe();
          }
        }
      );
    });
  }

  alterActive(message: ScheduledMessage) {
    this.updating[message.id] = true;

    this.service.updateScheduledMessage(this.reservation.id, message.id, {is_active: !message.is_active}).subscribe((success) => {
      this.updating[message.id] = false;
    });
  }

  ngOnDestroy(): void {
    this.isAlive=false;
  }
}
