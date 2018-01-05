import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Message} from '../../models/message';
import {Thread} from '../../models/thread';
import {StayDuvetService} from '../../services/stayduvet';
import {MatDialog, MatDialogRef} from '@angular/material';
import {MessageSpecialOfferPopupComponent} from '../message-special-offer';
import {User} from '../../models/user';
import {getAdmins, State} from '../../reducers/index';
import {Store} from '@ngrx/store';
import {isNullOrUndefined} from 'util';
import * as moment from "moment";
import {TimeAgoPipe} from "../../pipes/time-ago";

@Component({
  selector: 'sd-message',
  template: `
    <div class="chat-container test-card">
      <div class="chat">
        <ul>
          <div *ngFor="let message of messages">
            <li *ngIf="!message.is_preapproval && !message.offer"
                [ngClass]="{'guest': message.type ==='incoming', 'owner': message.type ==='outgoing'}">
              <a class="user"><img 
                onerror="this.src='/assets/images/avatar-placeholder.png'" 
                [src]="getImage(message.type)"/></a>
              <div class="date">
                {{message.sent_on | timeAgo }}
              </div>
              <div class="sender_name" *ngIf="message.type ==='outgoing' && !adminLoading">
                 <div>{{getSendersName(message)}} ({{getMessageSource(message)}})</div>
              </div>
              <div class="message" *ngIf="message.source ==='email'" [innerHtml]="message.content">
              </div>
              <div class="message" *ngIf="message.source !=='email'">
                <p style="width: 95%;line-height: 150%">{{ message.content | html }}</p>
              </div>
            </li>
            <div *ngIf="message.is_preapproval || message.offer" class="airbnb-alert" fxLayout="row" fxLayoutAlign="space-around center" fxLayoutGap="5px">
              <div fxFlex="23%">
                <hr/>
              </div>
              <div fxFlex="50%" style="text-align: center;">
                <span *ngIf="message.is_preapproval"
                      class="airbnb-alert-text">PRE APPROVED ON: {{ message.getOffer().start_date | date:'MMM, dd' }}</span>
                <span *ngIf="!message.is_preapproval" 
                      class="airbnb-alert-text">SPECIAL OFFER: \${{ message.getOffer().price_per_night | roundOff }}/PER-NIGHT</span>
              </div>
              <div fxFlex="23%">
                <hr/>
              </div>
            </div>
          </div>
        </ul>
      </div>
      <div class="action-container" *ngIf="thread.airbnb_thread_id && !thread?.inquiry_action_taken && !thread?.reservation_request" fxLayout="row" fxLayoutAlign="center center">
        <mat-card class="generalCard">
          <mat-card-title>
            <span style="font-size: 15px; font-weight: bolder; text-space: 1px;">
              Invite {{ thread?.getGuest().first_name }} to book by pre-approving this trip.
            </span>
          </mat-card-title>
          <mat-card-content>
            <p>Your calendar is still open until the guest books</p>
          </mat-card-content>
          <mat-card-actions>
            <div fxLayout="row" fxLayoutAlign="space-around center">
              <button mat-button (click)="preApprove()">Pre-approve</button>
              <button mat-button (click)="decline()" [color]="'warn'">Decline</button>
              <button mat-button (click)="specialOffer()" [color]="'accent'">Send Special Offer</button>
            </div>
          </mat-card-actions>
          <mat-card-footer>
            <mat-progress-bar *ngIf="airbnbActionLoading" mode="indeterminate"></mat-progress-bar>
          </mat-card-footer>
        </mat-card>
      </div>
      <div class="action-container" *ngIf="thread.airbnb_thread_id && thread?.reservation_request" fxLayout="row" fxLayoutAlign="center center">
        <mat-card class="generalCard">
          <mat-card-title>
            <span class="no-bold-height">
              {{ thread?.getGuest().first_name }} has requested to book.
            </span>
            <br>
            <span class="no-bold-height">
              {{ thread?.getBooking()?.start }} -> {{ thread?.getBooking().end }}
            </span>
          </mat-card-title>
          <mat-card-content>
            <p>Would you like to accept/decline the booking request?</p>
          </mat-card-content>
          <mat-card-actions>
            <div fxLayout="row" fxLayoutAlign="space-around center">
              <button mat-button (click)="acceptBookingRequest()">Accept</button>
              <button mat-button (click)="declineBookingRequest()" [color]="'warn'">Decline</button>
            </div>
          </mat-card-actions>
          <mat-card-footer>
            <mat-progress-bar *ngIf="airbnbActionLoading" mode="indeterminate"></mat-progress-bar>
          </mat-card-footer>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`

    .action-container {
      width: 98%;
      margin: 10px;
    }

    span {
      font-size: 18px !important;
      font-weight: bold !important;
      color: #364f66 !important;
    }

    hr {
      width: 100%;
      color: #0A253E;
    }

    .airbnb-alert {
      margin-top: 10px;
      margin-bottom: 10px;
    }

    .airbnb-alert-text {
      font-size: 14px;
      font-weight: bolder;
    }

    .message {
      min-height: 45px;
      white-space: pre-line;
    }

    body {
      background-color: #f3f3f3;

    }

    .chat-container {
      background-color: #fff;
      padding: 5px;
      overflow-x: hidden !important;
    }

    .chat ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .chat ul li {
      margin: 45px 0 0 0;
      font-weight: 300;
    }

    .chat ul li a.user {
      margin: -30px 0 0 0;
      display: block;
      color: #333;
    }

    .chat ul li a.user img {
      width: 65px;
      height: 65px;
      border-radius: 50%;
      background-color: #f3f3f3;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    }

    .chat ul li .date {
      font-size: 14px;
      color: #a6a6a6;
    }

    .chat ul li .sender_name {
      font-size: 14px;
      color: #373737;
    }

    .chat ul li .message {
      color: #000000;
      display: block;
      padding: 10px;
      position: relative;
      font-size: 15px;
      border-radius: 3px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      background-color: #ffffff;
    }

    .chat ul li .message:before {
      content: '';
      position: absolute;
      border-top: 16px solid rgba(0, 0, 0, 0.15);
      border-left: 16px solid transparent;
      border-right: 16px solid transparent;
    }

    .chat ul li .message:after {
      content: '';
      position: absolute;
      top: 0;
      border-left: 17px solid transparent;
      border-right: 17px solid transparent;
      border-top: 17px solid #ffffff;
    }

    .chat ul li .message.blur p {
      -webkit-filter: blur(3px);
      -moz-filter: blur(3px);
      -o-filter: blur(3px);
      -ms-filter: blur(3px);
      filter: blur(3px);
    }

    .chat ul li .message.blur .hider {
      opacity: 1;
      z-index: 1;
    }

    .chat ul li .message p {
      margin: 0;
      padding: 0;
      transition: all 0.1s;
    }

    .chat ul li .message .hider {
      opacity: 0;
      z-index: -1;
      position: absolute;
      height: 100%;
      width: 100%;
      margin: -10px;
      text-align: center;
      cursor: pointer;
      transform-style: preserve-3d;
      transition: all 0.1s;
    }

    .chat ul li .message .hider span {
      display: block;
      position: relative;
      top: 50%;
      font-size: 16px;
      transform: translateY(-50%);
    }

    .chat ul li.guest a.user {
      float: right;
    }

    .chat ul li.guest .date {
      float: right;
      margin: -20px 10px 0 0;
    }

    .chat ul li.guest .message {
      margin: 0 90px 0 0;
    }

    .chat ul li.guest .message:before {
      margin: -9px -16px 0 0;
      right: 0;
    }

    .chat ul li.guest .message:after {
      content: '';
      right: 0;
      margin: 0 -15px 0 0;
    }

    .chat ul li.owner a.user {
      float: left;
    }

    .chat ul li.owner .date {
      float: left;
      margin: -20px 0 0 10px;
    }

    .chat ul li.owner .sender_name {
      float: right;
      margin: -20px 10px 0 0;
    }

    .chat ul li.owner .message {
      margin: 0 0 0 90px;
    }

    .chat ul li.owner .message:before {
      margin: -9px 0 0 -16px;
      left: 0;
    }

    .chat ul li.owner .message:after {
      content: '';
      left: 0;
      margin: 0 0 0 -15px;
    }
  `]
})
export class MessagesDisplayComponent implements OnInit, OnDestroy {

  defaultImage = '/assets/images/avatar-placeholder.png';

  airbnbActionLoading = false;

  isAlive = true;

  admins: { [id: number]: String } = {};
  adminLoading = true;

  @Input() messages: Message[];
  @Input() thread: Thread;

  private dialogRef: MatDialogRef<any>;

  constructor(private service: StayDuvetService,
              private dialog: MatDialog,
              private store: Store<State>) {
  }

  ngOnInit(): void {
    console.log('OnInit chat-container');
    this.loadAdmins();
    console.log(this.thread);
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  loadAdmins() {
    this.adminLoading = true;
    this.store.select(getAdmins).takeWhile(() => this.isAlive).subscribe((admins) => {
      for (let i = 0; i < admins.length; i++) {
        this.admins[admins[i].id] = admins[i].getFullName();
      }

      this.adminLoading = false;
    });
  }

  preApprove() {
    this.airbnbActionLoading = true;
    this.service.preApproveThread(this.thread.id).subscribe((success) => {
      this.airbnbActionLoading = false;
    });
  }

  decline() {
    this.airbnbActionLoading = true;
    this.service.declineThread(this.thread.id).subscribe((success) => {
      this.airbnbActionLoading = false;
    });
  }

  specialOffer() {
    this.dialogRef = this.dialog.open(MessageSpecialOfferPopupComponent);
    const instance = this.dialogRef.componentInstance;
    instance.thread = this.thread;
    this.dialogRef.updateSize('100%');
  }

  getImage(type: string): string {

    if (type ==='incoming') {
      const guest = this.thread.getGuest();

      if (isNullOrUndefined(guest)) {
        return this.defaultImage;
      }

      return guest.pic_thumb_url;
    } else {
      const account = this.thread.getAccount();

      if (isNullOrUndefined(account)) {
        return this.defaultImage;
      }

      return account.pic_thumb_url;
    }
  }

  getSendersName(message: Message) {
    if (isNullOrUndefined(message.sender_id)) {
      return '';
    } else {
      return this.admins[message.sender_id];
    }
  }

  getMessageSource(message: Message)
  {
    if (message.automated) {
      return 'Automated';
    }

    if (message.source === 'airbnb') {
      return 'From Airbnb';
    }

    if (message.source === 'email') {
      return 'From Email';
    }

    if (message.source === 'message') {
      return 'From Text';
    }
  }



  acceptBookingRequest() {
    //
  }

  declineBookingRequest() {
    //
  }
}
