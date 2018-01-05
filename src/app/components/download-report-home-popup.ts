/**
 * Created by aditya on 18/9/17.
 */

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {StayDuvetService} from '../services/stayduvet';
import {Store} from '@ngrx/store';
import {
  getActiveContacts, getIsActiveContactLoaded, getIsActiveContactLoading, getListings, getUser,
  State
} from '../reducers/index';
import {saveAs} from 'file-saver/FileSaver';
import {User} from "../models/user";
import {Observable} from "rxjs/Observable";
import Utils from "../utils";
import ObjectUtils from "../utils/object";




@Component({
  selector: 'sd-download-report-home-popup',
  template: `
   <sd-modal-popup-layout title="Homeowner's Statement">
   <form fxLayout="column" fxLayoutGap="20px" [formGroup]="formGroup"
   (ngSubmit)="formGroup.valid && saveButtonCLicked()">
   <div fxLayoutAlign="space-between center" fxLayoutGap="10px">
      <mat-form-field style="width: 16%">
         <input matInput [matDatepicker]="startPicker" [(ngModel)]="minEndDate" placeholder="Start Date"
            formControlName='start_date'>
         <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
        <mat-datepicker #startPicker></mat-datepicker>
      </mat-form-field>
      <mat-icon>arrow_forward</mat-icon>
      <mat-form-field style="width: 16%">
         <input matInput [matDatepicker]="endPicker" [min]="minEndDate" placeholder="End Date"
            formControlName='end_date'>
         <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
        <mat-datepicker #endPicker></mat-datepicker>
      </mat-form-field>
     <mat-form-field style="width: 20%">
        <mat-select  placeholder="Format" formControlName='format'>
           <mat-option *ngFor="let option of formats" [value]="option.value">
           {{ option.viewValue }}
           </mat-option>
        </mat-select>
     </mat-form-field>
     <div *ngIf="isContactLoading" fxLayoutAlign="center center" style="width: 20%">
       <mat-spinner color="accent" [diameter]="30" [strokeWidth]="4"></mat-spinner>
     </div>
     <mat-form-field *ngIf="!isContactLoading"  style="width: 20%">
       <mat-select placeholder="Homeowner" formControlName='homeowner'>
         <mat-option *ngFor="let homeowner of homeowners" [value]="homeowner">
           {{ homeowner.first_name }} {{homeowner.last_name}}
         </mat-option>
       </mat-select>
     </mat-form-field>
     <button mat-raised-button [disabled]="!formGroup.valid || isSaving" color="accent" type="submit">
      <span>Download</span>
      </button>
      <button mat-raised-button (click)="emailReport()" [disabled]="!formGroup.valid || isSaving" color="accent" type="button">
      Email
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

    .entryInputs {
      width: 45%
    }
  `]
})
export class HomeOwnerReportDownloadPopupComponent implements OnInit,OnDestroy {

  formats = [
    {value: 'csv', viewValue: 'csv'},
    {value: 'pdf', viewValue: 'pdf'},
    {value: 'xlsx', viewValue: 'xlsx'}
  ];

  formGroup: FormGroup;
  startDate: FormControl;
  endDate: FormControl;
  option: FormControl;
  minEndDate: Date;
  homeowner: FormControl;
  homeowners:User[] = [];

  isContactLoading = false;
  isContactLoaded = false;


  isSaving: Boolean = false;
  isAlive = true;

  constructor(private service: StayDuvetService, private store: Store<State>, private dialog: MatDialog) {
    this.startDate = new FormControl(null, [Validators.required]);
    this.endDate = new FormControl(null, [Validators.required]);
    this.option = new FormControl(null, [Validators.required]);
    this.homeowner = new FormControl(null, [Validators.required]);


    this.formGroup = new FormGroup({
      start_date: this.startDate,
      end_date: this.endDate,
      format: this.option,
      homeowner: this.homeowner,

    });
  }

  ngOnInit() {

    this.store.select(getUser).takeWhile(() => this.isAlive).subscribe((user) => {
      if(user)
      {
        if(user.type == 'management' && user.getManagementContact().category == 'homeowner')
        {
          this.homeowners = [user];
          this.homeowner.setValue(user);
          this.homeowner.disable({onlySelf: true});

        }else {
          this.setUpHomeOwners();
        }
      }
    });
  }

  saveButtonCLicked() {
    this.isSaving = true;
    const data = this.formGroup.value;
    delete data['homeowner'];
    this.service.downloadHomeOwnerStatement(this.homeowner.value.getManagementContact().id,data).subscribe(res => {
      this.dialog.closeAll();
      this.isSaving = false;
      saveAs(res, 'homeowner_statement.' + this.option.value);
    },err=>{
      this.isSaving  = false;
    });

  }

  setUpHomeOwners()
  {
    this.store.select(getIsActiveContactLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.isContactLoading = loading;
    });

    this.store.select(getIsActiveContactLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.isContactLoaded = loaded;
    });

    this.store.select(getActiveContacts).takeWhile(() => this.isAlive).subscribe((contacts) => {
      if(contacts.length > 0)
      {
        this.homeowners = contacts.filter(contact => contact.type == 'management' && contact.getManagementContact().category == 'homeowner');
        this.homeowners =  ObjectUtils.sortByKey(this.homeowners,'first_name','asc');
      }
    });



    const upcomingCombined = Observable.merge(
      this.store.select(getIsActiveContactLoading),
      this.store.select(getIsActiveContactLoaded),
      this.store.select(getActiveContacts),
      ((contacts, loading, loaded) => {
      })
    );

    upcomingCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.isContactLoading && !this.isContactLoaded) {
          this.service.getActiveContacts().subscribe();
        }
      }
    );
  }

  emailReport()
  {
    this.isSaving = true;
    const data = this.formGroup.value;
    delete data['homeowner'];
    this.service.mailHomeOwnerStatement(this.homeowner.value.getManagementContact().id,data).subscribe(res => {
      this.isSaving = false;
      this.dialog.closeAll()
    },err=>{
      this.isSaving  = false;
    });

  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

}
