import {Component, Input, OnInit} from '@angular/core';
import {Listing} from '../../../models/listing';
import {StayDuvetService} from '../../../services/stayduvet';
import {MatDialog} from '@angular/material';
import {Store} from '@ngrx/store';
import {State} from '../../../reducers/index';
import {UpdateSuccessAction} from '../../../actions/listing';

@Component({
  selector: 'sd-listing-common-text-popup',
  template: `
    <sd-modal-popup-layout title="{{title}}">
      <div fxLayout="column" fxLayoutAlign="center stretch" fxLayoutGap="10px">
        <mat-form-field class="detailField">
          <textarea rows="15" color="accent" matInput placeholder="{{placeholder}}" [(ngModel)]="value"></textarea>
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

export class ListingCommonTextPopupComponent implements OnInit {
  @Input() title = 'Title';
  @Input() placeholder: string = this.title;
  @Input() key: string;
  @Input() listing: Listing;

  isSaving: Boolean = false;
  value;

  constructor(private service: StayDuvetService, private dialog: MatDialog, private store: Store<State>) {
  }

  ngOnInit() {
    this.value = this.listing[this.key];
  }

  saveButtonCLicked() {
    this.isSaving = true;

    const data = {};
    data[this.key] = this.value;
    this.service.updateListingDetails(data, String(this.listing.id)).subscribe((listing) => {
      this.isSaving = false;
      this.dialog.closeAll();
    }, () => {
      this.isSaving = false;
    } );
  }
}
