import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Message} from '../../models/message';
import {DataSource} from '@angular/cdk/table';
import {StayDuvetService} from '../../services/stayduvet';
import {Store} from '@ngrx/store';
import {
  getBookings, getIsBookingLoaded, getIsBookingLoading, getListings, State,
  getIsActiveContactLoaded, getActiveContacts, getIsActiveContactLoading, getBookingById, getIsShowedById,
  getIsShowingById
} from '../../reducers/index';
import {ActivatedRoute} from '@angular/router';
import {Booking} from '../../models/booking';
import {Listing} from '../../models/listing';
import {Observable} from 'rxjs/Observable';
import {isNullOrUndefined} from 'util';
import {User} from '../../models/user';
import {getAllReservationStatusTypes, getReservationStatusType, getSourceIcon} from '../../utils';

@Component({
  selector: 'sd-reservation-detail-component',
  template: `
    <sd-owner-main-layout>
      <div *ngIf="reservationsLoading " id="spinner" fxLayoutAlign="center center" fxFlex="100%">
        <mat-spinner color="accent" [diameter]="60" [strokeWidth]="5"></mat-spinner>
      </div>

      <div class="requiredHeight" style="overflow-x: hidden" fxLayout="column" style="padding-left: 20px;"
           fxFlex="97.5%" *ngIf="reservationsLoaded ">
        <div class="Heading" fxLayout="row" fxFlex="100%" fxLayoutAlign="space-between start">
          <div style="padding-left: 20px;">
            <h4>Reservation: {{reservation?.confirmation_code || '######'}}</h4>
          </div>
          <div fxLayoutAlign=" center">
            <img class="bnbLogo"
                 [src]="getSourceIcon(reservation.source)">
            <button style="float:right;margin-top:20px;margin-left: 10px;width: 200px"
                    mat-button
                    [style.background]="getReservationStatType(reservation.status).color"
                    [matMenuTriggerFor]="menu">
              <span align="center" class="successSpan" fxLayoutAlign="center">
                <b>{{getReservationStatType(reservation.status).title}}</b>
                <mat-icon style="position: absolute;top:20%;right:5%">expand_more</mat-icon>
              </span>
            </button>
            <mat-spinner *ngIf="isStatusChanging" class="spinner"
                         style="margin-top: 20px; margin-left: 10px" [diameter]="30" [strokeWidth]="4"></mat-spinner>
            <mat-menu #menu="matMenu"
                      [overlapTrigger]="false">
              <button mat-menu-item
                      [style.background]="status.color"
                      [style.color]="'white'"
                      *ngFor="let status of getReservationStatusTypes"
                      (click)="bookingStatusChanged(status)">
                {{status.title}}
              </button>
            </mat-menu>
          </div>
        </div>

        <hr class="ThickBorder">
        <div *ngIf="reviewLoaded" style="padding: 2px">
          <p *ngIf="loadedReview != null" style="letter-spacing:1px; font-size:16px ">"{{ loadedReview }}"</p>
          <p *ngIf="loadedReview == null" style="letter-spacing:1px; font-size:14px; font-style: italic ">
            No Review left by guest...
          </p>
        </div>
        <div *ngIf="!reviewLoaded" fxLayout="row" fxLayoutAlign="center center" style="width: 100%">
          <mat-spinner class="spinner"
                       [color]="'accent'" [diameter]="30" [strokeWidth]="4"></mat-spinner>
        </div>
        <hr class="ThinBorder">
        <div style="padding-top:10px"></div>
        <div fxLayout="column">
          <nav fxFlex="100%" color="accent" mat-tab-nav-bar aria-label="weather navigation links">
            <a mat-tab-link
               *ngFor="let tab of tabs"
               [routerLink]="tab.url"
               routerLinkActive #rla="routerLinkActive"
               fxFlex="12.5%"
               [active]="rla.isActive">
              {{tab.title}}
            </a>
          </nav>
          <div fxLayout="row" style="margin: 20px;">
            <div fxFlex="30%">
              <sd-reservation-userinfo-card
                *ngIf="reservationsLoaded && listingLoaded"
                [listing]="listing"
                [guest]="guest"
                [booking]="reservation">
              </sd-reservation-userinfo-card>
              <div *ngIf="reservationsLoading || !listingLoaded " fxLayoutAlign="center center">
                <mat-spinner style="width: 50px;" color="accent" [diameter]="30" [strokeWidth]="4"></mat-spinner>
              </div>

            </div>
            <div fxFlex="70%">
              <router-outlet></router-outlet>
            </div>
          </div>

          <div style="padding-top:50px"></div>
        </div>
      </div>
    </sd-owner-main-layout>
  `,
  styles: [`
    .successSpan {
      color: white;
      letter-spacing: 0.5px;
    }

    .Heading {
      flex: 1 1 5% !important;
    }

    .generalCard {
      background: -webkit-linear-gradient(top, #ffffff 0%, #ffffff 100%); /* Chrome10+,Safari5.1+ */;
      padding: 15px !important;
    }

    .financialsText span {
      font-size: 13px;
    !important;

    }

    hr {
      border: none;
      /* Set the hr color */
      color: lightgrey; /* old IE */
      background-color: lightgrey; /* Modern Browsers */
    }

    .ThickBorder {
      height: 7px;
    }

    .ThinBorder {
      height: 5px;
    }

    .spinner {
      height: 30px;
      width: 30px;
    }

    #spinner {
      position: fixed;
      top: 45%;
      right: 40%
    }

    .contentBorder {
      border: none;
      /* Set the hr color */
      color: #737373; /* old IE */
      background-color: #737373; /* Modern Browsers */
      height: 2px;
    }

    .bnbLogo {
      height: 35px;
      width: 35px;
      margin-top: 20px;
    }

    .successSpan {
      color: white;
      letter-spacing: 0.5px;
    }

    hr {
      margin-top: 0.3in;
      width: 100%;
    }

    /*some global styles*/

    /deep/ .mat-ink-bar {
      background-color: #194267 !important;
      height: 5px !important;
    }

    /deep/ .mat-tab-label {
      opacity: 1 !important;
      font-weight: bold;
    }


  `]
})

export class ReservationDetailComponent implements OnInit, OnDestroy {

  reviewLoaded = false;
  loadedReview = '';

  private isAlive: boolean = true;
  getSourceIcon = getSourceIcon;

  tabs = [
    {title: 'Financials', url: 'financials'},
    {title: 'Guest', url: 'guest'},
    {title: 'Automation', url: 'automation'},
    {title: 'Tasks', url: 'tasks'},
    {title: 'Inbox', url: 'inbox'},
    {title: 'Log', url: 'log'},
  ];

  reservationsLoaded = false;
  reservationsLoading = false;
  listingLoaded = false;

  listing: Listing;
  guest: User;
  reservation: Booking;

  bookingStatus;
  isStatusChanging: boolean = false;

  getReservationStatusTypes = getAllReservationStatusTypes();

  constructor(private service: StayDuvetService,
              private store: Store<State>,
              private router: ActivatedRoute) {
  }

  ngOnInit() {
    this.router.params.subscribe(params => {
      const reservationId = +params['id'];

      this.store.select((state) => {
        return getIsShowingById(state, reservationId);
      }).takeWhile(() => this.isAlive).subscribe((isShowing) => {
        this.reservationsLoading = isShowing;
      });

      this.store.select((state) => {
        return getIsShowedById(state, reservationId);
      }).takeWhile(() => this.isAlive).subscribe((isShowed) => {
        this.reservationsLoaded = isShowed;
      });

      this.store.select((state) => {
        return getBookingById(state, reservationId);
      }).takeWhile(() => this.isAlive).subscribe((booking) => {
        if (!isNullOrUndefined(booking) && booking.showFull) {
          this.reservation = booking;

          this.setUpListing();

          this.guest = Object.assign({}, new User(), booking.guest.data);
        }
      });

      const combinedObs = Observable.merge(
        this.store.select((state) => {
          return getIsShowingById(state, reservationId);
        }),
        this.store.select((state) => {
          return getIsShowedById(state, reservationId);
        }),
        this.store.select((state) => {
          return getBookingById(state, reservationId);
        }),
        ((isShowing, isShowed, booking) => {
        })
      );

      combinedObs.takeWhile(() => this.isAlive).subscribe(
        (data) => {
          if (!this.reservationsLoading && !this.reservationsLoaded) {
            this.service.getBookingWithId(reservationId).subscribe();
          }
        }
      );

      this.reviewLoaded = false;
      this.service.getReview(String(reservationId)).subscribe((review) => {
        console.log(review);
        this.reviewLoaded = true;
        this.loadedReview = review;
      });
    });
  }

  getReservationStatType(slug){
    return getReservationStatusType(slug);
  }

  setUpListing() {
    this.store.select(getListings).takeWhile(() => this.isAlive).subscribe((listings) => {
      if (isNullOrUndefined(this.reservation)) {
        return;
      }
      this.listing = listings.find(data => data.id === this.reservation.property_id);
      this.listingLoaded = true;
    });
  }

  bookingStatusChanged(status: { title: string, slug: string, color: string }) {
    this.isStatusChanging = true;
    this.service.updateBooking(this.reservation.id, this.reservation.thread_id, {status: status.slug}).subscribe(() => {
      this.isStatusChanging = false;
    });
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

}
