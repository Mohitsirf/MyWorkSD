/**
 * Created by divyanshu on 04/09/17.
 */

import {Component, Inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {getListings, State} from '../../../reducers/index';
import {Store} from '@ngrx/store';
import {Listing} from '../../../models/listing';
import {Alert} from '../../../models/alert';
import {
  getAllTimeDenominations, getAllAlertTypes,
  getAllAlertOffsetReferences, getAllOffsetPositions, getAllSendVias, getContactMaintenanceCatagoryTypes
} from '../../../utils';
import {StayDuvetService} from '../../../services/stayduvet';
import {isNullOrUndefined, isNumber} from 'util';

@Component({
  selector: 'sd-setting-check-in-instructions-popup',
  template: `
    <sd-modal-popup-layout title="{{popUpTitle}}">
      <div fxLayout="column" fxLayoutGap="20px">
        <div fxLayoutAlign="space-between center">
          <div fxLayoutAlign="start center">
            <span class="title">Hook &nbsp;</span>
          </div>
          <div fxLayoutAlign="start center" fxLayoutGap="10px">
            <span style="text-align: center">Enabled</span>
            <mat-slide-toggle [(ngModel)]="isAvailable"></mat-slide-toggle>
          </div>
        </div>
        <hr class="fullWidth colorLight">
        <div fxLayout="column" class="container-box" style="padding-bottom: 20px">
          <span class="bolder">Internal Name</span>
          <mat-form-field class="fullWidth" dividerColor="accent">
            <input matInput [(ngModel)]="title">
          </mat-form-field>
          <mat-error *ngIf="titleError" style="font-size: x-small; margin-top: -20px;">This field is required
          </mat-error>
        </div>

        <div fxLayoutAlign="start center" fxLayoutGap="10px" class="container-box">
          <span class="bolder">Send a message via</span>
          <mat-form-field style="width: 300px;">
            <mat-select
              color="accent"
              floatPlaceholder="never"
              [(ngModel)]="sendVia"
              [ngModelOptions]="{standalone: true}"
            >
              <mat-option *ngFor="let sendVia of getAllSendVias" [value]="sendVia.slug">
                {{sendVia.title}}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div fxLayoutAlign="start center" fxLayoutGap="10px" class="container-box">
          <span class="bolder">Schedule to &nbsp;</span>
          <div class="tenwidth">
            <mat-form-field>
              <input type="number" matInput [(ngModel)]="timeValue">
            </mat-form-field>
            <mat-error *ngIf="timeError" style="font-size: x-small; margin-top: -20px;">Required</mat-error>
          </div>
          <mat-form-field>
            <mat-select [(ngModel)]="timeDenomination">
              <mat-option *ngFor="let denomination of getAllTimeDenominations" [value]="denomination.slug">
                {{denomination.title}}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field>
            <mat-select [(ngModel)]="offsetPosition">
              <mat-option *ngFor="let position of getAllOffsetPositions" [value]="position.slug">
                {{position.title}}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field>
            <mat-select [(ngModel)]="offsetReference">
              <mat-option *ngFor="let reference of getAllAlertOffsetReferences" [value]="reference.slug">
                {{reference.title}}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div fxLayout="column" fxLayoutGap="10px" class="container-box">
          <div fxLayoutAlign="start center" fxLayoutGap="10px">
            <span class="bolder">To:</span>
            <mat-form-field style="width: 30%;">
              <mat-select [(ngModel)]="to">
                <mat-option *ngFor="let item of options" [value]="item.slug">{{item.title}}</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div fxLayout="column" fxLayoutGap="5px">
            <span class="bolder">Message</span>
            <textarea class="container-box" style="padding: -10px" rows="8" [(ngModel)]="message">
            
          </textarea>
            <mat-error *ngIf="messageError" style="font-size: x-small;">This field is required</mat-error>

            <span style="color: #2d7cff;font-size: 13px" fxFlexAlign="end">Learn more about variables</span>
          </div>
        </div>

        <hr class="fullWidth colorLight">

        <div fxLayout="column" fxLayoutGap="10px">
          <span class="bolder">This information is relevant for these Listings:</span>
          <div fxLayout="column">
            <mat-form-field style="width: 300px;">
              <mat-select
                color="accent"
                floatPlaceholder="never"
                [(ngModel)]="alertType"
                [ngModelOptions]="{standalone: true}"
                placeholder="Apply For">
                <mat-option *ngFor="let alertType of getAllAlertTypes" [value]="alertType.slug">
                  {{alertType.title}}
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>
          <div fxLayout="column">
            <mat-form-field style="width: 300px;">
              <mat-select
                multiple
                color="accent"
                floatPlaceholder="never"
                [(ngModel)]="propertyIds"
                [ngModelOptions]="{standalone: true}"
                placeholder="Listings to apply to">
                <mat-option *ngFor="let listing of listings" [value]="listing.id">
                  {{listing.title}}
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </div>

        <hr class="fullWidth colorLight">

        <div fxLayoutAlign="end center" fxLayoutGap="10px">
          <mat-spinner *ngIf="isUpdating" [diameter]="30" [strokeWidth]="4"></mat-spinner>
          <button mat-raised-button *ngIf="openForEdit" [disabled]="isUpdating" (click)="deleteAlert()" color="warn">
            Delete
          </button>
          <div fxFlexAlign="end" fxLayoutAlign="center end" fxLayout="row" fxLayoutGap="10px">
            <button mat-raised-button
                    fxFlexAlign="end"
                    color="accent"
                    *ngIf="openForEdit"
                    [disabled]="isUpdating"
                    (click)="updateAlert()">
              Update
            </button>
            <button mat-raised-button
                    fxFlexAlign="end"
                    color="accent"
                    *ngIf="!openForEdit"
                    [disabled]="isUpdating"
                    (click)="createAlert()">
              Create
            </button>
          </div>
        </div>
      </div>
    </sd-modal-popup-layout>
  `,
  styles: [`

    mat-spinner {
      width: 24px;
      height: 24px;
    }

    .fullWidth {
      width: 100%;
    }

    .tenwidth {
      width: 10%;
    }

    textarea {
      resize: none;
    }

    .colorLight {
      color: #c8c8c8;
    }

    .title {
      font-size: 20px;
      font-style: bolder;
    }

    .bolder {
      font-weight: bolder;
      font-size: 20px;
    }

    .container-box {
      border-style: solid;
      border-width: 0.1px;
      padding: 5px;
      border-color: #c8c8c8
    }

  `]
})
export class SettingsAlertPopupComponent implements OnInit {

  listings: Listing[];

  alertId: number;
  title: string = 'New Hook';

  offsetPosition: string = 'before';
  offsetReference: string = 'check_in';

  message: string = '';
  alertType: string = 'include';
  propertyIds: number[] = [];

  sendVia: string = 'booking_channel';
  isAvailable: boolean = true;

  to: string = 'guest';


  timeValue: number = 0;
  timeDenomination: string = 'day';

  openForEdit: boolean;

  titleError: boolean = false;
  timeError: boolean = false;
  messageError: boolean = false;


  getAllTimeDenominations;
  getAllOffsetPositions;
  getAllAlertOffsetReferences;
  getAllAlertTypes;
  getAllSendVias;

  isUpdating = false;

  popUpTitle = 'Create New Hook';

  options = [
    ...getContactMaintenanceCatagoryTypes(),
    {
      title: 'Owner',
      slug: 'owner'
    },
    {
      title: 'Guest',
      slug: 'guest'
    }
  ];

  constructor(private router: Router,
              private dialog: MatDialog,
              private service: StayDuvetService,
              private store: Store<State>,
              @Inject(MAT_DIALOG_DATA) private data: AlertPopupData) {

    this.getAllTimeDenominations = getAllTimeDenominations();
    this.getAllOffsetPositions = getAllOffsetPositions();
    this.getAllAlertOffsetReferences = getAllAlertOffsetReferences();
    this.getAllAlertTypes = getAllAlertTypes();
    this.getAllSendVias = getAllSendVias();

    const alert = data.alert;
    if (alert) {
      this.alertId = alert.id;
      this.title = alert.title;
      this.popUpTitle = alert.title;

      this.offsetPosition = alert.offset_position;
      this.offsetReference = alert.offset_reference;

      this.message = alert.message;
      this.alertType = alert.alert_type;
      this.propertyIds = alert.property_ids;
      this.sendVia = alert.send_via;
      this.isAvailable = alert.is_active;
      this.to = alert.to;

      const seconds = +alert.offset;

      if (seconds % 86400 === 0) {
        this.timeValue = seconds / 86400;
        this.timeDenomination = 'day';
      } else if (seconds % 3600 === 0) {
        this.timeValue = seconds / 3600;
        this.timeDenomination = 'hour';
      } else if (seconds % 60 === 0) {
        this.timeValue = seconds / 60;
        this.timeDenomination = 'minute';
      } else {
        this.timeValue = seconds;
        this.timeDenomination = 'second';
      }

      this.openForEdit = true;
    } else {
      this.openForEdit = false;
    }
  }

  ngOnInit() {
    this.store.select(getListings).subscribe((listings) => {
      this.listings = listings.sort((a: Listing, b: Listing) => {
        if (a.title > b.title) {
          return 1;
        }
        if (a.title < b.title) {
          return -1;
        }
        return 0;
      });
      console.log(listings);
    });
  }

  updateAlert() {
    if (!this.validate()) {
      return;
    }
    this.isUpdating = true;
    this.service.updateAlert(this.alertId, this.createData()).subscribe((success) => {
      this.isUpdating = false;
      this.closePopupClicked();
    }, () => {
      this.isUpdating = false;
    });
  }

  deleteAlert() {
    this.isUpdating = true;
    this.service.deleteAlert(this.alertId).subscribe((success) => {
      this.isUpdating = false;
      this.closePopupClicked();
    }, () => {
      this.isUpdating = false;
    });
  }

  createAlert() {
    if (!this.validate()) {
      return;
    }
    this.isUpdating = true;
    this.service.createAlert(this.createData()).subscribe((success) => {
      this.isUpdating = false;
      this.closePopupClicked();
    }, () => {
      this.isUpdating = false;
    });
  }

  private validate() {

    this.titleError = false;
    this.timeError = false;
    this.messageError = false;

    if (isNullOrUndefined(this.title) || this.title.trim() == '') {
      this.titleError = true;
      return false;
    }

    if (isNullOrUndefined(this.timeValue)) {
      this.timeError = true;
      return false;
    }

    if (isNullOrUndefined(this.message) || this.message.trim() == '') {
      this.messageError = true;
      return false;
    }

    this.titleError = false;
    this.timeError = false;
    this.messageError = false;

    return true;
  }

  private createData(): any {
    const data = {};
    data['title'] = this.title;
    data['offset_position'] = this.offsetPosition;
    data['offset_reference'] = this.offsetReference;
    data['message'] = this.message;
    data['alert_type'] = this.alertType;
    data['to'] = this.to;

    console.log(data);


    if (this.propertyIds.length === this.listings.length && this.alertType === 'include') {
      data['property_ids'] = [];
      data['alert_type'] = 'exclude';
    } else {
      data['property_ids'] = this.propertyIds;
    }

    data['send_via'] = this.sendVia;
    data['is_active'] = this.isAvailable;

    let offset;
    if (this.timeDenomination === 'day') {
      offset = this.timeValue * 86400;
    } else if (this.timeDenomination === 'hour') {
      offset = this.timeValue * 3600;
    } else if (this.timeDenomination === 'minute') {
      offset = this.timeValue * 60;
    } else {
      offset = this.timeValue;
    }
    data['offset'] = offset;

    return data;
  }

  closePopupClicked() {
    this.dialog.closeAll();
  }
}


export interface AlertPopupData {
  alert: Alert;
}
