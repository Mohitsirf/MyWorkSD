import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material";
import {StayDuvetService} from "../../services/stayduvet";
import {Store} from "@ngrx/store";
import {
  getAutoResponses, getIsAssgineesLoaded, getIsAutoResponseLoaded, getIsAutoResponseLoading, getListings,
  State
} from "../../reducers/index";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {ListingCannedMessagePopupComponent} from "../listing/popups/listing-canned-message-popup";
import {isNullOrUndefined} from "util";
import {Listing} from "../../models/listing";
import {AutoResponse} from "../../models/auto-response";
import {ListingAutoResponsePopupComponent} from "../listing/popups/listing-auto-response-popup";


@Component({
  selector: 'sd-settings-auto-response',
  template: `
    <div fxLayout="column" fxLayoutAlign="start stretch" fxLayoutGap="15px" style="margin-top: 10px;" class="bottom-padding">

      <div fxLayoutAlign="start center" *ngIf="!listingId">
        <button mat-raised-button color="primary" (click)="openTools()">
          <mat-icon>arrow_back</mat-icon>
          Back
        </button>
      </div>
      
      <div id="content" fxLayout="column" fxLayoutAlign="start stretch" fxLayoutGap="10px">

        <div fxLayoutAlign="space-between start">
          <div fxLayout="column" fxLayoutAlign="center start" fxLayoutGap="10px" class="para">
            <span class="heading">Auto Responses</span>
            <span class="hint">Set predefined messages if you are'nt able to respond within a certain amount of time..</span>
          </div>
          <button mat-raised-button color="accent" (click)="addAutoResponse()">
            Add New Auto Response
          </button>
        </div>

        <hr>

        <div fxLayoutAlign="center center">

        <mat-spinner color="accent" *ngIf="isLoading" [diameter]="60" [strokeWidth]="5"></mat-spinner>
        <div fxLayout="column" *ngIf="isLoaded" fxLayoutGap="10px" fxFlex="100%">
          <div fxLayout="column" fxLayoutGap="20px">
            
              <div fxLayout="row " fxLayoutGap="10px" fxLayoutAlign="start center">
                <div class="vertical-line"></div>
                <h3>For Confirmed Guests</h3>
              </div>

              <h4 style="text-align: center; font-size: small" *ngIf="confirmedGuestResponses.length === 0">
                No Auto Responses Found For Confirmed Guests
              </h4>

              <div *ngFor="let item of confirmedGuestResponses">

              <mat-card class="padding" (click)="editResponse(item)"  style="cursor: pointer">
                <mat-card-content>
                  <div fxLayout="row" fxLayoutAlign="space-between center">
                    <h3>{{item.title}}</h3>

                    <span class="mat-button"
                          style="background-color: darkorange;text-align: center; color: white">
                    {{getText(item.property_ids)}}
                     </span>
                  </div>
                  
                  <div class="content">
                    {{item.message}}
                  </div>
                  <br>
                  
                </mat-card-content>
              </mat-card>

            </div>
            
          </div>

          <div fxLayout="column" fxLayoutGap="20px">

            <div fxLayout="row " fxLayoutGap="10px" fxLayoutAlign="start center">
              <div class="vertical-line"></div>
              <h3>For Non-Confirmed Guests</h3>
            </div>

            <h4 style="text-align: center; font-size: small" *ngIf="nonConfirmedGuestResponses.length === 0">
              No Auto Responses Found For Non-Confirmed Guests
            </h4>

            <div *ngFor="let item of nonConfirmedGuestResponses">

              <mat-card class="padding" (click)="editResponse(item)"  style="cursor: pointer">
                <mat-card-content>
                  <div fxLayout="row" fxLayoutAlign="space-between center">
                    <h3>{{item.title}}</h3>

                    <span class="mat-button"
                          style="background-color: darkorange;text-align: center; color: white">
                    {{getText(item.property_ids)}}
                     </span>
                  </div>

                  <div class="content">
                    {{item.message}}
                  </div>
                  <br>

                </mat-card-content>
              </mat-card>

            </div>

          </div>
        </div>
      </div>

      </div>


    </div>
  `,
  styles: [
      `
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

      .content {
        font-size: 12px;
        line-height: 130%;
      }

      h3 {
        font-weight: bolder !important;
        letter-spacing: 1px !important;
        font-size: 20px !important;
        font-family: 'Montserrat', sans-serif !important;
      }

      .mat-card {
        border: 1px solid lightgrey !important;
        box-shadow: none !important;
      }

      .hint {
        font-size: 12px;
        margin-left: 2px;
      }

      #spinner {
        position: fixed;
        top: 45%;
        right: 40%
      }

      div.vertical-line {
        width: 5px; /* Line width */
        background-color: green; /* Line color */
        height: 20px; /* Override in-line if you want specific height. */
        float: left;
        /* Causes the line to float to left of content. 
               You can instead use position:absolute or display:inline-block
               if this fits better with your design */
      }
     
    `
  ]
})
export class SettingsAutoResponseComponent implements OnInit,OnDestroy {



  isAlive = true;
  isLoading = false;
  isLoaded = false;
  isDeleting = false;



  private dialogRef:MatDialogRef<any>;

  listings:Listing[] = [];

  @Input() confirmedGuestResponses : AutoResponse[] = [];
  @Input() nonConfirmedGuestResponses : AutoResponse[] = [];


  @Input() listingId;



  constructor(private router:Router, private route: ActivatedRoute, private service: StayDuvetService, private dialog: MatDialog, private store: Store<State>) {
  }

  ngOnInit(): void {
    console.log('onInit sd-listing-channel-tab');

    if(!this.listingId)
    {
      this.setUpAutoResponses();
    }
    else {
      this.isLoaded=true;
      this.isLoading=false;
    }

    this.store.select(getListings).takeWhile(() => this.isAlive).subscribe((listings) => {
      this.listings = listings;
    });
  }


  setUpAutoResponses() {

    this.store.select(getAutoResponses).takeWhile(() => this.isAlive).subscribe((responses) => {

      if(responses)
      {
        this.confirmedGuestResponses  =  responses.filter( response =>  response.type.includes('confirmed'));
        this.nonConfirmedGuestResponses  =  responses.filter( response =>  !response.type.includes('confirmed'));

      }
    });


    this.store.select(getIsAutoResponseLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.isLoading = loading;
    });

    this.store.select(getIsAutoResponseLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.isLoaded = loaded;
    });

    const upcomingCombined = Observable.merge(
      this.store.select(getAutoResponses),
      this.store.select(getIsAutoResponseLoaded),
      this.store.select(getIsAutoResponseLoading),
      ((tasks, loading, loaded) => {
      })
    );

    upcomingCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.isLoaded && !this.isLoading) {
          this.service.getAutoResponses().subscribe();
        }
      }
    );
  }




  addAutoResponse() {
    this.dialogRef = this.dialog.open(ListingAutoResponsePopupComponent);
    const instance = this.dialogRef.componentInstance;
    instance.popUpTitle = "Add New Auto Response";
    instance.listings = this.listings;
    instance.listingId = this.listingId;
    this.dialogRef.updateSize('100%','100%');
  }

  editResponse(response:AutoResponse)
  {

    this.dialogRef = this.dialog.open(ListingAutoResponsePopupComponent);
    const instance = this.dialogRef.componentInstance;
    instance.responseId = response.id;
    instance.title = response.title;
    instance.message = response.message;
    instance.type = response.type;
    instance.offset = response.offset;
    instance.popUpTitle = "Edit Auto Response";
    instance.isEditType = true;
    instance.listingIds =  response.property_ids;
    instance.listings = this.listings;
    this.dialogRef.updateSize('100%','100%');
  }


  getText(ids:number[])
  {
    if(isNullOrUndefined(ids) || ids.length == 0)
    {
      return 'On No Listings';
    }

    const listingIds = this.listings.map(listing => listing.id);

    if(listingIds.length == ids.length)
    {
      return 'On All Listings';
    }

    if(listingIds.length > ids.length)
    {
      return 'On Multiple Listings';
    }

  }


  getListingsTitle(ids:number[])
  {
    if(isNullOrUndefined(ids))
    {
      return;
    }
    return this.listings.filter(listing => ids.includes(listing.id)).map(listing => listing.title).join(', ');
  }


  openTools() {
    this.router.navigate(['/settings/tools']);
  }

  ngOnDestroy(): void {
    this.isAlive  =false;
  }
}
