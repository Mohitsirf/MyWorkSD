import {Component, Input, OnInit} from '@angular/core';
import {Listing} from '../../../models/listing';
import {StayDuvetService} from '../../../services/stayduvet';
import {MatDialog} from '@angular/material';
import {Store} from '@ngrx/store';
import {State} from '../../../reducers/index';
import {UpdateSuccessAction} from '../../../actions/listing';
import {FormControl, FormGroup} from '@angular/forms';
import Utils from '../../../utils';

@Component({
  selector: 'sd-listing-property-access-popup',
  template: `
    <sd-modal-popup-layout title="Property Access & Parking">
      <form fxLayout="column" [formGroup]="formGroup" (ngSubmit)="formGroup.valid && saveButtonCLicked()">
        <div fxLayoutAlign="space-between center">
          <mat-form-field style="width: 48%;">
            <mat-select
              matInput
              formControlName="property_access_title"
              placeholder="Type of Check In">
              <mat-option *ngFor="let lock of locks" [value]="lock.title">{{lock.title}}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field class="halfWidth">
            <input matInput placeholder="Property Access Code" formControlName="property_access_code">
          </mat-form-field>
        </div>

        <mat-form-field>
          <textarea 
            matInput 
            placeholder="Property Access Note"
            rows="8"
            formControlName="property_access_note">
          </textarea>
        </mat-form-field>
        
        <h3>Parking</h3>
        <mat-form-field>
          <textarea 
            matInput 
            placeholder="Parking Note" 
            rows="8" 
            formControlName="parking_note">
          </textarea>
        </mat-form-field>
        
        <div fxLayoutAlign="end center">
          <mat-spinner *ngIf="isSaving" [diameter]="30" [strokeWidth]="4"></mat-spinner>
          <button mat-raised-button color="accent">Save</button>
        </div>
      </form>
    </sd-modal-popup-layout>
  `,
  styles: [`
    .halfWidth {
      width: 48%;
    }

    textarea {
      resize: none;
    }

    mat-spinner {
      width: 30px;
      height: 30px;
    }
  `]
})

export class ListingPropertyAccessPopupComponent implements OnInit {
  @Input() listing: Listing;
  formGroup: FormGroup;
  parkingNote: FormControl;
  propertyAccessCode: FormControl;
  propertyAccessNote: FormControl;
  propertyAccessTitle: FormControl;
  locks = [
    {title: 'Lock-Box'},
    {title: 'Smart-Lock'},
    {title: 'Key Code'},
    {title: 'Face to Face'}
  ];

  isSaving: Boolean = false;

  constructor(private service: StayDuvetService, private dialog: MatDialog, private store: Store<State>) {
    this.parkingNote = new FormControl();
    this.propertyAccessCode = new FormControl();
    this.propertyAccessNote = new FormControl();
    this.propertyAccessTitle = new FormControl();

    this.formGroup = new FormGroup({
      parking_note: this.parkingNote,
      property_access_code: this.propertyAccessCode,
      property_access_note: this.propertyAccessNote,
      property_access_title: this.propertyAccessTitle
    });
  }

  ngOnInit() {
    this.parkingNote.setValue(this.listing.parking_note);
    this.propertyAccessCode.setValue(this.listing.property_access_code);
    this.propertyAccessNote.setValue(this.listing.property_access_note);
    this.propertyAccessTitle.setValue(this.listing.property_access_title);
  }

  saveButtonCLicked() {
    this.isSaving = true;
    let data = this.formGroup.value;
    data = Utils.removeNullFields(data);
    console.log(data);
    this.service.updateListingDetails(data, String(this.listing.id)).subscribe((listing) => {
      this.isSaving = false;
      this.dialog.closeAll();
    }, () => {
      this.isSaving = false;
    });
  }
}
