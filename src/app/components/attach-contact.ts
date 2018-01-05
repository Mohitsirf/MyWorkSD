/**
 * Created by divyanshu on 07/09/17.
 */

import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {StayDuvetService} from '../services/stayduvet';
import {Listing} from '../models/listing';
import {Store} from '@ngrx/store';
import {getIsVendorsLoaded, getIsVendorsLoading, getListings, getVendors, State} from '../reducers/index';
import {Subscription} from "rxjs/Subscription";
import {ManagementContact} from "../models/management-contact";
import {getContactMaintenanceCatagoryType, getContactMaintenanceCatagoryTypes} from "../utils";
import {Observable} from "rxjs/Observable";
import {isNullOrUndefined} from "util";
import {User} from "../models/user";


@Component({
  selector: 'sd-attach-contact',
  template: `
    <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="50px">
      <h4>New Contact:</h4>
      <div fxLayout="column" class="width20">
        <mat-form-field>
          <mat-select placeholder="Category"
                     [(ngModel)]="categoryType"
                     floatPlaceholder="never"
                     (ngModelChange)="filterVendors()"
                     [ngModelOptions]="{standalone: true}"
                     >
            <mat-option *ngFor="let category of categoryTypes" [value]="category.slug">
              {{category.title}}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <mat-spinner [color]="'accent'" *ngIf="vendorsLoading" [diameter]="30" [strokeWidth]="4"></mat-spinner>

      <div fxLayout="column" class="width20">
        <mat-form-field *ngIf="vendorsLoaded">
          <mat-select placeholder="Maintenance Contact"
                     
                     [(ngModel)]="selectedVendor"
                     floatPlaceholder="never"
                     (change)="vendorSelected()"
                     [ngModelOptions]="{standalone: true}"
                     >
            <mat-option *ngFor="let filteredVendor of filteredVendors" [value]="filteredVendor">
              {{filteredVendor.first_name + checkNullString(filteredVendor.last_name)}}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <mat-error style="font-size: x-small;">{{vendorError}}</mat-error>

      </div>
      

      <div fxLayoutAlign="end center">
        <button [disabled]="isAttaching" mat-raised-button color="accent" (click)="attachContact()">Add Contact</button>
        <mat-spinner color="accent" *ngIf="isAttaching" [diameter]="30" [strokeWidth]="4"></mat-spinner>
      </div>
    </div>


  `,
  styles: [`
    
    hr {
      width: 100%;
    }

    mat-spinner {
      height: 30px;
      width: 30px;
    }

    .width20 {
      width: 25%;
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
export class AttachContactComponent implements OnInit, OnDestroy {

  @Input() listing;
  @Output() attached = new EventEmitter();


  isAlive: boolean = true;
  isAttaching: boolean = false;

  vendors: User[];
  vendorsLoading = false;
  vendorsLoaded = false;

  categoryTypes;
  categoryType;
  filteredVendors;
  selectedVendor;

  vendorError;


  getContactMaintenanceCatagoryType;


  constructor(private service: StayDuvetService, private store: Store<State>, private dialog: MatDialog) {

  }
  ngOnInit(): void {
    this.getContactMaintenanceCatagoryType = getContactMaintenanceCatagoryTypes();
    this.categoryTypes = getContactMaintenanceCatagoryTypes();

    this.store.select(getIsVendorsLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.vendorsLoading = loading;
    });
    this.store.select(getIsVendorsLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.vendorsLoaded = loaded;
    });
    this.store.select(getVendors).takeWhile(() => this.isAlive).subscribe((vendors) => {
      if (vendors) {
        this.vendors = vendors;
        this.filterVendors();
      }
    });

    const mergedObservables = Observable.merge(
      this.store.select(getIsVendorsLoading),
      this.store.select(getIsVendorsLoaded),
      this.store.select(getVendors),
      ((breakdown, loading, loaded) => {
      })
    );

    mergedObservables.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.vendorsLoading && !this.vendorsLoaded) {
          this.service.getVendors().subscribe();
        }
      });
  }

  attachContact() {

    if(isNullOrUndefined(this.selectedVendor) )
    {
     this.vendorError = 'This field is required.';
      return;
    }
    this.isAttaching = true;
    this.service.updateVendorContacts(String(this.listing.id),this.selectedVendor).subscribe(() => {
      this.isAttaching = false;
      this.attached.emit();

    });
  }

  checkNullString(string: string): string {
    if (string != null) {
      return ' '.concat(string);
    } else {
      return '';
    }
  }

  filterVendors() {
    this.filteredVendors = this.vendors.filter((vendor) => {
      if (this.categoryType) {
        return vendor.getManagementContact().category === this.categoryType;
      } else {
        return true;
      }
    });
  }

  vendorSelected()
  {
    this.vendorError = null;
  }



  ngOnDestroy(): void {

    this.isAlive = false;
  }


}
