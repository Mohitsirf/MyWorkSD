import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material";
import {StayDuvetService} from "../../services/stayduvet";
import {Store} from "@ngrx/store";
import {
  getIsSavedMessagesLoaded, getIsSavedMessagesLoading, getListings, getSavedMessages,
  State
} from "../../reducers/index";
import {ActivatedRoute, Router} from "@angular/router";
import {SavedMessage} from "../../models/saved-message";
import {Observable} from "rxjs/Observable";
import {ListingCannedMessagePopupComponent} from "../listing/popups/listing-canned-message-popup";
import {isNullOrUndefined} from "util";
import {Listing} from "../../models/listing";

/**
 * Created by ubuntu on 9/7/17.
 */
@Component({
  selector: 'sd-settings-canned-responses',
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
            <span class="heading">Canned Responses</span>
            <span class="hint">You can create canned responses.</span>
          </div>
          <button mat-raised-button color="accent" (click)="addCannedResponse()">
            Add New Canned Response
          </button>
        </div>

        <hr>

        <div fxLayoutAlign="center center">

        <mat-spinner color="accent" *ngIf="isLoading" [diameter]="60" [strokeWidth]="5"></mat-spinner>
        <div fxLayout="column" *ngIf="isLoaded" fxLayoutGap="10px" fxFlex="100%">
          <h3 style="text-align: center" *ngIf="messages.length === 0">
            No Canned Responses Found
          </h3>
          
          <sd-canned-responses-detail *ngFor="let item of messages" [item]="item"></sd-canned-responses-detail>
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

     
    `
  ]
})
export class SettingsCannedResponsesComponent implements OnInit,OnDestroy {



  isAlive = true;
  isLoading = false;
  isLoaded = false;
  isDeleting = false;



  @Input() messages: SavedMessage[] = [];
  private dialogRef:MatDialogRef<any>;

  listings:Listing[] = [];

  @Input() listingId;



  constructor(private router:Router, private route: ActivatedRoute, private service: StayDuvetService, private dialog: MatDialog, private store: Store<State>) {
  }

  ngOnInit(): void {
    console.log('onInit sd-listing-channel-tab');

    if(!this.listingId)
    {
      this.setUpSavedMessages();
    }
    else {
      this.isLoaded=true;
      this.isLoading=false;
    }

    console.log(this.messages);

    this.store.select(getListings).takeWhile(() => this.isAlive).subscribe((listings) => {
      this.listings = listings;
    });
  }


  setUpSavedMessages() {

    this.store.select(getSavedMessages).takeWhile(() => this.isAlive).subscribe((messages) => {
      this.messages = messages;
    });


    this.store.select(getIsSavedMessagesLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.isLoading = loading;
    });

    this.store.select(getIsSavedMessagesLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.isLoaded = loaded;
    });

    const upcomingCombined = Observable.merge(
      this.store.select(getSavedMessages),
      this.store.select(getIsSavedMessagesLoading),
      this.store.select(getIsSavedMessagesLoaded),
      ((tasks, loading, loaded) => {
      })
    );

    upcomingCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.isLoaded && !this.isLoading) {
          this.service.getSavedMessages().subscribe();
        }
      }
    );
  }




  addCannedResponse() {
    this.dialogRef = this.dialog.open(ListingCannedMessagePopupComponent);
    const instance = this.dialogRef.componentInstance;
    instance.popUpTitle = "Add New Canned Response";
    instance.listings = this.listings;
    instance.listingId = this.listingId;
    this.dialogRef.updateSize('100%','100%');
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
