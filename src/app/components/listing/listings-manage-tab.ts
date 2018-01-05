import {Component, OnDestroy, OnInit} from '@angular/core';
import {ListingPropertyAccessPopupComponent} from './popups/listing-property-access-popup';
import {Listing} from '../../models/listing';
import {MatDialog, MatDialogRef} from '@angular/material';
import {getDays, getFrequencies, getCoffeeMakerType} from '../../utils';
import {StayDuvetService} from '../../services/stayduvet';
import {getListingById, State} from '../../reducers';
import {Store} from '@ngrx/store';
import {ActivatedRoute} from '@angular/router';
import {ListingEntertainmentInstructionsPopupComponent} from './popups/listing-house-entertainment-instructions-popup';
import {ListingCommonTextPopupComponent} from './popups/listing-common-text-popup';

@Component({
  selector: 'sd-listings-manage-tab',
  template: `
    <div fxLayout="column" fxLayoutGap="4px" fxFlex="100%" style="margin-top: 15px; margin-bottom: 50px">
      <mat-card class="header" style="padding-top: 0px" fxLayout="row" fxLayoutAlign="space-between none">
        <div fxLayout="column" fxLayoutGap="5px">
          <h2>Property Access instructions</h2>
          <span class="content">
        These are the instructions we send our guests to ensure they know everything about the house.
      </span>
        </div>
        <button mat-fab color="accent" (click)="editPropertyAccessPopup()" style="margin-top: 10px">
          <mat-icon>border_color</mat-icon>
        </button>
      </mat-card>
      <mat-card class="padding" fxLayout="column" fxLayoutGap="10px">
        <div fxLayout="column" fxLayoutGap="5px">
        <span style="font-size: 18px; font-weight: bolder;"> 
          How the Guests will access your home after they have parked their vehicle?
        </span>
          <div fxLayout="row">
            <strong>Fun Fact:</strong>
            <span class="content">
            Business travellers require a keyless entry to guarantee 24 hour arrival access
          </span>
          </div>
        </div>

        <hr>


        <div style="padding-left: 15px;" fxLayout="column" fxLayoutGap="15px">
          <div>
          <span style="font-size: 18px; font-weight: lighter" class="multi-line-content"> 
            {{selectedListing.property_access_note}}
          </span>
          </div>
          <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="10px"
               style="text-align: center; background-color: #c2c2c2; width: fit-content; height: 30px">
            <strong style="padding-left: 10px">{{selectedListing.property_access_title}}:</strong>
            <span class="bold">  {{selectedListing.property_access_code}} </span>
          </div>
        </div>


        <div fxLayout="column" fxLayoutGap="5px">
          <h2>Parking:</h2>
          <div fxLayout="row">
            <strong>Fun Fact:</strong>
            <span class="content">
            Business travellers require a keyless entry to guarantee 24 hour arrival access
          </span>
          </div>
        </div>

        <div style="padding-left: 15px;" fxLayout="column" fxLayoutGap="15px">
          <div>
          <span style="font-size: 18px; font-weight: lighter" class="multi-line-content"> 
            {{selectedListing.parking_note}}
          </span>
          </div>
        </div>


      </mat-card>
      <mat-card class="header" style="padding-top: 0px" fxLayout="row" fxLayoutAlign="space-between none">
        <div fxLayout="column" fxLayoutGap="5px">
          <h2>Entertainment instructions</h2>
          <span class="content">
        These are the instructions we send our guests to ensure they know everything about the house.
      </span>
        </div>
        <button mat-fab color="accent" (click)="editEntertainmentInstructionsPopup()" style="margin-top: 10px">
          <mat-icon>border_color</mat-icon>
        </button>
      </mat-card>

      <mat-card class="padding" fxLayout="column" fxLayoutGap="10px">
        <div fxLayout="column" fxLayoutGap="5px">
        <span style="font-size: 18px; font-weight: bolder;"> 
          Please provide how guests can access your tv,stereo, or any extra amenity you allow guest to use?
        </span>
          <div fxLayout="row">
            <strong>Fun Fact:</strong>
            <span class="content">
            We require a basic cable subscription or a netflix account
          </span>
          </div>
        </div>

        <hr>

        <div style="padding-bottom: 30px;padding-left: 15px;">
          <div fxLayout="column" fxLayoutGap="20px" class="multi-line-content">
            <span style="font-size: 18px; font-weight: lighter">{{selectedListing.entertainment_note}}</span>
          </div>
          <span style="flex: 1 1 auto"></span>
        </div>
        <div fxLayout="column" fxLayoutGap="10px" style="padding-left: 15px;">
          <div fxLayoutAlign="space-between center" style="width: 90%; background-color: #c2c2c2; height: 30px">
            <div fxLayoutAlign="start center" fxFlex="45%" style="padding-left: 10px">
              <strong>Netflix Username:</strong>
              &nbsp;
              <span>{{selectedListing.netflix_username}}</span>
            </div>
            <div fxLayoutAlign="start center" fxFlex="45%">
              <strong>Netflix Password:</strong>
              &nbsp;
              <span>{{selectedListing.netflix_password}}</span>
            </div>
          </div>
          <div fxLayout="row">
            <strong>Coffee Maker
              Type:</strong>&nbsp;<span>{{getCoffeeMakerType(selectedListing.coffee_maker_type).title}}</span>
          </div>
        </div>

        <div fxLayout="column" fxLayoutGap="5px">
          <h2>Wifi Info:</h2>
          <div fxLayout="row">
            <strong>Fun Fact:</strong>
            <span class="content">
            Business travellers require a keyless entry to guarantee 24 hour arrival access
          </span>
          </div>
        </div>

        <hr>

        <div fxLayout="column" fxLayoutGap="10px" style="padding-left: 15px;">
          <div fxLayoutAlign="space-between center" style="width: 90%; background-color: #c2c2c2; height: 30px">
            <div fxLayoutAlign="start center" fxFlex="45%" style="padding-left: 10px">
              <strong>Network:</strong>
              &nbsp;
              <span>{{selectedListing.wifi_network}}</span>
            </div>
            <div fxLayoutAlign="start center" fxFlex="45%">
              <strong>Password:</strong>
              &nbsp;
              <span>{{selectedListing.wifi_password}}</span>
            </div>
          </div>
        </div>
        <div style="padding-bottom: 30px;padding-left: 15px;">
          <div fxLayout="column" fxLayoutGap="20px" >
            <span style="font-size: 18px; font-weight: lighter" class="multi-line-content">{{selectedListing.wifi_note}}</span>
          </div>
          <span style="flex: 1 1 auto"></span>
        </div>
      </mat-card>
      <mat-card class="header" style="padding-top: 0px;" fxLayout="row" fxLayoutAlign="space-between none">
        <div fxLayout="column" fxLayoutGap="5px">
          <h2>Private Notes:</h2>
          <span class="content">
        This is for Duvet only. Any information here will not be sent to the guest but helps our team provide the best service
      </span>
        </div>
        <button mat-fab color="accent" (click)="openDialog('Private Notes', 'private_notes')" style="margin-top: 10px">
          <mat-icon>border_color</mat-icon>
        </button>
      </mat-card>

      <mat-card class="padding" fxLayout="column" fxLayoutGap="10px">
        <div fxLayout="column" fxLayoutGap="5px">
        <span style="font-size: 18px; font-weight: bolder;color: #5a6e81;"> 
          Tell us where your  breaker box is located, size of air filter and location?
        </span>
          <div fxLayout="row">
            <strong>Fun Fact:</strong>
            <span class="content">
            Relax let us handle everything, just make sure we know how to do it.
          </span>
          </div>
        </div>

        <hr>

        <div style="padding-bottom: 30px;padding-left: 15px;">
          <div fxLayout="column" fxLayoutGap="20px" >
            <span style="font-size: 18px; font-weight: lighter" class="multi-line-content">{{selectedListing.private_notes}}</span>
          </div>
          <span style="flex: 1 1 auto"></span>
        </div>

      </mat-card>
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

    .bold {
      font-size: 20px;
      font-weight: 900;
    }

    .header {
      padding: -10px -10px -10px -10px;
      background: whitesmoke;
      margin-top: 25px;
    }

    .multi-line-content {
      font-family: 'Roboto', sans-serif;
      white-space: pre-line;
    }

    strong {
      font-family: 'Roboto', sans-serif;
      color: dimgray;
    }
  `]
})

export class ListingsManageTabComponent implements OnInit, OnDestroy {

  selectedListing: Listing;
  private dialogRef: MatDialogRef<any>;
  private isAlive: boolean = true;
  task_threshold: string;
  days = getDays();

  listing: Listing;

  getCoffeeMakerType = getCoffeeMakerType;

  constructor(private route: ActivatedRoute,
              private store: Store<State>,
              private service: StayDuvetService,
              private dialog: MatDialog) {

  }

  editPropertyAccessPopup() {
    this.dialogRef = this.dialog.open(ListingPropertyAccessPopupComponent);
    const instance = this.dialogRef.componentInstance;
    instance.listing = this.selectedListing;
    this.dialogRef.updateSize('100%','100%');
  }

  editEntertainmentInstructionsPopup() {
    this.dialogRef = this.dialog.open(ListingEntertainmentInstructionsPopupComponent);
    const instance = this.dialogRef.componentInstance;
    instance.listing = this.selectedListing;
    this.dialogRef.updateSize('100%','100%');
  }

  ngOnInit() {
    this.route.parent.params.subscribe((params) => {
      const listingId = +params['id'];

      this.store.select((state) => {
        return getListingById(state, listingId);
      }).takeWhile(() => this.isAlive).subscribe((listing) => {
        this.listing = listing;
        console.log(this.listing);
        this.task_threshold = listing.task_threshold;
        this.selectedListing = listing;
      });
    });
  }

  openDialog(title: String, key: String, placeholder?: String) {
    this.dialogRef = this.dialog.open(ListingCommonTextPopupComponent);
    const instance = this.dialogRef.componentInstance;
    instance.listing = this.listing;
    instance.title = title;
    instance.key = key;
    instance.placeholder = placeholder;
    this.dialogRef.updateSize('100%');
  }

  ngOnDestroy() {
    this.isAlive = false;
  }
}
