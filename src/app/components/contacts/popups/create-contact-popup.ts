import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {StayDuvetService} from '../../../services/stayduvet';
import {MatDialog} from '@angular/material';
import {Store} from '@ngrx/store';
import {getListings, State} from '../../../reducers/index';
import {Listing} from '../../../models/listing';
import {
  getContactMethodTypes, getContactSourcesTypes, default as Utils,
  getContactMaintenanceCatagoryTypes
} from '../../../utils';

@Component({
  selector: 'sd-create-contact-popup',
  template: `
    <sd-modal-popup-layout title="Create Contact" [print]="true" (printAction)="printButtonClicked()">
     
     <ng-content></ng-content>
      <form fxLayout="column" fxLayoutGap="20px" [formGroup]="formGroup"
            (ngSubmit)="formGroup.valid && saveButtonCLicked()">
        <div fxLayoutAlign="space-between center">
          <mat-form-field class="width45">
            <input matInput placeholder="First Name" formControlName='first_name'>
          </mat-form-field>
          <mat-form-field class="width45">
            <input matInput placeholder="Last Name" formControlName='last_name'>
          </mat-form-field>
        </div>
        <div fxLayoutAlign="space-between center">
          <mat-form-field class="width45">
            <input matInput placeholder="Email" formControlName='email'>
          </mat-form-field>
          <mat-form-field class="width45">
            <input matInput placeholder="Secondary Email" formControlName='secondary_email'>
          </mat-form-field>
        </div>

        <div fxLayoutAlign="space-between center">
          <mat-form-field class="width45">
            <input matInput placeholder="Phone" formControlName='phone_number'>
          </mat-form-field>
          
          <mat-form-field class="width45">
            <input matInput placeholder="Secondary Phone" formControlName='secondary_phone_number'>
          </mat-form-field>
        </div>
        <div fxLayoutAlign="space-between center">

          <mat-form-field class="width30">
            <mat-select multiple placeholder="Add To A Listing"
                       floatPlaceholder="never"  formControlName='listing_ids'>
  
              <div fxLayout="column">
                <button class="select-button" mat-button (click)="onSelectAll()">Select All</button>
                <button class="select-button" mat-button (click)="onSelectNone()">Select None</button>
              </div>
  
              <mat-option *ngFor="let listing of listings" [value]="listing.id">
                {{ listing.title }}
              </mat-option>
  
            </mat-select>
          </mat-form-field>

          <mat-form-field class="width30">
            <mat-select placeholder="Type"  formControlName='category' #selectedType>
              <mat-option *ngFor="let category of categories" [value]="category.slug">{{category.title}}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field class="width30">
            <mat-select placeholder="Contact Method"  formControlName='preferred_contact_method'>
              <mat-option *ngFor="let contactMethod of contactMethods" [value]="contactMethod.slug">
                {{contactMethod.title}}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        <!--<mat-select ng-model="SampleSelectedListing" placeholder="Sample Selected Listing" class="width45">-->
        <!--<mat-option value="a">a</mat-option>-->
        <!--</mat-select>-->
        <mat-form-field>
          <textarea matInput placeholder="Notes" rows="4" formControlName='description'></textarea>
        </mat-form-field>

        <div fxLayout="row" fxLayoutAlign="end center" fxLayoutGap="10px">
          <mat-spinner *ngIf="isSaving" [diameter]="30" [strokeWidth]="4"></mat-spinner>
          <button mat-raised-button color="accent" [disabled]="isSaving" type="submit">Save</button>
        </div>
      </form>
    </sd-modal-popup-layout>

  `,
  styles: [`
    .width30 {
      width: 30%;
    }

    .width45 {
      width: 45%;
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

export class CreateContactPopupComponent implements OnInit, OnDestroy {

  private isAlive: boolean = true;

  listings: Listing[];
  isSaving: Boolean = false;

  categories;
  contactMethods;
  @Input() listing:Listing;

  formGroup: FormGroup;
  firstName: FormControl;
  lastName: FormControl;
  email: FormControl;
  secondaryEmail: FormControl;
  phoneNumber: FormControl;
  secondaryPhoneNumber: FormControl;
  category: FormControl;
  preferredContactMethod: FormControl;
  listingIds: FormControl;
  description: FormControl;

  constructor(private service: StayDuvetService, private dialog: MatDialog, private store: Store<State>) {
    this.firstName = new FormControl(null, [Validators.required]);
    this.lastName = new FormControl(null, []);
    this.email = new FormControl(null, [Validators.required, Validators.email]);
    this.secondaryEmail = new FormControl(null, []);
    this.phoneNumber = new FormControl(null, [Validators.required]);
    this.secondaryPhoneNumber = new FormControl(null, []);
    this.category = new FormControl(null, [Validators.required]);
    this.preferredContactMethod = new FormControl(null, [Validators.required]);
    this.listingIds = new FormControl(null, []);
    this.description = new FormControl(null, []);

    this.formGroup = new FormGroup({
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      secondary_email: this.secondaryEmail,
      phone_number: this.phoneNumber,
      secondary_phone_number: this.secondaryPhoneNumber,
      category: this.category,
      preferred_contact_method: this.preferredContactMethod,
      listing_ids: this.listingIds,
      description: this.description
    })
    ;
  }

  ngOnInit() {
    this.categories = getContactMaintenanceCatagoryTypes();
    this.contactMethods = getContactMethodTypes();

    if(this.listing)
    {
      this.listingIds.setValue([this.listing.id]);
      this.listings =  [this.listing];
      return;
    }
     this.store.select(getListings).takeWhile(()=> this.isAlive).subscribe((listings) => {
      this.listings = listings.sort((a: Listing, b: Listing) => {
        if(a.title > b.title) {
          return 1;
        }
        if(a.title < b.title) {
          return -1;
        }
        return 0;
      });
    });

  }

  printButtonClicked() {
    console.log('create contact print');
  }


  saveButtonCLicked() {
    this.isSaving = true;
    let data = this.formGroup.value;
    data = Utils.removeNullFields(data);

    this.service.createContact(data).subscribe(() => {
      this.isSaving = false;
      this.dialog.closeAll();
    }, () => {
      this.isSaving = false;
    });
  }

  onSelectAll() {
    this.listingIds.setValue(this.listings.map(listing => listing.id));
  }

  onSelectNone() {
    this.listingIds.setValue([]);
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
