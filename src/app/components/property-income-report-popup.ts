/**
 * Created by aditya on 18/9/17.
 */

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {StayDuvetService} from '../services/stayduvet';
import {Store} from '@ngrx/store';
import {saveAs} from 'file-saver/FileSaver';
import {Listing} from "../models/listing";
import {State} from "../reducers/index";




@Component({
  selector: 'sd-property-income-report-popup',
  template: `
   <sd-modal-popup-layout title="Property Income Report">
   <form fxLayout="column" fxLayoutGap="20px" [formGroup]="formGroup"
   (ngSubmit)="formGroup.valid && saveButtonCLicked()">
   <div fxLayout="row" fxLayoutAlign="space-between center" fxLayoutGap="10px">
      <mat-form-field style="width: 20%">
         <input matInput [matDatepicker]="startPicker" [(ngModel)]="minEndDate" placeholder="Start Date"
            formControlName='start_date'>
         <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
        <mat-datepicker #startPicker></mat-datepicker>
      </mat-form-field>
      <mat-icon>arrow_forward</mat-icon>
      <mat-form-field style="width: 20%">
         <input matInput [matDatepicker]="endPicker" [min]="minEndDate" placeholder="End Date"
            formControlName='end_date'>
         <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
        <mat-datepicker #endPicker></mat-datepicker>
      </mat-form-field>
     <mat-form-field style="width: 30%">
       <mat-select  multiple placeholder="Select Listings" [(ngModel)]="selectedListingIds" formControlName='property_ids'>
         <div fxLayout="column">
           <button class="select-button" mat-button (click)="onSelectAll()">Select All</button>
           <button class="select-button" mat-button (click)="onSelectNone()">Select None</button>
         </div>
         <mat-option *ngFor="let listing of listings" [value]="listing.id">
           {{ listing.title }}
         </mat-option>
       </mat-select>
     </mat-form-field>
     <mat-form-field style="width: 20%">
        <mat-select  placeholder="Format" formControlName='format'>
           <mat-option *ngFor="let option of formats" [value]="option.value">
           {{ option.viewValue }}
           </mat-option>
        </mat-select>
     </mat-form-field>
     <button mat-raised-button [disabled]="!formGroup.valid || isSaving" color="accent" type="submit">
      <span>Download</span>
      </button>
     <div fxLayoutAlign="center center">
      <mat-spinner *ngIf="isSaving"  [diameter]="30" [strokeWidth]="4"></mat-spinner>
     </div>
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


    .select-button {
      padding: 6px;
      text-align: left;
      font-size: 17px;
      padding-left: 10px;
      font-weight: bolder;
    }

    .entryInputs {
      width: 45%
    }
  `]
})
export class PropertyIncomeReportPopupComponent implements OnInit,OnDestroy {

  formats = [
    {value: 'csv', viewValue: 'csv'},
    {value: 'pdf', viewValue: 'pdf'},
    {value: 'xlsx', viewValue: 'xlsx'}
  ];

  formGroup: FormGroup;
  startDate: FormControl;
  endDate: FormControl;
  option: FormControl;
  properties: FormControl;

  minEndDate: Date;

  selectedListingIds= [];
  @Input() listings:Listing[]=[];

  isSaving: Boolean = false;

  constructor(private service: StayDuvetService, private store: Store<State>, private dialog: MatDialog) {
    this.startDate = new FormControl(null, [Validators.required]);
    this.endDate = new FormControl(null, [Validators.required]);
    this.option = new FormControl(null, [Validators.required]);
    this.properties = new FormControl(null, [Validators.required]);


    this.formGroup = new FormGroup({
      start_date: this.startDate,
      end_date: this.endDate,
      format: this.option,
      property_ids: this.properties,
    });
  }

  ngOnInit() {
  }

  saveButtonCLicked() {
    this.isSaving = true;
    let data = this.formGroup.value;
    data['property_ids'] = this.selectedListingIds;
    this.service.downloadPropertyIncomeReport(data).subscribe(res => {
      this.dialog.closeAll();
      this.isSaving = false;
      saveAs(res,  'Property_Income_Report.' + this.option.value);
    },err => {
      this.isSaving = false;
    });

  }

  onSelectAll() {
    this.properties.setValue(this.listings.map(listing => listing.id));
  }

  onSelectNone() {
    this.properties.setValue([]);
  }


  ngOnDestroy(): void {
  }

}
