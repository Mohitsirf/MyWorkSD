import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AirbnbAccount} from '../models/airbnb_account';
import {User} from '../models/user';
import {StayDuvetService} from '../services/stayduvet';
import {getAppLandingUrl, State} from '../reducers/index';
import {LoginSuccessAction} from '../actions/user';
import {Router} from '@angular/router';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'sd-airlock-popup',
  template: `
    <sd-modal-popup-layout title="Verify Airbnb Account">
      <div *ngIf="!activated" fxLayout="column">
        <h2>Hi {{account.first_name}}</h2>
        <h4>We tried adding your airbnb account but it is locked with 2-factor authentication. To keep using the
          account, we need you to verify the account.</h4>
        <h6>Verification will open on new tab. click on "Check Status" after you have verified.</h6>
        <p color="warn">We still can't connect. please try verifying once again.</p>
        <div fxLayout="row" fxLayoutAlign="space-around center">
          <div fxLayout="column" fxLayoutAlign="space-around center">
            <div fxLayout="row">
              <mat-spinner *ngIf="is_pinging" [diameter]="30" [strokeWidth]="4"></mat-spinner>
              <button mat-raised-button color="accent" (click)="ping()">Check Status</button>
            </div>
          </div>
          <div fxLayout="column" fxLayoutAlign="space-around center">
            <button mat-raised-button color="accent" (click)="openAirlock()">Verify Account</button>
          </div>
        </div>
      </div>
      <div *ngIf="activated" fxLayout="column">
        <h2>
          <mat-icon [color]="'accent'">thumb_up</mat-icon>
          Thanks {{account.first_name}}
        </h2>
        <h3>Yay! we have successfully verified your account.</h3>
      </div>
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
export class AirlockPopupComponent implements OnInit, OnDestroy {

  is_pinging = false;
  error_pinging = false;
  activated = false;

  @Input() account: AirbnbAccount;
  @Input() user: User;
  private isAlive = true;

  AIRLOCK_BASE_URL = 'https://www.airbnb.co.in/airlock?al_id=';

  ngOnInit() {
    console.log('onInit sd-airlock-popup');
  }

  constructor(private service: StayDuvetService,
              private store: Store<State>,
              private router: Router,
              private dialogRef: MatDialogRef<AirlockPopupComponent>) {
  }

  ping() {
    this.is_pinging = true;

    this.service.pingAirbnbAccount(this.account.id).subscribe((account) => {
      console.log(account);
      this.account = account;
      this.is_pinging = false;
      if (!account.airbnb_connected) {
        this.error_pinging = true;
      } else {
        this.activated = true;

        if (this.user != null) {
          this.store.dispatch(new LoginSuccessAction(this.user));

          return this.store.select(getAppLandingUrl).takeWhile(() => this.isAlive).subscribe((url) => {
            this.router.navigate([url]);
          });
        } else {
          setTimeout(() => {
            this.dialogRef.close();
          }, 3000);
        }
      }
    });
  }

  openAirlock() {
    window.open(this.AIRLOCK_BASE_URL + this.account.airlock_id, '_blank');
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

}
