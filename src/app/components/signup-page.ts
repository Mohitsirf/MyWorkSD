import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {StayDuvetService} from '../services/stayduvet';
import {MatDialog, MatDialogRef} from '@angular/material';
import {AirlockPopupComponent} from './airlock-popup';
import {User} from '../models/user';
import {Store} from '@ngrx/store';
import {getAppLandingUrl, State} from '../reducers/index';
import {LoginSuccessAction} from '../actions/user';
import {Router} from '@angular/router';

@Component({
  selector: 'sd-signup',
  template: `
    <div class="signup-background" fxLayoutAlign="center center">

      <mat-tab-group fxFlex="90%" [dynamicHeight]="true">

        <mat-tab label="Register via Airbnb">

          <mat-card>
            <h1>Register via Airbnb</h1>
            <p>If you already have an Airbnb account then registering with Duvet is even
              faster and this will put all your listing to prefill all your property fields.
            </p>
            <form fxLayout="column" fxLayoutAlign="center"
                  fxFlexAlign="center" fxLayoutGap="25px" name="form"
                  [formGroup]="airbnbForm" (ngSubmit)="airbnbForm.valid && onAirbnbSubmit()" novalidate>

              <mat-form-field dividerColor="accent">
                <input matInput color="accent" placeholder="Airbnb Username (Email)" type="email"
                       formControlName="airbnb_username">
                <mat-error>Valid email is required</mat-error>
              </mat-form-field>

              <mat-form-field dividerColor="accent">
                <input matInput color="accent" placeholder="Airbnb Password" type="password" formControlName="airbnb_password">
                <mat-error>Password is required</mat-error>
              </mat-form-field>

              <mat-form-field dividerColor="accent">
                <input matInput color="accent" placeholder="Forwarding Email" type="email"
                       formControlName="forwarding_email">
                <mat-error>Valid email is required</mat-error>
              </mat-form-field>

              <div fxLayout="row" fxLayoutAlign="space-between center">
                <div fxLayout="column">
                  <mat-checkbox formControlName="checkbox">Accept to Duvet's terms of service</mat-checkbox>
                  <mat-error *ngIf="airbnbCheckboxError && !this.airbnbForm.get('checkbox').value">
                    you must accept terms and condtions to continue.
                  </mat-error>
                </div>
                <div fxLayout="column" fxLayoutAlign="end center">
                  <div fxLayout="row" fxLayoutAlign="space-around center">
                    <mat-spinner color="accent" *ngIf="airbnb_loading" [diameter]="30" [strokeWidth]="4"></mat-spinner>
                    <button mat-raised-button color="accent">
                      SignUp
                    </button>
                  </div>
                </div>
              </div>

            </form>
          </mat-card>
        </mat-tab>

        <mat-tab label="Register via Email">

          <mat-card>
            <h1>Register via Email</h1>
            <p>Please provide your email and a secure password to sign up for Duvet.
              Next you can submit your property information and we can begin the Duvet process.
            </p>
            <form fxLayout="column" fxLayoutAlign="center"
                  FlexAlign="center" fxLayoutGap="25px" name="form"
                  [formGroup]="emailForm" (ngSubmit)="emailForm.valid && onEmailSubmit()" novalidate>

              <div fxLayout="row" fxLayoutAlign="stretch center" fxLayoutGap="10px">
                <div fxFlex="45%">
                  <mat-form-field style="width: 100%;" dividerColor="accent">
                    <input matInput color="accent" placeholder="First Name" formControlName="first_name">
                    <mat-error>First Name is required</mat-error>
                  </mat-form-field>
                </div>
                <div fxFlex="45%">
                  <mat-form-field style="width: 100%;" dividerColor="accent">
                    <input matInput color="accent" placeholder="Last Name" formControlName="last_name">
                  </mat-form-field>
                </div>
              </div>

              <mat-form-field dividerColor="accent">
                <input matInput color="accent" placeholder="Email" type="email" formControlName="email">
                <mat-error>Valid email is required</mat-error>
              </mat-form-field>

              <mat-form-field dividerColor="accent">
                <input matInput color="accent" placeholder="Password" type="password" formControlName="password">
                <mat-error>Password is required</mat-error>
              </mat-form-field>

              <div fxLayout="row" fxLayoutAlign="space-between center">
                <div fxLayout="column">
                  <mat-checkbox formControlName="checkbox">Accept to Duvet's terms of service</mat-checkbox>
                  <mat-error *ngIf="emailCheckboxError && !this.emailForm.get('checkbox').value">
                    you must accept terms and conditions to continue.
                  </mat-error>
                </div>
                <div fxLayout="column" fxLayoutAlign="end center">
                  <div fxLayout="row" fxLayoutAlign="space-around center">
                    <mat-spinner color="accent" *ngIf="email_loading" [diameter]="30" [strokeWidth]="4"></mat-spinner>
                    <button mat-raised-button color="accent">
                      SignUp
                    </button>
                  </div>
                </div>
              </div>

            </form>
          </mat-card>

        </mat-tab>
      </mat-tab-group>

    </div>
  `,
  styles: [`
    mat-spinner {
      width: 24px;
      height: 24px;
      margin-right: 20px;
    }
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
export class SignUpComponent implements OnInit,OnDestroy {

  private dialogRef: MatDialogRef<any>;

  airbnb_loading = false;
  email_loading = false;

  airbnbForm: FormGroup;
  emailForm: FormGroup;

  airbnbCheckboxError = false;
  emailCheckboxError = false;
  private isAlive:boolean = true;

  constructor(private dialog: MatDialog,
              private service: StayDuvetService,
              private store: Store<State>,
              private router: Router) {

  }

  ngOnInit() {
    this.airbnbForm = new FormGroup({
      airbnb_username: new FormControl(null, [Validators.required, Validators.email]),
      airbnb_password: new FormControl(null, [Validators.required]),
      forwarding_email: new FormControl(null, [Validators.required, Validators.email]),
      checkbox: new FormControl(null)
    });
    this.emailForm = new FormGroup({
      first_name: new FormControl(null, [Validators.required]),
      last_name: new FormControl(null),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      checkbox: new FormControl(null)
    });
  }

  onAirbnbSubmit() {
    if (!this.airbnbForm.get('checkbox').value) {
      this.airbnbCheckboxError = true;
      return;
    }

    this.airbnb_loading = true;

    this.service.signupViaAirbnb(this.airbnbForm.value).subscribe(res => {
      this.airbnb_loading = false;

      const airbnbAccount = res.airbnb_account;
      const userObject = Object.assign(new User(), res.user);

      if (!airbnbAccount.airbnb_connected) {
        this.dialogRef = this.dialog.open(AirlockPopupComponent);
        const instance = this.dialogRef.componentInstance;
        instance.account = airbnbAccount;
        instance.user = userObject;
        this.dialogRef.updateSize('100%');
      } else {
        this.store.dispatch(new LoginSuccessAction(userObject));

        return this.store.select(getAppLandingUrl).takeWhile(()=>this.isAlive).subscribe((url) => {
          this.router.navigate([url]);
        });
      }
    },err=>{
      this.airbnb_loading = false;
    });
  }

  onEmailSubmit() {
    console.log('on email');
    if (!this.emailForm.get('checkbox').value) {
      this.emailCheckboxError = true;
      return;
    }

    this.email_loading = true;

    this.service.signupViaEmail(this.emailForm.value).subscribe(res => {
      this.email_loading = false;

      return this.store.select(getAppLandingUrl).takeWhile(()=>this.isAlive).subscribe((url) => {
        this.router.navigate([url]);
      });
    },err=>{
      this.email_loading = false;
    });
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}

