import {Component, OnInit} from '@angular/core';
import {StayDuvetService} from '../services/stayduvet';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
/**
 * Created by piyushkantm on 13/06/17.
 */

@Component({
  selector: 'sd-forgot-password',
  template: `
    <div class="page-container svg-background" fxLayoutAlign="center center">
      <div fxLayout="column" fxFlex.xs="90%" fxFlex.sm="90%" fxFlex="30%" fxFlex.lg="30%" fxLayoutGap="20px">
      <div fxLayoutAlign="center">
        <img width="50%" height="15%" src="/assets/images/logo.png">
       </div>
        <mat-card>
          <h1 fxLayoutAlign="center center">Reset Password</h1>
          <form fxLayout="column" fxLayoutAlign="center stretch"
                fxFlexAlign="center" fxLayoutGap="10px" name="form"
                [formGroup]="emailForm" (ngSubmit)="emailForm.valid && onSubmit()" novalidate>
            <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="10px" [style.margin-top]="'20px'" *ngIf="emailSent">
              <mat-icon>done</mat-icon>
              <p>We have sent you the email. Please check your email inbox for furthur instructions and reset Link.</p>
            </div>
            <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="10px" [style.margin-top]="'20px'" *ngIf="!emailSent">
              <mat-icon>info_outline</mat-icon>
              <p>Email will be sent to the email id, which will contain a unique link to reset the password for your account.</p>
            </div>
            <mat-form-field>
              <input matInput placeholder="Email" type="email" formControlName="email">
              <mat-error>Email is required</mat-error>
            </mat-form-field>
            <div *ngIf="errorMessages">
              <div style="margin-bottom: .5em">
                <span class="sd-danger" *ngFor="let error of errorMessages" style="display: inline-block">{{ error }}</span>
              </div>
            </div>
            <div fxLayout="row" fxLayoutAlign="end center">
              <mat-spinner color="accent" *ngIf="loading" [diameter]="30" [strokeWidth]="4"></mat-spinner>
              <button mat-raised-button fxFlexAlign="end" color="primary" [disabled]="loading || emailSent" color="accent">
                Send Email.
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
    mat-icon {
      font-size: 24px;
    }
  `]
})
export class ForgotPasswordComponent implements OnInit {

  emailForm: FormGroup;
  loading = false;
  emailSent = false;
  errorMessages: [String] = null;

  constructor (private stayDuvetService: StayDuvetService,
               private mdSnackBar: MatSnackBar,
               private router: Router,
               private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.emailForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  onSubmit() {
    this.loading = true;
    this.errorMessages = null;

    this.stayDuvetService.forgotPassword(this.emailForm.value).subscribe(
      (response) => {
        this.loading = false;
        this.emailSent = true;
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
