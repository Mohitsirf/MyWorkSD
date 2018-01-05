import {Component, HostListener, Inject, Input, OnInit} from '@angular/core';
import {StayDuvetService} from '../../../services/stayduvet';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Booking} from '../../../models/booking';
import {environment} from 'environments/environment';
import {Payment} from '../../../models/payment';
import {getAllCollectionMethodTypes} from '../../../utils';

@Component({
  selector: 'sd-collect-payment-popup',
  template: `
    <sd-modal-popup-layout title="Collect Payment">
      <form fxLayout="column" fxLayoutGap="10px" [formGroup]="formGroup" (ngSubmit)="submitForm()">
        <div class="row" fxLayoutAlign="space-between center">
          <mat-form-field fxFlex="45%">
            <input matInput formControlName="amount" placeholder="Amount" type="number">
            <mat-error>Amount is required</mat-error>
          </mat-form-field>
          <mat-form-field [color]="'accent'" fxFlex="45%">
            <mat-select
              placeholder="Payment Method"
              [formControl]="method">
              <mat-option *ngFor="let method of paymentMethods" [value]="method.slug">{{method.title}}</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        <mat-form-field class="full-width">
          <textarea matInput 
                    style="max-height: 200px"
                    placeholder="Description"
                    lines="4"
                    formControlName="description">
          </textarea>
        </mat-form-field>
        
        <div fxLayout="row" fxLayoutAlign="end center" fxLayoutGap="15px">
          <mat-spinner *ngIf="isSaving" [diameter]="30" [strokeWidth]="4"></mat-spinner>
          <button type="submit" color="accent" [disabled]="isSaving" mat-raised-button>COLLECT</button>
        </div>
      </form>
    </sd-modal-popup-layout>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }
  `]
})

export class CollectPaymentComponent implements OnInit {
  booking: Booking;
  stripeHandler;

  isSaving = false;

  formGroup: FormGroup;

  amount: FormControl;
  method: FormControl;
  description: FormControl;

  paymentMethods = getAllCollectionMethodTypes();

  constructor(private service: StayDuvetService,
              private dialog: MatDialogRef<CollectPaymentComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    this.booking = data;

    this.amount = new FormControl(null, [Validators.required]);
    this.method = new FormControl(null, [Validators.required]);
    this.description = new FormControl();
  }

  ngOnInit() {
    this.formGroup = new FormGroup({
      amount: this.amount,
      method: this.method,
      description: this.description
    });

    this.method.setValue('credit_card');

    this.stripeHandler = StripeCheckout.configure({
      key: environment.Stripe.publishableKey,
      image: '/assets/images/logo.png',
      locale: 'auto',
      allowRememberMe: false,
      token: token => {
        const data = this.getData();
        data['card_token'] = token.id;

        this.hitAPI(data);
      }
    });
  }

  submitForm() {
    if (this.formGroup.invalid) {
      return;
    }

    if (this.method.value === 'credit_card') {
      this.stripeHandler.open({
        name: 'StayDuvet',
        description: 'Collection for booking id: ' + this.booking.id,
        email: this.booking.guest.data.email,
        amount: this.amount.value * 100
      });
    } else {
      this.hitAPI(this.getData());
    }
  }

  private hitAPI(data: any) {
    this.isSaving = true;
    this.service.collectPayment(this.booking.id, data).subscribe(payment => {
      this.isSaving = false;
      this.dialog.close();
    }, error => {
      this.isSaving = false;
    });
  }

  private getData() {
    return this.formGroup.getRawValue();
  }

  @HostListener('window:popstate')
  onPopstate() {
    this.stripeHandler.close();
  }
}
