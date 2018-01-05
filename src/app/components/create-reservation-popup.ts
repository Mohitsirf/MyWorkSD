/**
 * Created by aditya on 18/9/17.
 */

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material';
import {StayDuvetService} from '../services/stayduvet';
import {Store} from '@ngrx/store';
import {getListings, State} from '../reducers/index';
import {Booking} from "../models/booking";
import {Listing} from "../models/listing";
import DateUtils from "../utils/date";
import {NewReservationPopupComponent} from "./multi-calendar/new-reservation-popup";
import {getDateObj} from "./calendar/calendar-utils";


@Component({
  selector: 'sd-new-reservation-details-popup',
  template: `
    <sd-modal-popup-layout title="Create New Reservation">
      <form fxLayout="column" fxLayoutGap="20px" [formGroup]="formGroup"
            (ngSubmit)="formGroup.valid && saveButtonCLicked()">
        <div fxLayoutAlign="space-between center" fxLayoutGap="5px" fxLayout="row">
          <mat-form-field style="width: 18%">
            <input matInput [matDatepicker]="startPicker" [min]="minStartDate" placeholder="Start Date"
                   formControlName='start_date'>
            <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
            <mat-datepicker #startPicker></mat-datepicker>
          </mat-form-field>
          <mat-icon>arrow_forward</mat-icon>
          <mat-form-field style="width: 18%">
            <input matInput [matDatepicker]="endPicker" [min]="minEndDate" placeholder="End Date"
                   formControlName='end_date'>
            <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
            <mat-datepicker #endPicker></mat-datepicker>
          </mat-form-field>
          <mat-form-field style="width: 15%">
            <input matInput placeholder="No of Guests"
                   min="1"
                   type="number"
                   formControlName='no_of_guests'>
          </mat-form-field>
          <mat-form-field style="width: 15%">
            <input matInput placeholder="No of Pets"
                   min="0"
                   type="number"
                   formControlName='no_of_pets'>
          </mat-form-field>
          <mat-form-field style="width: 20%">
            <mat-select placeholder="Select Listing" formControlName='listing'>
              <mat-option *ngFor="let item of listings" [value]="item">
                {{ item.title }}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-raised-button *ngIf="!isSaving" [disabled]="!formGroup.valid" color="accent" type="submit">
            Continue
          </button>
          <mat-spinner color="accent" *ngIf="isSaving" [diameter]="30" [strokeWidth]="4"></mat-spinner>
        </div>
        <div fxLayout="row" fxLayoutAlign="end start">
          <mat-error style="font-size: x-small;">{{error}}</mat-error>
        </div>
      </form>
    </sd-modal-popup-layout>
  `,
  styles: [`
    hr {
      width: 100%;
    }

    mat-spinner {
      height: 30px;
      width: 30px;
    }

  `]
})
export class CreateReservationPopupComponent implements OnInit, OnDestroy {


  formGroup: FormGroup;
  startDate: FormControl;
  endDate: FormControl;
  no_of_guests: FormControl;
  no_of_pets: FormControl;
  listing: FormControl;

  listings: Listing[] = [];


  isSaving: Boolean = false;
  isAlive = true;

  minStartDate: Date;
  minEndDate: Date;
  error = '';

  dialogRef: MatDialogRef<any>;


  constructor(private service: StayDuvetService, private store: Store<State>, private dialog: MatDialog) {
    this.startDate = new FormControl(null, [Validators.required]);
    this.endDate = new FormControl(null, [Validators.required]);
    this.no_of_guests = new FormControl(null, [Validators.required]);
    this.no_of_pets = new FormControl(null, [Validators.required]);
    this.listing = new FormControl(null, [Validators.required]);

    this.formGroup = new FormGroup({
      start_date: this.startDate,
      end_date: this.endDate,
      no_of_guests: this.no_of_guests,
      no_of_pets: this.no_of_pets,
      listing: this.listing,
    });


    this.minStartDate = getDateObj();
    this.minEndDate = getDateObj();
    this.minEndDate.setDate(this.minEndDate.getDate() + 1);

    this.startDate.valueChanges.takeWhile(() => this.isAlive).subscribe((value) => {
      if (this.startDate.valid) {
        if (this.endDate.invalid || DateUtils.daysBetweenDates(value, this.endDate.value) <= 0) {
          this.endDate.setValue(DateUtils.addDays(value, 1));
        }

        this.minEndDate = DateUtils.addDays(value, 1);
      }
    });


  }

  ngOnInit() {


    this.store.select(getListings).takeWhile(() => this.isAlive).subscribe(data => {
        this.listings = data;
      }
    );
  }

  saveButtonCLicked() {
    this.error = '';
    this.isSaving = true;
    const data = {
      listing: this.listing.value,
      check_in: this.startDate.value,
      check_out: this.endDate.value,
      guest_count: this.no_of_guests.value,
      pet_count: this.no_of_pets.value
    };

    this.service.getBookingAvailability(this.listing.value.id, {
      start: this.startDate.value,
      end: this.endDate.value,
      number_of_guests: this.no_of_guests.value
    }).subscribe(res => {
        if (res['is_available']) {
          this.dialog.closeAll();
          this.isSaving = false;
          this.dialogRef = this.dialog.open(NewReservationPopupComponent, {
            data: data
          });
          this.dialogRef.updateSize('100%','100%');
        }
        else {
          this.isSaving = false;
          this.error = res['reason'];
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

}
