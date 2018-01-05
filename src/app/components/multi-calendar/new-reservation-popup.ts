/**
 * Created by aditya on 17/7/17.
 */
import {Component, Inject, OnInit, OnDestroy, HostListener, AfterViewChecked, AfterContentInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {StayDuvetService} from '../../services/stayduvet';
import {Listing} from '../../models/listing';
import {User} from '../../models/user';
import {getActiveContacts, getIsActiveContactLoaded, getIsActiveContactLoading, State} from '../../reducers/index';
import {Store} from '@ngrx/store';
import {Quote} from '../../models/quote';
import DateUtils from '../../utils/date';
import FormUtils from '../../utils/form';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs/Observable';
import {Guest} from '../../models/guest';
import {Router} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {getAllReservationPaymentTypes} from '../../utils';

@Component({
  selector: 'sd-new-reservation-popup',
  template: `
    <sd-modal-popup-layout title="Create Reservation">
      <div style="width: 100%;" fxLayout="column" fxLayoutGap="20px">
        <div fxLayout="row" fxLayoutAlign="center" fxLayoutGap="30px">
          <div matTooltip="Check In Date"><span class="label">Check-In:</span><span>{{_check_in | date}}</span></div>
          <div matTooltip="Check Out Date"><span class="label">Check-Out:</span><span>{{_check_out | date}}</span></div>
          <div matTooltip="Number of Guests"><span class="label"># guests:</span><span>{{_guest_count}}</span></div>
          <div [matTooltip]="_pets_count > 0 ? 'Pet(s) Coming with guests' : 'No Pets'"><span class="label"># pets:</span><span>{{_pets_count}}</span></div>
        </div>
        <hr>
        <div fxLayout="row" fxLayoutAlign="space-between start">
          <mat-slide-toggle fxFlex="45%" (change)="isReturnGuest = $event.checked">Return Guest</mat-slide-toggle>
          <mat-spinner *ngIf="isReturnGuest && !contactsLoaded" [color]="'accent'" [diameter]="30" [strokeWidth]="4"></mat-spinner>
          <mat-form-field *ngIf="isReturnGuest && contactsLoaded" fxFlex="45%" style="margin-bottom: 20px;">
            <input matInput placeholder="Search guest name" [matAutocomplete]="auto" [formControl]="returnGuest">
            <mat-autocomplete #auto="matAutocomplete" [displayWith]="getGuestName.bind(this)">
              <mat-option *ngFor="let guest of filteredGuests | async"
                          [ngStyle]="{'color': 'white'}"
                          [value]="guest">
                {{guest.first_name + checkNullString(guest.last_name)}}
              </mat-option>
            </mat-autocomplete>
          </mat-form-field>
        </div>
        <form *ngIf="!isReturnGuest" [formGroup]="guestForm" fxLayout="row"
              fxLayoutAlign="space-between start" fxLayoutWrap="wrap">
          <mat-form-field fxFlex="45%">
            <input matInput placeholder="First Name" formControlName='first_name'>
            <mat-error>First Name is required</mat-error>
          </mat-form-field>
          <mat-form-field fxFlex="45%">
            <input matInput placeholder="Last Name" formControlName='last_name'>
            <mat-error>Last Name is required</mat-error>
          </mat-form-field>
          <mat-form-field fxFlex="45%">
            <input matInput placeholder="Email" formControlName='email'>
            <mat-error>Email is required</mat-error>
          </mat-form-field>
          <mat-form-field fxFlex="45%">
            <input matInput placeholder="Phone" formControlName='phone'>
            <mat-error>Phone number is required</mat-error>
          </mat-form-field>
        </form>
        <div fxLayout="row" fxLayoutAlign="space-between stretch">
          <div fxFlex="45%">
            <p style="margin-bottom: 20px; font-weight: bold">{{listing.title}}</p>

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
            <div fxLayout="row" fxLayoutAlign="space-between start" *ngIf="isReturnGuest" style="margin-bottom: 10px;">
              <span *ngIf="!isValidReturnGuest()"
                    style="font-weight: bold; color:red; font-style: italic;">
                No Guest Selected
              </span>
              <mat-card *ngIf="isValidReturnGuest()" style="width: 90%">
                <mat-card-content>
                  <h2>{{returnGuest.value?.first_name}} {{returnGuest.value?.last_name}}</h2>
                  <div fxLayout="row" fxLayoutAlign="space-around">
                    <span style="font-weight: bold">Email: </span>
                    <span style="flex: 1 1 auto"></span>
                    <span>{{returnGuest.value?.email}}</span>
                  </div>

                  <div fxLayout="row">
                    <span style="font-weight: bold">Phone Number: </span>
                    <span style="flex: 1 1 auto"></span>
                    <span>{{returnGuest.value?.phone_number}}</span>
                  </div>
                </mat-card-content>
                <mat-card-footer>
                  <mat-progress-bar color="accent" value="100"></mat-progress-bar>
                </mat-card-footer>
              </mat-card>
            </div>
            <form [formGroup]="reservationForm" fxLayout="column" fxLayoutGap="15px">
              <mat-form-field>
                <mat-select placeholder="Payment Type" formControlName="payment">
                  <mat-option *ngFor="let method of allPaymentMethods" [value]="method.slug">{{method.title}}</mat-option>
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
              <button mat-raised-button *ngIf="!editMode" [disabled]="isSaving || payingOverPhone" color="accent"
                      (click)="createReservation()">Continue
              </button>
              <button mat-raised-button *ngIf="editMode" color="accent" (click)="saveInvoice()">Save</button>
              <button mat-raised-button *ngIf="editMode" color="primary" (click)="reset()">Reset</button>
            </div>
          </div>
        </div>
      </div>
      <sd-center-spinner *ngIf="isSaving || payingOverPhone"></sd-center-spinner>
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
export class NewReservationPopupComponent implements OnInit, OnDestroy, AfterContentInit {
  _check_in: Date;
  _check_out: Date;
  _guest_count: number;
  _pets_count: number;

  stripeHandler: any;
  stripeToken: string = '';
  payingOverPhone = false;

  listing: Listing;

  guestForm: FormGroup;
  reservationForm: FormGroup;
  fname: FormControl;
  lname: FormControl;
  email: FormControl;
  phone: FormControl;
  source: FormControl;
  payment: FormControl;
  returnGuest: FormControl;

  filteredGuests: Observable<any[]>;

  guests: User[] = [];
  isSaving = false;
  editMode = false;
  isReturnGuest = false;
  isAlive = true;
  quote: Quote;
  editedQuote: Quote;
  numOfNights: number;

  contactsLoading = false;
  contactsLoaded = false;

  allPaymentMethods = getAllReservationPaymentTypes();

  constructor(private service: StayDuvetService,
              private store: Store<State>,
              private dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) private data: ReservationData,
              private router: Router) {
    this.listing = data.listing;
    this.numOfNights = DateUtils.daysBetweenDates(data.check_in, data.check_out);

    // Doing this to make the data readable outside TS Class scope.
    this._check_in = data.check_in;
    this._check_out = data.check_out;
    this._guest_count = data.guest_count;
    this._pets_count = data.pet_count;
  }

  ngOnInit() {
    this.setupForms();
    this.setupGuests();

    this.stripeHandler = StripeCheckout.configure({
      key: environment.Stripe.publishableKey,
      image: '/assets/images/logo.png',
      locale: 'auto',
      allowRememberMe: false,
      token: token => {
        this.payingOverPhone = true;
        this.stripeToken = token.id;
        this.addBooking();
      }
    });
  }

  ngAfterContentInit() {
    this.setupQuoteDetails();
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

  setupForms() {
    this.payment = new FormControl(null, [Validators.required]);
    this.source = new FormControl(null, [Validators.required]);
    this.fname = new FormControl(null, [Validators.required]);
    this.lname = new FormControl(null, [Validators.required]);
    this.email = new FormControl(null, [Validators.required]);
    this.phone = new FormControl(null, [Validators.required]);
    this.returnGuest = new FormControl(null, [Validators.required]);

    this.guestForm = new FormGroup({
      first_name: this.fname,
      last_name: this.lname,
      email: this.email,
      phone: this.phone
    });

    this.reservationForm = new FormGroup({
      payment: this.payment,
      source: this.source
    });
  }

  setupGuests() {
    const guests$ = this.store.select(getActiveContacts).takeWhile(() => this.isAlive).map((contacts) => {
      return contacts.filter(contact => contact.type === 'guest');
    });

    const loading$ = this.store.select(getIsActiveContactLoading);
    const loaded$ = this.store.select(getIsActiveContactLoaded);

    loading$.takeWhile(() => this.isAlive).subscribe( (loading) => {
      this.contactsLoading = loading;
    });

    loaded$.takeWhile(() => this.isAlive).subscribe( (loaded) => {
      this.contactsLoaded = loaded;
    });

    guests$.combineLatest(loading$, loaded$, (guests, loading, loaded) => {
      return {guests, loading, loaded};
    }).takeWhile(() => this.isAlive).subscribe((data) => {
      if (!data.loading && !data.loaded) {
        this.service.getActiveContacts().subscribe();
      } else if (data.loaded) {
        this.guests = data.guests;
        this.filteredGuests = this.returnGuest.valueChanges.startWith(null).map(name => {
          return name ? this.filterGuests(name) : this.guests.slice(0, 30);
        });
      }
    });
  }

  setupQuoteDetails() {
    this.service.getQuote(this.listing.id, this.data.check_in, this.data.check_out, this.data.pet_count)
      .subscribe(value => {
        this.quote = value;
        this.editedQuote = Object.assign(new Quote(), this.quote);
      }, err => {
        this.dialog.closeAll();
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

  createReservation() {
    FormUtils.markAllAsTouched(this.reservationForm);
    this.isReturnGuest ? this.returnGuest.markAsTouched() : FormUtils.markAllAsTouched(this.guestForm);

    const formsInvalid = this.reservationForm.invalid ||
      (this.isReturnGuest && this.returnGuest.invalid) ||
      (!this.isReturnGuest && this.guestForm.invalid);

    if (formsInvalid) {
      return;
    }

    if (this.isReturnGuest && !this.isValidReturnGuest()) {
      return;
    }

    console.log(this.returnGuest.value);

    this.isSaving = true;

    if (this.payment.value === 'over_the_phone') {
      const data = this.getData();

      let guestEmail = '';
      if (this.isReturnGuest) {
        guestEmail = this.returnGuest.value.email;
      } else {
        guestEmail = this.guestForm.value.email;
      }

      this.stripeHandler.open({
        name: 'StayDuvet',
        description: 'Payment For Booking',
        email: guestEmail,
        amount: this.quote.total() * 100
      });
    } else {
      this.addBooking();
    }
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
    let data = {
      property_id: this.listing.id,
      start: DateUtils.toISODateString(this.data.check_in),
      end: DateUtils.toISODateString(this.data.check_out),
      number_of_guests: this.data.guest_count,
      security_deposit_fee: this.quote.security_deposit_fee,
      guest_channel_fee: this.quote.serviceFee(),
      cc_process_fee: this.quote.ccProcessFee(),
      base_amount: this.quote.base_amount,
      cleaning_fee: this.quote.cleaning_fee,
      commission: this.quote.commission_rate,
      payment_method: this.payment.value,
      guest_source: this.source.value // TODO: is this only required when not a returning guest
    };

    if (this.isReturnGuest) {
      data['guest_id'] = this.returnGuest.value.guest.data.id;
    } else {
      data = {...data, ...this.guestForm.value};
    }

    if (data.payment_method === 'over_the_phone') {
      data['card_token'] = this.stripeToken;
    }

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

    console.log(data);

    return data;
  }

  addBooking() {
    this.service.addBooking(this.getData()).subscribe((booking) => {
      this.isSaving = false;

      this.router.navigate(['/reservations/', booking.id]);

      this.dialog.closeAll();
    }, () => {
      this.isSaving = false;
    });
  }

  @HostListener('window:popstate')
  onPopstate() {
    this.stripeHandler.close();
  }

  filterGuests(name) {
    const fullResults = this.guests.filter(guest => {
      return (guest.first_name + this.checkNullString(guest.last_name)).toLowerCase().indexOf(String(name).toLowerCase()) === 0;
    });

    const length = fullResults.length;

    return fullResults.slice(0, length > 20 ? 20 : length);
  }

  isValidReturnGuest() {
    if (isNullOrUndefined(this.returnGuest.value)) {
      return false;
    }

    if (typeof this.returnGuest.value === 'string') {
      return false;
    }

    return true;
  }

  returnGuestChanged(guest: Guest) {
    this.returnGuest.setValue(guest);
  }
}

export interface ReservationData {
  listing: Listing;
  check_in: Date;
  check_out: Date;
  guest_count: number;
  pet_count: number;
}
