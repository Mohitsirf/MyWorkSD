import {Component, Input, OnInit, Output} from '@angular/core';
import {StayDuvetService} from '../../services/stayduvet';
import {MatDialog, MatDialogRef} from '@angular/material';
import {Store} from '@ngrx/store';
import {Prospect} from '../../models/prospect';
import {State} from '../../reducers/index';
import {Listing} from 'app/models/listing';
import {getSourceType} from 'app/utils';
import {CreateQuotePopupComponent} from './create-quote-popup';



@Component({
  selector: 'sd-prospect-details-magnify',
  template: `
    <sd-modal-popup-layout title="Prospect Details" [print]="true" (printAction)="printButtonClicked()" class="modal">
      <div fxLayout="column" fxLayoutGap="20px">
        <div fxLayout="column" fxLayoutGap="10px" class="fontSize">
          <div fxLayoutAlign="space-between center">
            <span class="widthHalf heading">Full Name</span>
            <span class="widthHalf">{{prospect?.guest.data.first_name}} {{prospect?.guest.data.last_name}}</span>
          </div>
          <div fxLayoutAlign="space-between center">
            <span class="widthHalf heading">Phone</span>
            <span class="widthHalf">{{prospect.guest.data.phone_number}}</span>
          </div>
          <div fxLayoutAlign="space-between center">
            <span class="widthHalf heading">Email</span>
            <span class="widthHalf">{{prospect?.guest.data.email}}</span>
          </div>
          <div fxLayoutAlign="space-between center">
            <span class="widthHalf heading">Listings</span>
            <span class="widthHalf">{{ listingsTitle(prospect)}}</span>
          </div>
           <div fxLayoutAlign="space-between center">
            <span class="widthHalf heading">Number of Guests</span>
            <span class="widthHalf">{{prospect?.number_of_guests}}</span>
          </div>
          <div fxLayoutAlign="space-between center">
            <span class="widthHalf heading">Check In Date</span>
            <span class="widthHalf">{{prospect?.start | date:'mediumDate'}}</span>
          </div>
            <div fxLayoutAlign="space-between center">
            <span class="widthHalf heading">Check Out Date</span>
            <span class="widthHalf">{{prospect?.end | date:'mediumDate'}}</span>
          </div>
        </div>

        <div fxLayoutAlign="end center" fxLayoutGap="10px">
          <button mat-raised-button color="accent" (click)="createQuote()">CreateQuote</button>
          <button mat-raised-button color="accent" (click)="editProspect()">Edit</button>
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
    
    .fontSize{
      font-size: 15px;
    }

    .modal {
      font-size: x-small;
    }
  `]
})

export class ProspectDetailsMagnifyComponent implements OnInit {

  private dialogRef: MatDialogRef<any>;

  @Input() prospect: Prospect;
  @Input() listings: Listing[];


  printButtonClicked() {
  }

  constructor(private stayDuvetService: StayDuvetService,
              private dialog: MatDialog,
              private store: Store<State>) {
  }

  ngOnInit() {
  }


  listingsTitle(prospect) {
    const prospectListings = this.listings.filter(listing => {
      return prospect.property_ids.includes(listing.id);
    });

    const titleArray = prospectListings.map(listing => listing.title);
    return titleArray.toString();
  }


  editProspect() {

  }

  createQuote() {
    const prospectListings = this.listings.filter(listing => {
      return this.prospect.property_ids.includes(listing.id);
    });

    const data = {
      listings: prospectListings,
      prospect: this.prospect
    };
    this.dialogRef = this.dialog.open(CreateQuotePopupComponent, {
      data: data
    });
    this.dialogRef.updateSize('100%','100%');
  }

  getSourceTitle(slug) {
    return getSourceType(slug).title;
  }


}
