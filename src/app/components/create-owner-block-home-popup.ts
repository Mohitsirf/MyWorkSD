/**
 * Created by divyanshu on 07/09/17.
 */

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {StayDuvetService} from '../services/stayduvet';
import {Listing} from '../models/listing';
import {Store} from '@ngrx/store';
import {getListings, State} from '../reducers/index';
import {Subscription} from "rxjs/Subscription";
import {getDateObj} from "./calendar/calendar-utils";


@Component({
  selector: 'sd-create-owner-block-home-popup',
  template: `
    <sd-modal-popup-layout title="Create Owner's Block">
      <form fxLayout="column" fxLayoutGap="20px" [formGroup]="formGroup"
            (ngSubmit)="formGroup.valid && saveButtonCLicked()">
        <div fxLayoutAlign="space-between center">
          <mat-form-field class="quar-width">
            <input matInput [matDatepicker]="startPicker" [min]="minStartDate" placeholder="Start Date"
                   formControlName='start_date' [(ngModel)]="minEndDate">
            <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
            <mat-datepicker #startPicker></mat-datepicker>
          </mat-form-field>

          <mat-form-field class="quar-width">
            <input matInput [matDatepicker]="endPicker" [min]="minEndDate" placeholder="End Date"
                   formControlName='end_date'>
            <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
            <mat-datepicker #endPicker></mat-datepicker>
          </mat-form-field>

          <mat-form-field class="half-width">
            <mat-select placeholder="Select Listing*"
                       [(ngModel)]="selectedListing"
                       [ngModelOptions]="{standalone: true}"
                       >
              <mat-option *ngFor="let listing of allListings" [value]="listing">
                {{ listing.title }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>


        <textarea class="container-box" placeholder="Block Reason*" rows="4" formControlName='reason'></textarea>

        <div fxLayoutGap="10px" fxLayoutAlign=" center" fxFlexAlign="end">
          <mat-spinner color="accent" *ngIf="isSaving" [diameter]="30" [strokeWidth]="4"></mat-spinner>
          <button mat-raised-button fxFlexAlign="end" [disabled]="isSaving" color="accent" type="submit">
            OK
          </button>
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

    .container-box {
      border-style: solid;
      border-width: 0.1px;
      padding: 10px;
      border-color: #c8c8c8
    }

    .half-width {
      width: 45%;
    }

    .quar-width {
      width: 25%;
    }

    .entryInputs {
      width: 45%
    }
  `]
})
export class HomeCreateOwnerBlockPopupComponent implements OnInit, OnDestroy {

  formGroup: FormGroup;
  startDate: FormControl;
  endDate: FormControl;
  reason: FormControl;
  minStartDate: Date;
  minEndDate: Date;

  isSaving: Boolean = false;
  allListings: Listing[];
  selectedListing: Listing;
  private isAlive: boolean = true;

  constructor(private service: StayDuvetService, private store: Store<State>, private dialog: MatDialog) {
    this.startDate = new FormControl(null, [Validators.required]);
    this.endDate = new FormControl(null, [Validators.required]);
    this.reason = new FormControl(null, [Validators.required]);

    this.formGroup = new FormGroup({
      start_date: this.startDate,
      end_date: this.endDate,
      reason: this.reason,
    });

    this.minStartDate = getDateObj();
    this.minEndDate = getDateObj();
  }

  ngOnInit() {
    this.store.select(getListings).takeWhile(() => this.isAlive).subscribe((listings) => {
      this.allListings = listings;
    });
  }

  saveButtonCLicked() {
    this.isSaving = true;
    const data = this.formGroup.value;
    this.service.createOwnerBlock(data, String(this.selectedListing.id)).subscribe((listing) => {
      this.isSaving = false;
      this.dialog.closeAll();
    });
  }

  ngOnDestroy(): void {

    this.isAlive = false;
  }


}
