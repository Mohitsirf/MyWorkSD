/**
 * Created by aditya on 24/7/17.
 */
import {Component, OnInit, NgZone} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {StayDuvetService} from '../services/stayduvet';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {getAppLandingUrl} from '../reducers/index';
import {State} from '../reducers';
import {Store} from '@ngrx/store';
import {environment} from '../../environments/environment';

@Component({
  selector: 'sd-checkout',
  template: `
    <div class="nobg-container" fxLayoutAlign="center center">
      <mat-card>
        <form action="" method="POST" id="payment-form" fxLayout="row" fxLayoutAlign="center stretch"
              fxFlexAlign="center" fxLayoutGap="10px" name="form"
              [formGroup]="checkoutForm" (ngSubmit)="checkoutForm.valid && onSubmit()" novalidate>
          <div fxLayout="column" fxFlex="35%">
            <img style="opacity:0.7;" src="http://www.cityofneedles.com/images/backgrounds/300x800box3-1.jpg"
                 width="100%" height="500"/>
            <div style="color:#0b1e33;margin-top:-350px;position:relative">
              <p style="font-family: 'Josefin Sans', sans-serif !important;font-weight:lighter;font-size: 22px"
                 align="center"><b>To Pay:</b></p>
              <h1
                style=" color:#0b1e33 ;font-family: 'Roboto', sans-serif !important;font-weight:lighter;font-size: 46px"
                align="center">$250</h1>
            </div>
          </div>
          <div style="padding-right:20px !important;" fxLayout="column" fxFlex="65%">
            <h1 style="font-family: 'Josefin Sans', sans-serif !important;font-weight:lighter;font-size: 40px">
              Payments</h1>
            <div fxLayout="row">
              <div fxLayout="column" fxFlex="60%">
                <p>Pay with credit/debit card</p>

              </div>
              <div fxLayout="column" fxFlex="40%">
                <img
                  src="https://cdnladders-1.nmg.io/assets/checkout/icon-credit_cards-white-95ac62cfa4738544ee8eefae9282734a351555c33513b1eb3b42f33a6b96b589.svg">
              </div>
            </div>
            <div style="padding-top:42px"></div>
            <mat-form-field>
              <input [(ngModel)]="cardNumber" matInput placeholder="Credit card number" type="number"
                     formControlName="cardNumber">
              <mat-error> Credit card number is required</mat-error>
            </mat-form-field>
            <div style="padding-top:40px"></div>
            <div fxLayout="row" fxLayoutAlign="space-between" fxFlex="100%">
              <div fxLayout="column" fxFlex="45%">
                <mat-select placeholder="Expiry Year" [(ngModel)]="expYear" formControlName="expiryYear"
                           [required]="isRequired">
                  <mat-option *ngFor="let year of cardYear" [value]="year.actual">
                    {{ year.value }}
                  </mat-option>
                </mat-select>
              </div>
              <div fxLayout="column" fxFlex="45%">
                <mat-select placeholder="Expiry Month" [(ngModel)]="expMonth" formControlName="expiryMonth"
                           [required]="isRequired">
                  <mat-option *ngFor="let month of cardMonth" [value]="month.actual">
                    {{ month.value }}
                  </mat-option>
                </mat-select>
              </div>
            </div>
            <div style="padding-top:20px"></div>
            <div fxLayout="row" fxLayoutAlign="space-between" fxFlex="100%">
              <div fxLayout="column" fxFlex="45%">
                <mat-form-field>
                  <input matInput [(ngModel)]="cvc" placeholder="Cvv detail" type="number" formControlName="cvvNumber">
                  <mat-error>Cvv details required</mat-error>
                </mat-form-field>
              </div>
              <div fxLayout="column" fxFlex="45%">
                <p style="font-family: 'Josefin Sans', sans-serif !important;font-weight:lighter;font-size: 22px"
                   align="center"><b>CVV 3 or 4 digit</b></p>
              </div>
            </div>
            <div style="padding-top:30px"></div>
            <div fxLayout="row" fxLayoutAlign="center" fxFlex="100%">
              <div fxLayout="column" fxFlexFill fxFlex="80%">
                <button class="hvr-grow-shadow" mat-raised-button color="primary" [disabled]="loading"
                        color="accent">
                  <span style="font-family: 'Josefin Sans', sans-serif !important;font-size: 20px">Make Payment</span>
                </button>
              </div>
            </div>
            <div *ngIf="errorMessages">
              <div style="margin-bottom: .5em">
                <span class="sd-danger" *ngFor="let error of errorMessages" style="display: inline-block">{{ error
                  }}</span>
              </div>
            </div>
          </div>
        </form>
        <div style="padding-top:6px"></div>
        <hr>
        <div style="padding-top:6px;padding-bottom:5px;width:100%" fxLayoutAlign="center" fxLayout="row" fxFlex="100%">


          <div *ngIf="isProcessing" fxFlexAlign="center">
            <mat-spinner style="height:30px;width:30px" color="accent" [diameter]="30" [strokeWidth]="4"></mat-spinner>
          </div>

          <p align="center" style="margin-bottom: 10px"><b><span class="hvr-grow"
                                                                 style="color:red">{{message}}</span></b></p>


        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .sd-danger {
      color: red;
    }

    mat-spinner {
      width: 24px;
      height: 24px;
      margin-right: 20px;
    }

    mat-icon {
      font-size: 10px;
      height: 10px;
      width: 10px;
    }

    /deep/ .mat-card {
      padding: 0px !important;
      box-shadow: 4px 4px 10px grey !important;
      -webkit-border-top-right-radius: 25px !important;
      -webkit-border-bottom-left-radius: 25px !important;
      -webkit-border-top-left-radius: 3px !important;
      -webkit-border-bottom-right-radius: 3px !important;;
    }
  `]
})
export class CheckoutComponent implements OnInit {
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvc: string;
  message = '';
  isProcessing = false;
  isRequired = false;
  checkoutForm: FormGroup;
  loading = false;
  errorMessages: [String] = null;
  cardYear = [
    {value: 2017, actual: 17},
    {value: 2018, actual: 18},
    {value: 2019, actual: 19},
    {value: 2020, actual: 20},
    {value: 2021, actual: 21},
    {value: 2022, actual: 22},
    {value: 2023, actual: 23},
    {value: 2024, actual: 24},
    {value: 2025, actual: 25},
  ];
  cardMonth = [
    {value: 'January', actual: 1},
    {value: 'February', actual: 2},
    {value: 'March', actual: 3},
    {value: 'April', actual: 4},
    {value: 'May', actual: 5},
    {value: 'June', actual: 6},
    {value: 'July', actual: 7},
    {value: 'August', actual: 8},
    {value: 'September', actual: 9},
    {value: 'October', actual: 10},
    {value: 'November', actual: 11},
    {value: 'December', actual: 12},
  ];

  constructor(private _zone: NgZone) {
  }

  ngOnInit() {
    this.checkoutForm = new FormGroup({
      'cardNumber': new FormControl(null, [Validators.required]),
      'cvvNumber': new FormControl(null, [Validators.required]),
      'expiryYear': new FormControl(null, [Validators.required]),
      'expiryMonth': new FormControl(null, [Validators.required])

    });
  }

  onSubmit() {
    this.isProcessing = true;

    (<any>window).Stripe.card.createToken({
      number: this.cardNumber,
      exp_month: this.expMonth,
      exp_year: this.expYear,
      cvc: this.cvc
    }, (status: number, response: any) => {


      this._zone.run(() => {
        if (status === 200) {
          this.isProcessing = false;
          this.message = `Success! Card token ${response.card.id}.`;
        } else {
          this.isProcessing = false;
          this.message = response.error.message;
        }
      });
    });
  }
}
