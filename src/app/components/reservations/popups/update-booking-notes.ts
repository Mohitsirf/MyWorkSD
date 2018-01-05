import {Component, Inject, Input, OnInit} from '@angular/core';
import {Listing} from '../../../models/listing';
import {StayDuvetService} from '../../../services/stayduvet';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {Store} from '@ngrx/store';
import {State} from '../../../reducers/index';
import {UpdateSuccessAction} from '../../../actions/listing';
import {ReservationData} from '../../multi-calendar/new-reservation-popup';
import {Booking} from '../../../models/booking';

@Component({
  selector: 'sd-booking-notes-popup',
  template: `
    <sd-modal-popup-layout title="Booking Notes">
      <div fxLayout="column" fxLayoutAlign="center stretch" fxLayoutGap="10px">
        <mat-form-field class="detailField">
          <textarea rows="10" color="accent" matInput placeholder="Booking Notes" [(ngModel)]="value"></textarea>
        </mat-form-field>
        <div fxLayout="row" fxLayoutAlign="end center" fxLayoutGap="10px">
          <mat-spinner *ngIf="isSaving" [diameter]="30" [strokeWidth]="4"></mat-spinner>
          <button mat-raised-button color="accent" [disabled]="isSaving" (click)="saveButtonCLicked()">Save</button>
        </div>
      </div>
    </sd-modal-popup-layout>
  `,
  styles: [`

    .title {
      font-weight: bolder;
      font-size: 22px;
      padding-left: 10px;
      padding-right: 10px;
      height: 30px;
      width: 100%;
    }

    .detailField {
      padding-left: 10px;
      padding-right: 10px;
      width: 95%;
    }

    textarea {
      resize: vertical;
    }

    mat-spinner {
      width: 30px;
      height: 30px;
    }

  `]
})

export class BookingNotesPopupComponent implements OnInit {

  booking: Booking;

  isSaving: Boolean = false;
  value;

  constructor(private service: StayDuvetService,
              private store: Store<State>,
              private dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    this.booking = data;
  }

  ngOnInit() {
    this.value = this.booking.booking_notes;
  }

  saveButtonCLicked() {
    this.isSaving = true;
    this.service.updateBooking(this.booking.id, this.booking.thread_id, {booking_notes: this.value}).subscribe((listing) => {
      this.isSaving = false;
      this.dialog.closeAll();
    });
  }
}

