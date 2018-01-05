import {Component, Input, OnInit} from '@angular/core';
import {Listing} from '../../../models/listing';
import {StayDuvetService} from '../../../services/stayduvet';
import {MatDialog} from '@angular/material';
import {isNullOrUndefined} from 'util';
import {amenitiesObject} from '../../../utils/constants';

/**
 * Created by piyushkantm on 30/06/17.
 */

@Component({
  selector: 'sd-listing-amenities-popup',
  template: `
    <sd-modal-popup-layout title="What amenities does your property offer?">
        <div fxLayout="column" style="width: 98%" fxLayoutGap="20px">
          <div fxLayout="column" fxLayoutAlign="center">
            <div style="width: 100%;" fxLayout="row" fxLayoutAlign="start center" fxLayoutWrap>
              <div fxLayoutAlign="start stretch" fxFlex="33%" class="sd-row" *ngFor="let amenity of amenities">
                <mat-checkbox [(ngModel)]="this.amenitiesObject[amenity].exists"><span>{{ this.amenitiesObject[amenity].title
                  }}</span>
                </mat-checkbox>
              </div>
            </div>
            <div fxLayout="row" fxLayoutAlign="end center" class="sd-row">
              <div fxFlex="20%" fxLayoutAlign="end center">
                <mat-spinner color="accent" *ngIf="isSaving" [diameter]="30" [strokeWidth]="4"></mat-spinner>
                <a mat-raised-button fxFlexAlign="end" [disabled]="isSaving" color="accent"
                   (click)="saveButtonCLicked()">
                  Save
                </a>
              </div>
            </div>
          </div>
        </div>
    </sd-modal-popup-layout>
  `,
  styles: [`   
    .sd-row {
      margin-bottom: 5px;
      margin-top: 5px;
    }

    mat-spinner {
      width: 24px;
      height: 24px;
      margin-right: 20px;
    }
  `]
})
export class ListingAmenitiesPopupComponent implements OnInit {
  @Input() listing: Listing;

  amenities: string[];
  amenitiesObject = {...amenitiesObject};

  isSaving: Boolean = false;

  constructor(private service: StayDuvetService, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.amenities = Object.keys(this.amenitiesObject);
    if (this.listing.amenities) {
      for (const amenity of this.listing.amenities) {
        if (!isNullOrUndefined(this.amenitiesObject[amenity])) {
          this.amenitiesObject[amenity].exists = true;
        }
      }
    }
  }

  saveButtonCLicked() {
    this.isSaving = true;

    const data = {};
    const amenitiesArray = [];
    for (const amenity of this.amenities) {
      if (this.amenitiesObject[amenity].exists) {
        amenitiesArray.push(amenity);
      }
    }

    data['amenities'] = amenitiesArray;
    this.service.updateListingDetails(data, String(this.listing.id)).subscribe((listing) => {
      this.isSaving = false;
      this.dialog.closeAll();
    }, () => {
      this.isSaving = false;
    });
  }
}

