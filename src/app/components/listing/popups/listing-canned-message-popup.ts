import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Listing} from '../../../models/listing';
import {StayDuvetService} from '../../../services/stayduvet';
import {MatDialog} from '@angular/material';
import {Store} from '@ngrx/store';
import {getListings, State} from '../../../reducers/index';
import {UpdateSuccessAction} from '../../../actions/listing';
import {SavedMessage} from "../../../models/saved-message";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'sd-listing-canned-message-popup',
  template: `
    <sd-modal-popup-layout title="{{popUpTitle}}">

        <form fxLayout="column" [formGroup]="formGroup" (ngSubmit)="formGroup.valid && saveButtonCLicked()">
          <mat-form-field class="detailField">
            <input type="text" matInput color="accent" formControlName="title"   placeholder="Title">
            <mat-error>This field is required.</mat-error>
          </mat-form-field>
          <mat-form-field class="detailField">
            <textarea rows="17" color="accent" matInput placeholder="Message" formControlName="message" ></textarea>
            <mat-error>This field is required</mat-error>
          </mat-form-field>
          <mat-form-field style="width:50%">
            <mat-select multiple placeholder="Select Listings"
                        floatPlaceholder="never"  formControlName='property_ids'>

              <div fxLayout="column">
                <button class="select-button" mat-button (click)="onSelectAll()">Select All</button>
                <button class="select-button" mat-button (click)="onSelectNone()">Select None</button>
              </div>

              <mat-option *ngFor="let listing of listings" [value]="listing.id">
                {{ listing.title }}
              </mat-option>

            </mat-select>
          </mat-form-field>
          <div fxLayout="row" fxLayoutAlign="end center" fxLayoutGap="10px">
            <mat-spinner *ngIf="isSaving" [diameter]="30" [strokeWidth]="4"></mat-spinner>
            <button mat-raised-button color="warn" *ngIf="isEditType" [disabled]="isSaving" (click)="deleteMessage()">Delete</button>
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
      width: 95%;
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

export class ListingCannedMessagePopupComponent implements OnInit ,OnDestroy {

  @Input() popUpTitle ;
  @Input() listingIds;
  @Input() messageId;
  @Input() title;
  @Input() message;
  @Input() isEditType=false;
  @Input() listingId;
  buttonText;

  formGroup: FormGroup;
  messageTitle: FormControl;
  messageContent: FormControl;
  formListingIds: FormControl;
  @Input() listings:Listing[]=[];



  isSaving: Boolean = false;
  isAlive = true;

  constructor(private service: StayDuvetService, private dialog: MatDialog, private store: Store<State>) {
    this.messageTitle = new FormControl(null, [Validators.required]);
    this.messageContent = new FormControl(null, [Validators.required]);
    this.formListingIds = new FormControl(null, []);

    this.formGroup = new FormGroup({
      title: this.messageTitle,
      message: this.messageContent,
      property_ids: this.formListingIds,
    });
  }

  ngOnInit() {



    if (this.isEditType)
    {
      this.buttonText="Edit";
      this.messageTitle.setValue(this.title);
      this.messageContent.setValue(this.message);
      this.formListingIds.setValue(this.listingIds);
    }
    else {
      this.buttonText="Add";
      if(this.listingId)
      {
        this.formListingIds.setValue([this.listingId]);
      }
    }

  }

  saveButtonCLicked() {
    this.isSaving  =true;
    if (this.isEditType)
    {
      this.service.updateCannedMessage(this.messageId
        ,this.formGroup.value).subscribe(item => {
        this.dialog.closeAll();
      }, () => {
        this.isSaving  = false;
      });
    }
    else {
      this.service.addNewCannedMessage(this.formGroup.value).subscribe(item => {
        this.dialog.closeAll();
      }, () => {
        this.isSaving  = false;
      });
    }

  }

  onSelectAll() {
    this.formListingIds.setValue(this.listings.map(listing => listing.id));
  }

  onSelectNone() {
    this.formListingIds.setValue([]);
  }

  deleteMessage()
  {
    this.isSaving = true;
    this.service.deleteSavedMessage( this.messageId ).subscribe(() => {
      this.isSaving = false;
      this.dialog.closeAll();
    }, () => {
      this.isSaving = false;
    });
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
