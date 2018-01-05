import {Component, OnDestroy, OnInit} from '@angular/core';
import {StayDuvetService} from '../services/stayduvet';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {isNull, isUndefined} from 'util';
/**
 * Created by piyushkantm on 12/06/17.
 */

@Component({
  selector: 'sd-forgot-password',
  template: `
    <div class="container" fxLayoutAlign="center center">
      <div fxLayout="column" fxFlex="450px" fxFlex.lt-sm="90%" fxLayoutGap="20px">
        <img width="100%" src="/assets/images/logo.png">
        <mat-card>
          <h1>Reset Password</h1>
          <form fxLayout="column" fxLayoutAlign="center stretch"
                fxFlexAlign="center" fxLayoutGap="10px" name="form"
                [formGroup]="resetForm" (ngSubmit)="resetForm.valid && onSubmit()" novalidate>
            <div fxLayout="row" *ngIf="email">
              <label strong>Email: {{ email }}</label>
            </div>
            <mat-form-field>
              <input matInput placeholder="New Password" type="password" formControlName="password">
              <mat-error>Password is required</mat-error>
            </mat-form-field>
            <mat-form-field>
              <input matInput placeholder="Confirmation Password" formControlName="password_confirmation">
              <mat-error>Confirmation Password is required</mat-error>
            </mat-form-field>
            <div *ngIf="errorMessages">
              <div style="margin-bottom: .5em">
                <span class="sd-danger" *ngFor="let error of errorMessages" style="display: inline-block">{{ error }}</span>
              </div>
            </div>
            <div fxLayout="row" fxLayoutAlign="end center">
              <mat-spinner color="accent" *ngIf="loading" [diameter]="30" [strokeWidth]="4"></mat-spinner>
              <button mat-raised-button fxFlexAlign="end" color="primary" [disabled]="loading || incorrectParams" color="accent">
                Reset Password
              </button>
            </div>
          </form>
        </mat-card>
      </div>
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
  `],
})
export class ResetPasswordComponent implements OnInit {


  email: string;
  code: string;

  resetForm: FormGroup;
  loading = false;
  incorrectParams = false;
  errorMessages: [String] = null;

  constructor(private stayDuvetService: StayDuvetService,
              private snackBar: MatSnackBar,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (isUndefined(params['email']) || isUndefined(params['code'])) {
        this.incorrectParams = true;
      } else {
        this.incorrectParams = false;
        this.email = decodeURI(params['email']);
        this.code = decodeURI(params['code']);
      }
    });

    if (this.incorrectParams) {
      this.snackBar.open('The link seems to be broken. please try opening the link again.', 'Dismiss');
    }

    this.resetForm = new FormGroup({
      'password': new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(14)]),
      'password_confirmation': new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(14)])
    });
  }

  onSubmit() {
    this.snackBar.dismiss();
    const userValue = this.resetForm.value;
    const password = userValue['password'];
    const passwordConfirm = userValue['password_confirmation'];

    if (password !== passwordConfirm) {
      this.snackBar.open('Password and Confirmation password do not match.', 'Dismiss');
      return;
    }

    this.loading = true;
    this.errorMessages = null;

    this.stayDuvetService.resetPassword({
      email: this.email,
      code: this.code,
      password: password,
      password_confirmation: passwordConfirm,
    }).subscribe(
      (response) => {
        this.router.navigate(['/login']);
      },
      (error) => {
        this.loading = false;
        console.log('login failed');
        console.log(error.messages);
        this.errorMessages = error.messages;
      },
      () => {
        console.log('complete function called');
      }
    );
  }
}
