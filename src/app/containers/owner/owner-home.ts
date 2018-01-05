import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {StayDuvetService} from '../../services/stayduvet';
import {Listing} from '../../models/listing';
import {Store} from '@ngrx/store';
import {
  getBreakdown,
  getIsBreakdownLoaded,
  getIsBreakdownLoading, getIsMultiCalendarLoaded, getIsMultiCalendarLoading,
  getIsStatsLoaded,
  getIsStatsLoading,
  getIsOwnerUpcomingBookingLoaded,
  getIsOwnerUpcomingBookingLoading,
  getListings,
  getStats,
  getOwnerUpcomingBookings,
  State, getUser
} from '../../reducers';
import {OwnerDashStats} from '../../models/owner-dash-stats';
import {Observable} from 'rxjs/Observable';
import Utils from '../../utils';
import {getIsMonthlyBreakdownLoading} from '../../reducers/listing';
import {MatDialog, MatDialogRef} from '@angular/material';
import {HomeCreateOwnerBlockPopupComponent} from '../../components/create-owner-block-home-popup';
import {HomeOwnerReportDownloadPopupComponent} from '../../components/download-report-home-popup';

import {Subscription} from "rxjs/Subscription";
import {CreateTaskPopupComponent} from '../../components/tasks/popups/create-task';
import {AdminDownloadReportPopupComponent} from "../admin/download-report-admin-popup";
import {User} from "app/models/user";

@Component({
  selector: 'sd-owner-home',
  template: `
    <sd-owner-main-layout>
      <div fxFlex="95%" fxLayoutGap="10px" class="requiredHeight main-container">
          <div fxLayout="row" fxLayoutGap="10px;" fxLayoutAlign="space-between center" style="font-size: x-small;">
            <button mat-raised-button color="accent" (click)="createOwnerBlockClicked()">Create owner's block</button>
            <button mat-raised-button color="accent" (click)="requestServiceClicked()">Request a service</button>
            <button mat-raised-button color="accent" (click)="downloadReportClicked()">
              <span *ngIf="user?.type=='owner'">Download a owner report</span>
              <span *ngIf="user?.type!='owner'">Download a homeowner report</span>
            </button>
            <mat-form-field >
            <mat-select
              multiple
              placeholder="Select Listing"
              [(ngModel)]="selectedListings"
              color="accent"
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
          </div>
          <!--<mat-menu [overlapTrigger]="false" #listingMenu="matMenu">-->
            <!--<button mat-menu-item (click)="onSelectAll()">Show all.</button>-->
            <!--<button-->
              <!--mat-menu-item-->
              <!--*ngFor="let listing of listings"-->
              <!--(click)="selectListing(listing)">{{ listing.title }}-->
            <!--</button>-->
          <!--</mat-menu>-->
        <div class="well" fxLayout="row" fxLayoutAlign="space-around center" *ngIf="statsLoading">
          <mat-spinner color="accent" [diameter]="60" [strokeWidth]="4"></mat-spinner>
        </div>
        <div class="well" fxLayout="row" fxLayoutAlign="space-around center" *ngIf="!statsLoading">
          <div class="stat-container">
            <div fxLayout="row" class="stat-header" fxLayoutAlign="center center">
              Days Booked
            </div>
            <div fxLayout="row" class="stat-footer" fxLayoutAlign="center center">
              <sd-counter
                [suffix]="''"
                [prefix]="''"
                [duration]="1"
                [countFrom]="0"
                [countTo]="aggregatedStats.days_booked"
                [step]="100"></sd-counter>
            </div>
          </div>
          <div class="stat-container">
            <div fxLayout="row" class="stat-header" fxLayoutAlign="center center">
              Booked Earnings
            </div>
            <div fxLayout="row" class="stat-footer" fxLayoutAlign="center center">
              <sd-counter
                [suffix]="''"
                [prefix]="'$'"
                [duration]="1"
                [countFrom]="0"
                [countTo]="aggregatedStats.stats.total_revenue"
                [step]="100"></sd-counter>
            </div>
          </div>
          <div class="stat-container">
            <div fxLayout="row" class="stat-header" fxLayoutAlign="center center">
              Total Expenses
            </div>
            <div fxLayout="row" class="stat-footer" fxLayoutAlign="center center">
              <sd-counter
                [suffix]="''"
                [prefix]="'$'"
                [duration]="1"
                [countFrom]="0"
                [countTo]="aggregatedStats.stats.total_expenses"
                [step]="100"></sd-counter>
            </div>
          </div>
          <div class="stat-container">
            <div fxLayout="row" class="stat-header" fxLayoutAlign="center center">
              Net Income
            </div>
            <div fxLayout="row" class="stat-footer" fxLayoutAlign="center center">
              <sd-counter
                [suffix]="''"
                [prefix]="'$'"
                [duration]="1"
                [countFrom]="0"
                [countTo]="aggregatedStats.stats.total_revenue - aggregatedStats.stats.total_expenses"
                [step]="100"></sd-counter>
            </div>
          </div>
          <div class="stat-container">
            <div fxLayout="row" class="stat-header" fxLayoutAlign="center center">
              Paid Out Earnings
            </div>
            <div fxLayout="row" class="stat-footer" fxLayoutAlign="center center">
              <sd-counter
                [suffix]="''"
                [prefix]="'$'"
                [duration]="1"
                [countFrom]="0"
                [countTo]="aggregatedStats.stats.paid_earnings"
                [step]="100"></sd-counter>
            </div>
          </div>
          <div class="stat-container">
            <div fxLayout="row" class="stat-header" fxLayoutAlign="center center">
              Future Earnings
            </div>
            <div fxLayout="row" class="stat-footer" fxLayoutAlign="center center">
              <sd-counter
                [suffix]="''"
                [prefix]="'$'"
                [duration]="1"
                [countFrom]="0"
                [countTo]="aggregatedStats.stats.total_revenue - 
                   aggregatedStats.stats.total_expenses - 
                   aggregatedStats.stats.paid_earnings"
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
        <h4>Upcoming Bookings: </h4>
        <div class="well" fxLayout="row" fxLayoutAlign="space-around center" *ngIf="upcomingBookingsLoading">
          <mat-spinner color="accent" [diameter]="60" [strokeWidth]="4"></mat-spinner>
        </div>
        <div class="well"
             fxLayout="row"
             fxLayoutWrap
             fxLayoutAlign="space-around center"
             *ngIf="!upcomingBookingsLoading">
          <sd-upcoming-booking-card
            *ngFor="let booking of upcomingBookings"
            [booking]="booking"
            class="booking-card"
            fxFlex="30%"
            style="cursor: pointer">
          </sd-upcoming-booking-card>
          <!--<span *vaFlexAlignmentHack></span>-->
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

    .booking-card {
      margin-top: 10px;
      margin-bottom: 10px;
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
export class OwnerHomeComponent implements OnInit, AfterViewInit, OnDestroy {


  private isAlive: boolean = true;
  stats: { [id: number]: OwnerDashStats } = {};
  statsLoading = false;
  statsLoaded = false;
  aggregatedStats: OwnerDashStats = {
    stats: {
      total_revenue: 0,
      total_expenses: 0,
      paid_earnings: 0,
    },
    days_booked: 0
  };

  breakdown: {};
  breakdownLoading = false;
  breakdownLoaded = false;
  aggregatedBreakdown = [];

  upcomingBookingsLoading = false;
  upcomingBookingsLoaded = false;
  upcomingBookings = [];

  selectedListings: Listing[];
  listings: Listing[];
  private dialogRef: MatDialogRef<any>;

  user:User;


  ngAfterViewInit() {
    window.scrollTo(0, 0);
  }


  constructor(private service: StayDuvetService,
              private store: Store<State>,
              private dialog: MatDialog) {
  }

  ngOnInit() {

    console.log('onInit sd-owner-home');

    this.store.select(getUser).takeWhile(() => this.isAlive).subscribe((user) => {
      this.user = user;
    });

    this.store.select(getListings).takeWhile(() => this.isAlive).subscribe((listings) => {
      this.listings = listings;
      this.selectedListings = listings;
    });


    this.setupUpcomingBookings();
    this.setupMonthlyBreakdown();
    this.setupStats();
  }

  setupUpcomingBookings() {
    this.store.select(getIsOwnerUpcomingBookingLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.upcomingBookingsLoading = loading;
    });

    this.store.select(getIsOwnerUpcomingBookingLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.upcomingBookingsLoaded = loaded;
    });

    this.store.select(getOwnerUpcomingBookings).takeWhile(() => this.isAlive).subscribe((bookings) => {
      this.upcomingBookings = bookings;
    });

    const upcomingCombined = Observable.merge(
      this.store.select(getOwnerUpcomingBookings),
      this.store.select(getIsOwnerUpcomingBookingLoading),
      this.store.select(getIsOwnerUpcomingBookingLoaded),
      ((bookings, loading, loaded) => {
      })
    );

    upcomingCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.upcomingBookingsLoading && !this.upcomingBookingsLoaded) {
          this.service.getOwnerUpcomingBookings().subscribe();
        }
      }
    );

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

  setupStats() {
    this.store.select(getIsStatsLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.statsLoading = loading;
    });
    this.store.select(getIsStatsLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.statsLoaded = loaded;
    });
    this.store.select(getStats).takeWhile(() => this.isAlive).subscribe((stats) => {
      if (Object.keys(stats).length > 0) {
        this.stats = stats;
        this.aggregateStats();
      }
    });

    const combinedObservable = Observable.merge(
      this.store.select(getStats),
      this.store.select(getIsStatsLoading),
      this.store.select(getIsStatsLoaded),
      ((stats, loading, loaded) => {
      })
    );

    combinedObservable.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.statsLoading && !this.statsLoaded) {
          this.service.getStats().subscribe();
        }
      });

  }

  selectedListingsChanged() {
    this.aggregateStats();
    this.aggregateBreakdown();
  }

  aggregateStats() {
    let selectedStats: OwnerDashStats[] = [];

    if (this.selectedListings == null) {
      selectedStats = Utils.normalizedObjToArray(this.stats);
    } else {
      for (let i = 0; i < this.selectedListings.length; i++) {
        selectedStats.push(this.stats[this.selectedListings[i].id]);
      }
    }

    const aggregatedStats = {
      stats: {
        total_revenue: 0,
        total_expenses: 0,
        paid_earnings: 0,
      },
      days_booked: 0
    };
    let numberOfDays = 0;
    let sumDaysBooked = 0;

    for (let i = 0; i < selectedStats.length; i++) {
      aggregatedStats.stats.total_revenue += selectedStats[i].stats.total_revenue;
      aggregatedStats.stats.total_expenses += selectedStats[i].stats.total_expenses;
      aggregatedStats.stats.paid_earnings += selectedStats[i].stats.paid_earnings;

      sumDaysBooked += selectedStats[i].days_booked;
      numberOfDays += 1;
    }


    aggregatedStats.days_booked = sumDaysBooked / numberOfDays || 0;

    this.aggregatedStats = aggregatedStats;
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

  onSelectAll() {
    this.selectedListings = this.listings;
    this.selectedListingsChanged();
  }

  onSelectNone() {
    this.selectedListings = [];
    this.selectedListingsChanged();
  }

  createOwnerBlockClicked() {
    this.dialogRef = this.dialog.open(HomeCreateOwnerBlockPopupComponent);
    this.dialogRef.updateSize('100%');
  }

  requestServiceClicked() {
    this.dialogRef = this.dialog.open(CreateTaskPopupComponent);
    this.dialogRef.updateSize('100%','100%');
  }

  downloadReportClicked() {
   if(this.user.type == 'owner')
   {
     this.dialogRef = this.dialog.open(AdminDownloadReportPopupComponent);
     this.dialogRef.updateSize('100%');
   }
   else
   {
     this.dialogRef = this.dialog.open(HomeOwnerReportDownloadPopupComponent);
     this.dialogRef.updateSize('100%');
   }
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

}
