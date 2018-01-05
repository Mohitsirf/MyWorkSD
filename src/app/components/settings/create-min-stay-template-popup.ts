import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {StayDuvetService} from '../../services/stayduvet';
import {MatDialog} from '@angular/material';
import {Store} from '@ngrx/store';
import { State} from '../../reducers/index';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {dateToDateString, getDateObj} from "../calendar/calendar-utils";
import DateUtils from "../../utils/date";

@Component({
  selector: 'sd-create-min-stay-template',
  template: `
    <sd-modal-popup-layout title="{{popUpTitle}}">

        <form fxLayout="column" [formGroup]="formGroup" (ngSubmit)="formGroup.valid && saveButtonCLicked()">
          <div fxLayout="row" fxLayoutAlign="space-between center">
            
            <mat-form-field fxFlex="30%">
              <input matInput [min]="minStartDate" [matDatepicker]="startPicker" formControlName="start" placeholder="Choose a start date">
              <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
              <mat-datepicker #startPicker></mat-datepicker>
              <mat-error>This field is required.</mat-error>
            </mat-form-field>
  
            <mat-form-field [color]="'accent'" fxFlex="30%">
              <input matInput [min]="minEndDate" [matDatepicker]="endPicker" formControlName="end" placeholder="Choose an end date">
              <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
              <mat-datepicker #endPicker></mat-datepicker>
              <mat-error>This field is required.</mat-error>
            </mat-form-field>
  
            <mat-form-field fxFlex="30%">
            <input type="number" min="1" matInput color="accent" formControlName="length"   placeholder="Length">
            <mat-error>This field is required.</mat-error>
          </mat-form-field>

          </div>    

          <div fxLayout="row" fxLayoutAlign="end center" fxLayoutGap="10px">
            <mat-spinner *ngIf="isSaving" [diameter]="30" [strokeWidth]="4"></mat-spinner>
            <button mat-raised-button *ngIf="isEditType" color="warn" (click)="deleteTemplate()" [disabled]="isSaving">Delete</button>
            <button mat-raised-button color="accent" [disabled]="isSaving">{{buttonText}}</button>
          </div>
        </form>
        
        
        
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
    }

    textarea {
      resize: vertical;
    }
    
    mat-error{
      font-size: x-small;
    }

    mat-spinner {
      width: 30px;
      height: 30px;
    }

    .select-button {
      padding: 6px;
      text-align: left;
      font-size: 17px;
      padding-left: 10px;
      font-weight: bolder;
    }

  `]
})

export class CreateMinStayTemplatePopup implements OnInit ,OnDestroy {

  @Input() popUpTitle ;
  @Input() length;
  @Input() templateId;
  @Input() start;
  @Input() end;
  @Input() isEditType=false;
  buttonText;

  formGroup: FormGroup;
  startDate: FormControl;
  endDate: FormControl;
  noOfDays: FormControl;



  isSaving: Boolean = false;
  isAlive = true;

  minStartDate: Date;
  minEndDate: Date;

  constructor(private service: StayDuvetService, private dialog: MatDialog, private store: Store<State>) {
    this.startDate = new FormControl(null, [Validators.required]);
    this.endDate = new FormControl(null, [Validators.required]);
    this.noOfDays = new FormControl(null, [Validators.required]);

    this.formGroup = new FormGroup({
      start: this.startDate,
      end: this.endDate,
      length: this.noOfDays,
    });

    this.minStartDate = getDateObj();
    this.minEndDate = getDateObj();
    this.minEndDate.setDate(this.minStartDate.getDate() + 1);

  }

  ngOnInit() {

    if (this.isEditType)
    {
      this.buttonText="Edit";
      this.startDate.setValue(this.start);
      this.endDate.setValue(this.end);
      this.noOfDays.setValue(this.length);
    }
    else {
      this.buttonText="Add";
    }

  }

  saveButtonCLicked() {
    this.isSaving  =true;

    let data = this.formGroup.value;
    data['start'] = dateToDateString(getDateObj(data['start']));
    data['end'] = dateToDateString(getDateObj(data['end']));


    if (this.isEditType)
    {
      this.service.updateMinStayTemplate(this.templateId
        ,data).subscribe(item => {
        this.isSaving  = false;
        this.dialog.closeAll();
      }, () => {
        this.isSaving  = false;
      });
    }
    else {
      this.service.addNewMinStayTemplate(data).subscribe(item => {
        this.dialog.closeAll();
      }, () => {
        this.isSaving  = false;
      });
    }

  }

  deleteTemplate()
  {
    this.isSaving = true;
    this.service.deleteMinStayTemplate(this.templateId).subscribe(() => {
      this.isSaving = false;
      this.dialog.closeAll();
    }, () => {
      this.isSaving  = false;
    });
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
