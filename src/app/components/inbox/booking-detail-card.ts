import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Booking} from '../../models/booking';
import {Listing} from '../../models/listing';
import {Store} from '@ngrx/store';
import {getListings, State} from '../../reducers/index';
import {ActivatedRoute, Router} from '@angular/router';
import {Thread} from '../../models/thread';
import {Subscription} from "rxjs/Subscription";
import {StayDuvetService} from '../../services/stayduvet';
import {getReservationStatusType, getSourceIcon, getSourceType, getThreadStatColor} from "../../utils";
import {isNullOrUndefined} from 'util';




@Component({
  selector: 'sd-booking-detail-card',
  template: `
    <div class="card" fxLayout="column" fxLayoutGap="20px">
      <div fxLayoutAlign="space-between center">
        <div style="padding: 10px; cursor: pointer" (click)="openBooking()">
          <span  style="color:blue;" *ngIf="booking.confirmation_code">{{ booking?.confirmation_code || '######' }}</span>
          <span style="color:blue;" *ngIf="!booking.confirmation_code">######</span>
        </div>
        <div  style="border-radius: 10px;" class="successSpan" [style.background]="getThreadStatusColor(thread.status).color">
          {{thread.status}}
        </div>
      </div>

      <mat-form-field class="full-width">
        <mat-select placeholder="Listing" 
                   [(ngModel)]="listingId"
                   [disabled]="listingChanging"
                   (change)="listingChanged()">
          <mat-option *ngFor="let listing of listings" [value]="listing.id">
            {{ listing.title }}
          </mat-option>
        </mat-select>
      </mat-form-field>
      <mat-spinner id="spinner" color="accent" *ngIf="listingChanging" [diameter]="30" [strokeWidth]="4"></mat-spinner>


      <div fxLayoutAlign="space-between center">
        <div fxLayout="column" fxLayoutAlign=" center">
          <span><b>{{ booking.start | date:'MM/dd/yy' }}</b></span>
          <span style="color:gray"><i>check in:</i></span>
        </div>
        <span id="right-arrow-font">&#10095;</span>
        <div fxLayout="column" fxLayoutAlign=" center">
          <span><b>{{ booking.end | date:'MM/dd/yy' }}</b></span>
          <span style="color:gray"><i>check out:</i></span>
        </div>
      </div>

      <hr class="full-width">

      <div fxLayoutAlign="space-between center">
        <div fxLayout="column" fxLayoutAlign=" center">
          <span>NIGHTS</span>
          <span><b>{{ booking.nights }}</b></span>
        </div>
        <div fxLayout="column" fxLayoutAlign=" center">
          <span>GUESTS</span>
          <span><b>{{ booking.number_of_guests }}</b></span>
        </div>
        <div fxLayout="column" fxLayoutAlign=" center">
          <span>PAYOUT</span>
          <span><b>\${{ booking.payout_amount | number : '1.2-2' }}</b></span>
        </div>
      </div>

      <hr class="full-width">

      <div fxLayoutAlign="space-between" fxLayoutGap="30px">
        <div fxLayout="row" class="lhalf-width">
          <span class="subPart">Source</span>
        </div>
        <div fxLayout="row" [matTooltip]="getSourceTitle(booking.source)">
          <div>
            <img class="source-icon"
                 src="{{getSourceIcon(booking.source)}}"
            />
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    span {
      font-family: 'Roboto', sans-serif !important;
      letter-spacing: 0px !important;      
      color: #13304b;
      font-size: 16px !important;
      font-weight: 300 !important;
    }
    
    .card {
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
      transition: 0.3s;
      padding: 12px;
      background: #ffffff;
      border: 1px solid lightgrey;
    }

    #spinner{
      width: 24px;
      height: 24px;
    }

    .full-width {
      width: 100%;
    }

    .lhalf-width {
      width: 45%;
    }

    #right-arrow-font {
      font-size: 25px;
    }

    mat-card {
      padding: 5px !important;
    }

    .successSpan {
      color: white;
      padding: 10px;
      font-size: x-small;
      text-align: center;
    }
    
    .source-icon {
      height: 30px;
      width: 30px;
    }

  `]
})

export class BookingDetailCardComponent implements OnInit, OnDestroy {

  @Input() booking: Booking;
  @Input() listingId: number;
  @Input() thread: Thread;

  listingChanging: boolean = false;

  listings: Listing[];
  private isAlive: boolean = true;

  getSourceIcon = getSourceIcon;

  getThreadStatusColor = getThreadStatColor;

  constructor(private store: Store<State>,
              private route: ActivatedRoute,
              private service: StayDuvetService,
              private router: Router) {

  }

  ngOnInit(): void {
    console.log('onInit sd-booking-detail-card');
    this.store.select(getListings).takeWhile(() => this.isAlive).subscribe((listings) => {
      this.listings = listings;
    });

  }

  openBooking() {
    if(isNullOrUndefined(this.booking.confirmation_code))
    {
      return;
    }
    this.router.navigate(['/reservations/' + this.booking.id]);
  }

  listingChanged(){
    this.listingChanging = true;
    this.service.updateBooking(this.booking.id, this.thread.id , {listing_id: this.listingId}).subscribe(() => {
      this.listingChanging = false;
    });
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }


  getSourceTitle(source) {
    return getSourceType(source).title;
  }
}
