import {Component, OnDestroy, OnInit} from '@angular/core';
import {getBookingLogType} from '../../utils';
import {BookingLog} from '../../models/booking-log';
import {StayDuvetService} from '../../services/stayduvet';
import {Store} from '@ngrx/store';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material';
import {getBookingById, getIsShowedById, getIsShowingById, State} from '../../reducers/index';
import {isNullOrUndefined} from 'util';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'sd-reservation-log-card',
  template: `
    <div *ngIf="reservationsLoading">
      <mat-spinner [color]="'accent'"></mat-spinner>
    </div>
    <mat-card *ngIf="reservationsLoaded" class="generalCard">
      <div style="border: 0.5px solid #cccccc;padding-top:10px">
        <div *ngIf="logs.length == 0"  fxLayoutAlign="center center">
          <span style="text-align: center ; padding: 20px;">No Logs Found.</span>
        </div>
        <div fxLayout="column" *ngFor="let log of logs">
          <div fxLayout="row" style="margin: 0px" fxLayoutAlign="space-between" fxFlex="100%">
            <div fxFlex="15%" style="margin-left:15px">

              <mat-chip-list>
                <mat-chip [ngStyle]="{'background':getMessageType(log.message_type).color}" style="text-align: center;color: white" selected="true">
                  <span style="width: 100%;text-align: center">
                    <b>{{getMessageType(log.message_type).title}}</b>
                  </span>
                </mat-chip>
              </mat-chip-list>

            </div>
            <div style="margin-top:8px" fxFlex="75%">
              <span>{{log.message_string}}</span>
            </div>
            <div style="margin-top:8px" fxFlex="10%">
              <span>{{log.created_at | date:'mediumDate' }}</span>
            </div>
          </div>
          <div fxLayout="row" fxFlex="100%">
            <hr class="contentBorder">

          </div>
        </div>
      </div>
    </mat-card>
  `,
  styles: [`
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
export class ReservationLogCardComponent implements OnInit, OnDestroy{

  logs: BookingLog[] = [];
  private isAlive: boolean = true;

  reservationsLoaded = false;
  reservationsLoading = false;


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
          this.logs = booking.logs.data;
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

  ngOnDestroy() {
    this.isAlive = false;
  }


  getMessageType(type: string): { title: string, slug: string, color: string} {
    return getBookingLogType(type);
  }
}
