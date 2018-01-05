import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Listing} from '../../../models/listing';
import {StayDuvetService} from '../../../services/stayduvet';
import {MatDialog} from '@angular/material';
import {Store} from '@ngrx/store';
import {
  getIsVendorsLoaded, getIsVendorsLoading, getVendors, State
} from '../../../reducers/index';
import Utils, {
  getContactMaintenanceCatagoryType, getContactMaintenanceCatagoryTypes
} from '../../../utils';
import {Observable} from 'rxjs/Observable';
import {Subscription} from "rxjs/Subscription";
import {ManagementContact} from '../../../models/management-contact';
import {User} from "../../../models/user";

@Component({
  selector: 'sd-listing-vendors-maintenances-popup',
  template: `

    <sd-modal-popup-layout title="Vendors & Maintenances" *ngIf="showContacts">
      <div fxLayout="column" *ngIf="showContacts">
        <div class="header" fxFlex="100%" fxLayoutAlign="space-between center">
          <div fxFlex="25%" fxLayout="column" fxLayoutAlign=" start" fxLayoutGap="5px">
            <p>Category</p>
          </div>

          <div style="margin-left:-3.5%" fxFlex="25%" fxLayout="column" fxLayoutAlign=" start" fxLayoutGap="5px">
            <p>Name</p>
          </div>

          <div style="margin-left:-3%" fxFlex="25%" fxLayout="column" fxLayoutAlign=" start" fxLayoutGap="5px">
            <p>Phone Number</p>
          </div>
        </div>
        <hr id="line">
        <div fxLayout="column">

          <div *ngIf="managementContacts.length === 0">
            <p style="text-align: center">No Contacts</p>
          </div>
          <div fxFlex="100%" fxLayoutAlign="space-between center"
               *ngFor="let managementContact of managementContacts; let index = index">

            <div fxFlex="25%" fxLayout="column" fxLayoutAlign=" start" fxLayoutGap="5px">
              <p>{{getContactMaintenanceCatagoryType(managementContact)}}</p>
            </div>

            <div fxFlex="25%" fxLayout="column" fxLayoutAlign=" start" fxLayoutGap="5px">
              <p>{{ managementContact.first_name + checkNullString(managementContact.last_name)}}</p>
            </div>

            <div fxFlex="25%" fxLayout="column" fxLayoutAlign=" start" fxLayoutGap="5px">
              <p>{{ managementContact.phone_number }}</p>
            </div>

            <button mat-mini-fab (click)="removeContact(index)">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <div>
            <button mat-raised-button color="accent" (click)="addContact()">
              <mat-icon>add</mat-icon>
              Add Contact
            </button>
            <button mat-raised-button color="accent" (click)="createContact()">
              Create New Contact
            </button>
          </div>
        </div>
      </div>
    </sd-modal-popup-layout>


    <sd-modal-popup-layout title="Attach Contact" *ngIf="showAddContact">
      <div *ngIf="showBackButton" fxFlex="100*" fxLayoutAlign="start start">
        <button (click)="backButton()" mat-raised-button color="accent">
          <mat-icon>keyboard_backspace</mat-icon>
          Back
        </button>
      </div>
      <sd-attach-contact [listing]="listing" (attached)="onAttached()"></sd-attach-contact>
    </sd-modal-popup-layout>


    <sd-create-contact-popup *ngIf="showCreateNewContact" [listing]="listing">
      <div *ngIf="showBackButton" fxFlex="100*" fxLayoutAlign="start start">
        <button (click)="backButton()" mat-raised-button color="accent">
          <mat-icon>keyboard_backspace</mat-icon>
          Back
        </button>
      </div>
    </sd-create-contact-popup>

  `,
  styles: [`
    #line {
      border: none;
      width: 100%;
      height: 2px;
      /* Set the hr color */
      color: #364f66; /* old IE */
      background-color: #364f66; /* Modern Browsers */
    }

    .textLabelPlaceholder {
      font-size: 10px;
      color: darkgray;
    }

    .header > div > p {
      color: #364f66;
      font-weight: bold;
    }

    textarea {
      resize: vertical;
    }

    mat-spinner {
      width: 30px;
      height: 30px;
    }
  `]
})

export class ListingVendorsMaintenancesPopupComponent implements OnInit, OnDestroy {
  @Input() listing: Listing;
  managementContacts: User[];

  isDeleting: { [id: number]: boolean } = {};

  isAlive: boolean = true;
  showBackButton: boolean = false;
  showCreateNewContact: boolean = false;
  showAddContact: boolean = false;
  showContacts: boolean = true;


  constructor(private service: StayDuvetService,
              private dialog: MatDialog,
              private store: Store<State>) {

  }

  ngOnInit() {
    console.log('onInit sd-listing-vendors-maintenances-popup');
    this.managementContacts = this.listing.getMaintenancesContacts();

  }

  addContact() {
    this.showBackButton = true;
    this.showAddContact = true;
    this.showCreateNewContact = false;
    this.showContacts = false;
  }

  createContact() {
    this.showBackButton = true;
    this.showAddContact = false;
    this.showCreateNewContact = true;
    this.showContacts = false;
  }

  backButton() {
    this.showBackButton = false;
    this.showAddContact = false;
    this.showCreateNewContact = false;
    this.showContacts = true;
  }

  removeContact(index) {
    this.isDeleting[index] = false;
    this.service.removeVendorContacts(String(this.listing.id), this.managementContacts[index]).subscribe(() => {
      this.isDeleting[index] = false;
      const contact = this.managementContacts[index];
      this.managementContacts = this.managementContacts.filter(item => item != contact);
    }, () => {
    });
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  onAttached() {
    this.dialog.closeAll();
  }

  getContactMaintenanceCatagoryType(contact: User) {
    return getContactMaintenanceCatagoryType(contact['managementContact']['data']['category']).title;
  }

  checkNullString(string: string): string {
    if (string != null) {
      return ' '.concat(string);
    } else {
      return '';
    }
  }


}
