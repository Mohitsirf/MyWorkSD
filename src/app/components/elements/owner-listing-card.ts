import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Listing} from '../../models/listing';
import {User} from '../../models/user';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ListingHouseSecretPopupComponent} from '../listing/popups/listing-house-secret-popup';
import {ListingOwnerBlockPopupComponent} from '../listing/popups/listing-owner-block-popup';
import {StayDuvetService} from '../../services/stayduvet';
import * as addDays from 'date-fns/add_days';
import {getDateObj} from "../calendar/calendar-utils";

/**
 * Created by piyushkantm on 20/06/17.
 */
@Component({
  selector: 'sd-owner-listing-card',
  template: `
    <mat-card style="margin-top: 15px;margin-bottom: 15px">
      <div fxLayout="row">
        <div fxFlex="300px" fxLayoutAlign="center center">
          <a style="cursor:pointer" (click)="openListingDetail()">
            <img class="embedImage" src="{{ listing.getPosterUrl() }}">
          </a>
        </div>
        <div class="verticalLine"></div>
        <div fxLayout="column" fxFlex="100%" fxLayoutAlign="start start">

          <div *ngIf="listing.status == 'draft'" style="padding-left: 5px;width: 100%">
            <div fxLayout="row" style="background-color: lightgray;height: 14px;border-radius: 7px;overflow: hidden;">
              <div fxFlex="{{percentProgress}}%" style="background-color: orange">
              </div>
            </div>
            <div fxLayout="row" fxLayoutAlign="end center" style="height: 14px;font-size: 12px;">
              <p>{{percentProgress | number:'2.0-0' }}% Complete</p>
            </div>
          </div>
          <div fxLayout="row" style="margin-bottom: 5px;">
                     <span style="cursor:pointer;font-size: 30px;font-family: 'Montserrat', sans-serif;"
                           (click)="openListingDetail()">{{ listing.title }}</span>
          </div>
          <div fxLayout="row" style="margin-bottom: 10px;">
                   <span style="font-weight: 500">
                     {{ listing?.getFullAddress() }}
                   </span>
          </div>

          <div fxLayout="row" fxLayoutGap="10px" fxLayoutWrap>
            <mat-chip-list *ngFor="let tag of listing.getTags()">
              <mat-chip>
                <span style="width: 100%;text-align: center">
                  {{tag.title}}
                </span>
              </mat-chip>
            </mat-chip-list>
          </div>


          <div style="margin-top:5px" fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="10px">
            <div>
                        <span style="font-size: 15px;font-family: 'Montserrat', sans-serif;font-weight: bolder">
                          Entire Home/Apt.
                        </span>
            </div>
            <div>
              <span style="font-size: 22px;font-weight: bolder;text-align: center">|</span>
            </div>
            <div>
                        <span style="font-size: 15px;font-family: 'Montserrat', sans-serif;font-weight: bolder">
                          {{listing.maximum_guest_number}} Guest(s)
                        </span>
            </div>
            <div>
              <span style="font-size: 22px;font-weight: bolder;text-align: center">|</span>
            </div>
            <div>
                        <span style="font-size: 15px;font-family: 'Montserrat', sans-serif;font-weight: bolder">
                          {{listing.rooms.length}} Room(s)
                        </span>
            </div>
            <div>
              <span style="font-size: 22px;font-weight: bolder;text-align: center">|</span>
            </div>
            <div>
                        <span style="font-size: 15px;font-family: 'Montserrat', sans-serif;font-weight: bolder">
                          {{listing.bed_count}} Bed(s)
                        </span>
            </div>
          </div>
          <div fxLayout="column" fxLayoutGap="5px" fxLayoutAlign="start" *ngIf="listing.status=='accepted'">

            <div fxLayout="row">
              <span class="stars-container stars-{{starPercent}}">★★★★★</span>
            </div>

            <div fxLayout="row" fxLayoutGap="10px" fxLayoutAlign=" center">
              <button mat-raised-button color="accent" (click)="popup()">House Secrets</button>
              <button mat-raised-button color="accent" (click)="openListingCalendar()">Calendar</button>
              <button mat-raised-button color="accent" (click)="openListingDetail()">Manage</button>
              <button mat-raised-button color="accent" (click)="openListingDetail()">Preview</button>
              <mat-spinner *ngIf="instantBookingLoading" [color]="'accent'" [diameter]="30" [strokeWidth]="4"></mat-spinner>
              <button mat-icon-button *ngIf="!instantBookingLoading" (click)="boltButtonClicked()">
                <mat-icon *ngIf="!listing.instant_book"
                          matTooltip="Instant Book"
                          [matTooltipPosition]="'right'"
                          color="primary">
                  flash_on
                </mat-icon>
                <mat-icon *ngIf="listing.instant_book"
                          matTooltip="Instant Book"
                          [matTooltipPosition]="'right'"
                          style="color: gold">
                  flash_on
                </mat-icon>
              </button>
            </div>
          </div>
          <div fxlayout="row" fxLayoutAlign="start center" *ngIf="listing.status=='rejected'">
            <span style="color: red"><mat-icon>priority_high</mat-icon> The Listing was rejected for the following reason:</span>
          </div>


          <div fxlayout="row"
               style="width: 100%; margin-left: 30px"
               fxLayoutAlign="start "
               *ngIf="listing.status=='rejected'">
            <div style="font-size: 20px;">
              <p>{{listing.rejection_reason}}</p>
            </div>
          </div>


          <div fxlayout="row"
               style="width: 100%;margin-top: 20px;"
               fxLayoutAlign="start "
               fxLayoutGap="10px"
               *ngIf="listing.status=='pending' && user.is_owner">
            <div>
              <p>Listing is being reviewed by our team</p>
            </div>
          </div>

          <div fxlayout="row"
               style="width: 100%;margin-top: 20px;"
               fxLayoutAlign="end center"
               fxLayoutGap="10px"
               *ngIf="listing.status=='pending' && user.is_admin">
            <a mat-raised-button (click)="approveListing()" color="primary">
              <mat-icon>done</mat-icon>
              Approve</a>
            <a mat-raised-button (click)="rejectListing()" color="warn">
              <mat-icon>delete</mat-icon>
              Reject</a>
          </div>


          <div fxlayout="row"
               style="width: 100%;margin-top: 20px;"
               fxLayoutAlign="end center"
               fxLayoutGap="10px"
               *ngIf="listing.status=='draft'">
            <a mat-raised-button (click)="openListingDetail()" color="primary">
              <mat-icon>remove_red_eye</mat-icon>
              Preview</a>
            <a mat-raised-button (click)="submitListingForApproval()" color="primary">
              <mat-icon>done</mat-icon>
              Submit for Approval</a>
          </div>
          <div fxlayout="row"
               style="width: 100%;margin-top: 20px;"
               fxLayoutAlign="end center"
               fxLayoutGap="10px"
               *ngIf="listing.status=='rejected'&& user.is_owner">
            <a mat-raised-button (click)="submitListingForApproval()" color="primary" *ngIf="user.is_owner">
              <mat-icon>settings_backup_restore</mat-icon>
              Re-Submit for Approval</a>
          </div>
        </div>
      </div>
    </mat-card>
  `,
  styles: [
      `
      mat-spinner {
        height: 36px;
        width: 36px;
      }

      span {
        /*color:white !important;*/
      }

      .embedImage {
        border-radius: 5px;
        box-shadow: 1px 1px 5px gray;
        height: auto;
        width: 110%;
      }

      .verticalLine {
        margin-left: 50px;
        margin-right: 10px;
        border-left: 2px solid #333;
      }
    `
  ]
})
export class OwnerListingCardComponent implements OnInit {
  @Input() listing: Listing;
  @Input() user: User;
  @Output() openListing = new EventEmitter;
  @Output() openCalendar = new EventEmitter;
  @Output() submitForApproval = new EventEmitter;
  @Output() approve = new EventEmitter;
  @Output() reject = new EventEmitter;

  instantBookingLoading = false;
  private dialogRef: MatDialogRef<any>;


  percentProgress ;

  constructor(private dialog: MatDialog, private service: StayDuvetService) {
  }

  ngOnInit(): void {
    console.log('onInit sd-owner-listing-card');
    this.percentProgress = this.listing.getProgress();
  }

  openListingDetail() {
    this.openListing.emit();
  }

  popup() {
    const dialogRef = this.dialog.open(ListingHouseSecretPopupComponent, {disableClose: true});
    const instance = dialogRef.componentInstance;
    instance.listing = this.listing;
    dialogRef.updateSize('100%','100%');
  }

  submitListingForApproval() {
    this.submitForApproval.emit();
  }

  approveListing() {
    this.approve.emit();
  }

  rejectListing() {
    this.reject.emit();
  }


  createOwnerBlockPopup() {
    const data = {
      startDate: getDateObj(),
      endDate: addDays(getDateObj(), 1),
      reason: '',
      listingId: this.listing.id
    }
    this.dialogRef = this.dialog.open(ListingOwnerBlockPopupComponent, {
      data: data
    });
    this.dialogRef.updateSize('100%');
  }

  openListingCalendar() {
    this.openCalendar.emit();
  }

  boltButtonClicked() {
    let data = {};
    this.instantBookingLoading = true;
    data['instant_book'] = !this.listing.instant_book;
    this.service.updateListingDetails(data, String(this.listing.id)).subscribe((res) => {
      this.instantBookingLoading = false;
    });
  }
}
