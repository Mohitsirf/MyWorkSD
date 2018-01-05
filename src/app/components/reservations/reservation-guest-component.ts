import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BookingGuest} from "../../models/booking-guest";
import {ReservationAddGuestCardComponent} from "./reservation-add-guest-card";
import {StayDuvetService} from "../../services/stayduvet";
import {MatDialog, MatDialogRef} from "@angular/material";
import {Booking} from "../../models/booking";
import {getBookingById, getBookings, getIsShowedById, getIsShowingById, State} from "../../reducers/index";
import {Store} from "@ngrx/store";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {isNullOrUndefined} from 'util';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'sd-reservation-guest',
  template: `
    <div fxLayout="column" fxLayoutGap="10px">

      <div fxLayout="row" fxLayoutAlign="end center">
        <button mat-raised-button color="accent" (click)="addNewGuest()">
          ADD NEW GUEST
        </button>
      </div>

      <mat-spinner *ngIf="reservationsLoading" [diameter]="30" [strokeWidth]="4"></mat-spinner>

      <div *ngIf="reservationsLoaded">
        <sd-reservation-guest-details
          style="cursor: pointer"
          *ngFor="let guest of reservation?.guests.data"
          [guest]="guest"
          (click)="editGuest(guest)">
        </sd-reservation-guest-details>
      </div>

    </div>
  `,
  styles: [`


  `]
})

export class ReservationGuestComponent implements OnInit, OnDestroy {


  private dialogRef: MatDialogRef<any>;

  reservationsLoading = false;
  reservationsLoaded = false;

  reservation: Booking;
  private isAlive: boolean = true;

  constructor(private service: StayDuvetService,
              private store: Store<State>,
              private dialog: MatDialog,
              private router: ActivatedRoute) {
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

  editGuest(guest: BookingGuest) {
    this.dialogRef = this.dialog.open(ReservationAddGuestCardComponent);
    const componentInstance = this.dialogRef.componentInstance;
    componentInstance.type = 'edit';
    componentInstance.guest = guest;
    componentInstance.reservation = this.reservation;
    this.dialogRef.updateSize('100%');
  }

  addNewGuest() {
    this.dialogRef = this.dialog.open(ReservationAddGuestCardComponent);
    const componentInstance = this.dialogRef.componentInstance;
    componentInstance.reservation = this.reservation;
    componentInstance.type = 'add';
    this.dialogRef.updateSize('100%');

  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

}
