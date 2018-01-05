import {Component, Input, OnInit} from '@angular/core';
import {SavedMessage} from '../../models/saved-message';
import {ListingCannedMessagePopupComponent} from '../listing/popups/listing-canned-message-popup';
import {StayDuvetService} from '../../services/stayduvet';
import {MatDialog, MatDialogRef} from '@angular/material';
import {Listing} from '../../models/listing';
import {getListings, State} from '../../reducers';
import {Store} from '@ngrx/store';
import {isNullOrUndefined} from "util";

@Component({
  selector: 'sd-canned-responses-detail',
  template: `
    <mat-card class="padding" (click)="editMessage(item)"  style="cursor: pointer">
      <mat-card-content>
        <div fxLayout="row" fxLayoutAlign="space-between center">
          <h3>{{item.title}}</h3>

          <span class="mat-button"
                style="background-color: darkorange;text-align: center; color: white">
                    {{getText(item.property_ids)}}
            </span>
        </div>
        <div class="content">
          {{item.message}}
        </div>
        <br>
      </mat-card-content>
    </mat-card>
    
  `,
  styles: [`
   
    .content {
      font-size: 12px;
      line-height: 130%;
    }
    .padding {
      background: -webkit-linear-gradient(top, #ffffff 0%, #ffffff 100%);
    }
    .mat-card {
      border: 1px solid lightgrey !important;
      box-shadow: none !important;
      background: -webkit-linear-gradient(top, #ffffff 0%, #ffffff 100%);
    }

    h3 {
      font-weight: bolder !important;
      letter-spacing: 1px !important;
      font-size: 20px !important;
      font-family: 'Montserrat', sans-serif !important;
    }
    
    mat-spinner {
      width: 30px;
      height: 30px;
    }
  `]
})

export class SettingCannedResponsesDetailComponent implements OnInit {

  @Input() item: SavedMessage;
  isAlive = true;


  private dialogRef:MatDialogRef<any>;

  listings:Listing[] = [];




  constructor( private service: StayDuvetService, private dialog: MatDialog,  private store: Store<State>) {
  }
  ngOnInit() {
    this.store.select(getListings).takeWhile(() => this.isAlive).subscribe((listings) => {
      this.listings = listings;
    });
  }

  getText(ids:number[])
  {
    if(isNullOrUndefined(ids) || ids.length == 0)
    {
      return 'On No Listings';
    }

    const listingIds = this.listings.map(listing => listing.id);

    if(listingIds.length == ids.length)
    {
      return 'On All Listings';
    }

    if(listingIds.length > ids.length)
    {
      return 'On Multiple Listings';
    }

  }

  editMessage(message:SavedMessage)
  {

    this.dialogRef = this.dialog.open(ListingCannedMessagePopupComponent);
    const instance = this.dialogRef.componentInstance;
    instance.messageId = message.id;
    instance.title = message.title;
    instance.message = message.message;
    instance.popUpTitle = "Edit Canned Response";
    instance.isEditType = true;
    instance.listingIds =  message.property_ids;
    instance.listings = this.listings;
    this.dialogRef.updateSize('100%','100%');
  }


}
