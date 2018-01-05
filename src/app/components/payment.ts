import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {StayDuvetService} from '../services/stayduvet';
import {Booking} from '../models/booking';
import {Listing} from '../models/listing';
import {User} from '../models/user';
import {environment} from '../../environments/environment';
import {Payment} from '../models/payment';

@Component({
  selector: 'sd-payment-page',
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
    </div>

    <div class="page-container" fxFlex="100%" fxLayoutAlign="center stretch"
         *ngIf="!isError && !paymentSuccessful && loading">
      <mat-spinner color="accent"></mat-spinner>
    </div>

    <div fxFlex="100%" fxLayoutAlign="center center" *ngIf="!isError && !paymentSuccessful && !loading"
         style="margin-top: 3%; margin-bottom: 5%">

      <div fxLayout="row" fxLayoutAlign="space-around" fxFlex="72%">

        <mat-card fxFlex="58%" fxLayout="column" fxLayoutGap="10px" fxLayoutAlign="start stretch" style="height: 100%">

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
            <span style="color: #8c8c8c;font-size: 14px; font-weight: bolder;width: 80%;white-space: pre-line">
              {{payment.description}}
            </span>
          </div>

          <div fxLayout="row" fxLayoutAlign="center center" style="width: 100%">
            <button style="width: 200px;" mat-raised-button
                    [disabled]="isPaying"
                    [color]="'accent'" (click)="openPayment()">
              PAY NOW
            </button>
            <mat-spinner *ngIf="isPaying" [diameter]="30" 
                         [strokeWidth]="4" [color]="'accent'">
            </mat-spinner>
          </div>
        </mat-card>


        <mat-card fxFlex="40%" class="secondary" fxLayout="column" fxLayoutGap="20px">
          <img style="width: 100%; height: auto;" src="{{listing.images.data[0].original_url}}">
          <div fxLayout="column" style="padding-left: 20px;" fxLayoutAlign="start start" fxLayoutGap="10px"
               fxFlex="100%">
            <span style="font-size: 16px; font-weight: bolder;">{{listing.title}}</span>
            <span
              style="color: #8c8c8c;font-size: 16px; font-weight: bolder;">
              {{listing.address_string}}
            </span>
            <span style="color: #8c8c8c;font-size: 14px; font-weight: bolder;width: 100%;text-align: center">
              {{booking.start}} - {{booking.end}}
            </span>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
  `]
})

export class PaymentPageComponent implements OnInit {

  isError = false;
  isPaying = false;

  errorStyle;
  errorHeadline;
  errorMessage;

  loading = true;
  payment: Payment;
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
        this.isPaying = true;
        this.service.payForCollection(this.payment.id, token.id).subscribe(() => {
          this.paymentSuccessful = true;
          this.isPaying = false;
          this.stripeHandler.close();
        });
      }
    });

    this.setupPayment();
  }


  setupPayment() {
    this.router.params.subscribe(params => {
      const bookingId = params['id'];

      this.loading = true;
      this.service.getHashedPayment(bookingId).subscribe((payment) => {
        this.payment = payment;
        this.booking = Object.assign(new Booking(), payment.booking.data);
        this.guest = Object.assign(new User(), payment.booking.data.guest.data);
        this.listing = Object.assign(new Listing(), payment.booking.data.property.data);

        this.loading = false;
      }, (error) => {
        if (error.error.code === 58) {
          this.errorStyle = 'extension';
          this.errorHeadline = 'Oops';
          this.errorMessage = 'Invalid Link';
        } else if (error.error.code === 59) {
          this.errorStyle = 'thumb_up';
          this.errorHeadline = 'Thanks!';
          this.errorMessage = 'We have already received payment from you. We certainly don\'t overcharge';
        } else if (error.error.code === 60) {
          this.errorStyle = 'hourglass_empty';
          this.errorHeadline = 'Oops';
          this.errorMessage = 'The Payment is from some other source';
        }

        this.isError = true;
      });
    });
  }

  openPayment() {
    this.stripeHandler.open({
      name: 'StayDuvet',
      description: 'Payment For Booking id: ' + this.booking.id,
      email: this.guest.email,
      amount: this.payment.amount * 100
    });
  }
}
