import {Component, OnDestroy, OnInit} from '@angular/core';
import {Listing} from '../../models/listing';
import {MatDialog, MatDialogRef} from '@angular/material';
import {getDays} from '../../utils';
import {StayDuvetService} from '../../services/stayduvet';
import {getListingById, State} from '../../reducers';
import {Store} from '@ngrx/store';
import {ActivatedRoute} from '@angular/router';
import {ListingCommonTextPopupComponent} from './popups/listing-common-text-popup';
import {CheckList} from '../../models/check-list';
import {GenericConfirmationPopupComponent} from '../elements/confirmation-popup';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'sd-listings-housekeeping-tab',
  template: `
    <div fxLayout="column" fxLayoutGap="4px" fxFlex="100%" style="margin-top: 15px; margin-bottom: 50px">

      <mat-card class="header" style="padding-top: 0px;" fxLayout="row" fxLayoutAlign="space-between none">
        <div fxLayout="column" fxLayoutGap="5px">
          <h2>Housekeeping Instructions:</h2>
          <span class="content" fxFlex="70%">
           We provide you a way to create a check-list and give our housekeepers detailed instructions so nothing is lost in translation
         </span>
        </div>
        <button mat-fab color="accent" (click)="openDialog('Cleaning Instructions', 'cleaning_instructions')" style="margin-top: 10px">
          <mat-icon>border_color</mat-icon>
        </button>
      </mat-card>
      <mat-card class="padding" fxLayout="column" fxLayoutGap="10px">
        <div fxLayout="column" fxLayoutGap="5px" style="font-family: montserrat">
        <span style="font-size: 18px; font-weight: bolder;color: #5a6e81;">
          Tell our housekeepers any special instructions you want them to follow?
        </span>
          <div fxLayout="row">
           <span class="content">
             This is for Duvet's housekeepers. You are able to let our housekeepers know where supplies are, give them special instructions
             and even make custom check-lists that are completed
          </span>
          </div>
        </div>

        <hr>


        <div style="padding-left: 15px;" fxLayout="column" fxLayoutGap="15px">
          <div>
          <span style="font-size: 18px; font-weight: lighter;color: #5a6e81;" class="multi-line-content"> 
            {{selectedListing.cleaning_instructions}}
          </span>
          </div>
        </div>

        <hr>

        <div fxLayout="row" fxLayoutAlign="space-between">

          <div fxLayout="column" fxLayoutGap="5px">
        
        <span style="font-size: 18px; font-weight: bolder; color: #5a6e81;"> 
          Customize our housekeepers checklist to fit your listings needs
        </span>
            <div fxLayout="row">
              <strong>FUN FACT:</strong>
              <span class="content">
             We actually provide the basics but feel free to create your own so we don't miss a spot
          </span>
            </div>
          </div>
          <div fxLayout="row">
            <button mat-fab color="accent" (click)="addCheckListRow()">
              <mat-icon>add</mat-icon>
            </button>
          </div>
        </div>


        <div fxLayout="column" fxLayoutGap="10px">
          <div *ngFor="let checklist of listing.getChecklists()" fxLayout="row" fxLayoutAlign="space-between center"
               fxFlex="100%">
            <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="10px">
              <mat-spinner *ngIf="isChecklistUpdating[checklist.id]" color="accent" [diameter]="30"
                           [strokeWidth]="4"></mat-spinner>
              <mat-checkbox [checked]="checklist.is_complete"
                            *ngIf="!isChecklistUpdating[checklist.id]"
                            (change)="alterChecklistCompleteStatus(checklist)">
              </mat-checkbox>
              <label style="font-family: roboto">{{checklist.title}}</label>
            </div>
            <div fxLayoutAlign="end center">
              <button mat-icon-button color="warn" (click)="deleteCheckList(checklist)">
                <mat-icon>close</mat-icon>
              </button>
            </div>
          </div>
          <form *ngIf="showChecklistRow" [formGroup]="checklistFormGroup"
                (ngSubmit)="this.checklistFormGroup.valid && saveCheckList()"
                fxLayout="row" fxLayoutAlign="space-between">
            <mat-form-field style="width: 80%;">
              <textarea matInput rows="2" placeholder="Check-list title" formControlName="title"></textarea>
            </mat-form-field>
            <div fxLayout="row" fxLayoutAlign="center center" fxLayoutGap="5px">
              <mat-spinner *ngIf="isChecklistSaving" color="accent" [diameter]="30" [strokeWidth]="4"></mat-spinner>
              <button mat-fab *ngIf="!isChecklistSaving" color="accent" type="submit">
                <mat-icon>check</mat-icon>
              </button>
            </div>
          </form>
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

    .multi-line-content {
      font-family: 'Roboto', sans-serif;
      white-space: pre-line;
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

    strong {
      font-family: 'Roboto', sans-serif;
      color: dimgray;
    }

  `]
})

export class ListingsHouseKeepingTabComponent implements OnInit, OnDestroy {

  selectedListing: Listing;
  private dialogRef: MatDialogRef<any>;
  private isAlive: boolean = true;
  task_threshold: string;
  days = getDays();

  listing: Listing;


  showChecklistRow = false;
  checklistFormGroup: FormGroup;
  isChecklistSaving: Boolean = false;
  isChecklistUpdating: { [id: number]: boolean } = {};

  constructor(private route: ActivatedRoute,
              private store: Store<State>,
              private service: StayDuvetService,
              private dialog: MatDialog) {
  }

  ngOnInit() {

    this.checklistFormGroup = new FormGroup({
      title: new FormControl(null, [Validators.required]),
    });

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


  addCheckListRow() {
    this.showChecklistRow = !this.showChecklistRow;
  }

  saveCheckList() {
    this.isChecklistSaving = true;
    this.service.addCheckList(this.selectedListing.id, this.checklistFormGroup.value).subscribe(() => {
      this.isChecklistSaving = false;
      this.checklistFormGroup.reset();
      this.showChecklistRow = false;
    }, () => {
      this.isChecklistSaving = false;
    });
  }

  deleteCheckList(checklist: CheckList) {
    this.dialogRef = this.dialog.open(GenericConfirmationPopupComponent);
    const instance = this.dialogRef.componentInstance;
    instance.title = 'Are you sure you want to delete this checklist';
    instance.description = checklist.title;
    instance.showCloseButton = true;
    this.dialogRef.updateSize('100%');

    instance.yesButtonClicked.subscribe((res) => {
      instance.isLoading = true;
      this.service.deleteCheckList(this.selectedListing.id, checklist.id).subscribe(() => {
        console.log('deleted check-list');
        this.dialogRef.close();
      });
    });
  }

  alterChecklistCompleteStatus(checkList: CheckList) {
    this.isChecklistUpdating[checkList.id] = true;
    this.service.updateCheckList(this.selectedListing.id, checkList.id, {is_complete: !checkList.is_complete})
      .subscribe(() => {
        this.isChecklistUpdating[checkList.id] = false;
      }, () => {
        this.isChecklistUpdating[checkList.id] = false;
      });
  }


  ngOnDestroy() {
    this.isAlive = false;
  }
}
