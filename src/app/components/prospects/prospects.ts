import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {StayDuvetService} from '../../services/stayduvet';
import {Store} from '@ngrx/store';
import {
  getExpiredProspectCurrentPage,
  getExpiredProspects, getExpiredProspectTotalCount, getExpiredProspectTotalPage,
  getIsExpiredProspectLoaded,
  getIsExpiredProspectLoading,
  getIsPassedProspectLoaded,
  getIsPassedProspectLoading, getIsTodayProspectLoaded, getIsTodayProspectLoading, getIsUpcomingProspectLoaded,
  getIsUpcomingProspectLoading,
  getListings, getPassedProspectCurrentPage, getPassedProspects, getPassedProspectTotalCount,
  getPassedProspectTotalPage,
  getTodayProspectCurrentPage,
  getTodayProspects,
  getTodayProspectTotalCount,
  getTodayProspectTotalPage, getUpcomingProspectCurrentPage, getUpcomingProspects, getUpcomingProspectTotalCount,
  getUpcomingProspectTotalPage,
  State
} from '../../reducers/index';
import {MatDialog, MatDialogRef} from '@angular/material';
import {Router} from '@angular/router';
import {Prospect} from '../../models/prospect';
import {NewProspectDetailsPopupComponent} from './new-prospect-details-popup';
import {Listing} from 'app/models/listing';
import {ProspectDetailsMagnifyComponent} from './prospect-details-magnify';
import {getAllSources, getProspectsFilterTypes, getSourceType} from 'app/utils';


@Component({
  selector: 'sd-prospect-component',
  template: `
    <sd-owner-main-layout>

      <div *ngIf="isCurrentlyLoading()" id="spinner" fxLayoutAlign="center center" fxFlex="100%">
        <mat-spinner color="accent" [diameter]="60" [strokeWidth]="5"></mat-spinner>
      </div>

      <div fxLayout="column" fxLayoutGap="20px" class="main-container requiredHeight"
           *ngIf="!isCurrentlyLoading()" fxFlex="100%">
        <div fxLayoutAlign="space-between center">
          <div fxLayout="column" fxLayoutAlign="center start" fxLayoutGap="10px" fxFlex="80%">
            <span style="font-size: 25px; font-weight: bolder">Prospects</span>
            <div style="width: 100%" fxLayout="column">
              <div fxLayout="row" fxLayoutAlign="space-between center" style="width: 80%; margin-top: -20px">
                <mat-form-field style="width: 80%;">
                  <mat-select [(ngModel)]="currentFilter"
                              (ngModelChange)="filterChanged()">
                    <mat-option *ngFor="let filter of filters" [value]="filter">
                      {{ filter.title }}
                    </mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
            </div>

          </div>
          <div>
            <button mat-raised-button color="accent" (click)="createNewProspect()">Create Prospect</button>
          </div>
        </div>

        <hr id="line">

        <div>
          <div>
            <mat-card fxFlex="100%" class="table-container">
              <div fxLayout="column">
                <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px" id="heading">
                  <span fxFlex="20%"><b>Name</b></span>
                  <span fxFlex="15%"><b>Phone</b></span>
                  <span fxFlex="30%"><b>Listings</b></span>
                  <span [matTooltip]="'No. of guests'" fxFlex="8%"><b># Guests</b></span>
                  <span fxFlex="10%"><b>Check In</b></span>
                  <span fxFlex="10%"><b>Check Out</b></span>
                  <span fxFlex="7%"><b>View</b></span>
                </div>
                <div>
                  <hr>
                </div>
                <div *ngFor="let prospect of prospects">
                  <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px">
                    <span fxFlex="20%">{{prospect.guest.data.first_name}} {{prospect.guest.data.last_name}}</span>
                    <span fxFlex="15%">{{prospect.guest.data.phone_number}}</span>
                    <span fxFlex="30%">{{getListingsTitle(prospect)}}</span>
                    <span fxFlex="8%">{{prospect.number_of_guests }}</span>
                    <span fxFlex="10%">{{prospect.start | date:'mediumDate'}}</span>
                    <span fxFlex="10%">{{prospect.end | date:'mediumDate'}}</span>
                    <div fxFlex="7%">
                      <button mat-icon-button (click)="showDetails(prospect)">
                        <mat-icon>search</mat-icon>
                      </button>
                    </div>
                  </div>
                  <hr>
                </div>

                <div fxLayout="row" *ngIf="prospects.length === 0" fxLayoutAlign="center center">
                  <p> No Prospects</p>
                </div>
                <hr>

                <div fxLayout="row" *ngIf="prospects.length > 0" fxLayoutAlign="end center">

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
      width: 60px;
      text-align: center;
    }

    .doublecellWidth {
      width: 170px;
    }

    span > b {
      font-size: 14px !important;
    }

    
  `]
})

export class ProspectsComponent implements OnInit, OnDestroy {

  prospectsToShow: Prospect[] = [];
  prospects: Prospect[] = [];

  filteredProspects: Prospect[] = [];

  todayProspects: Prospect[] = [];
  todayLoading = false;
  todayLoaded = false;
  todayCurrentPage = 0;
  todayTotalPage = 1;
  todayCount = 0;

  upcomingProspects: Prospect[] = [];
  upcomingLoading = false;
  upcomingLoaded = false;
  upcomingCurrentPage = 0;
  upcomingTotalPage = 1;
  upcomingCount = 0;

  expiredProspects: Prospect[] = [];
  expiredLoading = false;
  expiredLoaded = false;
  expiredCurrentPage = 0;
  expiredTotalPage = 1;
  expiredCount = 0;

  passedProspects: Prospect[] = [];
  passedLoading = false;
  passedLoaded = false;
  passedCurrentPage = 0;
  passedTotalPage = 1;
  passedCount = 0;

  sources = getAllSources();
  selectedSourceFilter: any = 'show_all';

  filters = getProspectsFilterTypes();
  getSourceType = getSourceType;
  currentFilter: { title: string, slug: string };

  private dialogRef: MatDialogRef<any>;
  private isAlive: boolean = true;

  isPrevDisabled: boolean = true;
  isNextDisabled: boolean = false;

  itemsPerPage = 15;
  currentPage: number = -1;
  currentLoadedPage: number = 0;
  currentTotalPage: number = 0;
  currentTotalCount: number = 0;

  start: number = 0;
  end: number = 0;
  total: number = 0;


  listings: Listing[] = [];
  selectedListings: Listing[];

  constructor(public service: StayDuvetService,
              private router: Router,
              private store: Store<State>,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.currentFilter = this.filters[0];

    this.setUpListing();

    this.filterChanged();
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

  filterChanged() {
    let isLoaded = true;
    this.currentPage = -1;

    switch (this.currentFilter.slug) {
      case 'today_prospects': {
        isLoaded = this.todayLoaded;
        if (!isLoaded) {
          this.setupTodayProspects();
        }
        break;
      }
      case 'upcoming_prospects': {
        isLoaded = this.upcomingLoaded;
        if (!isLoaded) {
          this.setupUpcomingProspects();
        }
        break;
      }
      case 'expired_prospects': {
        isLoaded = this.expiredLoaded;
        if (!isLoaded) {
          this.setupExpiredProspects();
        }
        break;
      }
      case 'passed_prospects': {
        isLoaded = this.passedLoaded;
        if (!isLoaded) {
          this.setupPassedProspects();
        }
        break;
      }
    }

    if (isLoaded) {
      this.refreshData();
    }
  }

  private refreshData() {
    switch (this.currentFilter.slug) {
      case 'today_prospects': {
        this.prospectsToShow = this.todayProspects;
        this.currentLoadedPage = this.todayCurrentPage;
        this.currentTotalPage = this.todayTotalPage;
        this.currentTotalCount = this.todayCount;
        break;
      }
      case 'upcoming_prospects': {
        this.prospectsToShow = this.upcomingProspects;
        this.currentLoadedPage = this.upcomingCurrentPage;
        this.currentTotalPage = this.upcomingTotalPage;
        this.currentTotalCount = this.upcomingCount;
        break;
      }
      case 'expired_prospects': {
        this.prospectsToShow = this.expiredProspects;
        this.currentLoadedPage = this.expiredCurrentPage;
        this.currentTotalPage = this.expiredTotalPage;
        this.currentTotalCount = this.expiredCount;
        break;
      }
      case 'passed_prospects': {
        this.prospectsToShow = this.passedProspects;
        this.currentLoadedPage = this.passedCurrentPage;
        this.currentTotalPage = this.passedTotalPage;
        this.currentTotalCount = this.passedCount;
        break;
      }
    }

    this.onNext();
  }

  private setUpListing() {
    this.store.select(getListings).takeWhile(() => this.isAlive).subscribe((listings) => {
      this.listings = listings;
    });
  }

  private loadNextData() {
    switch (this.currentFilter.slug) {
      case 'today_prospects': {
        this.service.getTodayProspects(this.todayCurrentPage + 1).subscribe();
        break;
      }
      case 'upcoming_prospects': {
        this.service.getUpcomingProspects(this.upcomingCurrentPage + 1).subscribe();
        break;
      }
      case 'expired_prospects': {
        this.service.getExpiredProspects(this.expiredCurrentPage + 1).subscribe();
        break;
      }
      case 'passed_prospects': {
        this.service.getPassedProspects(this.passedCurrentPage + 1).subscribe();
        break;
      }
    }
  }

  private setupTodayProspects() {
    this.store.select(getIsTodayProspectLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.todayLoading = loading;
    });

    this.store.select(getIsTodayProspectLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.todayLoaded = loaded;
    });

    this.store.select(getTodayProspectCurrentPage).takeWhile(() => this.isAlive).subscribe((currentPage) => {
      this.todayCurrentPage = currentPage;
    });

    this.store.select(getTodayProspectTotalPage).takeWhile(() => this.isAlive).subscribe((totalPage) => {
      this.todayTotalPage = totalPage;
    });

    this.store.select(getTodayProspectTotalCount).takeWhile(() => this.isAlive).subscribe((count) => {
      this.todayCount = count;
    });

    this.store.select(getTodayProspects).takeWhile(() => this.isAlive).subscribe((prospects) => {
      this.todayProspects = prospects;
      if (this.currentFilter.slug === 'today_prospects') {
        this.currentPage = -1;
        this.refreshData();
      }
    });

    const prospectsCombined = Observable.merge(
      this.store.select(getIsTodayProspectLoading),
      this.store.select(getIsTodayProspectLoaded),
      this.store.select(getTodayProspects),
      ((loading, loaded, bookings) => {
      })
    );

    prospectsCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.todayLoading && !this.todayLoaded) {
          this.service.getTodayProspects(this.todayCurrentPage + 1).subscribe();
        }
      }
    );
  }

  private setupUpcomingProspects() {
    this.store.select(getIsUpcomingProspectLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.upcomingLoading = loading;
    });

    this.store.select(getIsUpcomingProspectLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.upcomingLoaded = loaded;
    });

    this.store.select(getUpcomingProspectCurrentPage).takeWhile(() => this.isAlive).subscribe((currentPage) => {
      this.upcomingCurrentPage = currentPage;
    });

    this.store.select(getUpcomingProspectTotalPage).takeWhile(() => this.isAlive).subscribe((totalPage) => {
      this.upcomingTotalPage = totalPage;
    });

    this.store.select(getUpcomingProspectTotalCount).takeWhile(() => this.isAlive).subscribe((count) => {
      this.upcomingCount = count;
    });

    this.store.select(getUpcomingProspects).takeWhile(() => this.isAlive).subscribe((prospects) => {
      this.upcomingProspects = prospects;
      if (this.currentFilter.slug === 'upcoming_prospects') {
        this.refreshData();
      }
    });

    const prospectsCombined = Observable.merge(
      this.store.select(getIsUpcomingProspectLoading),
      this.store.select(getIsUpcomingProspectLoaded),
      this.store.select(getUpcomingProspects),
      ((loading, loaded, bookings) => {
      })
    );

    prospectsCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.upcomingLoading && !this.upcomingLoaded) {
          this.service.getUpcomingProspects(this.upcomingCurrentPage + 1).subscribe();
        }
      }
    );
  }

  private setupExpiredProspects() {
    this.store.select(getIsExpiredProspectLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.expiredLoading = loading;
    });

    this.store.select(getIsExpiredProspectLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.expiredLoaded = loaded;
    });

    this.store.select(getExpiredProspectCurrentPage).takeWhile(() => this.isAlive).subscribe((currentPage) => {
      this.expiredCurrentPage = currentPage;
    });

    this.store.select(getExpiredProspectTotalPage).takeWhile(() => this.isAlive).subscribe((totalPage) => {
      this.expiredTotalPage = totalPage;
    });

    this.store.select(getExpiredProspectTotalCount).takeWhile(() => this.isAlive).subscribe((count) => {
      this.expiredCount = count;
    });

    this.store.select(getExpiredProspects).takeWhile(() => this.isAlive).subscribe((prospects) => {
      this.expiredProspects = prospects;
      if (this.currentFilter.slug === 'expired_prospects') {
        this.refreshData();
      }
    });

    const prospectsCombined = Observable.merge(
      this.store.select(getIsExpiredProspectLoading),
      this.store.select(getIsExpiredProspectLoaded),
      this.store.select(getExpiredProspects),
      ((loading, loaded, bookings) => {
      })
    );

    prospectsCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.expiredLoading && !this.expiredLoaded) {
          this.service.getExpiredProspects(this.expiredCurrentPage + 1).subscribe();
        }
      }
    );
  }

  private setupPassedProspects() {
    this.store.select(getIsPassedProspectLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.passedLoading = loading;
    });

    this.store.select(getIsPassedProspectLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.passedLoaded = loaded;
    });

    this.store.select(getPassedProspectCurrentPage).takeWhile(() => this.isAlive).subscribe((currentPage) => {
      this.passedCurrentPage = currentPage;
    });

    this.store.select(getPassedProspectTotalPage).takeWhile(() => this.isAlive).subscribe((totalPage) => {
      this.passedTotalPage = totalPage;
    });

    this.store.select(getPassedProspectTotalCount).takeWhile(() => this.isAlive).subscribe((count) => {
      this.passedCount = count;
    });

    this.store.select(getPassedProspects).takeWhile(() => this.isAlive).subscribe((prospects) => {
      this.passedProspects = prospects;
      if (this.currentFilter.slug === 'passed_prospects') {
        this.refreshData();
      }
    });

    const prospectsCombined = Observable.merge(
      this.store.select(getIsPassedProspectLoading),
      this.store.select(getIsPassedProspectLoaded),
      this.store.select(getPassedProspects),
      ((loading, loaded, bookings) => {
      })
    );

    prospectsCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.passedLoading && !this.passedLoaded) {
          this.service.getPassedProspects(this.passedCurrentPage + 1).subscribe();
        }
      }
    );
  }

  itemsPerPageChanged() {
    this.currentPage = -1;
    this.onNext();
  }

  onNext() {
    const prospectsLoadedCount = this.currentLoadedPage * 50;

    if ((this.currentPage + 2) * this.itemsPerPage > prospectsLoadedCount) {
      this.loadNextData();
      return;
    }

    this.currentPage++;
    this.start = this.currentPage * this.itemsPerPage;
    this.end = this.itemsPerPage + this.start;

    this.isPrevDisabled = false;
    this.isNextDisabled = false;
    if (this.start === 0) {
      this.isPrevDisabled = true;
    }

    if (this.end >= this.currentTotalCount) {
      this.isNextDisabled = true;
      this.end = this.prospectsToShow.length;
    }
    this.total = this.currentTotalCount;

    this.prospects = this.prospectsToShow.slice(this.start, this.end);
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
    this.total = this.currentTotalCount;

    this.prospects = this.prospectsToShow.slice(this.start, this.end);
  }

  isCurrentlyLoading(): boolean {
    switch (this.currentFilter.slug) {
      case 'today_prospects': {
        return this.todayLoading;
      }
      case 'upcoming_prospects': {
        return this.upcomingLoading;
      }
      case 'expired_prospects': {
        return this.expiredLoading;
      }
      case 'passed_prospects': {
        return this.passedLoading;
      }
    }
  }

  onSelectAll() {
    this.selectedListings = this.listings;
    this.selectedListingsChanged();
  }

  onSelectNone() {
    this.selectedListings = [];
    this.selectedListingsChanged();
  }

  selectedListingsChanged() {
    //
  }

  createNewProspect() {
    this.dialogRef = this.dialog.open(NewProspectDetailsPopupComponent);
    this.dialogRef.updateSize('100%');
  }

  showDetails(prospect: Prospect) {
    this.dialogRef = this.dialog.open(ProspectDetailsMagnifyComponent);
    const component = this.dialogRef.componentInstance;
    component.prospect = prospect;
    component.listings = this.listings;
    this.dialogRef.updateSize('100%');
  }

  getListingsTitle(prospect: Prospect) {
    const prospectListings = this.listings.filter(listing => {
      return prospect.property_ids.includes(listing.id);
    });

    const titleArray = prospectListings.map(listing => listing.title);
    return titleArray.toString();
  }

  selectedSourceChanged() {
    //
  }
}
