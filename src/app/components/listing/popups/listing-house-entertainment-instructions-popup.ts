import {Component, Input, OnInit} from '@angular/core';
import {Listing} from '../../../models/listing';
import {StayDuvetService} from '../../../services/stayduvet';
import {MatDialog} from '@angular/material';
import {Store} from '@ngrx/store';
import {State} from '../../../reducers/index';
import {UpdateSuccessAction} from '../../../actions/listing';
import {FormControl, FormGroup} from '@angular/forms';
import {getCoffeeMakerTypes, default as Utils, getCoffeeMakerType} from '../../../utils';

@Component({
  selector: 'sd-listing-entertainment-instructions-popup',
  template: `
    <sd-modal-popup-layout title="Entertainment Instructions">
      <form fxLayout="column" [formGroup]="formGroup" (ngSubmit)="formGroup.valid && saveButtonCLicked()">
        <div fxLayoutAlign="space-between center">
          <mat-form-field style="width: 30%">
            <input matInput placeholder="Netflix Username" formControlName="netflix_username">
          </mat-form-field>
          <mat-form-field style="width: 30%">
            <input matInput placeholder="Netflix Password" formControlName="netflix_password">
          </mat-form-field>
          <mat-form-field style="width: 30%">
          <mat-select  placeholder="Coffee Maker Type*" floatPlaceholder="never"
                     formControlName="coffee_maker_type">
            <mat-option *ngFor="let coffeeMakertype of coffeeMakerTypes" [value]="coffeeMakertype.slug">
              {{coffeeMakertype.title}}
            </mat-option>
          </mat-select>
          </mat-form-field>
        </div>
        <mat-form-field>
          <textarea matInput placeholder="Entertainment Note" rows="8" formControlName="entertainment_note"></textarea>
        </mat-form-field>

        <h3>Wifi info</h3>
        <div fxLayoutAlign="space-between center">
          <mat-form-field style="width: 48%">
            <input matInput placeholder="Wifi Network" formControlName="wifi_network">
          </mat-form-field>
          <mat-form-field style="width: 48%">
            <input matInput placeholder="Wifi Password" formControlName="wifi_password">
          </mat-form-field>
        </div>
        <mat-form-field>
          <textarea matInput placeholder="Wifi Note" rows="8" formControlName="wifi_note"></textarea>
        </mat-form-field>
        <div fxLayoutAlign="end center">
          <mat-spinner *ngIf="isSaving" [diameter]="30" [strokeWidth]="4"></mat-spinner>
          <button mat-raised-button color="accent">Save</button>
        </div>
      </form>
    </sd-modal-popup-layout>
  `,
  styles: [`
    textarea {
      resize: none;
    }

    mat-spinner {
      width: 30px;
      height: 30px;
    }
  `]
})

export class ListingEntertainmentInstructionsPopupComponent implements OnInit {
  @Input() listing: Listing;
  formGroup: FormGroup;
  netflixUsername: FormControl;
  netflixPassword: FormControl;
  coffeeMakerType: FormControl;
  entertainmentNote: FormControl;
  wifiNetwork: FormControl;
  wifiPassword: FormControl;
  wifiNote: FormControl;

  isSaving: Boolean = false;
  coffeeMakerTypes;

  constructor(private service: StayDuvetService, private dialog: MatDialog, private store: Store<State>) {
    this.netflixUsername = new FormControl();
    this.netflixPassword = new FormControl();
    this.coffeeMakerType = new FormControl();
    this.entertainmentNote = new FormControl();
    this.wifiNetwork = new FormControl();
    this.wifiPassword = new FormControl();
    this.wifiNote = new FormControl();

    this.formGroup = new FormGroup({
      netflix_username: this.netflixUsername,
      netflix_password: this.netflixPassword,
      coffee_maker_type: this.coffeeMakerType,
      entertainment_note: this.entertainmentNote,
      wifi_network: this.wifiNetwork,
      wifi_password: this.wifiPassword,
      wifi_note: this.wifiNote,
    });
  }

  ngOnInit() {
    this.coffeeMakerTypes = getCoffeeMakerTypes();
    this.netflixUsername.setValue(this.listing.netflix_username);
    this.netflixPassword.setValue(this.listing.netflix_password);
    this.coffeeMakerType.setValue(this.listing.coffee_maker_type);
    this.entertainmentNote.setValue(this.listing.entertainment_note);
    this.wifiNetwork.setValue(this.listing.wifi_network);
    this.wifiPassword.setValue(this.listing.wifi_password);
    this.wifiNote.setValue(this.listing.wifi_note);
  }

  saveButtonCLicked() {
    this.isSaving = true;
    let data = this.formGroup.value;
    data = Utils.removeNullFields(data);
    this.service.updateListingDetails(data, String(this.listing.id)).subscribe((listing) => {
      this.isSaving = false;
      this.dialog.closeAll();
    }, () => {
      this.isSaving = false;
    });
  }
}
