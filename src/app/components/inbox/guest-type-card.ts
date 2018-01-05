import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {Booking} from '../../models/booking';
import {Store} from '@ngrx/store';
import {getListingById, State} from '../../reducers/index';
import {Listing} from '../../models/listing';
import {Router} from '@angular/router';

@Component({
  selector: 'sd-guest-type-card',
  template: `
    <div class="card" fxLayout="column" fxLayoutGap="10px">
      <span class="title">Guest Type</span>

      <hr class="full-width">

      <div fxLayoutAlign="space-between center">
        <span><b>Suitable for children:</b></span>
        <span>{{getResponseInYesNo(listing.suitable_for_children)}}</span>
      </div>
      <div fxLayoutAlign="space-between center">
        <span><b>Suitable for infants:</b></span>
        <span>{{getResponseInYesNo(listing.suitable_for_infants)}}</span>
      </div>
      <div fxLayoutAlign="space-between center">
        <span><b>Pets:</b></span>
        <span>{{getResponseInYesNo(listing.pets_allowed)}}</span>
      </div>
      <div fxLayoutAlign="space-between center">
        <span><b>Events/Filming allowed:</b></span>
        <span>{{getResponseInYesNo(listing.events_allowed)}}</span>
      </div>
      <div fxLayoutAlign="space-between center">
        <span><b>Smoking:</b></span>
        <span>{{getResponseInYesNo(listing.smoking_allowed)}}</span>
      </div>
      <div fxLayoutAlign="space-between center">
        <span><b>Must climb stairs:</b></span>
        <span>{{getResponseInYesNo(listing.must_climb_stairs)}}</span>
      </div>
      <div fxLayoutAlign="space-between center">
        <span><b>Potential for noise:</b></span>
        <span>{{getResponseInYesNo(listing.potential_for_noise)}}</span>
      </div>
      <div fxLayoutAlign="space-between center">
        <span><b>Pets live on property:</b></span>
        <span>{{getResponseInYesNo(listing.pets_live_on_property)}}</span>
      </div>
      <div fxLayoutAlign="space-between center">
        <span><b>No parking on property:</b></span>
        <span>{{getResponseInYesNo(listing.no_parking_on_property)}}</span>
      </div>
      <hr class="full-width">

      <span>Edit these under Guest Type</span>
      <button mat-button (click)="openGuest()">
        View Notes
      </button>
    </div>
  `,
  styles: [`

    .card {
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
      transition: 0.3s;
      padding: 12px;
      background: #ffffff;
      border: 1px solid lightgrey;

    }

    .title {
      font-size: 20px;
      font-style: italic;
      font-weight: bolder;
    }

    .full-width {
      width: 100%;
    }

    .medium-font {
      font-size: 20px;
    }

    span {
      font-family: 'Roboto', sans-serif !important;
      letter-spacing: 0px !important;
      font-size: 16px !important;
      color: #13304b;
      font-weight: 300 !important;
    }

  `]
})

export class GuestTypeCardComponent implements OnInit,OnChanges {

  @Input() booking: Booking;
  listingId;
  listing: Listing;


  constructor(private store: Store<State>,
              private router: Router) {
  }

  ngOnInit() {
  }

  ngOnChanges(){
    this.listingId = this.booking.property_id;
    this.store.select((state) => {
      return getListingById(state, this.listingId);
    }).subscribe((listing) => {
      this.listing = listing;
    });
  }

  getResponseInYesNo(value: boolean) {
    if (value) {
      return 'Yes';
    } else {
      return 'No';
    }
  }

  openGuest() {
    this.router.navigate(['/listings/' + this.booking.property_id + '/guest']);
  }
}
