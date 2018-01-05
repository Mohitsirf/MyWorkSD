/**
 * Created by divyanshu on 06/09/17.
 */

import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material';
import {Store} from '@ngrx/store';
import {StayDuvetService} from '../../../services/stayduvet';
import {getAdmins, getListingById, getListings, State} from '../../../reducers/index';
import {isNullOrUndefined} from "util";
import {Router} from '@angular/router';
import {User} from '../../../models/user';
import {getContactMaintenanceCatagoryType} from "../../../utils";

@
  Component({
  selector: 'sd-contacts-details-magnify',
  template: `
    <sd-modal-popup-layout title="{{(contact.getFullName() | titlecase)}}"
                           [print]="true"
                           (printAction)="printButtonClicked()" class="modal">
      <div fxLayout="column" fxLayoutGap="20px">
        <div fxLayout="column" fxLayoutGap="10px">
          <div fxLayoutAlign="space-between center">
            <span class="widthHalf heading">Name</span>
            <span class="widthHalf">{{contact.getFullName() | titlecase}}</span>
          </div>
          <div fxLayoutAlign="space-between center">
            <span class="widthHalf heading">Phone</span>
            <span class="widthHalf">{{contact.phone_number}}</span>
          </div>
          <div fxLayoutAlign="space-between center">
            <span class="widthHalf heading">Email</span>
            <span class="widthHalf">{{contact.email}}</span>
          </div>
          <div fxLayoutAlign="space-between center">
            <span class="widthHalf heading">Source</span>
            <span class="widthHalf">{{getSource(contact)}}</span>
          </div>
          <div fxLayoutAlign="space-between center">
            <span class="widthHalf heading">Listing</span>
            <span class="widthHalf">{{getListingsTitle()}}</span>
          </div>
          <div fxLayoutAlign="space-between center">
            <span class="widthHalf heading">Type</span>
            <span  class="widthHalf">{{getType(contact)}}</span>
          </div>
        </div>
        

        <div fxLayoutAlign="end center" fxLayoutGap="10px">
          <button mat-raised-button color="accent" (click)="editButtonClicked()">EDIT</button>
          <button mat-raised-button color="accent" (click)="callButtonClicked()">CALL</button>
        </div>
      </div>
    </sd-modal-popup-layout>
  `,
  styles: [`
    hr {
      width: 100%;
    }

    .widthHalf {
      width: 48%;
      padding: 2px;
    }

    .heading {
      font-size: small;
      color: #13304b;
      font-weight: bold;
      padding: 5px;
    }

    .modal {
      font-size: 14px;
    }
    
    span{
      font-size: small;
    }
  `]
})

export class ContactDetailsMagnifyComponent implements OnInit, OnDestroy {

  @Input() contact: User;
  admins;

  listings;

  private isAlive = true;

  printButtonClicked() {
  }

  constructor(private stayDuvetService: StayDuvetService,
              private dialog: MatDialog, private store: Store<State>, private router: Router) {
  }

  ngOnInit() {
    this.store.select(getAdmins).takeWhile(() => this.isAlive).subscribe(admins => {
      this.admins = admins;
    });

    this.store.select(getListings).takeWhile(() => this.isAlive).subscribe(listings => {
      this.listings = listings;
    });
  }

  checkNullString(string: string): string {
    if (string != null) {
      return ' '.concat(string);
    } else {
      return '';
    }
  }

  getSource(contact: User) {
    if (contact.type === 'admin') {
      return 'Admin';
    }

    if (contact.type === 'owner') {
      return 'Owner';
    }

    if (contact.type === 'guest') {
      return contact.getGuest().source;
    }

    if (contact.type === 'management') {
      const admin = this.admins.find(admin => admin.id === contact.getManagementContact().creator_id);
      if (!isNullOrUndefined(admin)) {
        return admin.first_name;
      }
    }

    return 'unknown';
  }

  getListingsTitle() {

    if(this.contact.type == 'owner' )
    {
      const filteredListings = this.listings.filter(listing => listing.owner_id == this.contact.getOwner().id);
      const titleArray = filteredListings.map(listing => listing.title);
      const titles =  titleArray.toString().replace(/,/g,', ');
      return titles;
    }

    if (this.contact.type == 'management' && !isNullOrUndefined(this.contact.getManagementContact().properties)) {
      const filteredListings = this.listings.filter(listing => this.contact.getManagementContact().properties.includes(listing.id));
      const titleArray = filteredListings.map(listing => listing.title);
      const titles =  titleArray.toString().replace(/,/g,', ');
      return titles;
    }

    return '-----';

  }

  editButtonClicked() {
    this.router.navigate(['/contacts/' + this.contact.id]);
    this.dialog.closeAll();
  }

  getType(contact: User) {
    if (contact.type === 'admin') {
      return 'Admin';
    }

    if (contact.type === 'owner') {
      return 'Owner';
    }

    if (contact.type === 'guest') {
      return 'Guest'
    }

    if (contact.type === 'management') {
      return getContactMaintenanceCatagoryType(contact.getManagementContact().category).title;
    }

    return 'unknown';
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  getContactCategory(category)
  {
    return getContactMaintenanceCatagoryType(category).title;
  }

  callButtonClicked() {
    //
  }

}
