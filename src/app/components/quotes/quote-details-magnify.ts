import {Component, Inject, Input, OnInit, Output} from '@angular/core';
import {StayDuvetService} from '../../services/stayduvet';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {Store} from '@ngrx/store';
import {Quote} from "../../models/quote";
import {State} from "../../reducers/index";
import {Listing} from "app/models/listing";
import {getSourceType} from "app/utils";


@Component({
  selector: 'sd-quote-details-magnify',
  template: `
    <sd-modal-popup-layout title="Quote Details" [print]="true" (printAction)="printButtonClicked()" class="modal">
      <div fxLayout="column" fxLayoutGap="20px">
        <div fxLayout="column" fxLayoutGap="10px" class="fontSize">
          <div fxLayoutAlign="space-between center">
            <span class="widthHalf heading">Listing</span>
            <span class="widthHalf">{{listingTitle(quote.property_id)}}</span>
          </div>
          <div fxLayoutAlign="space-between center">
            <span class="widthHalf heading">Check In</span>
            <span class="widthHalf">{{quote?.check_in | date:'mediumDate'}}</span>
          </div>
          <div fxLayoutAlign="space-between center">
            <span class="widthHalf heading">Check Out</span>
            <span class="widthHalf">{{quote?.check_out | date:'mediumDate'}}</span>
          </div>
          <div fxLayoutAlign="space-between center">
            <span class="widthHalf heading">Source</span>
            <span class="widthHalf">{{ getSourceTitle(quote?.source)}}</span>
          </div>
          <div fxLayoutAlign="space-between center">
            <span class="widthHalf heading">Base Amount</span>
            <span class="widthHalf"> $ {{quote?.base_amount || 0 | number : '1.2-2'}}</span>
          </div>
          <div fxLayoutAlign="space-between center">
            <span class="widthHalf heading">Cleaning Fee</span>
            <span class="widthHalf">$ {{quote?.cleaning_fee || 0  | number : '1.2-2'}}</span>
          </div>
          <div fxLayoutAlign="space-between center" *ngIf="quote.other_fee.pet_fee">
            <span class="widthHalf heading">Pet Fee</span>
            <span class="widthHalf">$ {{quote.other_fee.pet_fee || 0 | number : '1.2-2'}}</span>
          </div>
          <div fxLayoutAlign="space-between center" *ngIf="quote.other_fee.extra_guest_fee">
            <span class="widthHalf heading">Extra Guest Fee</span>
            <span class="widthHalf">$ {{quote.other_fee.extra_guest_fee || 0 | number : '1.2-2' }}</span>
          </div>
          <div fxLayoutAlign="space-between center">
            <span class="widthHalf heading">Security Deposit</span>
            <span class="widthHalf">$ {{quote?.security_deposit_fee || 0 | number : '1.2-2'}}</span>
          </div>
          <div fxLayoutAlign="space-between center">
            <span class="widthHalf heading">Service Fee</span>
            <span class="widthHalf">$ {{quote?.guest_channel_fee || 0 | number : '1.2-2'}}</span>
          </div>
          <div fxLayoutAlign="space-between center">
            <span class="widthHalf heading">CC Process Fee</span>
            <span class="widthHalf">$ {{quote?.cc_process_fee || 0 | number : '1.2-2' }}</span>
          </div>
          <div fxLayoutAlign="space-between center">
            <span class="widthHalf heading">Total Tax</span>
            <span class="widthHalf">$ {{quote?.total_tax || 0 | number : '1.2-2' }}</span>
          </div>
          <div fxLayoutAlign="space-between center">
            <span class="widthHalf heading">Payable Amount</span>
            <span class="widthHalf">$ {{quote?.amount_to_pay || 0 | number : '1.2-2'}}</span>
          </div>
        </div>

        <div fxLayoutAlign="end center" fxLayoutGap="10px">
          <button mat-raised-button color="accent" (click)="cancel()">Cancel</button>
          <button mat-raised-button color="accent" (click)="editQuote()">Edit</button>
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
    }

    .fontSize {
      font-size: 15px;
    }

    .modal {
      font-size: x-small;
    }
  `]
})

export class QuoteDetailsMagnifyComponent implements OnInit {

  quote: Quote;
  listings: Listing[];


  printButtonClicked() {
  }

  constructor(private stayDuvetService: StayDuvetService,
              private dialog: MatDialog,
              private store: Store<State>,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    this.quote = data.quote;
    this.listings = data.listings;

    console.log(this.quote);
  }

  ngOnInit() {
  }


  listingTitle(id) {
    return this.listings.find(listing => listing.id == id).title;
  }


  editQuote() {

  }

  cancel() {
    this.dialog.closeAll();
  }

  getSourceTitle(slug) {
    return getSourceType(slug).title;
  }

}
