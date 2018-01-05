import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Listing} from '../../../models/listing';
import {StayDuvetService} from '../../../services/stayduvet';
import {MatDialog} from '@angular/material';
import {Store} from '@ngrx/store';
import {getListings, State} from '../../../reducers/index';
import {UpdateSuccessAction} from '../../../actions/listing';
import {SavedMessage} from "../../../models/saved-message";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {getAutoResponseTypes} from "../../../utils";

@Component({
  selector: 'sd-listing-auto-response-popup',
  template: `
    <sd-modal-popup-layout title="{{popUpTitle}}">

        <form fxLayout="column" [formGroup]="formGroup" (ngSubmit)="formGroup.valid && saveButtonCLicked()">
          <mat-form-field class="detailField">
            <input type="text" matInput color="accent" formControlName="title"   placeholder="Title">
            <mat-error>This field is required.</mat-error>
          </mat-form-field>

          <div fxLayout="row" fxLayoutAlign="space-between center" class="detailField">

            <mat-form-field style="width:35%">
              <mat-select
                matInput
                formControlName="type"
                placeholder="Type">
                <mat-option *ngFor="let type of autoResponseTypes" [value]="type.slug">{{type.title}}</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field   style="width:20%">
              <input type="number" min="0" matInput color="accent" formControlName="offset"   placeholder="Delay (In Minutes)">
              <mat-error>This field is required.</mat-error>
            </mat-form-field>

            <mat-form-field style="width:40%">
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

          </div>

         
          
          <mat-form-field class="detailField">
            <textarea rows="17" color="accent" matInput placeholder="Message" formControlName="message" ></textarea>
            <mat-error>This field is required</mat-error>
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

export class ListingAutoResponsePopupComponent implements OnInit ,OnDestroy {

  @Input() popUpTitle ;
  @Input() listingIds;
  @Input() responseId;
  @Input() title;
  @Input() message;
  @Input() type;
  @Input() offset;
  @Input() isEditType=false;
  @Input() listingId;
  buttonText;

  formGroup: FormGroup;
  responseTitle: FormControl;
  responseMessage: FormControl;
  formListingIds: FormControl;
  responseType: FormControl;
  responseOffset: FormControl;
  @Input() listings:Listing[]=[];



  autoResponseTypes = getAutoResponseTypes();


  isSaving: Boolean = false;
  isAlive = true;

  constructor(private service: StayDuvetService, private dialog: MatDialog, private store: Store<State>) {
    this.responseTitle = new FormControl(null, [Validators.required]);
    this.responseMessage = new FormControl(null, [Validators.required]);
    this.responseOffset = new FormControl(null, [Validators.required]);
    this.responseType = new FormControl(null, [Validators.required]);
    this.formListingIds = new FormControl(null, []);

    this.formGroup = new FormGroup({
      title: this.responseTitle,
      message: this.responseMessage,
      offset: this.responseOffset,
      type: this.responseType,
      property_ids: this.formListingIds,
    });
  }

  ngOnInit() {



    if (this.isEditType)
    {
      this.buttonText="Edit";
      this.responseTitle.setValue(this.title);
      this.responseMessage.setValue(this.message);
      this.responseType.setValue(this.type);
      this.responseOffset.setValue(this.offset);
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
      this.service.updateAutoResponse(this.responseId
        ,this.formGroup.value).subscribe((item) => {
        this.dialog.closeAll();
        this.isSaving = false;
      }, () => {
        this.isSaving = false;
      });
    }
    else {
      this.service.addNewAutoResponse(this.formGroup.value).subscribe((item) => {
        this.dialog.closeAll();
      }, () => {
        this.isSaving = false;
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
    this.service.deleteAutoResponse( this.responseId ).subscribe(() => {
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
