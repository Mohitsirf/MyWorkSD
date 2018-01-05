/**
 * Created by aditya on 24/8/17.
 */
import {Component, OnDestroy, OnInit, Input} from '@angular/core';
import {FormGroup, Validators, FormControl} from "@angular/forms";
import {ActivatedRoute, Router} from '@angular/router';
import {
  getActiveContacts, getIsActiveContactLoaded, getIsActiveContactLoading, getListings,
  State
} from '../../reducers/index';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {StayDuvetService} from '../../services/stayduvet';
import {Subscription} from 'rxjs/Subscription';
import {
  getContactMaintenanceCatagoryTypes, getContactMethodType, getContactMethodTypes} from '../../utils';
import {isNullOrUndefined} from "util";
import {Listing} from "../../models/listing";
import {User} from '../../models/user';
import {ContactLog} from "../../models/contact-log";

@Component({
  selector: 'sd-contact-log-info',
  template: `
    <div style="margin: 20px;">
      <div style="border: 1px solid #cccccc;padding-top:10px">
        <div fxLayout="column" *ngFor="let data of contact?.getLogs()">
          <div fxLayout="row" fxLayoutAlign="space-between center" fxFlex="100%">
            <div fxFlex="20%" style="margin-left:15px">

              <mat-chip-list>
                <mat-chip [ngStyle]="{'background':getColor(data.type)}" 
                  style=" text-align: center;color: white"
                          selected="true">
                  <span style="width: 100%; text-align: center; font-size: xx-small;">
                    <b>{{getStatus(data.type)}}</b>
                  </span>
                </mat-chip>
              </mat-chip-list>

            </div>
            <div fxLayout="row" fxLayoutAlign="space-between center" fxFlex="80%">
              <div style="margin-top:8px" fxFlex="60%">
                <span>{{getDescription(data.meta)}}</span>
              </div>
              <div style="margin-top:8px" fxFlex="20%">
                <span>{{data.created_at | date:'mediumDate'}}</span>
              </div>
            </div>
          </div>
          <div fxLayout="row" fxFlex="100%">
            <hr class="contentBorder">
          </div>
        </div>


        <div *ngIf="contact?.getLogs().length == 0" fxLayout="row" fxLayoutAlign="center"
            fxFlex="100%">
            <h5>No Logs Found</h5>
        </div>

      </div>
    </div>

  `,
  styles: [`

    span {
      font-size: 14px !important;
      font-weight: bold;
    }

    .generalCard {
      background: -webkit-linear-gradient(top, #ffffff 0%, #ffffff 100%); /* Chrome10+,Safari5.1+ */;
      padding: 15px !important;
    }

    .financialsText span {
      font-size: 13px;
    !important;

    }

    .contentBorder {
      border: none;
      /* Set the hr color */
      color: #cccccc; /* old IE */
      background-color: #cccccc; /* Modern Browsers */
      height: 1px;
      width: 100%;
    }

  `]

})

export class ContactLogInfoComponent implements OnInit {


  @Input() contact: User;


  ngOnInit() {


  }

  getColor(type: string) {
    switch (type) {
      case 'created':
        return '#4F8A10';
      case 'updated':
        return '#D17B26';
      case 'listing_added':
        return '#8a7030';
      case 'listing_removed':
        return '#328a70';
    }
  }

  getStatus(type: string) {
    switch (type) {
      case 'created':
        return 'CREATED';
      case 'updated':
        return 'UPDATED';
      case 'listing_added':
        return 'LISTING ADDED';
      case 'listing_removed':
        return 'LISTING REMOVED';
    }
  }

  getDate(meta: string) {
    return JSON.parse(meta).date;
  }

  getDescription(meta: string) {
    return JSON.parse(meta).description;
  }


}


