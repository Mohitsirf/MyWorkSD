/**
 * Created by aditya on 17/7/17.
 */
import {Component, Inject, OnInit, OnDestroy, AfterContentInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {StayDuvetService} from '../../services/stayduvet';
import {Listing} from '../../models/listing';
import {User} from '../../models/user';
import {Store} from '@ngrx/store';
import {Quote} from '../../models/quote';
import DateUtils from '../../utils/date';
import FormUtils from '../../utils/form';
import {Router} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {Prospect} from '../../models/prospect';
import {getDateObj} from '../calendar/calendar-utils';

@Component({
  selector: 'sd-create-quote-popup',
  template: `
    <sd-modal-popup-layout title="Create Quote">
      <div style="width: 100%;" fxLayout="column" fxLayoutGap="20px">
        <div fxLayout="row" fxLayoutAlign="center" fxLayoutGap="30px">
          <div matTooltip="Check In Date"><span class="label">Check-In:</span><span>{{_check_in | date}}</span></div>
          <div matTooltip="Check Out Date"><span class="label">Check-Out:</span><span>{{_check_out | date}}</span></div>
          <div matTooltip="Number of Guests"><span class="label"># guests:</span><span>{{_guest_count}}</span></div>
          <div [matTooltip]="_pets_count > 0 ? 'Pet(s) Coming with guests' : 'No Pets'"><span
            class="label"># pets:</span><span>{{_pets_count}}</span></div>
        </div>
        <hr>
        <div fxLayout="row" fxLayoutAlign="space-between start">
        </div>
        <div fxLayout="row" fxLayoutAlign="space-between stretch">
          <div fxFlex="45%">
            <p style="margin-bottom: 20px; font-weight: bold">{{selectedListing.value.title}}</p>

            <div *ngIf="editedQuote" fxLayout="column" fxLayoutAlign="start stretch">
              <div fxLayoutAlign="space-between  start">
                <p>Total Fare</p>
                <p>{{editedQuote.total() | currency:'USD':true}}</p>
              </div>
              <hr>
              <div fxLayoutAlign="space-between start">
                <p>{{(editedQuote.base_amount / numOfNights) | currency:'USD':true}} X {{numOfNights}}</p>
                <p *ngIf="!editMode">{{editedQuote.base_amount | currency:'USD':true}}</p>
                <input class="quote-field" type="number" *ngIf="editMode" matInput min="0"
                       [(ngModel)]="editedQuote.base_amount"/>
              </div>
              <hr>
              <div fxLayoutAlign="space-between start">
                <p>Cleaning Fee</p>
                <p *ngIf="!editMode">{{editedQuote.cleaning_fee | currency:'USD':true}}</p>
                <input class="quote-field" type="number" *ngIf="editMode" matInput min="0"
                       [(ngModel)]="editedQuote.cleaning_fee"/>
              </div>
              <hr>
              <div fxLayoutAlign="space-between start" *ngIf="editedQuote.other_fee.pet_fee">
                <p>Pet Fee</p>
                <p *ngIf="!editMode">{{editedQuote.other_fee.pet_fee | currency:'USD':true}}</p>
                <input class="quote-field" type="number" *ngIf="editMode" matInput min="0"
                       [(ngModel)]="editedQuote.other_fee.pet_fee"/>
              </div>
              <hr *ngIf="editedQuote.other_fee.pet_fee">
              <div fxLayoutAlign="space-between start" *ngIf="editedQuote.other_fee.extra_guest_fee">
                <p>Extra Guest Fee</p>
                <p *ngIf="!editMode">{{editedQuote.other_fee.extra_guest_fee | currency:'USD':true}}</p>
                <input class="quote-field" type="number" *ngIf="editMode" matInput min="0"
                       [(ngModel)]="editedQuote.other_fee.extra_guest_fee"/>
              </div>
              <hr *ngIf="editedQuote.other_fee.extra_guest_fee">
              <div fxLayoutAlign="space-between start">
                <p>Security Fee</p>
                <p *ngIf="!editMode">{{editedQuote.security_deposit_fee | currency:'USD':true}}</p>
                <input class="quote-field" type="number" *ngIf="editMode" matInput min="0"
                       [(ngModel)]="editedQuote.security_deposit_fee"/>
              </div>
              <hr>
              <div fxLayoutAlign="space-between start">
                <p>Service Fee</p>
                <p>{{editedQuote.serviceFee() | currency:'USD':true}}</p>
              </div>
              <hr>
              <div fxLayoutAlign="space-between start">
                <p>CC Process Fee</p>
                <p>{{editedQuote.ccProcessFee() | currency:'USD':true}}</p>
              </div>
              <hr>
              <div fxLayoutAlign="space-between" start>
                <p>Occupancy Taxes</p>
                <p>{{editedQuote.taxes() | currency:'USD':true}}</p>
              </div>
            </div>
            <div *ngIf="!editedQuote" class="loading">
              <sd-center-spinner></sd-center-spinner>
            </div>
          </div>
          <div fxFlex="45%" fxLayout="column" fxLayoutAlign="start stretch">
            <form [formGroup]="quoteForm" fxLayout="column" fxLayoutGap="15px">
              <mat-form-field fxFlex="80%">
                <mat-select placeholder="Listing"
                            (change)="setupQuoteDetails()"
                            formControlName="selectedListing">
                  <mat-option *ngFor="let listing of listings" [value]="listing">{{listing.title}}</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field>
                <mat-select placeholder="Source" formControlName="source">
                  <mat-option value="airbnb">AirBnb</mat-option>
                  <mat-option value="homeaway">HomeAway</mat-option>
                  <mat-option value="stayduvet">StayDuvet</mat-option>
                  <mat-option value="referral">Referral</mat-option>
                </mat-select>
              </mat-form-field>
            </form>
            <div fxLayout="row" fxLayoutAlign="end" fxLayoutGap="15px">
              <mat-spinner color="accent" *ngIf="isSaving" [diameter]="30" [strokeWidth]="4"></mat-spinner>
              <button mat-raised-button *ngIf="!editMode" [disabled]="isSaving" color="accent"
                      (click)="editMode = true">
                Edit Invoice
              </button>
              <button mat-raised-button *ngIf="!editMode" [disabled]="isSaving || notPossible" color="accent"
                      (click)="createQuote()">Continue
              </button>
              <button mat-raised-button *ngIf="editMode" color="accent" (click)="saveInvoice()">Save</button>
              <button mat-raised-button *ngIf="editMode" color="primary" (click)="reset()">Reset</button>
            </div>
          </div>
        </div>
      </div>
      <sd-center-spinner *ngIf="isSaving || notPossible"></sd-center-spinner>
    </sd-modal-popup-layout>
  `,
  styles: [`
    .padding {
      cursor: pointer;
      padding: -10px -10px -10px -10px;
      background: -webkit-linear-gradient(top, #ffffff 0%, #ffffff 100%);
    }

    .content {
      font-size: 14px;
      line-height: 130%;
    }

    h3 {
      font-weight: bolder !important;
      letter-spacing: 1px !important;
      font-size: 22px !important;
      font-family: 'Montserrat', sans-serif !important;
    }

    .mat-card {
      border: 1px solid lightgrey !important;
      box-shadow: none !important;
    }

    .label {
      margin-right: 5px;
      color: #aaaaaa;
    }

    hr {
      width: 100%;
    }

    p {
      margin-bottom: 5px;
      margin-top: 5px;
      font-size: 16px;
    }

    .quote-field {
      text-align: right;
      width: auto;
      font-size: 20px;
      color: green;
    }

    .loading {
      position: relative;
      height: 360px;
      width: 100%;
    }
  `]
})
export class CreateQuotePopupComponent implements OnInit, OnDestroy, AfterContentInit {
  _check_in: string;
  _check_out: string;
  _guest_count: number;
  _pets_count: number;

  listings: Listing[];
  prospect: Prospect;

  quoteForm: FormGroup;
  selectedListing: FormControl;
  source: FormControl;

  guests: User[] = [];
  isSaving = false;
  editMode = false;
  isAlive = true;
  quote: Quote;
  editedQuote: Quote;
  numOfNights: number;

  notPossible = false;

  constructor(private service: StayDuvetService,
              private dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) private data: CreateQuotePopupData,
              private router: Router) {
    this.prospect = data.prospect;
    this.listings = data.listings;
    this.numOfNights = DateUtils.daysBetweenDates(getDateObj(data.prospect.start), getDateObj(data.prospect.end));

    // Doing this to make the data readable outside TS Class scope.
    this._check_in = data.prospect.start;
    this._check_out = data.prospect.end;
    this._guest_count = data.prospect.number_of_guests;
    this._pets_count = data.prospect.number_of_pets;
  }

  ngOnInit() {
    this.setupForms();

    this.selectedListing.valueChanges.subscribe((change) => {
      this.setupQuoteDetails();
    });
  }

  ngAfterContentInit() {
    this.setupQuoteDetails();
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

  setupForms() {
    this.selectedListing = new FormControl(null, [Validators.required]);
    this.source = new FormControl('stayduvet', [Validators.required]);

    this.quoteForm = new FormGroup({
      selectedListing: this.selectedListing,
      source: this.source
    });

    this.selectedListing.setValue(this.listings[0]);
  }

  setupQuoteDetails() {
    this.quote = null;
    this.editedQuote = null;
    console.log(this.selectedListing.value);

    this.service.getQuote(this.selectedListing.value.id, getDateObj(this.prospect.start), getDateObj(this.prospect.end), this.prospect.number_of_pets)
      .subscribe(value => {
        this.quote = value;
        this.editedQuote = Object.assign(new Quote(), this.quote);
      }, err => {
        this.notPossible = true;
      });
  }

  saveInvoice() {
    this.quote = Object.assign(new Quote(), this.editedQuote);
    this.editMode = false;
  }

  reset() {
    this.editedQuote = Object.assign(new Quote(), this.quote);
    this.editMode = false;
  }

  createQuote() {
    FormUtils.markAllAsTouched(this.quoteForm);

    if (this.quoteForm.invalid) {
      return;
    }

    this.isSaving = true;
    this.service.createQuote(this.getData()).subscribe((quote) => {
      this.isSaving = false;

      this.dialog.closeAll();
    }, () => {
      this.isSaving = false;
    });
  }

  getGuestName(guest: User) {
    if (isNullOrUndefined(guest)) {
      return '';
    }

    return guest.first_name + this.checkNullString(guest.last_name);
  }

  checkNullString(string: string): string {
    if (string != null) {
      return ' '.concat(string);
    } else {
      return '';
    }
  }

  getData() {
    const data = {
      property_id: this.selectedListing.value.id,
      prospect_id: this.prospect.id,

      start: this.prospect.start,
      end: this.prospect.end,

      number_of_guests: this.prospect.number_of_guests,
      number_of_pets: this.prospect.number_of_pets,

      security_deposit_fee: this.quote.security_deposit_fee,
      guest_channel_fee: this.quote.serviceFee(),
      base_amount: this.quote.base_amount,
      cc_process_fee: this.quote.ccProcessFee(),
      cleaning_fee: this.quote.cleaning_fee,
      source: this.source.value
    };

    if (this.quote.other_fee.pet_fee || this.quote.other_fee.extra_guest_fee) {
      data['other_fee'] = [];
      if (this.quote.other_fee.pet_fee) {
        data['other_fee'].push({
          'slug': 'pet_fee',
          'description': 'Fee for accommodating pets on property',
          'amount': this.quote.other_fee.pet_fee,
        });
      }
      if (this.quote.other_fee.extra_guest_fee) {
        data['other_fee'].push({
          'slug': 'extra_guest_fee',
          'description': 'Fee for accommodating extra guests on property',
          'amount': this.quote.other_fee.pet_fee,
        });
      }
    }

    return data;
  }
}

export interface CreateQuotePopupData {
  prospect: Prospect;
  listings: Listing[];
}
