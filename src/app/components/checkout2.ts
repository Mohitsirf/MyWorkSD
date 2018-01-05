import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {StayDuvetService} from '../services/stayduvet';
import {Booking} from '../models/booking';
import {Listing} from '../models/listing';
import {User} from '../models/user';
import {environment} from '../../environments/environment';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'sd-checkout-page',
  template: `

    <div class="page-container" fxLayout="column" *ngIf="isError" fxLayoutAlign="center center"
         fxLayoutGap="20px">
      <mat-icon>{{errorStyle}}</mat-icon>
      <span style="font-size: 25px; font-weight: bolder">{{errorHeadline}}</span>
      <span>{{errorMessage}}</span>
    </div>

    <div class="page-container" fxLayout="column" *ngIf="!isError && paymentSuccessful" fxLayoutAlign="center center"
         fxLayoutGap="20px">
      <mat-icon>{{errorStyle}}</mat-icon>
      <span style="font-size: 25px; font-weight: bolder">Thanks!</span>
      <span>We have successfully received the payment.</span>
      <span>You will shortly receive email with confirmation.</span>
    </div>

    <div class="page-container" fxFlex="100%" fxLayoutAlign="center center"
         *ngIf="!isError && !paymentSuccessful && loading">
      <mat-spinner [diameter]="70" [strokeWidth]="6" color="accent"></mat-spinner>
    </div>

    <div fxFlex="100%" fxLayoutAlign="center center" *ngIf="!isError && !paymentSuccessful && !loading"
         style="margin-top: 3%; margin-bottom: 5%">

      <div fxLayout="row" fxLayoutAlign="space-around" fxFlex="72%">

        <mat-card fxFlex="58%" fxLayout="column" fxLayoutGap="10px" fxLayoutAlign="start start" style="height: 100%">

          <div fxLayout="column" class="full-width">
            <div fxLayout="row" fxLayoutGap="5px" fxLayoutAlign="start center">
              <mat-icon class="primary">person_outline</mat-icon>
              <span class="bolder">GUEST DETAILS</span>
            </div>
            <hr>
          </div>

          <mat-card style="width: 90%">
            <mat-card-content>
              <h2>{{guest?.first_name}} {{guest?.last_name}}</h2>
              <div fxLayout="row">
                <span style="font-weight: bold">Email: </span>
                <span style="flex: 1 1 auto"></span>
                <span>{{guest?.email}}</span>
              </div>

              <div fxLayout="row">
                <span style="font-weight: bold">Phone Number: </span>
                <span style="flex: 1 1 auto"></span>
                <span>{{guest?.phone_number}}</span>
              </div>
            </mat-card-content>
            <mat-card-footer>
              <mat-progress-bar color="accent" value="100"></mat-progress-bar>
            </mat-card-footer>
          </mat-card>

          <div fxLayout="column" class="full-width" fxLayoutGap="2px">
            <div fxLayout="row" fxLayoutGap="5px" fxLayoutAlign="start center">
              <mat-icon class="primary">credit_card</mat-icon>
              <span class="bolder">PAYMENT DETAILS</span>
            </div>
            <hr>
          </div>

          <div fxLayout="row" fxLayoutAlign="space-between center" style="width: 100%">
            <div fxLayout="row" fxLayoutGap="3px">
              <mat-icon>check_circle</mat-icon>
              <strong>CREDIT CARD</strong>
            </div>
          </div>

          <div fxLayout="row" fxLayoutAlign="center center" style="width: 100%">
            <button style="width: 200px;" mat-raised-button [color]="'accent'" (click)="openPayment()"> PAY NOW</button>
          </div>
        </mat-card>


        <mat-card fxFlex="40%" class="secondary" fxLayout="column" fxLayoutGap="20px">
          <img style="width: 100%; height: auto;" src="{{getImageUrl()}}">
          <div fxLayout="column" style="padding-left: 20px;" fxLayoutAlign="start start" fxLayoutGap="10px"
               fxFlex="100%">
            <span style="font-size: 16px; font-weight: bolder;">{{listing.title}}</span>
            <span
              style="color: #8c8c8c;font-size: 16px; font-weight: bolder;">{{getAddress()}}</span>

            <div fxLayout="column" fxLayoutGap="3px" style="width: 100%; padding-right: 20px">
              <hr style="width: 100%">
              <hr style="width: 100%">
            </div>

            <div style="padding-right: 20px; padding-bottom: 20px;" fxLayoutAlign="center center">
              <mat-tab-group fxFlex="100%" style="overflow: hidden; magrin-bottom: 10px">
                <mat-tab label="SUMMARY">
                  <div fxLayout="column" fxLayoutGap="10px" style="margin-top: 10px;overflow: scroll">
                    <div fxLayout="row" fxLayoutAlign="space-between center">
                      <span style="color: #8c8c8c;font-size: 16px; font-weight: bolder;">Check-In:</span>
                      <span
                        style="color: #8c8c8c;font-size: 16px; font-weight: bolder;">{{booking.start}}</span>
                    </div>
                    <div fxLayout="row" fxLayoutAlign="space-between center">
                      <span style="color: #8c8c8c;font-size: 16px; font-weight: bolder;">Check-Out</span>
                      <span
                        style="color: #8c8c8c;font-size: 16px; font-weight: bolder;">{{booking.end}}</span>
                    </div>
                    <div fxLayout="row" fxLayoutGap="5px" fxLayoutAlign="space-between center">
                      <span style="color: #8c8c8c;font-size: 16px; font-weight: bolder;">ROOMS</span>
                      <span
                        style="color: #8c8c8c;font-size: 16px; font-weight: bolder;">{{listing.rooms.length}}</span>
                    </div>
                    <hr>
                    <div fxLayoutAlign="space-between">
                      <span class="bolder">TOTAL</span>
                      <span class="bolder">$ {{booking.amount_to_pay}}</span>
                    </div>
                    <hr>
                    <span style="color: #8c8c8c;font-size: 16px; font-weight: bolder;">PAYMENT SCHEDULE</span>
                    <div fxLayout="row" fxLayoutAlign="space-between center">
                      <span  style="font-size: x-small">Payment 1 (On agreement)</span>
                      <strong  style="font-size: x-small">$ {{booking.amount_to_pay}}</strong>
                    </div>
                    <span style="color: #8c8c8c;font-size: 16px; font-weight: bolder;">CANCELLATION POLICY</span>
                    <span
                      style="color: #8c8c8c; font-size: 14px; text-align: justify">0% refundable if cancelled after</span>
                  </div>
                </mat-tab>

                <mat-tab label="DETAILS">
                  <div fxLayout="column" fxLayoutGap="10px" style="margin-top: 10px;overflow: scroll">
                    <div fxLayout="row" fxLayoutAlign="space-between center">
                      <span style="color: #8c8c8c;font-size: 16px; font-weight: bolder;">ACCOMMODATION FEE</span>
                      <span
                        style="color: #8c8c8c;font-size: 16px; font-weight: bolder;">$\{{booking.base_amount}}</span>
                    </div>
                    <div fxLayout="row" fxLayoutAlign="space-between center">
                      <span style="color: #8c8c8c;font-size: 16px; font-weight: bolder;">CLEANING FEE</span>
                      <span
                        style="color: #8c8c8c;font-size: 16px; font-weight: bolder;">$\{{booking.cleaning_fee}}</span>
                    </div>
                    <div fxLayout="row" *ngFor="let otherFee of booking.other_fee" fxLayoutAlign="space-between center">
                      <span *ngIf="otherFee.slug === 'pet_fee'" style="color: #8c8c8c;font-size: 16px; font-weight: bolder;">PET FEE</span>
                      <span *ngIf="otherFee.slug === 'extra_guest_fee'" style="color: #8c8c8c;font-size: 16px; font-weight: bolder;">EXTRA GUEST FEE</span>
                      <span
                        style="color: #8c8c8c;font-size: 16px; font-weight: bolder;">$\{{otherFee.amount}}</span>
                    </div>
                    <div fxLayout="row" fxLayoutAlign="space-between center">
                      <span style="color: #8c8c8c;font-size: 16px; font-weight: bolder;">SUBTOTAL</span>
                      <span
                        style="color: #8c8c8c;font-size: 16px; font-weight: bolder;">$\{{booking.subtotal_amount}}</span>
                    </div>
                    <div fxLayout="row" fxLayoutAlign="space-between center">
                      <span style="color: #8c8c8c;font-size: 16px; font-weight: bolder;">GUEST FEE</span>
                      <span
                        style="color: #8c8c8c;font-size: 16px; font-weight: bolder;">$\{{booking.guest_channel_fee}}</span>
                    </div>
                    <div fxLayout="row" fxLayoutAlign="space-between center">
                      <span style="color: #8c8c8c;font-size: 16px; font-weight: bolder;">CC PROCESS FEE</span>
                      <span
                        style="color: #8c8c8c;font-size: 16px; font-weight: bolder;">$\{{booking.cc_process_fee}}</span>
                    </div>
                    <div fxLayout="row" fxLayoutAlign="space-between center">
                      <span style="color: #8c8c8c;font-size: 16px; font-weight: bolder;">TAXES</span>
                      <span
                        style="color: #8c8c8c;font-size: 16px; font-weight: bolder;">$\{{booking.total_tax}}</span>
                    </div>
                    <hr>
                    <div fxLayout="row" fxLayoutAlign="space-between center">
                      <span style="color: #8c8c8c;font-size: 16px; font-weight: bolder;">SECURITY DEPOSIT</span>
                      <span
                        style="color: #8c8c8c;font-size: 16px; font-weight: bolder;">$\{{booking.security_deposit_fee}}</span>
                    </div>
                    <hr>
                    <div fxLayoutAlign="space-between">
                      <span class="bolder">TOTAL</span>
                      <span class="bolder">$ {{booking.amount_to_pay}}</span>
                    </div>
                  </div>
                </mat-tab>
              </mat-tab-group>
            </div>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      position: absolute;
      height: 100%;
      width: 100%;
    }

    mat-icon.primary {
      font-size: 24px;
      height: 24px;
      width: 24px;
    }

    hr {
      width: 100%;
      margin-top: 0px;
      padding-top: 0px;
    }

    hr.sec {
      width: 100%;
    }

    .bolder {
      font-size: large;
      font-weight: 700
    }

    .full-width {
      width: 100%;
    }

    ::-webkit-scrollbar {
      display: none;
    }

    mat-card.secondary {
      padding: 0px;
    }

    mat-spinner {
      width: 24px;
      height: 24px;
      margin-right: 20px;
    }

  `]
})

export class CheckoutPageComponent implements OnInit {

  isError = false;

  errorStyle;
  errorHeadline;
  errorMessage;

  loading = true;
  booking: Booking;
  listing: Listing;
  guest: User;

  paymentSuccessful = false;

  stripeHandler: any;

  constructor(private router: ActivatedRoute,
              private service: StayDuvetService,) {
  }

  ngOnInit() {
    this.stripeHandler = StripeCheckout.configure({
      key: environment.Stripe.publishableKey,
      image: '/assets/images/logo.png',
      locale: 'auto',
      allowRememberMe: false,
      token: token => {
        this.loading = true;
        this.service.payFromPlatform(this.booking.id, token.id).subscribe(() => {
          this.paymentSuccessful = true;
          this.loading = false;
          this.stripeHandler.close();
        });
      }
    });

    this.setupBooking();
  }

  getAddress()
  {
    if(!isNullOrUndefined(this.listing))
    {
      return this.listing.getFullAddress();
    }
  }


  setupBooking() {
    this.router.params.subscribe(params => {
      const bookingId = params['id'];

      this.loading = true;
      this.service.getHashedBooking(bookingId).subscribe((booking) => {
        this.booking = booking;
        this.guest = booking.getGuest();
        this.listing = Object.assign( new Listing(), this.booking.getListing());

        this.loading = false;
      }, (error) => {
        if (error.error.code === 28) {
          this.errorStyle = 'extension';
          this.errorHeadline = 'Oops';
          this.errorMessage = 'Booking doesn\'t exist';
        } else if (error.error.code === 56) {
          this.errorStyle = 'thumb_up';
          this.errorHeadline = 'Thanks!';
          this.errorMessage = 'We have already received payment from you. We certainly don\'t overcharge';
        } else if (error.error.code === 57) {
          this.errorStyle = 'hourglass_empty';
          this.errorHeadline = 'Oops';
          this.errorMessage = 'Booking doesn\'t exist';
        }

        this.isError = true;
      });
    });
  }

  openPayment() {
    this.stripeHandler.open({
      name: 'StayDuvet',
      description: 'Payment For Booking',
      email: this.booking.guest.data.email,
      amount: this.booking.amount_to_pay * 100
    });
  }

  getImageUrl() {
    const images = this.listing.images.data;

    let flag = false;

    if (isNullOrUndefined(images)) {
      flag = true;
    }

    if (images.length === 0) {
      flag = true;
    }

    if (flag) {
      return '/assets/images/image-placeholder.jpg';
    }

    return images[0].original_url;
  }
}
