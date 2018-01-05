import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material';
import {Store} from '@ngrx/store';
import {getListings, State} from "../../reducers/index";
import DateUtils from "../../utils/date";
import {Listing} from "../../models/listing";
import {CreateProspectPopupComponent} from "app/components/multi-calendar/create-prospect-popup";
import {getDateObj} from "../calendar/calendar-utils";


@Component({
  selector: 'sd-new-prospect-details-popup',
  template: `
    <sd-modal-popup-layout title="Create New Prospect">
      <form fxLayout="column" fxLayoutGap="20px" [formGroup]="formGroup"
            (ngSubmit)="formGroup.valid && saveButtonCLicked()">
        <div fxLayoutAlign="space-between center" fxLayoutGap="10px" fxLayout="row">
          <mat-form-field style="width: 25%">
            <input matInput [matDatepicker]="startPicker" [min]="minStartDate" placeholder="Start Date"
                   formControlName='start_date'>
            <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
            <mat-datepicker #startPicker></mat-datepicker>
          </mat-form-field>
          <mat-icon>arrow_forward</mat-icon>
          <mat-form-field style="width: 25%">
            <input matInput [matDatepicker]="endPicker" [min]="minEndDate" placeholder="End Date"
                   formControlName='end_date'>
            <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
            <mat-datepicker #endPicker></mat-datepicker>
          </mat-form-field>
          <mat-form-field style="width: 25%">
            <input matInput placeholder="No of Guests"
                   min="1"
                   type="number"
                   formControlName='no_of_guests'>
          </mat-form-field>
          <mat-form-field style="width: 20%">
            <mat-select
              multiple
              placeholder="Select Listings" formControlName='listings'>
              <div fxLayout="column">
                <button class="select-button" mat-button (click)="onSelectAll()">Select All</button>
                <button class="select-button" mat-button (click)="onSelectNone()">Select None</button>
              </div>
              <mat-option *ngFor="let item of allListings" [value]="item">
                {{ item.title }}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-raised-button [disabled]="!formGroup.valid" color="accent" type="submit">
            Continue
          </button>
        </div>
      </form>
    </sd-modal-popup-layout>
  `,
  styles: [`
    hr {
      width: 100%;
    }

    .select-button {
      padding: 6px;
      text-align: left;
      font-size: 17px;
      padding-left: 10px;
      font-weight: bolder;
    }

    mat-spinner {
      height: 30px;
      width: 30px;
    }

  `]
})
export class NewProspectDetailsPopupComponent implements OnInit, OnDestroy {


  formGroup: FormGroup;
  startDate: FormControl;
  endDate: FormControl;
  no_of_guests: FormControl;
  listings: FormControl;

  allListings: Listing[] = [];


  isAlive = true;

  minStartDate: Date;
  minEndDate: Date;

  dialogRef: MatDialogRef<any>;


  constructor(private store: Store<State>, private dialog: MatDialog) {
    this.startDate = new FormControl(null, [Validators.required]);
    this.endDate = new FormControl(null, [Validators.required]);
    this.no_of_guests = new FormControl(null, [Validators.required]);
    this.listings = new FormControl(null, [Validators.required]);

    this.formGroup = new FormGroup({
      start_date: this.startDate,
      end_date: this.endDate,
      no_of_guests: this.no_of_guests,
      listings: this.listings,
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
        this.allListings = data;
      }
    );
  }

  saveButtonCLicked() {
    const data = {
      listings: this.listings.value,
      check_in: this.startDate.value,
      check_out: this.endDate.value,
      guest_count: this.no_of_guests.value
    };
    this.dialog.closeAll();
    this.dialogRef = this.dialog.open(CreateProspectPopupComponent);
    const componentInstance = this.dialogRef.componentInstance;
    componentInstance.checkInDate = data.check_in;
    componentInstance.checkOutDate = data.check_out;
    componentInstance.noOfGuests = data.guest_count;
    componentInstance.checkedListings = data.listings;
    componentInstance.numberOfDays = DateUtils.daysBetweenDates(data.check_in, data.check_out);
    this.dialogRef.updateSize('100%','100%');
  }

  onSelectAll() {
    this.listings.setValue(this.allListings);
  }

  onSelectNone() {
    this.listings.setValue([]);

  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

}
