import {Component, Inject, Input, OnInit} from '@angular/core';
import {Listing} from '../../../models/listing';
import {StayDuvetService} from '../../../services/stayduvet';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';

/**
 * Created by ubuntu on 9/7/17.
 */

@Component({
  selector: 'sd-owner-block-popup',
  template: `
    <sd-modal-popup-layout title="Create Owner's Block">
      <form fxLayout="column" fxLayoutGap="20px" [formGroup]="formGroup"
            (ngSubmit)="formGroup.valid && saveButtonCLicked()">
        <div fxLayoutAlign="space-between center">
          <mat-form-field class="half-width">
            <input matInput [matDatepicker]="startPicker" [min]="minStartDate" placeholder="Start Date"
                   formControlName='start_date' [(ngModel)]="minEndDate">
            <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
            <mat-datepicker #startPicker></mat-datepicker>
          </mat-form-field>

          <mat-icon>arrow_forward</mat-icon>

          <mat-form-field class="half-width">
            <input matInput [matDatepicker]="endPicker" [min]="minEndDate" placeholder="End Date"
                   formControlName='end_date'>
            <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
            <mat-datepicker #endPicker></mat-datepicker>
          </mat-form-field>
        </div>

        <mat-form-field class="hr">
          <textarea matInput style="max-height: 200px" placeholder="Block Reason*"
                    formControlName="reason"></textarea>
        </mat-form-field>

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

    .half-width {
      width: 45%;
    }

    .container-box {
      border-style: solid;
      border-width: 0.1px;
      padding: 10px;
      border-color: #c8c8c8
    }

    .entryInputs {
      width: 45%
    }
  `]
})
export class ListingOwnerBlockPopupComponent implements OnInit {
  formGroup: FormGroup;
  startDate: FormControl;
  endDate: FormControl;
  reason: FormControl;

  minStartDate: Date;
  minEndDate: Date;
  //
  // @Input() key: string;
  // @Input() listing: Listing;

  isSaving: Boolean = false;

  constructor(private service: StayDuvetService,
              private dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) private data: OwnerBlockParams) {
    this.startDate = new FormControl(null, [Validators.required]);
    this.endDate = new FormControl(null, [Validators.required]);
    this.reason = new FormControl(null, [Validators.required]);

    this.formGroup = new FormGroup({
      start_date: this.startDate,
      end_date: this.endDate,
      reason: this.reason,
    });

    this.minStartDate = data.startDate;
    this.minEndDate = data.startDate;
    this.startDate.setValue(data.startDate);
    this.endDate.setValue(data.endDate);
    this.reason.setValue(data.reason);
  }

  ngOnInit() {
  }

  getDateString(date: Date){
    const fullDate = ('0' + date.getDate()).slice(-2);
    const fullMonth = ('0' + (date.getMonth() + 1)).slice(-2);
    const fullYear = date.getFullYear();
    const dateString = fullYear + '-' + fullMonth + '-' + fullDate;

    return dateString;
  }

  saveButtonCLicked() {
    this.isSaving = true;
    const data = this.formGroup.value;
    // const startDate = this.getDateString(new Date(this.startDate.value));
    // const endDate = this.getDateString(new Date(this.endDate.value));
    //

    this.service.createOwnerBlock(data, String(this.data.listingId)).subscribe((listing) => {
      this.isSaving = false;
      this.dialog.closeAll();
    }, () => {
      this.isSaving = false;
    });
  }
}



export interface  OwnerBlockParams {
  startDate: Date;
  endDate: Date;
  reason: string;
  listingId: number;
}
