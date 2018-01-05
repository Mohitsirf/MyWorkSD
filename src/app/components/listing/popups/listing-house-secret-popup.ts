import {Component, Input, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Router} from '@angular/router';
import {Listing} from '../../../models/listing';
import {Store} from '@ngrx/store';
import {State} from '../../../reducers/index';
import Utils, {getContactMaintenanceCatagoryType} from '../../../utils';
import {User} from '../../../models/user';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'sd-house-secret-popup',
  template: `
    <sd-modal-popup-layout title="{{listing.title}}">
      <div fxLayout="column" fxLayoutGap="15px" style="padding: 10px 20px 10px 20px">
        <div fxLayout="column" fxLayoutGap="15px">
          <div fxLayout="row">
            <div fxFlex="50%">
              <strong>Listing Owner</strong>
            </div>
            <span>{{listing?.getOwnerObj()?.getFullName()}}</span>
          </div>
          <div fxLayout="row">
            <div fxFlex="50%">
              <strong>Account Manager</strong>
            </div>
            <!--<span>Assignee</span>-->
            <span>{{getAssignee(listing)}}</span>
          </div>
          <div fxLayout="row" *ngFor="let contact of managementContacts">
            <div fxFlex="50%">
              <strong>{{getCategory(contact)}}</strong>
            </div>
            <span>{{contact.getFullName()}}</span>
          </div>
        </div>
        <hr>
        <div fxLayout="column" fxLayoutGap="15px">
          <div fxLayout="row">
            <div fxFlex="50%">
              <strong>Address</strong>
            </div>
            <span fxFlex="end">{{listing?.getFullAddress()}}</span>
          </div>
          <div fxLayout="row">
            <div fxFlex="50%">
              <strong>Lockbox code</strong>
            </div>
            <span>{{listing?.property_access_code}}</span>
          </div>
          <div fxLayout="row">
            <div fxFlex="50%">
              <strong>Wifi Network</strong>
            </div>
            <span>{{listing?.wifi_network}}</span>
          </div>
          <div fxLayout="row">
            <div fxFlex="50%">
              <strong>Wifi Password</strong>
            </div>
            <span>{{listing?.wifi_password}}</span>
          </div>
        </div>
      </div>
      <div fxLayout="row" fxLayoutGap="10px" fxLayoutAlign="end" style="padding-top: 20px">
        <button mat-raised-button color="accent" (click)="house()">House Secrets</button>
        <button mat-raised-button color="accent" (click)="showListing()">Listing Details</button>
      </div>
    </sd-modal-popup-layout>
  `,
  styles: [`
    hr {
      width: 100%;
    }

    .example-spacer {
      flex: 1 1 auto;
    }
  `]
})
export class ListingHouseSecretPopupComponent implements OnInit {

  @Input() listing: Listing;

  managementContacts: User[];
  owner: User;
  assignee: User;
  getManagementTypes;

  constructor(private dialogref: MatDialogRef<ListingHouseSecretPopupComponent>,
              private store: Store<State>,
              private router: Router) {
  }

  ngOnInit(): void {
    this.getManagementTypes = getContactMaintenanceCatagoryType;
    this.managementContacts = this.listing.getMaintenances();
  }

  close() {
    this.dialogref.close();
  }

  house() {
    this.router.navigate(['/listings/' + this.listing.id + '/manage']);
    this.dialogref.close();
  }

  showListing() {
    this.router.navigate(['/listings/' + this.listing.id + '/details']);
    this.dialogref.close();
  }

  getCategory(contact: User) {
    return getContactMaintenanceCatagoryType(contact['managementContact']['data']['category']).title;
  }

  getAssignee(listing) {
    if (isNullOrUndefined(listing.getAssigneeObj())) {
      return '';
    } else
      return listing.getAssigneeObj().getFullName()
  }

}
