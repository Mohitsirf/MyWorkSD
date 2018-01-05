import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {StayDuvetService} from '../services/stayduvet';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {getAppLandingUrl} from '../reducers/index';
import {State} from '../reducers';
import {Store} from '@ngrx/store';

@Component({
  selector: 'sd-login',
  template: `

    <div class="page-container svg-background" fxLayoutAlign="center center">
      <div class="sampleanim" style="left:4%;top:1%; position: absolute;">

        <article class="loginQuoteContainer">

          <blockquote class="loginQuote">
            <strong>TRAVELLING</strong> it <em>leaves</em> YOU <strong>speechless</strong>
          </blockquote>
          <b>Frank, A.</b>

        </article>
      </div>
      <div style="" fxLayout="column" fxFlex.xs="90%" fxFlex.sm="90%" fxFlex="30%" fxFlex.lg="30%" fxLayoutGap="20px">
        <div fxLayoutAlign="center">

        </div>
        <mat-card class="login-general-card">
          <div class="svg-card" fxLayout="row" fxLayoutAlign="center">
            <img width="50%" height="15%" src="/assets/images/logo.png">
          </div>
          <div style="padding:5px 15px 15px 15px">
            <h1 class="login-style">Login</h1>

            <form fxLayout="column" fxLayoutAlign="center stretch"
                  fxFlexAlign="center" fxLayoutGap="10px" name="form"
                  [formGroup]="loginForm" (ngSubmit)="loginForm.valid && onSubmit()" novalidate>
              <mat-form-field dividerColor="accent">
                <input matInput placeholder="Email" type="email" formControlName="email">
                <mat-error>Valid email is required</mat-error>
              </mat-form-field>
              <mat-form-field dividerColor="accent">
                <input matInput placeholder="Password" type="password" formControlName="password">
                <mat-error>Password is required</mat-error>
              </mat-form-field>
              <div *ngIf="errorMessages">
                <div style="margin-bottom: .5em">
                  <span class="sd-danger" *ngFor="let error of errorMessages" style="display: inline-block">{{ error
                    }}</span>
                </div>
              </div>
              <div fxLayout="row" fxLayoutAlign="end center">
                <mat-spinner color="accent" *ngIf="loading" [diameter]="30" [strokeWidth]="4"></mat-spinner>
                <button mat-raised-button fxFlexAlign="end" color="primary" [disabled]="loading"
                        color="accent">
                  Login
                </button>
              </div>
              <div fxLayout="row" fxLayoutAlign="center center" fxLayoutGap="10px" [style.margin-top]="'20px'">
                <a class="text-longshadow login-style" routerLink="/signup">Create New Account</a>

                <mat-icon style="color:#13304b">fiber_manual_record</mat-icon>
                <a routerLink="/forgot-password" class="login-style">Forgot Password?</a>
              </div>
            </form>
          </div>
        </mat-card>


      </div>
    </div>
  `,
  styles: [`
    a {
      color: #13304b;
     
    }
    
    .login-style{
     

    }
    
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
  `]
})

export class LoginComponent implements OnInit,OnDestroy {


  loginForm: FormGroup;
  loading = false;
  errorMessages: [String] = null;
  private isAlive:boolean = true;

  constructor(private stayDuvetService: StayDuvetService,
              private snackBar: MatSnackBar,
              private router: Router,
              private store: Store<State>,
              private route: ActivatedRoute,) {
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required])
    });
  }

  onSubmit() {
    this.loading = true;
    this.errorMessages = null;

    this.stayDuvetService.login(this.loginForm.value).subscribe(
      (response) => {
        this.loading = false;
        return this.store.select(getAppLandingUrl).takeWhile(()=>this.isAlive).subscribe((url) => {
          this.router.navigate([url]);
        });
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
  ngOnDestroy(): void {
    this.isAlive  =false;
  }

}
