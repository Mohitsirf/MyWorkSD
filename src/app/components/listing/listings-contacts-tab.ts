import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {ActivatedRoute} from '@angular/router';
import {StayDuvetService} from '../../services/stayduvet';
import {getListingById, State} from '../../reducers';
import {MatDialog, MatDialogRef} from '@angular/material';
import {Listing} from '../../models/listing';
import {getContactMaintenanceCatagoryType, getCoffeeMakerType, getDays, getFrequencies} from '../../utils';
import {ListingVendorsMaintenancesPopupComponent} from './popups/listing-vendors-maintenances';

@Component({
  selector: 'sd-listings-contacts-tab',
  template: `
    <div fxLayout="column" fxLayoutGap="4px" fxFlex="100%" style="margin-top: 15px; margin-bottom: 50px">
      <mat-card class="header" style="padding-top: 0px;" fxLayout="row" fxLayoutAlign="space-between none">
        <div fxLayout="column" fxLayoutGap="5px">
          <h2>Vendors and Maintenance:</h2>
          <span class="content" fxFlex="70%">
           These are the instructions we send our guests to ensure they know everything about the house.
         </span>
        </div>
        <button mat-fab color="accent" (click)="updateContact()"
                style="margin-top: 10px">
          <mat-icon>border_color</mat-icon>
        </button>
      </mat-card>
      <mat-card class="padding" fxLayout="column" fxLayoutGap="10px">
        <div fxLayout="column" fxLayoutGap="5px">
          <div fxLayout="row" fxLayoutGap="20px">
          <span style="font-size: 18px; font-weight: bolder;"> 
            I would like Duvet to call me on maintenance cost that exceeds
          </span>
            <mat-select
              *ngIf="!thresholdUpdating"
              fxFlex="10%"
              matInput
              [(ngModel)]="task_threshold"
              (ngModelChange)="thresholdChanged()">
              <mat-option *ngFor="let limit of limits" [value]="limit">
                {{ limit }}
              </mat-option>
            </mat-select>
          </div>

          <span class="content">
          Keep in mind if Duvet can fix the problem in a timely fashion we do not have to refund the guest for the inconvenience.
       </span>
        </div>

        <hr>

        <div fxLayout="row">
          <strong>Fun Fact:</strong>
          <span class="content">
          If your property is local to Charleston Duvet will take your trash cans do the curbs on the day specified.
        </span>
        </div>

        <div fxLayout="row" fxLayoutAlign="space-around center" style="margin-top: 20px;">
          <div fxFlex="20%" fxLayout="column" fxLayoutGap="10px">
            <span class="heading">Recycling: </span>
          </div>

          <mat-spinner [color]="'accent'" *ngIf="recyclingUpdating" [diameter]="30" [strokeWidth]="4"></mat-spinner>

          <mat-select
            *ngIf="!recyclingUpdating"
            fxFlex="15%"
            matInput
            [(ngModel)]="recycling_day_frequency"
            (ngModelChange)="recyclingChanged()">
            <mat-option *ngFor="let frequency of frequencies" [value]="frequency.slug">
              {{ frequency.title }}
            </mat-option>
          </mat-select>

          <mat-select
            *ngIf="!recyclingUpdating"
            fxFlex="15%"
            matInput
            [(ngModel)]="recycling_day"
            (ngModelChange)="recyclingChanged()">
            <mat-option *ngFor="let day of days" [value]="day.slug">
              {{ day.title }}
            </mat-option>
          </mat-select>
        </div>
        <div fxLayout="row" fxLayoutAlign="space-around center" style="margin-top: 20px;">
          <div fxFlex="20%" fxLayout="column" fxLayoutGap="10px">
            <span class="heading">Trash: </span>
          </div>

          <mat-spinner [color]="'accent'" *ngIf="trashUpdating" [diameter]="30" [strokeWidth]="4"></mat-spinner>

          <mat-select
            *ngIf="!trashUpdating"
            fxFlex="15%"
            matInput
            [(ngModel)]="trash_day_frequency"
            (ngModelChange)="trashChanged()">
            <mat-option *ngFor="let frequency of frequencies" [value]="frequency.slug">
              {{ frequency.title }}
            </mat-option>
          </mat-select>

          <mat-select
            *ngIf="!trashUpdating"
            fxFlex="15%"
            matInput
            [(ngModel)]="trash_day"
            (ngModelChange)="trashChanged()">
            <mat-option *ngFor="let day of days" [value]="day.slug">
              {{ day.title }}
            </mat-option>
          </mat-select>
        </div>


        <div fxLayout="column" fxLayoutGap="5px">
          <h2>Maintenance and Contacts:</h2>
          <div fxLayout="row">
            <strong>Fun Fact:</strong>
            <span class="content">
          If Duvet can get fixed in a timely manner we do not have to refund the guest!
        </span>
          </div>
        </div>

        <hr>

        <div fxLayout="column" fxLayoutGap="20px" *ngFor="let vendor of vendors">
          <div fxLayout="row" fxLayoutGap="20px" style="padding: 15px 0px 10px">
            <div fxFlex="15%" fxLayoutAlign="end">
              <strong>{{getCategory(vendor.managementContact.data.category)}}:</strong>
            </div>
            <div fxFlex="35%" fxLayout="column" fxLayoutGap="10px">
              <span>{{vendor.first_name + checkNullString(vendor.last_name)}}</span>
              <span>{{vendor.phone_number}}</span>
              <span>{{vendor.email}}</span>
            </div>
            <div fxLayout="column" style="background-color: whitesmoke;white-space: pre-line;" fxFlex="45%">
              <span>{{vendor.description}}</span>
            </div>
          </div>
          <hr>
        </div>

      </mat-card>

      <button mat-raised-button color="accent" style="width: 100%">ADD CONTACTS TO ALL MY LISTINGS</button>

    </div>

  `,
  styles: [`
    .padding {
      padding: -10px -10px -10px -10px;
      background: -webkit-linear-gradient(top, #ffffff 0%, #ffffff 100%);
    }

    .content {
      font-size: 14px;
      line-height: 130%;
      font-family: roboto;
      color: grey;
    }

    hr {
      width: 100%;
    }

    h2 {
      font-family: montserrat;
      font-weight: bold;
      color: dimgray;
    }

    .mat-button {
      height: 30px;
      line-height: 20px;
      min-height: 25px;
      vertical-align: top;
      font-size: 13px;
      color: white;
      padding-left: 10px;
      padding-right: 10px;
      margin: 0;
    }

    span {
      font-family: roboto;
      color: grey;
    }

    .mat-card {
      border: 1px solid lightgrey !important;
      box-shadow: none !important;
    }

    .multi-line-content {
      font-family: 'Roboto', sans-serif;
      white-space: pre-line;
    }

    .bold {
      font-size: 20px;
      font-weight: 900;
    }

    .header {
      padding: -10px -10px -10px -10px;
      background: whitesmoke;
      margin-top: 25px;
    }

    strong {
      font-family: 'Roboto', sans-serif;
      color: dimgray;
    }
  `]
})

export class ListingsContactsTabComponent implements OnInit, OnDestroy {

  selectedListing: Listing;
  maintenances = [];
  vendors = [];
  housekeepers = [];
  private dialogRef: MatDialogRef<any>;
  getCoffeeMakerType;
  private isAlive: boolean = true;

  trash_day: string;
  trash_day_frequency: string;
  recycling_day: string;
  recycling_day_frequency: string;
  task_threshold: string;
  trashUpdating = false;
  recyclingUpdating = false;
  thresholdUpdating = false;
  days = getDays();
  frequencies = getFrequencies();
  limits = ['$500', '$700', '$1000', 'all'];

  listing: Listing;


  constructor(private route: ActivatedRoute,
              private store: Store<State>,
              private service: StayDuvetService,
              private dialog: MatDialog) {
    this.getCoffeeMakerType = getCoffeeMakerType;
  }

  ngOnInit() {


    this.route.parent.params.subscribe((params) => {
      const listingId = +params['id'];

      this.store.select((state) => {
        return getListingById(state, listingId);
      }).takeWhile(() => this.isAlive).subscribe((listing) => {
        this.listing = listing;
        this.vendors = listing.getMaintenancesContacts();
        console.log(this.vendors);
        console.log(this.listing);
        this.trash_day = listing.trash_day;
        this.trash_day_frequency = listing.trash_day_frequency;
        this.recycling_day = listing.recycling_day;
        this.recycling_day_frequency = listing.recycling_day_frequency;
        this.task_threshold = listing.task_threshold;
        this.maintenances = [];
        this.housekeepers = [];
        this.selectedListing = listing;
        this.selectedListing.getMaintenances().map((maintenance) => {
          if (maintenance.type === 'guest') {
          } else if (maintenance.type === 'housekeeper') {
            this.housekeepers.push(maintenance);
          } else if (maintenance.type === 'maintenance') {
            this.maintenances.push(maintenance);
          }
        });
      });
    });


  }


  checkNullString(string: string): string {
    if (string != null) {
      return ' '.concat(string);
    } else {
      return '';
    }
  }

  getCategory(slug: string): string {
    return getContactMaintenanceCatagoryType(slug).title;
  }

  recyclingChanged() {
    this.recyclingUpdating = true;
    this.service.updateListingDetails(
      {recycling_day: this.recycling_day, recycling_day_frequency: this.recycling_day_frequency},
      String(this.selectedListing.id)).subscribe((success) => {
      this.recyclingUpdating = false;
    }, () => {
      this.recyclingUpdating = false;
    });
  }

  trashChanged() {
    this.trashUpdating = true;
    this.service.updateListingDetails(
      {trash_day: this.trash_day, trash_day_frequency: this.trash_day_frequency},
      String(this.selectedListing.id)).subscribe((success) => {
      this.trashUpdating = false;
    }, () => {
      this.trashUpdating = false;
    });
  }

  updateContact() {
    this.dialogRef = this.dialog.open(ListingVendorsMaintenancesPopupComponent);
    const instance = this.dialogRef.componentInstance;
    instance.listing = this.selectedListing;
    this.dialogRef.updateSize('100%', '100%');
  }

  thresholdChanged() {
    this.thresholdUpdating = true;
    this.service.updateListingDetails(
      {task_threshold: this.task_threshold},
      String(this.selectedListing.id)).subscribe((success) => {
      this.thresholdUpdating = false;
    }, () => {
      this.thresholdUpdating = false;
    });
  }

  ngOnDestroy() {
    this.isAlive = false;
  }
}
