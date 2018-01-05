/**
 * Created by aditya on 17/7/17.
 */
import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Listing} from '../../models/listing';
import {getActiveContacts, getIsActiveContactLoaded, getIsActiveContactLoading, State} from '../../reducers/index';
import {Store} from '@ngrx/store';
import {StayDuvetService} from '../../services/stayduvet';
import {getContactSourcesTypes} from '../../utils';
import {User} from '../../models/user';
import {dateToDateString} from '../calendar/calendar-utils';
import {MatDialog} from "@angular/material";
import {Observable} from 'rxjs/Observable';
import {isNullOrUndefined} from "util";

@Component({
  selector: 'sd-create-prospect-popup',
  template: `
    <sd-modal-popup-layout fxLayout="column" title="Create Prospect">

      <div style="margin-left:auto;margin-right:auto;text-align:center;">
        <ol class="progtrckr" data-progtrckr-steps="5">
          <li id="prospect" class="progtrckr-todo"><b>Prospect</b></li>
          <li id="quote" class="progtrckr-todo"><b>Quote</b></li>
          <li id="workflow" class="progtrckr-todo"><b>Workflow</b></li>
        </ol>
      </div>

      <div style="padding-top:20px" fxLayout="row" fxLayoutGap="10px" fxLayoutAlign="center">

        <mat-form-field dividerColor="accent" fxFlex="20%">
          <input [(ngModel)]="checkInDate" disabled matInput [matDatepicker]="checkin"
                 placeholder="Check in Date">
          <mat-datepicker-toggle matSuffix [for]="checkin"></mat-datepicker-toggle>
          <mat-datepicker #checkin></mat-datepicker>
        </mat-form-field>

        <mat-form-field dividerColor="accent" fxFlex="20%">
          <input [(ngModel)]="checkOutDate" disabled matInput [matDatepicker]="checkout"
                 placeholder="Check out Date">
          <mat-datepicker-toggle matSuffix style="color:#13304b" [for]="checkout"></mat-datepicker-toggle>
          <mat-datepicker #checkout></mat-datepicker>
        </mat-form-field>

        <mat-form-field dividerColor="accent" fxFlex="20%">
          <input matInput type="number" min="1" [(ngModel)]="noOfGuests" placeholder="No. of guests?">
          <mat-error> Required</mat-error>
        </mat-form-field>

        <mat-form-field dividerColor="accent" fxFlex="20%">
          <input matInput type="number" [(ngModel)]="numberOfDays" min="1" placeholder="No. of days?">
          <mat-error> Required</mat-error>
        </mat-form-field>
      </div>

      <div *ngIf="isProspectFilled" fxLayout="column">

        <div fxFlex="100%" fxLayoutGap="20px" fxLayout="column" style="margin: 20px;">

          <mat-slide-toggle
            style="margin-bottom: 20px"
            (change)="sliderChange($event)">
            Return Guest
          </mat-slide-toggle>

          <form fxLayout="column" [formGroup]="prospectForm" (ngSubmit)="prospectForm.valid && createProspect()">


            <div fxLayout="row" fxLayoutAlign="space-between start" *ngIf="isReturnGuest"style="margin-bottom: 10px;">
              <mat-form-field fxFlex="40%" style="padding: 20px 20px 20px 0px;">
                <input matInput placeholder="Search guest name" [matAutocomplete]="auto"
                       [formControl]="selectedGuest">
                <mat-autocomplete #auto="matAutocomplete" [displayWith]="getGuestName.bind(this)">
                  <mat-option *ngFor="let guest of filteredGuests | async"
                              [ngStyle]="{'color': 'white'}"
                              [value]="guest">
                    {{guest.first_name + checkNullString(guest.last_name)}}
                  </mat-option>
                </mat-autocomplete>
              </mat-form-field>
              <mat-error style="font-size: x-small;margin-bottom: 10px;">{{error}}</mat-error>
              <div fxFlex="55%">
                <span *ngIf="!checkIfValidGuest()"
                      style="font-weight: bold; color:red; font-style: italic;">
                No Guest Selected
                </span>
                <mat-card *ngIf="checkIfValidGuest()" style="width: 90%">
                  <mat-card-content>
                    <h2>{{selectedGuest.value?.first_name}} {{selectedGuest.value?.last_name}}</h2>
                    <div fxLayout="row" fxLayoutAlign="space-around">
                      <span style="font-weight: bold">Email: </span>
                      <span style="flex: 1 1 auto"></span>
                      <span>{{selectedGuest.value?.email}}</span>
                    </div>

                    <div fxLayout="row">
                      <span style="font-weight: bold">Phone Number: </span>
                      <span style="flex: 1 1 auto"></span>
                      <span>{{selectedGuest.value?.phone_number}}</span>
                    </div>
                  </mat-card-content>
                  <mat-card-footer>
                    <mat-progress-bar color="accent" value="100"></mat-progress-bar>
                  </mat-card-footer>
                </mat-card>
              </div>
            </div>

            <div *ngIf="!isReturnGuest" fxLayout="column" fxLayoutGap="5px">

              <div fxLayout="row" fxFlex="100%" fxLayoutAlign="space-between center">
                <mat-form-field fxFlex="40%" dividerColor="accent">
                  <input matInput placeholder="First Name" [(ngModel)]="fname"
                         formControlName='fname'>
                  <mat-error> First Name is required</mat-error>
                </mat-form-field>


                <mat-form-field fxFlex="40%" dividerColor="accent">
                  <input matInput placeholder="Last Name" [(ngModel)]="lname"
                         formControlName='lname'>
                  <mat-error> Last Name is required</mat-error>
                </mat-form-field>
              </div>

              <div fxFlex="100%" fxLayout="row" fxLayoutAlign="space-between center">

                <mat-form-field fxFlex="40%" dividerColor="accent">
                  <input matInput placeholder="Email" [(ngModel)]="email" formControlName='email'>
                  <mat-error> Email is required</mat-error>
                </mat-form-field>

                <mat-form-field fxFlex="40%" dividerColor="accent">
                  <input matInput placeholder="Phone" [(ngModel)]="phone" formControlName='phone'>
                  <mat-error> Phone number is required</mat-error>
                </mat-form-field>
              </div>

              <div fxLayout="row" style="width: 40%;padding: 20px; padding-left: 0px;">
                <mat-select [(ngModel)]="selectedSource"
                            placeholder="Source" formControlName="source">
                  <mat-option *ngFor="let source of sources" [value]="source.slug">
                    {{source.title}}
                  </mat-option>
                </mat-select>
              </div>

            </div>

            <span style="color:#194267; "><b>Selected Listing</b></span>
            <div fxLayout="row" fxLayoutWrap fxLayoutGap="10px" fxFlex="100%" fxLayoutAlign="start none">
              <div *ngFor="let checkedListing of checkedListings" style="font-weight: bold;"
                   fxFlex="30%"
                   class="isa_success">
                {{checkedListing.title}}
              </div>
            </div>
            <div fxLayout="row" fxLayoutAlign="end center">
              <div fxFlex="20%" fxLayoutAlign="end center">
                <mat-spinner color="accent" *ngIf="isSaving" [diameter]="30" [strokeWidth]="4"></mat-spinner>

                <mat-spinner *ngIf="isCreatingProspects" [color]="'accent'" [diameter]="30"
                             [strokeWidth]="4"></mat-spinner>
                <button mat-raised-button fxFlexAlign="end" [disabled]="isSaving"
                        type="submit"
                        color="accent">
                  Create Prospect
                </button>
              </div>
            </div>

          </form>
        </div>


        <div *ngIf="isProspectDone">
          <div fxLayout="column" fxLayoutGap="20px">
            <div fxFlex="100%">
              <form fxFlex="100%" [formGroup]="prospectFormFilled"
                    (ngSubmit)="prospectFormFilled.valid && prospectEntryComplete()">
                <div style="margin-top: 20px" fxLayout="row" fxFlex="100%" fxLayoutAlign="space-between"
                     fxLayoutGap="15px">
                  <div fxFlex="50%">
                    <div fxFlex="100%" class="isa_info">
                      <p><b>Name: {{fname}} {{lname}}</b></p>
                      <p><b>Email : {{email}}</b></p>
                      <p><b>Phone : {{phone}}</b></p>
                    </div>

                  </div>
                  <div style="padding-top:10px" fxFlex="50%">
                    <div class="textArea">
                      <span [innerHTML]="userQuote"></span>
                    </div>
                  </div>
                </div>
                <div fxLayout="row" fxLayoutWrap fxLayoutGap="10px" fxFlex="100%"
                     fxLayoutAlign="start none">
                  <div *ngFor="let checkedListing of checkedListings" style="font-weight: bold;"
                       fxFlex="30%"
                       class="isa_warning">
                    {{checkedListing.title}}
                  </div>
                </div>
                <div style="margin-top:20px" fxLayout="row" fxLayoutAlign="end center">
                  <div fxFlex="20%" fxLayoutAlign="end center">
                    <mat-spinner color="accent" *ngIf="isSaving" [diameter]="30" [strokeWidth]="4"></mat-spinner>
                    <button mat-raised-button fxFlexAlign="end" [disabled]="isSaving" color="accent"
                            type="submit">
                      Next
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <form fxFlex="100%" style="width:100%;" [formGroup]="quoteForm"
              (ngSubmit)="quoteForm.valid && quoteComplete()">


          <div *ngIf="isQuoteFilled" style="margin-top: 20px" fxLayout="row" fxFlex="100%"
               fxLayoutAlign="space-between"
               fxLayoutGap="70px">
            <div fxFlex="50%">
              <span style="color:#194267;font-size: 16px"><b>Pay Out Info</b></span>
              <div fxLayout="row" style="padding-top: 20px" fxLayoutAlign="space-between" fxFlex="100%">
                <div class="financialsText" fxFlex="100%" style="margin-left:10px">
                  <table
                    style="font-size: 16px;letter-spacing:0.5px;border-collapse:separate;border-spacing:10px;font-weight: bold;">
                    <tr>
                      <td>
                        <input class="input-field" [(ngModel)]="occupancyDetail"
                               value="{{occupancyDetail}}"
                               formControlName='occupancyDetail'>
                      </td>
                      <td>
                        <mat-icon>arrow_forward</mat-icon>
                      </td>
                      <td>
                        <input class="input-field" [(ngModel)]="occupancyCost"
                               value="{{occupancyCost}}"
                               formControlName='occupancyCost'>
                      </td>
                      <td>$USD</td>

                    </tr>
                    <tr>
                      <td>CLEANING FEE</td>
                      <td>
                        <mat-icon>arrow_forward</mat-icon>
                      </td>
                      <td>
                        <input class="input-field" [(ngModel)]="cleaningFee"
                               value="{{cleaningFee}}"
                               formControlName='cleaningFee'>
                      </td>
                      <td>$USD</td>
                    </tr>
                    <tr>
                      <td>SERVICE FEE</td>
                      <td>
                        <mat-icon>arrow_forward</mat-icon>
                      </td>
                      <td>
                        <input class="input-field" [(ngModel)]="serviceFee" value="{{serviceFee}}"
                               formControlName='serviceFee'>

                      </td>
                      <td>$USD</td>
                    </tr>
                    <tr>
                      <td>OCCUPANCY TAX</td>
                      <td>
                        <mat-icon>arrow_forward</mat-icon>
                      </td>
                      <td>
                        <input class="input-field" [(ngModel)]="occupancyTax"
                               value="{{occupancyTax}}"
                               formControlName='occupancyTax'>
                      </td>
                      <td>$USD</td>
                    </tr>
                    <tr>
                      <td colspan="3">
                        <hr>
                      </td>
                    </tr>
                    <tr>
                      <td>Total</td>
                      <td>
                        <mat-icon>arrow_forward</mat-icon>
                      </td>
                      <td>
                        <input class="input-field" [(ngModel)]="total" value="{{total}}"
                               formControlName='total'>
                      </td>
                      <td>$USD</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
            <div style="margin-top:20px" fxFlex="40%" fxLayout="column" fxLayoutGap="20px">
              <button type="button" style="margin-top:10%" *ngIf="editButton" (click)="editRates()"
                      mat-raised-button
                      fxFlexAlign="end" [disabled]="isSaving" color="accent">
                Edit
              </button>
              <button type="button" *ngIf="editButton" (click)="workflowAction()" mat-raised-button
                      fxFlexAlign="end"
                      [disabled]="isSaving" color="accent">
                Continue
              </button>

              <div style="margin-top:35px;margin-left:16%" *ngIf="preFinalScreen" fxFlex="100%"
                   class="isa_info">
                <p><b>Name: {{fname}} {{lname}}</b></p>
                <p><b>Email : {{email}}</b></p>
                <p><b>Phone : {{phone}}</b></p>
                <button type="button" style="float:right;margin-top:10%" mat-raised-button
                        (click)="workflowAction()"
                        [disabled]="isSaving" color="accent">
                  Finish Editing
                </button>
              </div>
            </div>
          </div>


          <div *ngIf="workflow">
            <div fxLayout="column" style="width: 100%" fxLayoutGap="20px">
              <div fxFlex="100%">
                <div style="margin-top: 20px" fxLayout="row" fxFlex="100%" fxLayoutAlign="space-between"
                     fxLayoutGap="15px">
                  <div fxFlex="50%">
                    <div fxFlex="100%" class="isa_info">
                      <p><b>Name: {{fname}} {{lname}}</b></p>
                      <p><b>Email : {{email}}</b></p>
                      <p><b>Phone : {{phone}}</b></p>
                    </div>
                    <div fxFlex="100%">
                      <table
                        style="font-size: 16px;letter-spacing:0.5px;border-collapse:separate;border-spacing:10px;font-weight: bold">
                        <tr>
                          <td>
                            {{occupancyDetail}}
                          </td>
                          <td>
                            <mat-icon>arrow_forward</mat-icon>
                          </td>
                          <td>
                            {{occupancyCost | currency:'USD':true}}
                          </td>
                        </tr>
                        <tr>
                          <td>CLEANING FEE</td>
                          <td>
                            <mat-icon>arrow_forward</mat-icon>
                          </td>
                          <td>
                            {{cleaningFee | currency:'USD':true}}
                          </td>
                        </tr>
                        <tr>
                          <td>SERVICE FEE</td>
                          <td>
                            <mat-icon>arrow_forward</mat-icon>
                          </td>
                          <td>
                            {{serviceFee | currency:'USD':true}}
                          </td>
                        </tr>
                        <tr>
                          <td>OCCUPANCY TAX</td>
                          <td>
                            <mat-icon>arrow_forward</mat-icon>
                          </td>
                          <td>
                            {{occupancyTax | currency:'USD':true}}
                          </td>
                        </tr>
                        <tr>
                          <td colspan="3">
                            <hr>
                          </td>
                        </tr>
                        <tr>
                          <td>TOTAL</td>
                          <td>
                            <mat-icon>arrow_forward</mat-icon>
                          </td>
                          <td>
                            {{total | currency:'USD':true}}
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                  <div style="padding-top:10px" fxFlex="50%">
                    <mat-form-field class="textArea">
                                <textarea [innerHTML]="userQuoteEdit" formControlName='userNotes' matInput
                                          placeholder="Notes" rows="10"> 
                                
                                </textarea>
                    </mat-form-field>
                  </div>
                </div>

                <div style="margin-top:20px" fxLayout="row" fxLayoutAlign="end center">
                  <div fxFlex="20%" fxLayoutAlign="end center">
                    <mat-spinner color="accent" *ngIf="isSaving" [diameter]="30" [strokeWidth]="4"></mat-spinner>
                    <button mat-raised-button fxFlexAlign="end" [disabled]="isSaving" color="accent"
                            type="submit">
                      Submit
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </form>

      </div>
    </sd-modal-popup-layout>
  `,
  styles: [`
    /*progress*/

    mat-spinner {
      height: 24px;
      width: 24px;
    }

    .mat-input-underline {
      display: none;
    }

    .textArea {
      width: 100%;
      min-height: 100px;
      box-sizing: border-box;
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      border-color: blue;
      padding: 5px;
      border-style: solid;
      margin: 2px;
      border-width: 1px;
      border-color: rgb(160, 160, 255);
      border-radius: 5px;
    }

    ol.progtrckr {
      margin: 0;
      padding: 0;
      list-style-type: none;
    }

    ol.progtrckr li {
      display: inline-block;
      text-align: center;
      line-height: 3.5em;
    }

    ol.progtrckr[data-progtrckr-steps="2"] li {
      width: 49%;
    }

    ol.progtrckr[data-progtrckr-steps="3"] li {
      width: 33%;
    }

    ol.progtrckr[data-progtrckr-steps="4"] li {
      width: 24%;
    }

    ol.progtrckr[data-progtrckr-steps="5"] li {
      width: 19%;
    }

    ol.progtrckr[data-progtrckr-steps="6"] li {
      width: 16%;
    }

    ol.progtrckr[data-progtrckr-steps="7"] li {
      width: 14%;
    }

    ol.progtrckr[data-progtrckr-steps="8"] li {
      width: 12%;
    }

    ol.progtrckr[data-progtrckr-steps="9"] li {
      width: 11%;
    }

    ol.progtrckr li.progtrckr-done {
      color: black;
      border-bottom: 4px solid yellowgreen;
    }

    ol.progtrckr li.progtrckr-todo {
      color: silver;
      border-bottom: 4px solid silver;
    }

    ol.progtrckr li:after {
      content: "\\00a0\\00a0";
    }

    ol.progtrckr li:before {
      position: relative;
      bottom: -2.5em;
      float: left;
      left: 50%;
      line-height: 1em;
    }

    ol.progtrckr li.progtrckr-done:before {
      content: "\\2713";
      color: white;
      background-color: yellowgreen;
      height: 2.2em;
      width: 2.2em;
      line-height: 2.2em;
      border: none;
      border-radius: 2.2em;
    }

    ol.progtrckr li.progtrckr-todo:before {
      content: "\\039F";
      color: silver;
      background-color: white;
      font-size: 2.2em;
      bottom: -1.2em;
    }

    #dropdown {
      color: #00a3cc;
      cursor: pointer;
      font-size: 18px;
      margin-top: 10px;
      font-weight: bolder;

    }

    hr {
      border: none;
      background-color: #737373; /* Modern Browsers */
      width: 100%;
      height: 3px;
    }

    .input-field {
      box-sizing: border-box;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      border: 1px solid #609cff;
      box-shadow: 1px 1px 4px #EBEBEB;
      -moz-box-shadow: 1px 1px 4px #EBEBEB;
      -webkit-box-shadow: 1px 1px 4px #EBEBEB;
      border-radius: 3px;
      -webkit-border-radius: 3px;
      -moz-border-radius: 3px;
      padding: 7px;
      outline: none;
      width: auto;
    }

    .input-field:focus {
      border: 1px solid #0C0;
    }
  `]
})

export class CreateProspectPopupComponent implements OnInit, OnDestroy {
  isCreatingProspects = false;

  @Input() checkInDate: Date;
  @Input() checkOutDate: Date;
  @Input() noOfGuests: number;
  @Input() checkedListings;
  @Input() numberOfDays;


  prospectForm: FormGroup;
  prospectFormFilled: FormGroup;
  quoteForm: FormGroup;

  guests: User[] = [];
  sources = getContactSourcesTypes();


  selectedSource: string = this.sources[0].slug;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  source: string;
  selectedGuest: FormControl;

  // form detail
  userQuote: string;
  userQuoteEdit: string;

  // Edit form
  occupancyDetail: string = '134 x 12';
  occupancyCost: number = 98;
  cleaningFee: number = 60;
  serviceFee: number = 50;
  occupancyTax: number = 70;
  total: number = this.occupancyCost + this.cleaningFee + this.serviceFee + this.occupancyTax;
  isReturnGuest = false;

  isProspectFilled: boolean = true;
  isProspectDone: boolean = false;
  isQuoteFilled: boolean = false;
  preFinalScreen: boolean = false;
  editButton: boolean = true;
  workflow: boolean = false;

  error;

  @Input() listing: Listing;
  isSaving: Boolean = false;

  private isAlive = true;

  filteredGuests: Observable<any[]>;

  constructor(private store: Store<State>,
              private service: StayDuvetService,
              private dialog: MatDialog) {
    this.selectedGuest = new FormControl();

    this.prospectForm = new FormGroup({
      'source': new FormControl(null, []),
      'fname': new FormControl(null, []),
      'lname': new FormControl(null, []),
      'email': new FormControl(null, []),
      'phone': new FormControl(null, []),
      'guest_id': this.selectedGuest
    });

    this.prospectFormFilled = new FormGroup({});

    this.quoteForm = new FormGroup({
      'occupancyDetail': new FormControl([Validators.required]),
      'occupancyCost': new FormControl(null, [Validators.required]),
      'cleaningFee': new FormControl(null, [Validators.required]),
      'serviceFee': new FormControl(null, [Validators.required]),
      'total': new FormControl(null, [Validators.required]),
      'occupancyTax': new FormControl(null, [Validators.required]),
      'userNotes': new FormControl(null, [Validators.required]),
    });
    this.quoteForm.controls['occupancyDetail'].disable();
    this.quoteForm.controls['occupancyCost'].disable();
    this.quoteForm.controls['cleaningFee'].disable();
    this.quoteForm.controls['serviceFee'].disable();
    this.quoteForm.controls['occupancyTax'].disable();
    this.quoteForm.controls['total'].disable();
  }

  ngOnInit() {
    this.setupGuests();
  }

  prospectEntry() {
    return true;
    // console.log(this.checkInDate);
    // console.log(this.checkOutDate);
    // console.log(this.noOfGuests);
    // console.log(this.numberOfDays);
    // console.log(this.prospectForm.value);
  }

  prospectEntryComplete() {
    const data = this.prospectFormFilled.value;
    document.getElementById('quote').className = 'progtrckr-done';
    this.isProspectDone = !this.isProspectDone;
    this.isQuoteFilled = !this.isQuoteFilled;
  }

  quoteComplete() {
  }

  editRates() {
    this.quoteForm.controls['occupancyDetail'].enable();
    this.quoteForm.controls['occupancyCost'].enable();
    this.quoteForm.controls['cleaningFee'].enable();
    this.quoteForm.controls['serviceFee'].enable();
    this.quoteForm.controls['occupancyTax'].enable();
    this.quoteForm.controls['total'].enable();
    this.preFinalScreen = !this.preFinalScreen;
    this.editButton = !this.preFinalScreen;
  }

  workflowAction() {
    this.isQuoteFilled = !this.isQuoteFilled;
    this.workflow = !this.workflow;
    document.getElementById('workflow').className = 'progtrckr-done';
    this.quoteForm.controls['userNotes'].setValue(this.userQuoteEdit);
  }


  setupGuests() {
    const guests$ = this.store.select(getActiveContacts).takeWhile(() => this.isAlive).map((contacts) => {
      return contacts.filter(contact => contact.type === 'guest');
    });

    const loading$ = this.store.select(getIsActiveContactLoading);
    const loaded$ = this.store.select(getIsActiveContactLoaded);

    guests$.combineLatest(loading$, loaded$, (guests, loading, loaded) => {
      return {guests, loading, loaded};
    }).takeWhile(() => this.isAlive).subscribe((data) => {
      if (!data.loading && !data.loaded) {
        this.service.getActiveContacts().subscribe();
      } else if (data.loaded) {
        this.guests = data.guests;
        this.filteredGuests = this.selectedGuest.valueChanges.startWith(null).map(name => {
          return name ? this.filterGuests(name) : this.guests.slice(0, 30);
        });
      }
    });

  }

  filterGuests(name: string) {
    const fullResults = this.guests.filter(guest => {
      return (guest.first_name + this.checkNullString(guest.last_name)).toLowerCase().indexOf(String(name).toLowerCase()) === 0;
    });

    const length = fullResults.length;

    return fullResults.slice(0, length > 20 ? 20 : length);
  }

  sliderChange($event) {
    this.isReturnGuest = $event.checked;
  }

  createProspect() {
    if (this.isReturnGuest && !this.checkIfValidGuest()) {
      return;
    }

    const data = {};
    data['start'] = dateToDateString(this.checkInDate);
    data['end'] = dateToDateString(this.checkOutDate);
    data['number_of_guests'] = this.noOfGuests;
    data['property_ids'] = this.checkedListings.map(function (listing) {
      return listing.id;
    });

    if (this.isReturnGuest) {
      data['guest_id'] = this.selectedGuest.value.guest.data.id;
    } else {
      data['first_name'] = this.prospectForm.value.fname;
      data['last_name'] = this.prospectForm.value.lname;
      data['email'] = this.prospectForm.value.email;
      data['phone'] = this.prospectForm.value.phone;
      data['guest_source'] = this.prospectForm.value.source;
    }

    console.log(data);

    this.isCreatingProspects = true;
    this.service.createProspects(data).subscribe((data) => {
      this.isCreatingProspects = false;

      this.dialog.closeAll();
    });
  }

  getGuestName(guest: User) {
    if (isNullOrUndefined(guest)) {
      return '';
    }

    return guest.first_name + this.checkNullString(guest.last_name);
  }

  checkIfValidGuest() {
    if (isNullOrUndefined(this.selectedGuest.value)) {
      return false;
    }

    if (typeof this.selectedGuest.value === 'string') {
      return false;
    }

    return true;
  }

  getGuestId(name: string) {
    const guest = this.guests.find(contact => String(contact.first_name + this.checkNullString(contact.last_name)) === name);
    return guest.getGuest().id;
  }

  checkNullString(string: string): string {
    if (string != null) {
      return ' '.concat(string);
    } else {
      return '';
    }
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

}

