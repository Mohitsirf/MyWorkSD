import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {Store} from '@ngrx/store';
import {StayDuvetService} from '../../services/stayduvet';
import {
  getAdmins,
  getIsLocationsLoaded, getIsLocationsLoading, getIsTagsLoaded, getIsTagsLoading, getListings, getLocations, getTags,
  getUser,
  State
} from '../../reducers';
import {ActivatedRoute, Router} from '@angular/router';
import {Listing} from '../../models/listing';
import {Observable} from 'rxjs/Observable';
import {AirbnbPopupComponent} from '../../components/elements/owner-add-airbnb-popup';
import {ApproveListingPopupComponent} from '../../components/contacts/popups/approve-listing-popup';
import {ListingRejectPopupComponent} from '../../components/listing/popups/listing-reject-popup';
import {AirlockPopupComponent} from '../../components/airlock-popup';
import {LoginSuccessAction} from '../../actions/user';
import {AirbnbAccount} from '../../models/airbnb_account';
import {User} from "../../models/user";
import {getTaskFilterType} from "../../utils";
import ObjectUtils from "app/utils/object";

@Component({
  selector: 'sd-listings-page',
  template: `
    <sd-owner-main-layout>
      <div class="main-container requiredHeight" fxLayout="column" fxLayoutGap="10px" fxFlex="100%">

        <div fxLayout="column" fxLayoutGap="10px" >
          <div fxLayoutAlign="space-between center" style="font-size: x-small;"> 
            <div fxLayout="column" fxLayoutAlign="center start" fxLayoutGap="10px" fxFlex="70%">
              <span style="font-size: 25px; font-weight: bolder">Listings</span>
              <mat-form-field style="width: 25%">
              <mat-select
                placeholder="Select Listing"
                [(ngModel)]="selectedListingFilter"
                color="accent"
                floatPlaceholder="never"
                (ngModelChange)="selectedFilterChanged()"
                [ngModelOptions]="{standalone: true}">
                <mat-option *ngFor="let listingFilter of listingFilters" [value]="listingFilter">
                  {{ listingFilter.title }}
                </mat-option>
              </mat-select>
              </mat-form-field>
            </div>
            <div >
              <button mat-raised-button color="accent" [matMenuTriggerFor]="menu" class="my-menu">
                ADD A LISTING &nbsp; &nbsp;
                <mat-icon>arrow_drop_down</mat-icon>
              </button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item color="accent" (click)="addNewListing()">
                  ADD A LISTING
                </button>
                <button mat-menu-item color="accent" (click)="addNewAirbnbAccount()">
                  ADD INTEGRATION
                </button>
              </mat-menu>
            </div>
          </div>

          <div fxFlexAlign="end" fxLayoutAlign="end center" fxLayoutGap="10px">
            <mat-form-field style="width: 40%">
            <mat-select
              multiple
              [(ngModel)]="selectedLocationFilter"
              color="accent"
              placeholder="Filter City"
              (ngModelChange)="selectedFilterChanged()"
              [ngModelOptions]="{standalone: true}">
              <div fxLayout="column">
                <button class="select-button" mat-button (click)="onSelectAll()">Select All</button>
                <button class="select-button" mat-button (click)="onSelectNone()">Select None</button>
              </div>
              <mat-option *ngFor="let location of locations" [value]="location">
                {{ location }}
              </mat-option>
            </mat-select>
            </mat-form-field>
            <mat-form-field style="width: 50%">
            <mat-select
              [(ngModel)]="selectedTagFilter"
              color="accent"
              placeholder="Filter By Tag"
              (ngModelChange)="selectedFilterChanged()"
              [ngModelOptions]="{standalone: true}">
              <mat-option value="show_all">
                Show All
              </mat-option>
              <mat-option *ngFor="let tag of tags" [value]="tag">
                {{ tag }}
              </mat-option>
            </mat-select>
            </mat-form-field>
            <div fxLayout="row">
              <button mat-raised-button color="accent" [matMenuTriggerFor]="sortMenu" class="my-menu">
                Sort By: {{selectedSortingBy.title}}
              </button>
              <button id="sort-button" mat-raised-button color="accent" fxFlexAlign="center center" class="mat-button"
                      (click)="sortingOrderChanged()">
                <mat-icon>{{sortIcon}}</mat-icon>
              </button>
            </div>
            <mat-menu #sortMenu="matMenu">
              <button mat-menu-item color="accent" *ngFor="let item of sortingByTypes"
                      (click)="selectedSortByChanged(item)">
                {{item.title}}
              </button>
            </mat-menu>
          </div>

          <hr id="line">

        </div>


        <div fxLayout="row" *ngIf="listings.length > 0" fxLayoutAlign="end center">

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

          <span style="font-size:xx-small; font-style:bolder;">{{start + 1}} - {{end}} of {{total}}</span>
          <button mat-button [disabled]="isPrevDisabled" (click)="onPrev()">
            <mat-icon>navigate_before</mat-icon>
            Prev
          </button>
          <button mat-button [disabled]="isNextDisabled" (click)="onNext(false)">Next
            <mat-icon>navigate_next</mat-icon>
          </button>
        </div>


        <sd-owner-listing-card
          *ngFor="let listing of listings"
          [listing]="listing"
          [user]="user"
          (openListing)="openListing(listing)"
          (openCalendar)="openListingCalendar(listing)"
          (submitForApproval)="submitForApproval(listing)"
          (approve)="approveListing(listing)"
          (reject)="rejectListing(listing)">
        </sd-owner-listing-card>
      </div>
    </sd-owner-main-layout>
  `,
  styles: [
      `
      .h1 {
        color: red;
      }

      .mat-button {
        /*height: 30px;*/
        /*line-height: 20px;*/
        /*min-height: 25px;*/
        /*vertical-align: top;*/
        /*font-size: 13px;*/
        /*color: white;*/
        /*padding-left: 10px;*/
        /*padding-right: 10px;*/
        /*margin: 0;*/
        max-width: 30%;
      }

      .select-button {
        padding: 6px;
        text-align: left;
        font-size: 17px;
        padding-left: 10px;
        font-weight: lighter;
      }

      #line {
        border: none;
        width: 100%;
        height: 3px;
        /* Set the hr color */
        color: #364f66; /* old IE */
        background-color: #364f66; /* Modern Browsers */
      }

      .main-container {
        margin: 30px;
        margin-top: 10px;
      }

      /deep/ .mat-menu-content {
        -webkit-text-fill-color: white;
        background: #13304b !important;
        color: white;
      }

      mat-spinner {
        width: 32px;
        height: 32px;
        margin-right: 20px;
      }

      #sort-button {
        min-height: 23px !important;
        min-width: 30px !important;
        font-size: 1px !important;
        line-height: 0px;
      }
    `
  ]
})
export class OwnerListingsPageComponent implements OnInit, OnDestroy, AfterViewInit {

  loadingCreateListing = false;
  user;
  private isAlive: boolean = true;

  listingFilters = [
    {
      title: 'Active Listings',
      slug: 'active_listings'
    },
    {
      title: 'Inactive Listings',
      slug: 'inactive_listings'
    },
    {
      title: 'Uplisted Listings',
      slug: 'uplisted_listings'
    },
    {
      title: 'Listed Listings',
      slug: 'listed_listings'
    }
  ];

  sortingByTypes = [
    {
      title: 'Title',
      slug: 'title'
    },
    {
      title: 'City',
      slug: 'city'
    }
  ];

  selectedSortingBy = this.sortingByTypes[0];


  selectedListingFilter: any;
  selectedFilter?: string;
  rawListings: Listing[];

  listings: Listing[];
  dialogRef: MatDialogRef<any>;

  locations = [];
  selectedLocationFilter;
  locationsLoading = false;
  locationsLoaded = false;

  tags = [];
  selectedTagFilter = 'show_all';
  tagsLoading = false;
  tagsLoaded = false;


  iconDrowDown = 'arrow_drop_down';
  iconDrowUp = 'arrow_drop_up';
  sortIcon = this.iconDrowDown;
  isAsc = true;

  admins: User[] = [];

  allListings: Listing[] = [];
  draftListings: Listing[] = [];
  waitingListings: Listing[] = [];
  rejectedListings: Listing[] = [];
  approvedListings: Listing[] = [];
  filteredListings: Listing[] = [];


  isPrevDisabled: boolean = true;
  isNextDisabled: boolean = false;

  itemsPerPage = 15;
  currentPage: number = -1;

  start: number = 0;
  end: number = 0;
  total: number;


  constructor(public dialog: MatDialog,
              private stayDuvetService: StayDuvetService,
              private store: Store<State>,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    console.log('onInit sd-listings-page');

    this.setUpLocations();
    this.setUpTags();

    this.selectedListingFilter = this.listingFilters[0];

    this.store.select(getUser).takeWhile(() => this.isAlive).subscribe((user) => {
      this.user = user;
    });

    this.store.select(getAdmins).takeWhile(() => this.isAlive).subscribe((admins) => {
      this.admins = admins;
    });


    this.store.select(getListings).takeWhile(() => this.isAlive).subscribe((listings) => {
      if (listings) {
        this.rawListings = listings;
        this.processListings();
      }
    });


    this.route.data.subscribe((data) => {
      this.selectedFilter = data.filter;
    });

    const combinedObservable = Observable.merge(
      this.store.select(getListings),
      this.route.data,
      ((listings, data) => {
      })
    );

    combinedObservable.takeWhile(() => this.isAlive).subscribe(
      (data) => {

        this.filterListings();
      }
    );
  }

  processListings() {
    this.allListings = this.rawListings;
    this.approvedListings = this.allListings.filter(listing => listing.status === 'accepted');
    this.rejectedListings = this.allListings.filter(listing => listing.status === 'rejected');
    this.draftListings = this.allListings.filter(listing => listing.status === 'draft');
    this.waitingListings = this.allListings.filter(listing => listing.status === 'pending');
    this.selectedLocationFilter = this.allListings.map(listing => listing.city);
    this.filterListings();
  }


  filterListings() {
    this.currentPage = -1;
    this.onNext(true);
  }

  ngAfterViewInit() {
    window.scrollTo(0, 0);
  }

  addNewListing() {
    this.loadingCreateListing = true;
    this.stayDuvetService.createListing().subscribe((listing) => {
      this.router.navigate(['/listings/' + listing.id]);
    });
  }

  addNewAirbnbAccount() {
    this.dialogRef = this.dialog.open(AirbnbPopupComponent);
    const instance = this.dialogRef.componentInstance;
    instance.accountAdded.subscribe((res) => {

      const airbnbAccount = Object.assign(new AirbnbAccount(), res.data);

      if (!airbnbAccount.airbnb_connected) {
        this.dialogRef = this.dialog.open(AirlockPopupComponent);
        const instance = this.dialogRef.componentInstance;
        instance.account = airbnbAccount;
        instance.user = null;
        this.dialogRef.updateSize('100%','100%');
      }
    });

    this.dialogRef.updateSize('100%','100%');
  }

  openListing(listing: Listing) {
    this.router.navigate(['/listings/' + listing.id]);
  }

  openListingCalendar(listing: Listing) {
    this.router.navigate(['/listings/' + listing.id + '/calendar']);
  }

  submitForApproval(listing: Listing) {
    this.stayDuvetService.sendListingForApproval(String(listing.id)).subscribe();
  }

  approveListing(listing: Listing) {
    this.dialogRef = this.dialog.open(ApproveListingPopupComponent);
    const instance = this.dialogRef.componentInstance;
    instance.title = listing.title;
    //TODO : Change User Details
    instance.users = this.admins;
    instance.listing = listing;
    instance.yesButtonClicked.subscribe((data: {
      assignee_id: number,
      housekeeper_id: number,
      general_maintenance_id: number,
      painter_id: number,
      electrician_id: number,
      plumber_id: number,
      homeowner_id: number,
      cleaner_id: number,
      hvac_id: number
    }) => {
      instance.isLoading = true;
      console.log(data);
      this.stayDuvetService.approveListing(String(listing.id), data).subscribe((updatedListing) => {
          instance.isLoading = false;
          this.dialogRef.close();
        },
        () => {
          instance.isLoading = false;
        });

    });
    this.dialogRef.updateSize('100%','100%');
  }

  rejectListing(listing: Listing) {
    this.dialogRef = this.dialog.open(ListingRejectPopupComponent);
    const instance = this.dialogRef.componentInstance;
    instance.title = listing.title;
    instance.placeholder = 'Reason for rejection';
    instance.rejectButtonClicked.subscribe((reason) => {
      instance.isLoading = true;
      this.stayDuvetService.rejectListing(String(listing.id), {reason}).subscribe((updatedListing) => {
          instance.isLoading = false;
          this.dialogRef.close();
        },
        () => {
          instance.isLoading = false;
        });

    });
    this.dialogRef.updateSize('100%');
  }


  private setUpLocations() {
    this.store.select(getIsLocationsLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.locationsLoaded = loading;
    });
    this.store.select(getIsLocationsLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.locationsLoaded = loaded;
    });
    this.store.select(getLocations).takeWhile(() => this.isAlive).subscribe((locations) => {
      this.locations = locations;
    });

    const combinedObservable = Observable.merge(
      this.store.select(getIsLocationsLoaded),
      this.store.select(getIsLocationsLoading),
      this.store.select(getLocations),
      ((locations, loading, loaded) => {
      })
    );
    combinedObservable.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.locationsLoaded && !this.locationsLoading) {
          this.stayDuvetService.getListingLocations().subscribe();
        }
      });


  }

  private setUpTags() {

    this.store.select(getIsTagsLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.tagsLoading = loading;
    });
    this.store.select(getIsTagsLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.tagsLoaded = loaded;
    });
    this.store.select(getTags).takeWhile(() => this.isAlive).subscribe((tags) => {
      this.tags = tags;
    });

    const combinedObservable = Observable.merge(
      this.store.select(getIsTagsLoading),
      this.store.select(getIsTagsLoaded),
      this.store.select(getTags),
      ((tags, loading, loaded) => {
      })
    );

    combinedObservable.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.tagsLoaded && !this.tagsLoading) {
          this.stayDuvetService.getTags().subscribe();
        }
      });
  }

  selectedFilterChanged() {
    this.filterListings();
  }

  onSelectAll() {
    this.selectedLocationFilter = this.allListings.map(listing => listing.city);
    this.selectedFilterChanged();
  }

  onSelectNone() {
    this.selectedLocationFilter = [];
    this.selectedFilterChanged();
  }


  sortingOrderChanged() {
    this.isAsc = !this.isAsc;
    if (this.isAsc) {
      this.sortIcon = this.iconDrowDown;

    }
    else {
      this.sortIcon = this.iconDrowUp;
    }
    this.sortListing(this.isAsc, this.selectedSortingBy.slug);
  }

  selectedSortByChanged(item) {
    this.selectedSortingBy = item;
    this.sortListing(this.isAsc, this.selectedSortingBy.slug);
  }

  itemsPerPageChanged() {
    this.currentPage = -1;
    this.onNext(false);
  }

  sortListing(sortInAsc: boolean, sortBy: string) {
    this.filteredListings = ObjectUtils.sortByKey(this.filteredListings, sortBy, (sortInAsc ? 'asc' : 'desc'));
    this.afterSorting();
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  afterSorting() {
    this.currentPage = -1;
    this.onNext(false);
  }


  onNext(updateListings: boolean) {
    this.currentPage++;
    this.start = this.currentPage * this.itemsPerPage;
    this.end = this.itemsPerPage + this.start;

    if (updateListings) {
      this.updateFilteredListings();
      return;
    }

    this.isPrevDisabled = false;
    this.isNextDisabled = false;
    if (this.start == 0) {
      this.isPrevDisabled = true;
    }
    if (this.end >= this.filteredListings.length) {
      this.isNextDisabled = true;
      this.end = this.filteredListings.length;
    }
    this.total = this.filteredListings.length;
    this.listings = this.filteredListings.slice(this.start, this.end);
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

    if (this.currentPage == 0) {
      this.isPrevDisabled = true;
    }
    this.total = this.filteredListings.length;
    this.listings = this.filteredListings.slice(this.start, this.end);
  }


  updateFilteredListings() {
    switch (this.selectedFilter) {
      case 'accepted': {
        this.filteredListings = this.approvedListings
      }
        break;
      case 'rejected': {
        this.filteredListings = this.rejectedListings
      }
        break;
      case 'pending': {
        this.filteredListings = this.waitingListings
      }
        break;
      case 'draft': {
        this.filteredListings = this.draftListings
      }
        break;
      default : {
        this.filteredListings = this.allListings
      }
    }

    this.filteredListings = this.filteredListings.filter(listing =>
      this.selectedLocationFilter.includes(listing.city)
    );

    if (this.selectedTagFilter !== 'show_all') {
      this.filteredListings = this.filteredListings.filter(listing => {
        const tags = listing.getTags().map(tag => tag.title);
        return tags.includes(this.selectedTagFilter);
      });
    }

    this.selectedSortByChanged(this.selectedSortingBy);
  }

}
