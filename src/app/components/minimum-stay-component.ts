import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {StayDuvetService} from "../services/stayduvet";
import {State} from "../reducers/index";
import {Listing} from "app/models/listing";
import {dateToDateString, getDateObj} from "./calendar/calendar-utils";
import {MinStayTemplatePopupComponent} from "./listing/min-stay-template-popup";
import {MatDialog, MatDialogRef} from "@angular/material";

@Component({
  selector: 'sd-minimum-stay',
  template: `
    <div fxLayout="column" fxLayoutGap="20px">
      <div fxLayout="column" fxLayoutGap="20px" class="padding10-left">
        <mat-card fxLayout="column" fxLayoutGap="10px" class="padding40-left card">
          <div fxLayout="row" fxLayoutGap="20px" fxLayoutAlign="start center">
            <span class="cellWidth"><b>START</b></span>
            <span class="cellWidth"><b>END</b></span>
            <span class="cellWidth"><b>LENGTH</b></span>
          </div>
          <div fxLayout="row" fxLayoutGap="10px" fxLayoutAlign="start center"
               *ngFor="let stay of minimumStays; let i = index">
            <mat-form-field [color]="'accent'" class="cellWidth">
              <input [min]="minDate" matInput [matDatepicker]="startPicker" [(ngModel)]="stay.start" placeholder="Choose a start date">
              <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
              <mat-datepicker #startPicker></mat-datepicker>
            </mat-form-field>
            <mat-form-field [color]="'accent'" class="cellWidth">
              <input [min]="minDate" matInput [matDatepicker]="endPicker" [(ngModel)]="stay.end" placeholder="Choose an end date">
              <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
              <mat-datepicker #endPicker></mat-datepicker>
            </mat-form-field>
            <mat-form-field [color]="'accent'" class="cellWidth">
              <input type="number" min="1" matInput placeholder="length" [(ngModel)]="stay.length">
            </mat-form-field>
            <button mat-icon-button (click)="removeButtonClicked(i)">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <div fxLayout="row" fxLayoutAlign="space-between center" fxLayoutGap="10px">
            <button mat-raised-button [matMenuTriggerFor]="addMinimumMenu" color="accent">
              Add  a minimum
            </button>

            <mat-menu [overlapTrigger]="false" #addMinimumMenu="matMenu">
              <button mat-menu-item (click)="addMinimum()">Add Minimum Stay</button>
              <button mat-menu-item (click)="chooseFromTemplates()">Choose From Templates</button>
            </mat-menu>
            <div fxLayout="row" fxLayoutAlign="end center">
              <mat-spinner *ngIf="isStaysSaving" [color]="'accent'" [diameter]="30" [strokeWidth]="4"></mat-spinner>
              <button mat-raised-button color="accent" [disabled]="isStaysSaving" (click)="saveStays()">SAVE</button>
            </div>
          </div>
        </mat-card>

      </div>
    </div>
  `,
  styles: [`

    .padding {
      padding: -10px -10px -10px -10px;
      background-color: white;
    }

    .heading {
      font-weight: bolder;
      font-size: 22px;
    }

    hr {
      width: 100%;
    }

    .card {
      padding: 15px;
      background: -webkit-linear-gradient(top, #ffffff 0%, #ffffff 100%);
    }

    mat-spinner {
      height: 30px;
      width: 30px;
      margin-right: 10px;
    }

    .heading {
      font-size: 25px;
    }

    .top-padding {
      padding-top: 20px;
    }

    .bottom-padding {
      padding-bottom: 20px;
    }

    hr {
      width: 100%;
    }

    .bolder {
      font-weight: bolder;
    }

    .percContainer {
      width: 50%;
    }

    .Q3Width {
      width: 70%;
    }

    .cellWidth {
      width: 250px;
    }

    .padding40-left {
      padding-left: 40px;
    }

    .padding10-left {
      padding-left: 10px;
    }

    .margin200-left {
      margin-left: 200px;
    }

    .padding-bottom {
      padding-bottom: 200px;
    }

  `]
})
export class MinimumStayComponent implements OnInit, OnDestroy {


  isAlive: boolean = true;

  @Input() minimumStays: { start: string, end: string, length: number }[];
  isStaysSaving = false;
  @Input() selectedListing: Listing;

  minDate: Date;
  dialogRef: MatDialogRef<any>;



  constructor(private service: StayDuvetService,
              private store: Store<State>,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    console.log('OnInit minimum-stay-component');
    this.minDate = getDateObj();
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  removeButtonClicked(index: number) {
    this.minimumStays = [...this.minimumStays.slice(0, index),
      ...this.minimumStays.slice(index + 1)
    ];
  }



  chooseFromTemplates()
  {
    this.dialogRef = this.dialog.open(MinStayTemplatePopupComponent);
    const instance = this.dialogRef.componentInstance;
    instance.selectedStays.subscribe(data => {
     this.minimumStays = [...this.minimumStays, ...data];
    });
    this.dialogRef.updateSize('100%');
  }

  addMinimum()
  {
    this.minimumStays.push({start: dateToDateString(getDateObj()), end: dateToDateString(getDateObj()), length: 1});
  }

  saveStays() {
    this.isStaysSaving = true;
    const staysArray = [];
    for (const stays of this.minimumStays) {
      const startDate = getDateObj(stays.start);
      const endDate = getDateObj(stays.end);

      const startDateString = dateToDateString(startDate);
      const endDateString = dateToDateString(endDate);

      staysArray.push({
        'start': startDateString,
        'end': endDateString,
        'length': stays.length
      });
    }

    this.service.updateListingDetails({seasonal_min_stays: staysArray}, String(this.selectedListing.id)).subscribe((success) => {
      this.isStaysSaving = false;
    });
  }


}
