import {Component, Input, OnInit} from '@angular/core';
import {Listing} from '../../../models/listing';
import {StayDuvetService} from '../../../services/stayduvet';
import {MatDialog} from '@angular/material';
import {Store} from '@ngrx/store';
import {State} from '../../../reducers/index';
import {UpdateSuccessAction} from '../../../actions/listing';

@Component({
  selector: 'sd-listing-listing-name-popup',
  template: `
    <sd-modal-popup-layout title="{{title}}">
      <div fxLayout="column" fxLayoutAlign="center stretch" fxLayoutGap="10px">
        <mat-form-field class="detailField">
          <input
            matInput
            placeholder="Title"
            [(ngModel)]="listingTitle">
        </mat-form-field>
        <mat-form-field class="detailField">
          <input
            matInput
            placeholder="Headline"
            [(ngModel)]="listingHeadline">
        </mat-form-field>
        <div fxLayout="row" fxLayoutAlign="end center" fxLayoutGap="10px">
          <mat-spinner *ngIf="isSaving" [diameter]="30" [strokeWidth]="4"></mat-spinner>
          <button mat-raised-button color="accent" [disabled]="isSaving" (click)="saveButtonCLicked()">Save</button>
        </div>
      </div>
    </sd-modal-popup-layout>
  `,
  styles: [`

    .title {
      font-weight: bolder;
      font-size: 22px;
      padding-left: 10px;
      padding-right: 10px;
      height: 30px;
      width: 100%;
    }

    .detailField {
      padding-left: 10px;
      padding-right: 10px;
      width: 95%;
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

export class ListingNamePopupComponent implements OnInit {
  title = 'Edit Listing Name';
  @Input() listing: Listing;

  isSaving: Boolean = false;

  listingTitle;
  listingHeadline;

  constructor(private service: StayDuvetService, private dialog: MatDialog, private store: Store<State>) {
  }

  ngOnInit() {
    this.listingTitle = this.listing.title;
    this.listingHeadline = this.listing.headline;
  }

  saveButtonCLicked() {
    this.isSaving = true;
    const data = {};
    data['title'] = this.listingTitle;
    data['headline'] = this.listingHeadline;
    this.service.updateListingDetails(data, String(this.listing.id)).subscribe((listing) => {
      this.isSaving = false;
      this.dialog.closeAll();
    }, () => {
      this.isSaving = false;
    });
  }
}
