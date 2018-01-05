import {Component, OnDestroy, OnInit} from '@angular/core';
import {getListingById, State} from '../../reducers/index';
import {MatDialog, MatDialogRef} from '@angular/material';
import {StayDuvetService} from '../../services/stayduvet';
import {Store} from '@ngrx/store';
import {ActivatedRoute} from '@angular/router';
import {Listing} from '../../models/listing';
import {ListingEntertainmentInstructionsPopupComponent} from './popups/listing-house-entertainment-instructions-popup';
import {getContactMaintenanceCatagoryType, getCoffeeMakerType, getDays, getFrequencies} from '../../utils';
import {ListingPropertyAccessPopupComponent} from './popups/listing-property-access-popup';
import {ListingVendorsMaintenancesPopupComponent} from './popups/listing-vendors-maintenances';
import {ListingCommonTextPopupComponent} from 'app/components/listing/popups/listing-common-text-popup';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CheckList} from '../../models/check-list';
import {GenericConfirmationPopupComponent} from '../elements/confirmation-popup';

/**
 * Created by ubuntu on 9/7/17.
 */
@Component({
  selector: 'sd-listing-house-tab',
  template: `
    <div fxLayout="column" fxLayoutGap="10px" fxFlex="95%" style="padding: 20px 0px 30px 10px">
      <div fxLayout="column" fxLayoutGap="20px">
        <div fxLayout="row">
          <div fxLayout="column" fxLayoutGap="10px">
            <h2>Property Access</h2>
            <span class="compact">Fun Fact: Keyless entry system make check-ins seamless.</span>
          </div>
          <span style="flex: 1 1 auto"></span>
          <div>
            <button mat-raised-button color="accent" (click)="editPropertyAccessPopup()">EDIT THIS SECTION</button>
          </div>
        </div>
        <div>
          <div fxLayout="column" fxLayoutGap="20px" style="padding: 10px 0px 0px 80px;">
            <p class="light">{{selectedListing.property_access_note}}</p>
            <div fxLayout="row" fxLayoutAlign="space-between" style="width: 650px">
              <strong>{{selectedListing.property_access_title}}</strong>
              <span class="bold">Code: {{selectedListing.property_access_code}}</span>
            </div>
          </div>
          <span style="flex: 1 1 auto"></span>
        </div>
      </div>
      <hr>
      <div fxLayout="column" fxLayoutGap="10px">
        <h3>Parking</h3>
        <span class="compact">Please elaborate on how to access your parking lot from the street.</span>
        <div>
          <div fxLayout="column" fxLayoutGap="20px" style="padding: 10px 0px 0px 80px;">
            <p class="light">{{selectedListing.parking_note}}</p>
          </div>
          <span style="flex: 1 1 auto"></span>
        </div>
      </div>
      <hr>
      <div fxLayout="column" fxLayoutGap="10px">
        <div fxLayout="column" fxLayoutGap="20px">
          <div fxLayout="row">
            <div fxLayout="column" fxLayoutGap="10px">
              <h2>Entertainment Instructions</h2>
              <span class="compact">We require a netflix account or a basic cable subscription</span>
            </div>
            <span style="flex: 1 1 auto"></span>
            <div>
              <button mat-raised-button color="accent" (click)="editEntertainmentInstructionsPopup()">EDIT THIS SECTION
              </button>
            </div>
          </div>
          <div>
            <div fxLayout="column" fxLayoutGap="20px" style="padding: 10px 0px 0px 80px;">
              <p class="light">{{selectedListing.entertainment_note}}</p>
            </div>
            <span style="flex: 1 1 auto"></span>
          </div>
          <div fxLayout="column" fxLayoutGap="10px">
            <div fxLayoutAlign="space-between center" style="width: 90%">
              <div fxLayoutAlign="start center" fxFlex="45%">
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
        </div>
      </div>
      <hr>
      <div fxLayout="column" fxLayoutGap="10px">
        <h3>Wifi Info</h3>
        <span class="compact"> By default we made all of our network the Listing name and the password stayduvet</span>
        <div fxLayout="row" style="padding: 10px 0px 10px">
          <div fxFlex="45%">
            <strong>Network:</strong>&nbsp;<span>{{selectedListing.wifi_network}}</span>
          </div>
          <div fxFlex="55%">
            <strong>Password:</strong>&nbsp;<span>{{selectedListing.wifi_password}}</span>
          </div>
        </div>
        <div style="padding: 0px 0px 10px 60px">
          <span class="light">{{selectedListing.wifi_note}}</span>
        </div>
      </div>
      <hr>
      <div fxLayout="column" fxLayoutGap="10px">
        <div fxLayout="row" fxLayoutAlign="space-between">
          <h2>Check-Lists</h2>
          <div>
            <button mat-raised-button color="accent" (click)="addCheckListRow()">Add a Check-list</button>
          </div>
        </div>
        <div *ngFor="let checklist of listing.getChecklists()" fxLayout="row" fxLayoutAlign="space-between center"
             fxFlex="100%">
          <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="10px">
            <mat-spinner *ngIf="isChecklistUpdating[checklist.id]" color="accent" [diameter]="30" [strokeWidth]="4"></mat-spinner>
            <mat-checkbox [checked]="checklist.is_complete"
                         *ngIf="!isChecklistUpdating[checklist.id]"
                         (change)="alterChecklistCompleteStatus(checklist)">
            </mat-checkbox>
            <label>{{checklist.title}}</label>
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
      <hr>
      <div fxLayout="column" fxLayoutGap="10px">
        <div fxLayout="row">
          <div fxLayout="column" fxLayoutGap="10px">
            <h2>Vendors and Maintenance</h2>
            <span class="compact">Duvet has permission to spend <strong class="bold">$500</strong> to fix a problem without confirming with
             the homeowner.</span>
          </div>
          <span style="flex: 1 1 auto"></span>
          <div>
            <button mat-raised-button color="accent" (click)="editVendorsMaintenancePopup()">ADD CONTACT</button>
          </div>
        </div>
        <div fxLayout="row" fxLayoutAlign="space-around center" style="margin-top: 20px;">
          <div fxFlex="70%" fxLayout="column" fxLayoutGap="10px">
            <span>StayDuvet will have permission to spend upto selected amount to fix a problem without confirming with the homeowner.</span>
          </div>

          <mat-spinner [color]="'accent'" *ngIf="thresholdUpdating" [diameter]="30" [strokeWidth]="4"></mat-spinner>

          <mat-select
            *ngIf="!thresholdUpdating"
            fxFlex="30%"
            matInput
            [(ngModel)]="task_threshold"
            (ngModelChange)="thresholdChanged()">
            <mat-option *ngFor="let limit of limits" [value]="limit">
              {{ limit }}
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
            fxFlex="30%"
            matInput
            [(ngModel)]="trash_day_frequency"
            (ngModelChange)="trashChanged()">
            <mat-option *ngFor="let frequency of frequencies" [value]="frequency.slug">
              {{ frequency.title }}
            </mat-option>
          </mat-select>

          <mat-select
            *ngIf="!trashUpdating"
            fxFlex="30%"
            matInput
            [(ngModel)]="trash_day"
            (ngModelChange)="trashChanged()">
            <mat-option *ngFor="let day of days" [value]="day.slug">
              {{ day.title }}
            </mat-option>
          </mat-select>
        </div>
        <div style="padding: 10px 0px 10px; width: 800px">
          <span style="font-size: 18px;font-weight: bold">Cleaning Instructions</span>
          <mat-icon (click)="openCleaningInstructionPopup()" style="cursor: pointer">border_color</mat-icon>
          <br/>
          <span>{{ listing.cleaning_instructions }}</span>
        </div>
        <div fxLayout="column" fxLayoutGap="20px" *ngFor="let housekeeper of housekeepers">
          <div fxLayout="row" fxLayoutGap="20px" style="padding: 15px 0px 10px">
            <div fxFlex="20%" fxLayoutAlign="end">
              <strong>{{housekeeper.type}}:</strong>
            </div>
            <div fxLayout="column" fxLayoutGap="10px">
              <span>{{housekeeper.first_name + checkNullString(housekeeper.last_name)}}</span>
              <span>{{housekeeper.phone_number}}</span>
              <span>{{housekeeper.email}}</span>
            </div>
          </div>
          <hr>
        </div>
        <div fxLayout="column" fxLayoutGap="20px" *ngFor="let vendor of vendors">
          <div fxLayout="row" fxLayoutGap="20px" style="padding: 15px 0px 10px">
            <div fxFlex="20%" fxLayoutAlign="end">
              <strong>{{getCategory(vendor.managementContact.data.category)}}:</strong>
            </div>
            <div fxLayout="column" fxLayoutGap="10px">
              <span>{{vendor.first_name + checkNullString(vendor.last_name)}}</span>
              <span>{{vendor.phone_number}}</span>
              <span>{{vendor.email}}</span>
            </div>
          </div>
          <hr>
        </div>
        <h3 *ngIf="maintenances.length > 0">Maintenance Contacts:</h3>
        <div fxLayout="column" fxLayoutGap="20px" *ngFor="let maintenance of maintenances">
          <div fxLayout="row" fxLayoutGap="20px" style="padding: 15px 0px 10px">
            <div fxFlex="20%" fxLayoutAlign="end">
              <strong>{{maintenance.category}}:</strong>
            </div>
            <div fxLayout="column" fxLayoutGap="10px">
              <span>{{maintenance.first_name + checkNullString(maintenance.last_name)}}</span>
              <span>{{maintenance.phone_number}}</span>
              <span>{{maintenance.email}}</span>
            </div>
          </div>
          <hr>
        </div>
      </div>
      
      <div fxLayout="column" fxLayoutGap="10px">
        <div fxLayout="row">
          <span style="font-size: 25px; font-weight: bolder">Private Notes:</span>
          <span style="flex: 1 1 auto"></span>
          <div>
            <button mat-raised-button color="accent" (click)="openDialog('Private Notes', 'private_notes')">Edit
              Section
            </button>
          </div>
        </div>
        <div>
          <div fxLayout="column" fxLayoutGap="20px" style="padding: 0px 0px 0px 80px;">
            <p class="light">{{selectedListing.private_notes}}</p>
          </div>
        </div>
      </div>
      <hr>
    </div>
  `,
  styles: [`
    mat-spinner {
      height: 40px;
      width: 40px;
    }

    hr {
      width: 100%;
    }

    .compact {
      font-size: 13px;
      font-weight: lighter;
    }

    .bold {
      font-size: 20px;
      font-weight: 900;
    }

    mat-spinner {
      width: 30px;
      height: 30px;
      padding: 10px;
    }

    .light {
      width: 80%;
      font-size: 18px;
      font-family: 'Roboto', sans-serif;
      white-space: pre-line;
    }
  `]
})
export class ListingHouseTabComponent implements OnInit, OnDestroy {

  selectedListing: Listing;
  maintenances = [];
  vendors = [];
  housekeepers = [];
  private dialogRef: MatDialogRef<any>;
  getCoffeeMakerType = getCoffeeMakerType;
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

  showChecklistRow = false;
  checklistFormGroup: FormGroup;
  isChecklistSaving: Boolean = false;
  isChecklistUpdating: { [id: number]: boolean } = {};

  ngOnInit(): void {

    this.checklistFormGroup = new FormGroup({
      title: new FormControl(null, [Validators.required]),
    });
    console.log('onInit sd-listing-house-tab');
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

  editVendorsMaintenancePopup() {
    this.dialogRef = this.dialog.open(ListingVendorsMaintenancesPopupComponent);
    const instance = this.dialogRef.componentInstance;
    instance.listing = this.selectedListing;
    this.dialogRef.updateSize('100%');
  }

  constructor(private route: ActivatedRoute,
              private store: Store<State>,
              private service: StayDuvetService,
              private dialog: MatDialog) {
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

  openDialog(title: String, key: String, placeholder?: String) {
    this.dialogRef = this.dialog.open(ListingCommonTextPopupComponent);
    const instance = this.dialogRef.componentInstance;
    instance.listing = this.listing;
    instance.title = title;
    instance.key = key;
    instance.placeholder = placeholder;
    this.dialogRef.updateSize('100%');
  }


  openCleaningInstructionPopup() {
    this.dialogRef = this.dialog.open(ListingCommonTextPopupComponent);
    const instance = this.dialogRef.componentInstance;
    instance.listing = this.listing;
    instance.title = 'Cleaning Instructions';
    instance.key = 'cleaning_instructions';
    instance.placeholder = '';
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

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
