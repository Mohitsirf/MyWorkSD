/**
 * Created by aditya on 18/9/17.
 */

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {StayDuvetService} from '../../services/stayduvet';
import {Store} from '@ngrx/store';
import {
  getActiveContacts, getIsActiveContactLoaded, getIsActiveContactLoading, getListings, getUser,
  State
} from '../../reducers/index';
import {User} from "../../models/user";
import {Observable} from "rxjs/Observable";
import {saveAs} from 'file-saver/FileSaver';



@Component({
  selector: 'sd-download-report-admin-popup',
  template: `
   <sd-modal-popup-layout title="Owner's Statement">
   <form fxLayout="column" fxLayoutGap="20px" [formGroup]="formGroup"
   (ngSubmit)="formGroup.valid && downloadButtonClicked()">
   <div fxLayoutAlign="space-between center" fxLayoutGap="10px">
      <mat-form-field style="width: 18%">
         <input matInput [matDatepicker]="startPicker" [(ngModel)]="minEndDate" placeholder="Start Date"
            formControlName='start_date'>
         <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
      </mat-form-field>
      <mat-datepicker #startPicker></mat-datepicker>
      <mat-icon>arrow_forward</mat-icon>
      <mat-form-field style="width: 18%">
         <input matInput [matDatepicker]="endPicker" [min]="minEndDate" placeholder="End Date"
            formControlName='end_date'>
         <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
        <mat-datepicker #endPicker></mat-datepicker>
      </mat-form-field>
      <mat-form-field style="width: 18%">
      <mat-select placeholder="Owner" formControlName='owner'>
         <mat-option *ngFor="let owner of owners" [value]="owner">
         {{ owner.first_name }} {{owner.last_name}}
         </mat-option>
      </mat-select>
      </mat-form-field>
      <mat-form-field style="width: 18%">
       <mat-select placeholder="Format" formControlName='format'>
         <mat-option *ngFor="let format of formats" [value]="format.value">
         {{ format.viewValue }}
         </mat-option>
      </mat-select>
      </mat-form-field>
      <button mat-raised-button [disabled]="!formGroup.valid || isLoading " color="accent" type="submit">
      <span>Download</span>
      </button>
      <button  mat-raised-button [disabled]="!formGroup.valid || isLoading" color="accent" type="button" (click)="mailOwnerStatement()">
      Email Me
      </button>
     <div fxLayoutAlign="center center">
      <mat-spinner *ngIf="isLoading" color="accent" [diameter]="30" [strokeWidth]="4"></mat-spinner>
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
export class AdminDownloadReportPopupComponent implements OnInit,OnDestroy {

  formats = [
    {value: 'csv', viewValue: 'csv'},
    {value: 'pdf', viewValue: 'pdf'},
    {value: 'xlsx', viewValue: 'xlsx'}
  ];

  owners:User[] = [];

  formGroup: FormGroup;
  startDate: FormControl;
  endDate: FormControl;
  owner: FormControl;
  format: FormControl;
  minEndDate: Date;
  isContactLoading = false;
  isContactLoaded = false;

  isLoading: boolean = false;
  isAlive: boolean = true;



  constructor(private service: StayDuvetService, private store: Store<State>, private dialog: MatDialog) {
    this.startDate = new FormControl(null, [Validators.required]);
    this.endDate = new FormControl(null, [Validators.required]);
    this.format = new FormControl(null, [Validators.required]);
    this.owner = new FormControl(null, [Validators.required]);

    this.formGroup = new FormGroup({
      start_date: this.startDate,
      end_date: this.endDate,
      format: this.format,
      owner: this.owner,

    });
  }

  ngOnInit() {

    this.store.select(getUser).takeWhile(() => this.isAlive).subscribe((user) => {
      if(user)
      {
        if(user.type == 'owner')
        {
         this.owners = [user];
         this.owner.setValue(user);
         this.owner.disable({onlySelf: true});

        }else {
          this.setUpOwners();
        }
      }
    });

  }

  downloadButtonClicked() {
    this.isLoading = true;
    delete this.formGroup.value['owner'];
    this.service.downloadOwnerStatement(this.owner.value.getOwner().id, this.formGroup.value).subscribe(res => {
      this.isLoading = false;
      this.dialog.closeAll();
      saveAs(res, this.owner.value.first_name + '.' + this.format.value);
    }, err=>{
     this.isLoading  = false;
    });
  }

  mailOwnerStatement()
  {
    this.isLoading = true;
    delete this.formGroup.value['owner'];
    this.service.mailOwnerStatement(this.owner.value.getOwner().id, this.formGroup.value).subscribe(res => {
      this.isLoading = false;
      this.dialog.closeAll();
    },err=>{
      this.isLoading  = false;
    });
  }


  setUpOwners()
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
        this.owners = contacts.filter(contact => contact.type == 'owner');

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

  ngOnDestroy(): void {
    this.isAlive  = false;
  }

}
