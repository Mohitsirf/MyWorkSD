/**
 * Created by divyanshu on 01/09/17.
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog, MatDialogRef} from '@angular/material';
import {SettingsThreeFourBedroomPopupComponent} from './last-minute-discounts/three-four-bedroom-popup';
import {Store} from '@ngrx/store';
import {getDiscounts, getIsDiscountsLoaded, getIsDiscountsLoading, State} from '../../reducers/index';
import {StayDuvetService} from '../../services/stayduvet';
import {LastMinuteDiscount} from '../../models/last-minute-discount';
import {Observable} from 'rxjs/Observable';
import {CreateLastMinuteDiscountComponent} from './last-minute-discounts/create-disount-popup';

@Component({
  selector: 'sd-setting-last-minute-discount',
  template: `
    <div fxLayout="column" fxLayoutGap="30px" style="margin-top: 10px; margin-bottom: 50px" fxFlex="100%">

      <div fxLayoutAlign="start center">
        <button mat-raised-button color="primary" (click)="openTools()">
          <mat-icon>arrow_back</mat-icon>
          Back
        </button>
      </div>

      <div fxLayout="column" fxLayoutGap="5px">
        <div fxLayoutAlign="space-between center">
          <span class="heading">Last Minute Discounts</span>
          <button mat-raised-button color="accent" (click)="addLastMinuteDiscount()">Add Last Minute Discount</button>
        </div>
        <span class="hint">Create a schedule of last minute discounts offered to property types.</span>
      </div>


      <div fxLayout="column" fxLayoutGap="20px">
        <mat-card *ngFor="let discount of discounts" fxLayout="column" fxLayoutGap="5px" class="padding" (click)="openLastMinuteDiscount(discount)" style="cursor: pointer">
          <h3>{{discount.title}}</h3>
          <span class="content">{{discount.description}}</span>
        </mat-card>
      </div>
      <div fxLayout="row" *ngIf="!discountsLoading && discounts.length === 0" fxLayoutAlign="center center">
        <p> No Special Discounts</p>
      </div>
      <div *ngIf="discountsLoading" fxLayoutAlign="center center">
        <mat-spinner [color]="'accent'" [diameter]="30" [strokeWidth]="4"></mat-spinner>
      </div>
    </div>
  `,
  styles: [`
    .padding {
      padding: -10px -10px -10px -10px;
      background: -webkit-linear-gradient(top, #ffffff 0%, #ffffff 100%);
    }

    .content {
      font-size: 10px;
    }

    .heading {
      font-weight: bolder;
      font-size: 22px;
    }

    .hint {
      font-size: 12px;
    }
    
     .content{
      font-size: 12px;
      line-height: 130%;
    }
    
    h3{
     font-weight: bolder !important;
     letter-spacing: 1px !important;
     font-size: 20px !important;
     font-family: 'Montserrat', sans-serif !important;
    }
    
    .mat-card{
    border: 1px solid lightgrey !important;
    box-shadow: none !important;
    }
  `]
})
export class SettingsLastMinuteDiscountsComponent implements OnInit, OnDestroy{
  private dialogRef: MatDialogRef<any>;
  isAlive = true;
  isLoading = false;
  isLoaded = false;
  discountsLoading = true;

  discounts: LastMinuteDiscount[];

  constructor(private router: Router, private dialog: MatDialog, private store: Store<State>, private service: StayDuvetService) {
  }

  ngOnInit() {
   this.setupDiscounts();
  }

  setupDiscounts() {
    this.store.select(getDiscounts).takeWhile(() => this.isAlive).subscribe((discounts) => {
     this.discounts = discounts;
    });

    this.store.select(getIsDiscountsLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.isLoading = loading;
    });

    this.store.select(getIsDiscountsLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.isLoaded = loaded;
    });

    const upcomingCombined = Observable.merge(
      this.store.select(getDiscounts),
      this.store.select(getIsDiscountsLoading),
      this.store.select(getIsDiscountsLoaded),
      ((discounts, loading, loaded) => {
      })
    );

    upcomingCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.isLoading && !this.isLoaded) {
          this.service.fetchSpecialDiscounts().subscribe(() => {
            this.discountsLoading = false;
          });
        }  else if (!this.isLoading && this.isLoaded) {
          this.discountsLoading = false;
        }
      }
    );

  }

  addLastMinuteDiscount() {
    this.dialogRef = this.dialog.open(CreateLastMinuteDiscountComponent);
    this.dialogRef.updateSize('100%','100%');
  }

  openLastMinuteDiscount(discount: LastMinuteDiscount) {
    this.dialogRef = this.dialog.open(CreateLastMinuteDiscountComponent);
    const instance = this.dialogRef.componentInstance;
    instance.lastMinuteDiscount = discount;
    this.dialogRef.updateSize('100%','100%');
  }

  openTools() {
    this.router.navigate(['/settings/tools']);
  }

  ngOnDestroy() {
    this.isAlive = false;
  }
}
