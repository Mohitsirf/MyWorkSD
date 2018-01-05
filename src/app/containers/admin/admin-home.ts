import {Component, OnDestroy, OnInit} from '@angular/core';
import {StayDuvetService} from '../../services/stayduvet';
import {Listing} from '../../models/listing';
import {Store} from '@ngrx/store';
import {
  getAdmins, getAdminStats, getBookings, getBreakdown, getActiveContacts, getIsAdminLoaded, getIsAdminLoading, getIsAdminStatsLoaded, getIsAdminStatsLoading, getIsBookingLoaded, getIsBookingLoading, getIsBreakdownLoaded, getIsBreakdownLoading, getIsTagsLoaded, getIsTagsLoading, getListings, getTags, State
} from '../../reducers';
import {Observable} from 'rxjs/Observable';
import Utils, {getAllSources} from '../../utils';
import {AdminDashStats} from '../../models/admin-dash-stats';
import {AdminDownloadReportPopupComponent} from "./download-report-admin-popup";
import {MatDialog, MatDialogRef} from '@angular/material';
import {User} from "../../models/user";
import {Booking} from '../../models/booking';
import {PropertyIncomeReportPopupComponent} from "../../components/property-income-report-popup";
import {HomeOwnerReportDownloadPopupComponent} from "../../components/download-report-home-popup";

@Component({
  selector: 'sd-admin-home',
  template: `
    <sd-owner-main-layout fxFlex="100%">
      <div style="font-size:x-small;" fxFlex="97.5%" fxLayoutGap="10px" class="requiredHeight main-container">
        
          <div  fxLayout="row" fxLayoutGap="15px" fxLayoutAlign="space-between center">
            <mat-form-field color="accent">
              <mat-select
                multiple
                placeholder="filter stats per source"
                [(ngModel)]="sourceFilterName"
                (ngModelChange)="sourceTypeFilterChanged()"
                [ngModelOptions]="{standalone: true}">
                <mat-option *ngFor="let source of sources" [value]="source.slug">
                  {{source.title}}
                </mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field color="accent">
              <mat-select
                multiple
                placeholder="select property(s) to view"
                [(ngModel)]="selectedListings"
                (ngModelChange)="selectedListingsChanged()"
                [ngModelOptions]="{standalone: true}">
                <div fxLayout="column">
                  <button class="select-button" mat-button (click)="onSelectAll()">Select All</button>
                  <button class="select-button" mat-button (click)="onSelectNone()">Select None</button>
                </div>
                <mat-option *ngFor="let listing of listings" [value]="listing">
                  {{listing.title}}
                </mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field color="accent">
              <mat-select
                placeholder="select tag"
                [(ngModel)]="tagFilter"
                (ngModelChange)="propertyTagFilterChanged()"
                [ngModelOptions]="{standalone: true}">
                <mat-option value="show_all">
                  Show All
                </mat-option>
                <mat-option *ngFor="let tag of tags" [value]="tag">
                  {{tag}}
                </mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field color="accent">
              <mat-select
                multiple
                placeholder="filter by user"
                [(ngModel)]="selectedAdminIds"
                (ngModelChange)="selectAdminFilterChanged()"
                [ngModelOptions]="{standalone: true}">
                <div fxLayout="column">
                  <button class="select-button" mat-button (click)="onFilterSelectAll()">Select All</button>
                  <button class="select-button" mat-button (click)="onFilterSelectNone()">Select None</button>
                </div>

                <mat-option *ngFor="let user of users" [value]="user.id">
                  {{user.first_name}} {{user.last_name}}
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>


          <div fxLayout="row" fxLayoutAlign="space-between center">
            <button mat-raised-button color="accent" (click)="downloadReportAdminClicked()">Homeowner statement</button>
            <button mat-raised-button color="accent" (click)="propertyIncomeClicked()"> Property Income Report</button>
            <button mat-raised-button color="accent">Sales Report</button>
            <button mat-raised-button color="accent">Comp Report</button>
          </div>
       

        <div class="well" fxLayout="row" fxLayoutAlign="space-around center" *ngIf="statsLoading">
          <mat-spinner color="accent" [diameter]="60" [strokeWidth]="4"></mat-spinner>
        </div>

        <div class="well" fxLayout="row" fxLayoutAlign="space-around center" *ngIf="!statsLoading">
          <div class="stat-container">
            <div fxLayout="row" class="stat-header" fxLayoutAlign="center center">
              Commission Earned
            </div>
            <div fxLayout="row" class="stat-footer" fxLayoutAlign="center center">
              <sd-counter
                [suffix]="''"
                [prefix]="'$'"
                [duration]="1"
                [countFrom]="0"
                [countTo]="aggregatedStats.commission_earned"
                [step]="100"></sd-counter>
            </div>
          </div>
          <div class="stat-container">
            <div fxLayout="row" class="stat-header" fxLayoutAlign="center center">
              Internal Sales
            </div>
            <div fxLayout="row" class="stat-footer" fxLayoutAlign="center center">
              <sd-counter
                [suffix]="''"
                [prefix]="'$'"
                [duration]="1"
                [countFrom]="0"
                [countTo]="aggregatedStats.internal_sales"
                [step]="100"></sd-counter>
            </div>
          </div>
          <div class="stat-container">
            <div fxLayout="row" class="stat-header" fxLayoutAlign="center center">
              Revenue QTD
            </div>
            <div fxLayout="row" class="stat-footer" fxLayoutAlign="center center">
              <sd-counter
                [suffix]="''"
                [prefix]="'$'"
                [duration]="1"
                [countFrom]="0"
                [countTo]="aggregatedStats.revenue_QTD"
                [step]="100"></sd-counter>
            </div>
          </div>
          <div class="stat-container">
            <div fxLayout="row" class="stat-header" fxLayoutAlign="center center">
              Quaterly Goal
            </div>
            <div fxLayout="row" class="stat-footer" fxLayoutAlign="center center">
              <sd-counter
                [suffix]="''"
                [prefix]="'$'"
                [duration]="1"
                [countFrom]="0"
                [countTo]="aggregatedStats.quarterly_goal"
                [step]="100"></sd-counter>
            </div>
          </div>
        </div>


        <div class="well" fxLayout="row" fxLayoutAlign="space-around center" *ngIf="breakdownLoading">
          <mat-spinner color="accent" [diameter]="60" [strokeWidth]="4"></mat-spinner>
        </div>

        <div class="well" fxLayout="row" *ngIf="!breakdownLoading">
          <sd-monthly-breakdown-chart
            [statsData]="aggregatedBreakdown"
            fxFlex="100%" style="height:400px"></sd-monthly-breakdown-chart>
        </div>

        <div class="well" fxLayout="row" fxLayoutAlign="space-around center" *ngIf="statsLoading">
          <mat-spinner color="accent" [diameter]="60" [strokeWidth]="4"></mat-spinner>
        </div>

        <div class="well" fxLayout="row" fxLayoutAlign="space-around center" *ngIf="!statsLoading">
          <div class="stat-container">
            <div fxLayout="row" class="stat-header" fxLayoutAlign="center center">
              Revenue MTD
            </div>
            <div fxLayout="row" class="stat-footer" fxLayoutAlign="center center">
              <sd-counter
                [suffix]="''"
                [prefix]="'$'"
                [duration]="1"
                [countFrom]="0"
                [countTo]="aggregatedStats.revenue_MTD"
                [step]="100"></sd-counter>
            </div>
          </div>
          <div class="stat-container">
            <div fxLayout="row" class="stat-header" fxLayoutAlign="center center">
              Revenue YTD
            </div>
            <div fxLayout="row" class="stat-footer" fxLayoutAlign="center center">
              <sd-counter
                [suffix]="''"
                [prefix]="'$'"
                [duration]="1"
                [countFrom]="0"
                [countTo]="aggregatedStats.revenue_YTD"
                [step]="100"></sd-counter>
            </div>
          </div>
          <div class="stat-container">
            <div fxLayout="row" class="stat-header" fxLayoutAlign="center center">
              Occupancy Rate
            </div>
            <div fxLayout="row" class="stat-footer" fxLayoutAlign="center center">
              <sd-counter
                [suffix]="'%'"
                [prefix]="''"
                [duration]="1"
                [countFrom]="0"
                [countTo]="aggregatedStats.occupancy_rate"
                [step]="100"></sd-counter>
            </div>
          </div>
          <div class="stat-container">
            <div fxLayout="row" class="stat-header" fxLayoutAlign="center center">
              Revenue per booking
            </div>
            <div fxLayout="row" class="stat-footer" fxLayoutAlign="center center">
              <sd-counter
                [suffix]="''"
                [prefix]="'$'"
                [duration]="1"
                [countFrom]="0"
                [countTo]="aggregatedStats.revenue_per_booking"
                [step]="100"></sd-counter>
            </div>
          </div>
          <div class="stat-container">
            <div fxLayout="row" class="stat-header" fxLayoutAlign="center center">
              Revenue per night
            </div>
            <div fxLayout="row" class="stat-footer" fxLayoutAlign="center center">
              <sd-counter
                [suffix]="''"
                [prefix]="'$'"
                [duration]="1"
                [countFrom]="0"
                [countTo]="aggregatedStats.revenue_per_night"
                [step]="100"></sd-counter>
            </div>
          </div>
        </div>


        <div class="well" fxLayout="row" fxLayoutAlign="space-around center" *ngIf="statsLoading">
          <mat-spinner color="accent" [diameter]="60" [strokeWidth]="4"></mat-spinner>
        </div>


        <div class="well" *ngIf="!statsLoading">
          <div style="margin-left: 30px; padding-top: 10px">
            <h4>Rental/Channel Breakdown</h4>
          </div>
          <div fxLayout="row">
            <sd-rental-channel-breakdown-pie-chart
              [data]="pieChartData"
              fxFlex="50%" fxLayoutAlign="center" style="height:330px"></sd-rental-channel-breakdown-pie-chart>
            <sd-rental-channel-breakdown-bar-chart
              [data]="barGraphData"
              fxFlex="50%" fxLayoutAlign="center" style="height:330px"></sd-rental-channel-breakdown-bar-chart>
          </div>
        </div>
      </div>
    </sd-owner-main-layout>
  `,
  styles: [`
    .well {
      background-color: #f5f5f5;
      border-radius: 5px;
      border: 5px black;
      margin: 20px 5px;
    }

    .stat-container {
      padding-top: 10px;
      padding-bottom: 20px;
    }

    .stat-header {
      font-size: 12px;
    }

    .stat-footer {
      padding-top: 5px;
      font-size: 30px;
      font-family: 'Montserrat', sans-serif;
    }

    .main-container {
      margin: 30px;
    }

    .select-button {
      padding: 6px;
      text-align: left;
      font-size: 17px;
      padding-left: 10px;
      font-weight: bolder;
    }

  `]
})
export class AdminHomeComponent implements OnInit, OnDestroy {


  isAlive: boolean = true;
  stats: { [id: number]: AdminDashStats } = {};
  statsLoading = false;
  statsLoaded = false;
  private dialogRef: MatDialogRef<any>;
  aggregatedStats: AdminDashStats = {
    internal_sales: 0,
    external_sales: 0,
    revenue_QTD: 0,
    revenue_MTD: 0,
    revenue_YTD: 0,
    revenue_per_booking: 0,
    revenue_per_night: 0,
    quarterly_goal: 0,
    commission_earned: 0,
    occupancy_rate: 0,
  };

  breakdown: {};
  breakdownLoading = false;
  breakdownLoaded = false;
  aggregatedBreakdown = [];
  pieChartData = [];
  barGraphData = [];
  sources = getAllSources();

  tags=[];
  tagFilter: string = 'show_all';
  tagsLoading = false;
  tagsLoaded = false;

  selectedAdminIds = [];

  users:User[] = [];

  sourceFilterName: string[] = [];


  selectedListings: Listing[];
  listings: Listing[];

  bookings: Booking[];
  isBookingsLoading = true;


  constructor(private service: StayDuvetService, private store: Store<State>, private dialog: MatDialog) {
  }

  ngOnInit() {

    this.sources.forEach(item => {
      this.sourceFilterName.push(item.slug);
    });

    console.log('onInit sd-admin-home');
    this.store.select(getListings).takeWhile(() => this.isAlive).subscribe((listings) => {
      this.listings = listings.sort((a: Listing, b: Listing) => {
        if(a.title > b.title) {
          return 1;
        }
        if(a.title < b.title) {
          return -1;
        }
        return 0;
      });
      this.selectedListings = this.listings;
    });
    this.setupStats();
    this.setupMonthlyBreakdown();
    this.setUpAdmins();
    this.setUpTags();
    // this.setupBookings();

    console.log(this.listings.length);
  }

  setupBookings() {
    const booking$ = this.store.select(getBookings);
    const bookingsLoaded$ = this.store.select(getIsBookingLoaded);
    const bookingsLoading$ = this.store.select(getIsBookingLoading);

    booking$.combineLatest(bookingsLoading$, bookingsLoaded$, (bookings, loading, loaded) => {
      return {bookings, loading, loaded};
    }).subscribe(data => {
      if (!data.loaded && !data.loading) {
        this.service.getBookings().subscribe();
      }

      if (data.loaded && !data.loading) {
        this.bookings = data.bookings;
        console.log(this.bookings);
      }
    });
  }

  setupStats() {
    this.store.select(getIsAdminStatsLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.statsLoading = loading;
    });
    this.store.select(getIsAdminStatsLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.statsLoaded = loaded;
    });
    this.store.select(getAdminStats).takeWhile(() => this.isAlive).subscribe((stats) => {
      if (Object.keys(stats).length > 0) {
        this.stats = stats;
        this.selectedListings = this.listings;
        this.aggregateStats();
      }
    });

    const combinedObservable = Observable.merge(
      this.store.select(getAdminStats),
      this.store.select(getIsAdminStatsLoading),
      this.store.select(getIsAdminStatsLoaded),
      ((stats, loading, loaded) => {
      })
    );

    combinedObservable.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.statsLoading && !this.statsLoaded) {
          this.service.getAdminStats().subscribe();
        }
      });

  }

  aggregateStats() {
    console.log('called');
    console.log(this.selectedListings.length);
    let selectedStats: AdminDashStats[] = [];

    if (this.selectedListings == null) {
      selectedStats = Utils.normalizedObjToArray(this.stats);
    } else {
      for (let i = 0; i < this.selectedListings.length; i++) {
        selectedStats.push(this.stats[this.selectedListings[i].id]);
      }
    }

    const aggregatedStats = {
      internal_sales: 0,
      external_sales: 0,
      revenue_QTD: 0,
      revenue_MTD: 0,
      revenue_YTD: 0,
      revenue_per_booking: 0,
      revenue_per_night: 0,
      quarterly_goal: 0,
      commission_earned: 0,
      occupancy_rate: 0,
    };

    for (let i = 0; i < selectedStats.length; i++) {
      aggregatedStats.internal_sales += selectedStats[i].internal_sales;
      aggregatedStats.external_sales += selectedStats[i].external_sales;
      aggregatedStats.revenue_QTD += selectedStats[i].revenue_QTD;
      aggregatedStats.revenue_YTD += selectedStats[i].revenue_YTD;

      aggregatedStats.revenue_MTD += selectedStats[i].revenue_MTD;
      aggregatedStats.revenue_per_booking += selectedStats[i].revenue_per_booking;
      aggregatedStats.revenue_per_night += selectedStats[i].revenue_per_night;
      aggregatedStats.quarterly_goal += selectedStats[i].quarterly_goal;
      aggregatedStats.commission_earned += selectedStats[i].commission_earned;
      aggregatedStats.occupancy_rate += selectedStats[i].occupancy_rate;
    }
    aggregatedStats.revenue_per_booking /= selectedStats.length;
    aggregatedStats.revenue_per_night /= selectedStats.length;
    aggregatedStats.occupancy_rate /= selectedStats.length;
    if (isNaN(aggregatedStats.occupancy_rate)) {
      aggregatedStats.occupancy_rate = 0;
    }
    if (isNaN(aggregatedStats.revenue_per_booking)) {
      aggregatedStats.revenue_per_booking = 0;
    }
    if (isNaN(aggregatedStats.revenue_per_night)) {
      aggregatedStats.revenue_per_night = 0;
    }
    this.aggregatedStats = aggregatedStats;
    this.setUpRentalChannelBreakdown();
  }

  setupMonthlyBreakdown() {
    this.store.select(getIsBreakdownLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.breakdownLoading = loading;
    });
    this.store.select(getIsBreakdownLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.breakdownLoaded = loaded;
    });

    this.store.select(getBreakdown).takeWhile(() => this.isAlive).subscribe((breakdown) => {
      this.breakdown = breakdown;
      this.aggregateBreakdown();
    });


    const breakdownCombined = Observable.merge(
      this.store.select(getBreakdown),
      this.store.select(getIsBreakdownLoading),
      this.store.select(getIsBreakdownLoaded),
      ((breakdown, loading, loaded) => {
      })
    );

    breakdownCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.breakdownLoading && !this.breakdownLoaded) {
          this.service.getOwnerMonthlyBreakdown().subscribe();
        }
      }
    );

  }

  aggregateBreakdown() {
    let selectedListings = this.selectedListings;
    if (selectedListings == null) {
      selectedListings = this.listings;
    }
    const aggregatedBreakdown = [];
    const months = Object.keys(this.breakdown);
    for (let i = 0; i < months.length; i++) {
      const statForMonth = this.breakdown[months[i]];

      const stats = [];
      for (const listing of selectedListings) {
        const value = statForMonth[listing.id].total_revenue - statForMonth[listing.id].total_expenses;
        stats.push({
          name: listing.title,
          stats: statForMonth[listing.id],
          value: value
        });
      }
      aggregatedBreakdown.push({
        name: months[i],
        series: stats
      });
    }
    this.aggregatedBreakdown = aggregatedBreakdown;
  }

  setUpRentalChannelBreakdown() {
    const total = this.aggregatedStats.internal_sales + this.aggregatedStats.external_sales;
    const pieData = [
      {
        name: 'Rental',
        value: (this.aggregatedStats.external_sales / total) * 100
      },
      {
        name: 'Channel',
        value: (this.aggregatedStats.internal_sales / total) * 100
      }
    ];

    const barData = [
      {
        name: 'Rental',
        value: this.aggregatedStats.external_sales
      },
      {
        name: 'Channel',
        value: this.aggregatedStats.internal_sales
      }
    ];

    this.pieChartData = pieData;
    this.barGraphData = barData;

  }

  selectedListingsChanged() {
    this.aggregateStats();
    this.aggregateBreakdown();
  }

  sourceTypeFilterChanged() {
    console.log(this.sourceFilterName);
    this.selectedListings = [];

    if (this.sourceFilterName.length == 3) {
      this.service.getAdminStats().subscribe();
      this.service.getOwnerMonthlyBreakdown().subscribe();
    } else {
      this.service.getAdminStats(this.sourceFilterName).subscribe();
      this.service.getOwnerMonthlyBreakdown(this.sourceFilterName).subscribe();
    }

    // for (let source of this.sourceFilterName) {
    //   for (let booking of this.bookings) {
    //     console.log(booking.source);
    //     if (booking.source == source) {
    //       if(this.selectedListings.length != 0) {
    //         this.selectedListings = this.selectedListings.concat(this.listings.filter(listing => {
    //           return listing.id == booking.property_id;
    //         }));
    //       } else {
    //         this.selectedListings = this.listings.filter(listing => {
    //           return listing.id == booking.property_id;
    //         });
    //       }
    //     } else {
    //       console.log('not filtered ' + booking.id + ', property id ' + booking.property_id);
    //     }
    //   }
    // }
    // this.selectedListings.map(listing => {
    //   console.log(listing.id);
    // });
    //
    //
    // console.log('---end----');
    // this.filterDuplicateListings();
    //
    // this.selectedListings.map(listing => {
    //   console.log(listing.id);
    // });
    //
    // this.selectedListingsChanged();
  }

  filterDuplicateListings() {
    this.selectedListings = this.selectedListings.filter((elem, index, self) => index === self.indexOf(elem));
  }

  selectAdminFilterChanged() {
    this.selectedListings = this.listings.filter(listing => this.selectedAdminIds.includes(listing.assignee_id));
    this.selectedListingsChanged();
  }

  propertyTagFilterChanged() {
    this.selectedListings = this.listings;
    if (this.tagFilter !== 'show_all') {
      this.selectedListings = this.listings.filter(listing => {
        const tags = listing.getTags().map(tag => tag.title);
        return tags.includes(this.tagFilter);
      });
    }
    this.selectedListingsChanged();
  }

  propertyIncomeClicked()
  {
    this.dialogRef = this.dialog.open(PropertyIncomeReportPopupComponent);
    this.dialogRef.componentInstance.listings = this.listings;
    this.dialogRef.updateSize('100%');
  }


  downloadReportAdminClicked(){
    this.dialogRef = this.dialog.open(HomeOwnerReportDownloadPopupComponent);
    this.dialogRef.updateSize('100%');
  }

  onSelectAll() {
    this.selectedListings = this.listings;
    this.selectedListingsChanged();
  }

  onSelectNone() {
    this.selectedListings = [];
    this.selectedListingsChanged();
  }


  onFilterSelectAll() {
    this.selectedAdminIds = [];
    this.setUpAdmins();
    this.selectAdminFilterChanged();
  }

  onFilterSelectNone() {
    this.selectedAdminIds = [];
    this.selectAdminFilterChanged();
  }

  setUpAdmins() {
    this.store.select(getAdmins).takeWhile(() => this.isAlive).subscribe((admins) => {
      this.users = admins;
      this.users.forEach(user => this.selectedAdminIds.push(user.getAdmin().id));
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
          this.service.getTags().subscribe();
        }
      });
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

}

