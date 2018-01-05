import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {DataSource} from '@angular/cdk/table';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Store} from '@ngrx/store';
import {getAirbnbAccounts, getIsAccountsLoaded, getIsAccountsLoading, State} from '../../reducers/index';
import {StayDuvetService} from '../../services/stayduvet';
import {AirbnbAccount} from '../../models/airbnb_account';
import {isNullOrUndefined} from 'util';
import {MatDialog, MatDialogRef} from '@angular/material';
import {DetailsMagnifyComponent} from '../tasks/details-magnify';
import {AirbnbPopupComponent} from '../elements/owner-add-airbnb-popup';

@Component({
  selector: 'sd-setting-integrations',
  template: `

    <mat-card fxFlex="100%" id="container">
      <div fxLayout="column" *ngIf="!accountsLoading">
        <div fxLayout="row" fxLayoutAlign="center center" id="heading">
          <span fxFlex="18%" class="title-text">NickName</span>
          <span fxFlex="16%" class="title-text">Host Name</span>
          <span fxFlex="29%" class="title-text">Email</span>
          <span fxFlex="15%" class="title-text">Status</span>
          <span fxFlex="15%" class="title-text">Verified</span>
          <span fxFlex="7%" class="title-text">Refresh</span>
        </div>
        <div>
          <hr>
        </div>
        <div *ngFor="let account of accounts">
          <div fxLayout="row" fxLayoutAlign="start center">
            <span fxFlex="18%" style="cursor: pointer" (click)="openDialog(account)">{{account.first_name }}</span>
            <span fxFlex="16%" style="cursor: pointer" (click)="openDialog(account)">{{account.first_name + ' ' + account.last_name | truncate}}</span>
            <span fxFlex="29%" style="cursor: pointer" (click)="openDialog(account)">{{account.airbnb_username}}</span>
            <span fxFlex="15%" fxLayoutAlign="center center"><mat-chip-list>
                        <mat-chip selected="true"
                                  matTooltip="{{getAccountStatusType(account.airbnb_connected).text}}"
                                  [matTooltipPosition]="'above'"
                                  [ngStyle]="{
                                   'background': getAccountStatusType(account.airbnb_connected).color,
                                   'text-align':'center',
                                   'color':'white'
                                 }">
                          <span style="width: 100%;text-align: center">
                            {{getAccountStatusType(account.airbnb_connected).text}}
                          </span>
                        </mat-chip>
            </mat-chip-list>
            </span>
            <span fxFlex="15%" fxLayoutAlign="center center">
              <mat-chip-list *ngIf="!account.airlock_id">
                <mat-chip selected="true"
                          matTooltip="verified"
                          [matTooltipPosition]="'above'"
                          [ngStyle]="{
                                   'background': 'Green',
                                   'color': 'white',
                                   'text-align':'center'
                        }"> 
                        <span style="width: 100%;text-align: center">
                            Verified
                        </span>
                </mat-chip>
              </mat-chip-list>
              <button mat-raised-button *ngIf="account.airlock_id" color="accent"
                      (click)="verifyAirlock(account.airlock_id)">
                Verify
              </button>
            </span>
            <span fxFlex="7%" fxLayoutAlign="center center">
              <button *ngIf="!refreshingIds[account.id]" mat-mini-fab color="accent"
                      (click)="verifyAirlock(account)">
                <mat-icon>replay</mat-icon>
              </button>
              <mat-spinner *ngIf="refreshingIds[account.id]" [color]="'accent'" [diameter]="30" [strokeWidth]="4"></mat-spinner>
            </span>
          </div>
          <hr>
        </div>

        <div fxLayout="row" *ngIf="!accountsLoading && accounts.length === 0" fxLayoutAlign="center center">
          <p> No Account</p>
        </div>
      </div>

      <div *ngIf="accountsLoading" fxLayoutAlign="center center">
        <mat-spinner [color]="'accent'" [diameter]="30" [strokeWidth]="4"></mat-spinner>
      </div>

    </mat-card>

  `,
  styles: [`
    #container {
      width: 100%;
      background: -webkit-linear-gradient(top, #ffffff 0%, #ffffff 100%);
      padding: 30px;
      font-size: 13px;
    }

    mat-chip {
      width: 120px;
      text-align: center;
    }

    .title-text {
      font-size: 15px;
      font-weight: bold;
      text-align: center;
    }

    /deep/ .mat-chip:not(.mat-basic-chip) {
      padding: 8px 4px 8px 4px !important;
      font-size: 13px !important;
    }
  `]
})
export class SettingsIntegrationsComponent implements OnInit, OnDestroy {

  private isAlive: boolean = true;

  accounts: AirbnbAccount[];
  refreshingIds: {[id: number]: boolean} = {};

  private dialogRef: MatDialogRef<any>;

  isLoading: boolean;
  isLoaded: boolean;

  accountsLoading = true;

  constructor(private store: Store<State>, private service: StayDuvetService, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.store.select(getIsAccountsLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.isLoading = loading;
    });

    this.store.select(getIsAccountsLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.isLoaded = loaded;
    });

    const upcomingCombined = Observable.merge(
      this.store.select(getAirbnbAccounts),
      this.store.select(getIsAccountsLoading),
      this.store.select(getIsAccountsLoaded),
      ((accounts, loading, loaded) => {
      })
    );

    upcomingCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.isLoading && !this.isLoaded) {
          this.service.getAirbnbAccounts().subscribe(() => {
            this.accountsLoading = false;
          });
        } else if (!this.isLoading && this.isLoaded) {
          this.accountsLoading = false;
        }
      }
    );
    this.store.select(getAirbnbAccounts).subscribe((accounts) => {
      console.log(accounts);
      this.accounts = accounts;
    });
  }

  getAccountStatusType(connected: boolean): any {
    let text, color;
    if (connected === true) {
      text = 'ACTIVE';
      color = 'Green';
    } else {
      text = 'IN-ACTIVE';
      color = 'Red';
    }
    return {text: text, color: color};
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

  verifyAirlock(account: AirbnbAccount) {
    this.refreshingIds[account.id] = true;
    this.service.refreshAirbnbAccount(account.id).subscribe((complete) => {
      this.refreshingIds[account.id] = false;
    });
  }

  refreshAccount(id: any) {
    window.open('https://www.airbnb.co.in/airlock?al_id=' + id, '_blank').focus();
  }

  openDialog(account: AirbnbAccount) {
    this.dialogRef = this.dialog.open(AirbnbPopupComponent);
    const instance = this.dialogRef.componentInstance;
    instance.account = account;
    this.dialogRef.updateSize('100%','100%');
  }
}
