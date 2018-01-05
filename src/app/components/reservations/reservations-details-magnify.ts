/**
 * Created by divyanshu on 31/08/17.
 */

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StayDuvetService} from '../../services/stayduvet';
import {MatDialog} from '@angular/material';
import {Store} from '@ngrx/store';
import {getActiveContacts, getIsActiveContactLoaded, getIsActiveContactLoading, State} from '../../reducers/index';
import {Observable} from 'rxjs/Observable';
import {getTaskType} from '../../utils';
import {Booking} from '../../models/booking';
import {Listing} from "../../models/listing";
import {isNullOrUndefined} from "util";
import {Router} from "@angular/router";
import {User} from '../../models/user';

@Component({
  selector: 'sd-reservations-details-magnify',
  template: `
    <sd-modal-popup-layout title="{{getTitle()}}" [print]="true" (printAction)="printButtonClicked()" class="modal">
      <div fxLayout="column" fxLayoutGap="20px">
        <div fxLayout="column" fxLayoutGap="15px" class="fontSize">
          <div fxLayoutAlign="space-between center">
            <span class="widthHalf heading">Guest Name</span>
            <span class="widthHalf">{{guest?.first_name}} {{guest?.last_name}}</span>
          </div>
          <div fxLayoutAlign="space-between center">
            <span class="widthHalf heading">Phone</span>
            <span class="widthHalf">{{guest?.phone_number}}</span>
          </div>
          <div fxLayoutAlign="space-between center">
            <span class="widthHalf heading">Email</span>
            <span class="widthHalf">{{guest?.email}}</span>
          </div>
          <div fxLayoutAlign="space-between center">
            <span class="widthHalf heading">Listing</span>
            <span class="widthHalf">{{listing?.title}}</span>
          </div>
          <div fxLayoutAlign="space-between center">
            <span class="widthHalf heading">Arrival Time</span>
            <span class="widthHalf">{{booking?.check_in_time}}</span>
          </div>
          <div fxLayoutAlign="space-between center">
            <span class="widthHalf heading">Address</span>
            <span class="widthHalf">{{listing?.getFullAddress()}}</span>
          </div>
          <div fxLayoutAlign="space-between center">
            <span class="widthHalf heading">Wifi Network</span>
            <span class="widthHalf">{{listing?.wifi_network || '------'}}</span>
          </div>
          <div fxLayoutAlign="space-between center">
            <span class="widthHalf heading">Wifi Password</span>
            <span class="widthHalf">{{listing?.wifi_password || '------'}}</span>
          </div>
        </div>

        <div fxLayoutAlign="end center" fxLayoutGap="10px">
          <button mat-raised-button color="accent" (click)="detailsButtonClicked()">Details</button>
          <button mat-raised-button color="accent" (click)="openListing()">Listing</button>
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
      font-style: italic;
      font-weight: bolder;
      font-size: small;
    }
    
    span{
      font-size: small;
    }
    .fontSize{
      font-size: 15px;
    }

    .modal {
      font-size: x-small;
    }
  `]
})

export class ReservationDetailsMagnifyComponent implements OnInit {

  @Input() booking: Booking;
  @Input() guest: User;
  @Input() listing: Listing;
  @Output() showDetails: EventEmitter<Booking> = new EventEmitter<Booking>();
  @Output() showListing: EventEmitter<Listing> = new EventEmitter<Listing>();


  printButtonClicked() {
  }

  constructor(private stayDuvetService: StayDuvetService,
              private dialog: MatDialog,
              private store: Store<State>) {
  }

  ngOnInit() {
  }

  checkNullString(string: string): string {
    if (string != null) {
      return ' '.concat(string);
    } else {
      return '';
    }
  }

  getTitle() {
    if (isNullOrUndefined(this.booking.confirmation_code)) {
      return 'Reservation ######';
    }
    return 'Reservation ' + this.booking.confirmation_code;
  }


  openListing() {
    this.showListing.emit(this.listing);
  }


  detailsButtonClicked() {
    this.showDetails.emit(this.booking);
  }

}
