/**
 * Created by aditya on 17/7/17.
 */
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {StayDuvetService} from '../../services/stayduvet';
import {AirbnbAccount} from '../../models/airbnb_account';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'sd-add-airbnb-popup',
  template: `
    <sd-modal-popup-layout title="Add Airbnb Account">
      <form [formGroup]="addAccountForm" (ngSubmit)="addAccountForm.valid && onSubmit()">
        <div fxLayout="row" fxLayoutGap="40px" fxLayoutAlign="space-between">
          <div fxFlex="60%">
            <p>Credentials for your Airbnb Account</p>
            <div fxLayout="column" fxLayoutAlign="center stretch" fxFlexAlign="center" fxLayoutGap="10px">
              <mat-form-field [color]="'accent'">
                <input matInput placeholder="Forwarding Email" type="email" formControlName="forwarding_email">
                <mat-error>Enter an email address where we will forward the 'airbnb emails'</mat-error>
              </mat-form-field>
              <mat-form-field [color]="'accent'">
                <input matInput placeholder="Airbnb Username"  type="email" formControlName="airbnb_username">
                <mat-error>Enter the Airbnb Email for login</mat-error>
              </mat-form-field>
              <mat-form-field [color]="'accent'">
                <input matInput placeholder="Airbnb Password" type="password" formControlName="airbnb_password">
                <mat-error>Enter the Airbnb Password for login</mat-error>
              </mat-form-field>
              <div fxLayout="row" fxLayoutAlign="center center" fxLayoutGap="10px" [style.margin-top]="'0px'">
               <span>
                  <mat-icon>info</mat-icon>
                  Changing Airbnb password can be tricky. Airbnb enforces some
                  strict rule on changing password. It has to be more than 8 letter and it cannot be a password
                  that you've previously used. We will try to update your Airbnb account to use your new password.
                  and if we fail doing so, we will use a random password and send you an email about it.
               </span>
              </div>
            </div>
          </div>
          <div fxFlex="40%">
            <div>
              <p style="font-weight: bold">Forwarding</p>
              <mat-slide-toggle>All emails</mat-slide-toggle>
            </div>
            <div fxLayout="column" fxLayoutGap="5px" style="margin-top: 20px">
              <p>I want only these emails</p>
              <mat-slide-toggle [checked]="false" formControlName="reservation_confirmation">Reservation conformations
              </mat-slide-toggle>
              <mat-slide-toggle [checked]="false" formControlName="reservation_requests">Reservation request
              </mat-slide-toggle>
              <mat-slide-toggle [checked]="true" formControlName="inquiries">Inquiries</mat-slide-toggle>
              <mat-slide-toggle [checked]="false" formControlName="reminders">Reminders</mat-slide-toggle>
              <mat-slide-toggle [checked]="true" formControlName="reviews">Reviews</mat-slide-toggle>
              <mat-slide-toggle [checked]="false" formControlName="emails_from_guests">Email from guests
              </mat-slide-toggle>
              <p>Note: All email's from Airbnb's support will still be forwarded</p>
              <div>
                <hr>
              </div>
            </div>
          </div>
        </div>
        <div  fxLayout="row" fxLayoutAlign="end center">
          <mat-spinner color="accent" *ngIf="loading"  [diameter]="30" [strokeWidth]="4"></mat-spinner>
          <button *ngIf="!update"  mat-raised-button fxFlexAlign="end" color="primary" [disabled]="loading"
                  color="accent">
            Add Account
          </button>
          <button *ngIf="update" mat-raised-button fxFlexAlign="end"  color="primary" [disabled]="loading"
                  color="accent">
            Update Account
          </button>
        </div>
      </form>
    </sd-modal-popup-layout>
  `,
  styles: [`
    mat-spinner {
      width: 24px;
      height: 24px;
      margin-right: 20px;
    }
  `]
})
export class AirbnbPopupComponent implements OnInit {
  addAccountForm: FormGroup;
  loading = false;

  update = false;
  @Input() account: AirbnbAccount;
  @Output() accountAdded = new EventEmitter<any>();

  constructor(private service: StayDuvetService,
              private dialog: MatDialog,
              public dialogRef: MatDialogRef<AirbnbPopupComponent>) {
  }

  ngOnInit() {
    console.log(this.account);
    if(!isNullOrUndefined(this.account)) {
      this.update = true;
      this.addAccountForm = new FormGroup({
        'forwarding_email': new FormControl(this.account.forwarding_email, [Validators.required, Validators.email]),
        'airbnb_username': new FormControl(this.account.airbnb_username, [Validators.required, Validators.email]),
        'airbnb_password': new FormControl(this.account.airbnb_password, [Validators.required]),

        'reservation_confirmation': new FormControl(this.account.reservation_confirmation, []),
        'reservation_requests': new FormControl(this.account.reservation_requests, []),
        'inquiries': new FormControl(this.account.inquiries, []),
        'reminders': new FormControl(this.account.reminders, []),
        'reviews': new FormControl(this.account.reviews, []),
        'emails_from_guests': new FormControl(this.account.emails_from_guests, []),
      });
    } else {
      this.addAccountForm = new FormGroup({
        'forwarding_email': new FormControl(null, [Validators.required, Validators.email]),
        'airbnb_username': new FormControl(null, [Validators.required, Validators.email]),
        'airbnb_password': new FormControl(null, [Validators.required]),

        'reservation_confirmation': new FormControl(null, []),
        'reservation_requests': new FormControl(null, []),
        'inquiries': new FormControl(null, []),
        'reminders': new FormControl(null, []),
        'reviews': new FormControl(null, []),
        'emails_from_guests': new FormControl(null, []),
      });
    }

  }

  onSubmit() {
    const data = this.addAccountForm.value;
    if(!this.update) {
      this.loading = true;
      this.service.attachAirbnbAccount(data).subscribe((res) => {
        this.loading = false;
        this.accountAdded.emit(res);
        this.dialogRef.close();
      }, () => {
        this.loading = false;
      });
    } else {
      if(this.account.airbnb_username == data['airbnb_username'] && this.account.airbnb_password == data['airbnb_password']){
        delete data['airbnb_username'];
        delete data['airbnb_password'];
      }

      this.loading = true;
      console.log(data);
      this.service.updateAirbnbAccount(this.account.id, this.addAccountForm.value).subscribe((res) => {
        this.loading = false;
        this.dialogRef.close();
      }, () => {
        this.loading = false;
      });
    }

  }
}
