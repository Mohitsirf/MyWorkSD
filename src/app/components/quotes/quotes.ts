import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {StayDuvetService} from '../../services/stayduvet';
import {Store} from '@ngrx/store';
import {
  getIsQuotesLoaded, getIsQuotesLoading, getListingById, getListings,
  getQuotes,
  State
} from '../../reducers/index';
import {MatDialog, MatDialogRef} from "@angular/material";
import {Router} from "@angular/router";
import {Quote} from "app/models/quote";
import {Listing} from "app/models/listing";
import {QuoteDetailsMagnifyComponent} from "./quote-details-magnify";
import {getAllSources, getQuotesFilterTypes, getSourceType} from 'app/utils';
import {CreateProspectPopupComponent} from '../multi-calendar/create-prospect-popup';
import * as moment from "moment";
import {getDateObj} from "../calendar/calendar-utils";
import {NewProspectDetailsPopupComponent} from "../prospects/new-prospect-details-popup";
import ObjectUtils from "app/utils/object";


@Component({
  selector: 'sd-quotes-component',
  template: `
    <sd-owner-main-layout>

      <div *ngIf="quotesLoading" id="spinner" fxLayoutAlign="center center" fxFlex="100%">
        <mat-spinner color="accent" [diameter]="60" [strokeWidth]="5"></mat-spinner>
      </div>

      <div fxLayout="column" fxLayoutGap="20px" class="main-container requiredHeight"
           *ngIf="quotesLoaded" fxFlex="100%">
        <div fxLayoutAlign="space-between center">
          <div fxLayout="column" fxLayoutAlign="center start" fxLayoutGap="10px" fxFlex="80%">
            <span style="font-size: 25px; font-weight: bolder">Quotes</span>
            <div style="width: 100%" fxLayout="column">
              <mat-form-field style="width: 80%">
                <mat-select
                  multiple
                  placeholder="Select Listing"
                  [(ngModel)]="selectedListings"
                  color="accent"
                  floatPlaceholder="never"
                  (ngModelChange)="selectedListingsChanged()"
                  [ngModelOptions]="{standalone: true}">

                  <div fxLayout="column">
                    <button class="select-button" mat-button (click)="onSelectAll()">Select All</button>
                    <button class="select-button" mat-button (click)="onSelectNone()">Select None</button>
                  </div>

                  <mat-option *ngFor="let listing of listings" [value]="listing">
                    {{ listing.title }}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <div fxLayout="row" fxLayoutAlign="space-between center" style="width: 80%; margin-top: -20px">
                <mat-form-field style="width: 34%;">
                  <mat-select
                    [(ngModel)]="selectedFilter"
                    (ngModelChange)="selectedFilterChanged()">
                    <mat-option *ngFor="let filter of filters" [value]="filter.slug">
                      {{ filter.title }}
                    </mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field style="width: 30%;">
                  <mat-select
                    [(ngModel)]="selectedSourceFilter"
                    (ngModelChange)="selectedFilterChanged()">
                    <mat-option value="show_all">Show All</mat-option>
                    <mat-option *ngFor="let source of sources" [value]="source.slug">
                      {{ source.title }}
                    </mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field style="width: 30%;">
                  <mat-select
                    [(ngModel)]="selectedValidFilter"
                    (ngModelChange)="selectedFilterChanged()">
                    <mat-option value="show_all">Show All</mat-option>
                    <mat-option *ngFor="let filter of validFilters" [value]="filter.slug">
                      {{ filter.title }}
                    </mat-option>
                  </mat-select>
                </mat-form-field>

              </div>

            </div>

          </div>
          <div>
            <button mat-raised-button color="accent" (click)="createNewQuote()">Create Quote</button>
          </div>

        </div>
        <hr id="line">


        <div>

          <div fxLayout="column" fxLayoutGap="20px" fxLayoutAlign="center">

            <mat-card fxFlex="100%" class="table-container">
              <div fxLayout="column">
                <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px" id="heading">
                  <span fxFlex="5%"><b></b></span>
                  <span fxFlex="20%"><b>Listing</b></span>
                  <span fxFlex="10%"><b>Check In</b></span>
                  <span fxFlex="10%"><b>Check Out</b></span>
                  <span fxFlex="10%"><b>Source</b></span>
                  <span fxFlex="9%"><b>Security Deposit </b></span>
                  <span fxFlex="9%"><b>Cleaning Fee </b></span>
                  <span fxFlex="9%"><b>Sub Total</b></span>
                  <span fxFlex="13%"><b>Created On</b></span>
                  <span fxFlex="5%"><b>View</b></span>
                </div>
                <div>
                  <hr>
                </div>
                <div *ngFor="let quote of quotes">
                  <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px">
                    <mat-checkbox fxFlex="5%" disabled="true"
                                  [matTooltip]="quote.is_converted ? 'Quote Converted' : 'Pending'"
                                  [checked]="quote.is_converted">
                    </mat-checkbox>
                    <span fxFlex="20%">{{getListingTitle(quote.property_id)}}</span>
                    <span fxFlex="10%">{{quote.check_in | date:'mediumDate'}}</span>
                    <span fxFlex="10%">{{quote.check_out | date:'mediumDate'}}</span>
                    <span fxFlex="10%">{{getSourceTitle(quote?.source)}}</span>
                    <span fxFlex="9%">$ {{quote?.security_deposit_fee | number: '1.2-2'}}</span>
                    <span fxFlex="9%">$ {{quote?.cleaning_fee | number: '1.2-2'}}</span>
                    <span fxFlex="9%">$ {{quote?.subtotal_amount | number: '1.2-2'}}</span>
                    <span fxFlex="13%">{{quote.created_at | date:'MM/dd/yy HH:mm'}}</span>
                    <div fxFlex="5%">
                      <button mat-icon-button (click)="showDetails(quote)">
                        <mat-icon>search</mat-icon>
                      </button>
                    </div>
                  </div>
                  <hr>
                </div>

                <div fxLayout="row" *ngIf="quotes.length === 0" fxLayoutAlign="center center">
                  <p> No Quotes</p>
                </div>
                <hr>
                <div fxLayout="row" *ngIf="quotes.length > 0" fxLayoutAlign="end center">

                  <div fxFlex fxLayoutAlign="start start">
                    <mat-form-field [color]="'accent'">
                      <mat-select
                        placeholder="Items per page"
                        [(ngModel)]="itemsPerPage"
                        fxFlex="100%"
                        (ngModelChange)="itemsPerPageChanged()"
                        [ngModelOptions]="{standalone: true}">
                        <mat-option [value]="5">5</mat-option>
                        <mat-option [value]="10">10</mat-option>
                        <mat-option [value]="15">15</mat-option>
                        <mat-option [value]="20">20</mat-option>
                        <mat-option [value]="30">30</mat-option>
                        <mat-option [value]="50">50</mat-option>
                      </mat-select>
                    </mat-form-field>
                  </div>

                  <span style="font-size:xx-small; font-style: bolder;">{{start + 1}} - {{end}} of {{total}}</span>
                  <button mat-button [disabled]="isPrevDisabled" (click)="onPrev()">
                    <mat-icon>navigate_before</mat-icon>
                    Prev
                  </button>
                  <button mat-button [disabled]="isNextDisabled" (click)="onNext(false)">Next
                    <mat-icon>navigate_next</mat-icon>
                  </button>
                </div>

              </div>

            </mat-card>

          </div>
        </div>
      </div>
    </sd-owner-main-layout>
  `,
  styles: [`
    .main-container {
      margin: 30px;
      margin-top: 10px;
    }

    #description {
      padding-left: 10px;
    }

    #text {
      font-size: 15px;
    }

    #line {
      border: none;
      width: 100%;
      height: 5px;
      /* Set the hr color */
      color: lightgrey; /* old IE */
      background-color: lightgrey; /* Modern Browsers */
    }

    #table-heading {
      padding-left: 10px;
      padding-top: 5px;
      font-weight: bold;
    }

    .table-container {
      width: 100%;
      background: -webkit-linear-gradient(top, #ffffff 0%, #ffffff 100%);
      padding: 30px;
      font-size: 13px;
    }

    #spinner {
      position: fixed;
      top: 45%;
      right: 40%
    }

    #heading {
      font-weight: bolder;
    }

    .cellWidth {
      width: 110px;
      text-align: center;
    }

    .halfcellWidth {
      width: 80px;
      text-align: center;
    }

    .doublecellWidth {
      width: 190px;
    }

    span > b {
      font-size: 14px !important;
    }

    .select-button {
      padding: 6px;
      text-align: left;
      font-size: 17px;
      padding-left: 10px;
      font-weight: bolder;
      background-color: yello;
    }
  `]
})

export class QuotesComponent implements OnInit, OnDestroy {

  quotesLoaded = false;
  quotesLoading = false;
  quotes: Quote[] = [];
  allQuotes: Quote[] = [];
  filteredQuotes: Quote[] = [];
  upcomingQuotes: Quote[] = [];
  todayQuotes: Quote[] = [];
  expiredQuotes: Quote[] = [];


  sources = getAllSources();
  selectedSourceFilter: any = 'show_all';
  selectedValidFilter: any = 'show_all';
  filters = getQuotesFilterTypes();
  selectedFilter: any = this.filters[0].slug;
  validFilters =
    [{title: 'Valid', slug: 'valid'},
      {title: 'Expired', slug: 'expired'}];

  private dialogRef: MatDialogRef<any>;
  private isAlive: boolean = true;

  listings: Listing[] = [];
  selectedListings: Listing[] = [];


  isPrevDisabled: boolean = true;
  isNextDisabled: boolean = false;

  itemsPerPage = 5;
  currentPage: number = -1;

  start: number = 0;
  end: number = 0;
  total: number;


  constructor(public service: StayDuvetService,
              private router: Router,
              private store: Store<State>, private dialog: MatDialog) {
  }

  ngOnInit() {

    this.store.select(getIsQuotesLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.quotesLoading = loading;
    });

    this.store.select(getIsQuotesLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.quotesLoaded = loaded;
    });

    const quotesCombined = Observable.merge(
      this.store.select(getIsQuotesLoading),
      this.store.select(getIsQuotesLoaded),
      this.store.select(getQuotes),
      ((loading, loaded, quotes) => {
      })
    );

    quotesCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.quotesLoading && !this.quotesLoaded) {
          this.service.getQuotes().subscribe();
        }
      }
    );
    this.store.select(getQuotes).takeWhile(() => this.isAlive).subscribe((quotes) => {
      this.allQuotes = quotes;
      if (this.selectedListings.length > 0 && this.allQuotes.length > 0) {
        this.processQuotes();
      }

    });

    this.store.select(getListings).takeWhile(() => this.isAlive).subscribe((listings) => {
      this.listings = ObjectUtils.sortByKey(listings, 'title');
      this.selectedListings = this.listings;
      console.log(this.selectedListings);
      if (this.selectedListings.length > 0 && this.allQuotes.length > 0) {
        this.processQuotes();
      }
    });

  }

  processQuotes() {
    const temp = getDateObj();
    const currentDateString = temp.getFullYear() + '-' + (temp.getMonth() + 1) + '-' + temp.getDate();
    const currentDateMoment = moment(currentDateString);

    this.todayQuotes = this.allQuotes.filter(data => {
      const dueDateMoment = moment(data.check_in);
      return currentDateMoment.diff(dueDateMoment) === 0;
    });

    this.upcomingQuotes = this.allQuotes.filter(data => {
      const dueDateMoment = moment(data.check_in);
      return dueDateMoment.diff(currentDateMoment) > 0;
    });

    this.upcomingQuotes.sort((first: Quote, second: Quote) => {
      const firstTaskDate = getDateObj(first.check_in);
      const secondTaskDate = getDateObj(second.check_in);

      if (firstTaskDate > secondTaskDate) {
        return 1;
      }
      return -1;

    });

    this.expiredQuotes = this.allQuotes.filter(data => {
      const dueDateMoment = moment(data.check_in);
      return currentDateMoment.diff(dueDateMoment) > 0;
    });

    this.expiredQuotes.sort((first: Quote, second: Quote) => {
      const firstTaskDate = getDateObj(first.check_in);
      const secondTaskDate = getDateObj(second.check_in);

      if (firstTaskDate > secondTaskDate) {
        return -1;
      }
      return 1;

    });

    this.filterQuotes();
  }

  filterQuotes() {
    this.currentPage = -1;
    this.onNext(true);
  }


  createNewQuote() {
    this.dialogRef = this.dialog.open(NewProspectDetailsPopupComponent);
    this.dialogRef.updateSize('100%');
  }

  showDetails(quote) {
    this.dialogRef = this.dialog.open(QuoteDetailsMagnifyComponent, {
      data: {
        quote: quote,
        listings: this.listings
      }
    });
    this.dialogRef.updateSize('100%');
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  getListingTitle(id) {
    return this.listings.find(listing => listing.id == id).title;
  }

  getSourceTitle(slug) {
    return getSourceType(slug).title;
  }

  itemsPerPageChanged() {
    this.currentPage = -1;
    this.onNext(false);
  }

  onNext(flag: boolean) {
    this.currentPage++;
    this.start = this.currentPage * this.itemsPerPage;
    this.end = this.itemsPerPage + this.start;

    if (flag) {
      this.updateFilteredQuotes();

    }

    this.isPrevDisabled = false;
    this.isNextDisabled = false;
    if (this.start === 0) {
      this.isPrevDisabled = true;
    }
    if (this.end >= this.filteredQuotes.length) {
      this.isNextDisabled = true;
      this.end = this.filteredQuotes.length;
    }
    this.total = this.filteredQuotes.length;
    this.quotes = this.filteredQuotes.slice(this.start, this.end);
  }

  onPrev() {
    this.currentPage--;

    this.start = this.currentPage * this.itemsPerPage;
    this.end = this.itemsPerPage + this.start;

    if (this.currentPage < 0) {
      return;
    }


    this.isPrevDisabled = false;
    this.isNextDisabled = false;

    if (this.currentPage === 0) {
      this.isPrevDisabled = true;
    }
    this.total = this.filteredQuotes.length;
    this.quotes = this.filteredQuotes.slice(this.start, this.end);
  }

  updateFilteredQuotes() {
    switch (this.selectedFilter) {
      case 'upcoming_quotes': {
        this.filteredQuotes = this.upcomingQuotes;
      }
        break;
      case 'today_quotes': {
        this.filteredQuotes = this.todayQuotes;
      }
        break;
      case 'expired_quotes': {
        this.filteredQuotes = this.expiredQuotes;
      }
        break;
    }

    this.filteredQuotes = this.filteredQuotes.filter(
      quote => this.selectedListings.some((listing) => String(listing.id) === String(quote.property_id))
    );


    if (this.selectedSourceFilter !== 'show_all') {
      this.filteredQuotes = this.filteredQuotes.filter(quote => quote.source === this.selectedSourceFilter);
    }

    if (this.selectedValidFilter !== 'show_all') {
      switch (this.selectedValidFilter) {
        case 'valid': {
          this.filteredQuotes = this.filteredQuotes.filter(data => {
            const quoteTime = getDateObj(data.created_at);
            console.log(quoteTime);
            quoteTime.setHours(quoteTime.getHours() + 24);
            console.log(quoteTime);
            const quoteDateString = quoteTime.getFullYear() + '-' + (quoteTime.getMonth() + 1) + '-' + quoteTime.getDate();
            const temp = getDateObj();
            const currentDateString = temp.getFullYear() + '-' + (temp.getMonth() + 1) + '-' + temp.getDate();
            const currentDateMoment = moment(currentDateString);
            return currentDateMoment.diff(quoteDateString) < 0;
          });
          break;
        }
        case 'expired': {
          this.filteredQuotes = this.filteredQuotes.filter(data => {
            const quoteTime = getDateObj(data.created_at);
            console.log(quoteTime);
            quoteTime.setHours(quoteTime.getHours() + 24);
            console.log(quoteTime);
            const quoteDateString = quoteTime.getFullYear() + '-' + (quoteTime.getMonth() + 1) + '-' + quoteTime.getDate();
            const temp = getDateObj();
            const currentDateString = temp.getFullYear() + '-' + (temp.getMonth() + 1) + '-' + temp.getDate();
            const currentDateMoment = moment(currentDateString);
            return currentDateMoment.diff(quoteDateString) >= 0;
          });
          break;
        }
      }
    }
  }

  selectedListingsChanged() {
    this.filterQuotes();
  }

  selectedFilterChanged() {
    this.filterQuotes();
  }

  onSelectAll() {
    this.selectedListings = this.listings;
    this.selectedListingsChanged();
  }

  onSelectNone() {
    this.selectedListings = [];
    this.selectedListingsChanged();
  }
}
