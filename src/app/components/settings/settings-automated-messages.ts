import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {SettingsAlertPopupComponent} from './automated-messages-popup/check-in-instructions-popup';
import {MatDialog, MatDialogRef} from '@angular/material';
import {Router} from '@angular/router';
import {Alert} from '../../models/alert';
import {StayDuvetService} from '../../services/stayduvet';
import {getAlerts, getIsAlertsLoaded, getIsAlertsLoading, State} from '../../reducers/index';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import Utils from '../../utils';

@Component({
  selector: 'sd-setting-automated-messages',
  template: `
    <div fxLayout="column" fxLayoutGap="10px" fxFlex="100%">
      <div fxLayoutAlign="start center" *ngIf="!listingId">
        <button mat-raised-button color="primary" (click)="openTools()">
          <mat-icon>arrow_back</mat-icon>
          Back
        </button>
      </div>
      <div fxLayout="column" fxLayoutGap="5px" fxFlex="80%">

        <div style="margin-top: 10px;" fxLayoutAlign="space-between start">
          <div fxLayout="column" fxLayoutAlign="center start" fxLayoutGap="10px" class="para">
            <span class="heading">Hooks</span>
          </div>
          <button mat-raised-button color="accent" (click)="openCreateDialog()">Add a new Hook</button>
        </div>

        <hr>

        <div fxLayoutAlign="center center" *ngIf="isLoading" style="height: 400px; width: 100%">
          <mat-spinner [color]="'accent'" [diameter]="60" [strokeWidth]="5"></mat-spinner>
        </div>

        <div *ngIf="isLoaded" fxLayout="column" fxLayoutGap="10px">
          <div>
            <div style="margin-left: 2%; margin-top: 15px; margin-bottom: 30px ;margin-right: 2%" fxLayout="column"
                 *ngFor="let section of sections"
                 fxLayoutGap="10px">
              <div fxLayout="row " fxLayoutGap="10px" fxLayoutAlign="start center">
                <div class="vertical-line"></div>
                <h3>{{section.title}}</h3>
              </div>

              <h4 style="text-align: center; font-size: small" *ngIf="section.alerts.length ==0 ">
                No Hooks Found For {{section.title}}.
              </h4>
              <mat-card
                *ngFor="let alert of section.alerts"
                fxLayout="column"
                fxLayoutGap="5px"
                class="padding"
                (click)="openDialog(alert)"
                style="cursor: pointer">
                <div fxLayout="row" fxLayoutAlign="space-between center">
                  <strong>{{alert.title}}</strong>
                  <span class="mat-button"
                        *ngIf="alert.property_ids.length === 0 && alert.alert_type === 'exclude'"
                        style="background-color: darkorange;text-align: center">
                    On all listings
                  </span>
                  <span class="mat-button"
                        *ngIf="!(alert.property_ids.length === 0 && alert.alert_type === 'exclude')"
                        style="background-color: darkorange; text-align: center;">
                    On Multiple listings
                  </span>
                </div>
                <span class="content">{{Utils.trim(alert.message, 100)}}</span>
              </mat-card>
            </div>
          </div>
        </div>
      </div>
    </div>

  `,
  styles: [`

    mat-spinner {
      width: 100px;
      height: 100px;
    }

    .mat-button {
      height: 30px;
      line-height: 20px;
      min-height: 25px;
      vertical-align: top;
      font-size: 13px;
      color: white;
      padding-left: 10px;
      padding-right: 10px;
      padding-top: 5px;
      padding-bottom: 5px;
      margin: 0;
    }

    .padding {
      padding: -10px 0px -10px -5px;
      background: -webkit-linear-gradient(top, #ffffff 0%, #ffffff 100%);
    }

    .card {
      padding: 15px;
      background: -webkit-linear-gradient(top, #ffffff 0%, #ffffff 100%);
    }

    .mat-card {
      border: 1px solid lightgrey !important;
      box-shadow: none !important;
      background: -webkit-linear-gradient(top, #ffffff 0%, #ffffff 100%);
    }

    .content {
      font-size: 14px;
      line-height: 130%;
    }

    strong {
      font-weight: bolder !important;
      letter-spacing: 1px !important;
      font-size: 18px !important;
      font-family: 'Roboto', sans-serif !important;
    }

    .heading {
      font-weight: bolder;
      font-size: 22px;
    }

    div.vertical-line {
      width: 5px; /* Line width */
      background-color: green; /* Line color */
      height: 20px; /* Override in-line if you want specific height. */
      float: left;
      /* Causes the line to float to left of content. 
             You can instead use position:absolute or display:inline-block
             if this fits better with your design */
    }`]
})
export class SettingsAutomatedMessagesComponent implements OnInit, OnDestroy {

  private dialogRef: MatDialogRef<any>;

  isAlive = true;

  sections: { title: string, alerts: Alert[] }[] = [];

  alerts: Alert[];
  isLoading: boolean;
  isLoaded: boolean;

  Utils = Utils;

  @Input() checkInAutomatedMessages: Alert[] = [];
  @Input() checkOutAutomatedMessages: Alert[] = [];
  @Input() reservedAutomatedMessages: Alert[] = [];

  @Input() listingId;


  constructor(private dialog: MatDialog,
              private service: StayDuvetService,
              private store: Store<State>,
              private router: Router) {
  }

  ngOnInit(): void {
    console.log('onInit sd-setting-automated-messages');


    if (!this.listingId) {
      this.setUpAutomatedMessages();
    }
    else {
      this.sections = [
        {
          title: 'Check In',
          alerts: this.checkInAutomatedMessages
        },
        {
          title: 'Check Out',
          alerts: this.checkOutAutomatedMessages
        },
        {
          title: 'Reservation Confirmed',
          alerts: this.reservedAutomatedMessages
        }
      ];

      this.isLoaded = true;
      this.isLoading = false;
    }

  }

  setUpAutomatedMessages() {
    this.store.select(getAlerts).takeWhile(() => this.isAlive).subscribe((alerts) => {
      this.alerts = alerts;
      this.filterAlerts();
    });

    this.store.select(getIsAlertsLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.isLoading = loading;
    });

    this.store.select(getIsAlertsLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.isLoaded = loaded;
    });

    const alertsCombined = Observable.merge(
      this.store.select(getAlerts),
      this.store.select(getIsAlertsLoading),
      this.store.select(getIsAlertsLoaded),
      ((discounts, loading, loaded) => {
      })
    );

    alertsCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.isLoading && !this.isLoaded) {
          this.service.getAlerts().subscribe(() => {
          });
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  filterAlerts() {
    const checkIn = [];
    const checkOut = [];
    const reservation = [];

    this.alerts.map((alert) => {
      if (alert.offset_reference === 'check_in') {
        checkIn.push(alert);
      } else if (alert.offset_reference === 'check_out') {
        checkOut.push(alert);
      } else {
        reservation.push(alert);
      }
    });

    this.sections = [
      {
        title: 'Check In',
        alerts: checkIn
      },
      {
        title: 'Check Out',
        alerts: checkOut
      },
      {
        title: 'Reservation Confirmed',
        alerts: reservation
      }
    ];
  }

  openDialog(alert: Alert) {
    const data = {
      alert: alert
    };
    this.dialogRef = this.dialog.open(SettingsAlertPopupComponent, {
      data: data
    });
    this.dialogRef.updateSize('100%','100%');
  }

  openCreateDialog() {
    this.dialogRef = this.dialog.open(SettingsAlertPopupComponent, {
      data: {
        alert: null
      }
    });
    this.dialogRef.updateSize('100%','100%');
  }

  openTools() {
    this.router.navigate(['/settings/tools']);
  }
}
