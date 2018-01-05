import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {StayDuvetService} from '../../services/stayduvet';
import {Thread} from '../../models/thread';
import {SavedMessage} from '../../models/saved-message';
import {getIsSavedMessagesLoaded, getIsSavedMessagesLoading, getSavedMessages, State} from "../../reducers/index";
import {Observable} from "rxjs/Observable";
import {Store} from "@ngrx/store";
import {isNullOrUndefined} from "util";
import {BookingNotesPopupComponent} from "../reservations/popups/update-booking-notes";
import {MatDialog} from "@angular/material";
import {User} from "../../models/user";

@Component({
  selector: 'sd-response-card',
  template: `
    <div fxLayout="column" class="border-visible">
      <div fxLayoutAlign="space-between center">

        <mat-tab-group class="full-width" [disableRipple]="true" [dynamicHeight]="true" #tabGroup>
          <mat-tab *ngIf="isAirbnbEnabled" class="label2" label="AIRBNB">
            <sd-message-box (text)="textChanged($event)" [textModel]="text"></sd-message-box>
          </mat-tab>
          <mat-tab *ngIf="isEmailEnabled" label="EMAIL">
            <sd-email-box (subject)="subjectChanged($event)" (text)="textChanged($event)" [subjectModel]="subject"
                          [textModel]="text"></sd-email-box>
          </mat-tab>
          <mat-tab *ngIf="isPhoneEnabled" label="SMS">
            <sd-message-box (text)="textChanged($event)" [textModel]="text"></sd-message-box>
          </mat-tab>

          <!--<mat-tab label="NOTES">-->
          <!--<div class="card"  fxLayout="column" (click)="openNotes()">-->
          <!--<span>{{selectedThread?.getBooking()?.booking_notes || 'Enter your booking note here...'}}</span>-->
          <!--</div>-->
          <!--</mat-tab>-->

        </mat-tab-group>
      </div>


      <div fxLayout="column" fxLayoutAlign="center center" style="padding-top: 20px; padding-bottom: 10px;"
           *ngIf="!isAirbnbEnabled && !isEmailEnabled && !isPhoneEnabled">
        <span style="font-size: small">No channel exist for communication.</span>
      </div>
      <mat-error *ngIf="showError" style="font-size: x-small; margin-left: 10px;">The {{errorField}} field is
        required.
      </mat-error>


      <div fxLayout="row" fxLayoutAlign="end center" fxLayoutGap="10px">
        <div fxLayout="row" fxLayoutAlign="start center" fxFlex="start">
          <mat-radio-button
            matTooltip="Mark For Followup"
            *ngIf="!isMarkingForFollowup"
            [checked]="selectedThread.is_marked_for_followup"
            (click)="alterArchived()">
          </mat-radio-button>
          <span *ngIf="!isMarkingForFollowup" style="font-size: small;">Mark for Follow-up</span>
          <div fxLayoutAlign="center center">
            <mat-spinner *ngIf="isMarkingForFollowup" color="accent" [diameter]="30" [strokeWidth]="4"></mat-spinner>
          </div>
        </div>

        <div fxFlex="40%" fxLayoutAlign="start center">
          <mat-form-field fxFill>
            <mat-select
              placeholder="Canned Response"
              floatPlaceholder="never"
              [(ngModel)]="savedResponse"
              (ngModelChange)="savedResponseSelected()"
              color="accent"
              [ngModelOptions]="{standalone: true}">
              <mat-option *ngFor="let savedResponse of savedResponses" [value]="savedResponse">
                {{savedResponse.title}}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        <div fxLayout="row" fxLayoutAlign="start center">
          <mat-spinner color="accent" *ngIf="sending" [diameter]="30" [strokeWidth]="4"></mat-spinner>
          <button mat-raised-button [disabled]="sending || !isAirbnbEnabled && !isEmailEnabled && !isPhoneEnabled"
                  color="accent" class="margin-10left" (click)="sendMessage()">send
          </button>
        </div>
      </div>
    </div>

  `,
  styles: [`

    #options {
      height: 50px;
    }

    #text {
      height: 70px;
    }

    .border-visible {
      border-width: 1px;
      border-style: solid gray;
      padding-bottom: 10px;
    }

    .margin-10left {
      margin-left: 10px;
    }

    .full-width {
      width: 100%;
    }

    /deep/ .mat-tab-label {
      line-height: 38px !important;
      height: 38px !important;
    }

    /deep/ .mat-ink-bar {
      background-color: #194267 !important;
      height: 5px !important;
    }

    /deep/ .mat-tab-label {
      opacity: 1 !important;
      font-weight: bold;
    }

    .card {
      background: -webkit-linear-gradient(top, #ffffff 0%, #ffffff 100%); /* Chrome10+,Safari5.1+ */;
      padding: 10px !important;
      font-family: 'Roboto', sans-serif;
      font-size: x-small;
      white-space: pre-line;
      color: gray;
      display: flex;
      height: auto;
      flex-direction: column-reverse;
      overflow: scroll;
      overflow-x: hidden !important;
      cursor: pointer;
      max-height: 250px;
    }

  `]
})

export class ResponseCardComponent implements OnInit, OnChanges {

  @ViewChild('tabGroup') tabGroup;
  isMarkedForFollowup;
  isMarkingForFollowup = false;

  savedResponse: SavedMessage;
  savedResponses: SavedMessage[] = [];

  isLoading = false;
  isLoaded = false;
  private isAlive = true;
  listingId;


  text = '';
  subject = 'Hi!';
  sending = false;
  errorField = 'message';
  tabs: { title: string, url: string, slug: string }[] = [
    {title: 'AIRBNB', url: 'airbnb', slug: 'airbnb'},
    {title: 'EMAIL', url: 'email', slug: 'email'},
    {title: 'SMS', url: 'sms', slug: 'sms'},
  ];

  @Input() selectedThread: Thread;


  showError = false;

  isAirbnbEnabled = true;
  isEmailEnabled = true;
  isPhoneEnabled = true;
  guest: User;

  constructor(private service: StayDuvetService, private store: Store<State>, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    console.log('onInit ');
    this.guest = this.selectedThread.getGuest();

    if (this.guest['guest']['data'].source != 'airbnb') {
      this.isAirbnbEnabled = false;
    }

    if (isNullOrUndefined(this.guest.email) || this.guest.email.trim() == '') {
      this.isEmailEnabled = false;
    }

    if (isNullOrUndefined(this.guest.phone_number) || this.guest.phone_number.trim() == '') {
      this.isPhoneEnabled = false;
    }


  }

  ngOnChanges(changes: SimpleChanges): void {
    this.listingId = this.selectedThread.getBooking().property_id;
    this.setUpSavedMessages();
  }


  textChanged(newText: string) {
    this.text = newText;
    this.showError = false;
  }

  subjectChanged(newText: string) {
    this.subject = newText;
    this.showError = false;
  }

  sendMessage() {

    if (isNullOrUndefined(this.text) || this.text.trim() == '') {
      this.showError = true;
      this.errorField = 'message';
      return;
    }

    const selectedTab = this.tabs[this.tabGroup.selectedIndex];
    switch (selectedTab.slug) {
      case 'airbnb': {
        this.sending = true;
        this.service.sendAirbnbMessage({content: this.text}, this.selectedThread.id).subscribe((success) => {
          this.sending = false;
          this.text = '';
        }, err => {
          this.sending = false;
        });
        break;
      }
      case 'email': {
        if (isNullOrUndefined(this.subject) || this.subject.trim() == '') {
          this.showError = true;
          this.errorField = 'subject';
          return;
        }

        this.sending = true;


        let data = {content: this.text, subject: this.subject};
        this.service.sendEmailMessage(data, this.selectedThread.id).subscribe(() => {
          this.sending = false;
          this.text = '';
          this.subject = 'Hi!'
        }, err => {
          this.sending = false;
        });
        break;
      }
      case 'sms': {
        this.sending = true;
        this.service.sendSMSMessage({content: this.text}, this.selectedThread.id).subscribe(() => {
          this.sending = false;
          this.text = '';
        }, err => {
          this.sending = false;
        });
        break;
      }
      default: {
        break;
      }
    }
  }

  savedResponseSelected() {
    this.text = this.savedResponse.message;
  }

  alterArchived() {
    this.isMarkingForFollowup = true;
    this.service.updateThread(this.selectedThread, {is_marked_for_followup: !this.selectedThread.is_marked_for_followup}).subscribe((thread) => {
      this.isMarkingForFollowup = false;
    });
  }


  setUpSavedMessages() {

    this.store.select(getSavedMessages).takeWhile(() => this.isAlive).subscribe((messages) => {
      if (messages.length > 0) {
        this.savedResponses = messages.filter(message => {
          if (!isNullOrUndefined(message.property_ids)) {
            return message.property_ids.includes(this.listingId)
          } else {
            return false;
          }
        });
      }

    });

    this.store.select(getIsSavedMessagesLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.isLoading = loading;
    });

    this.store.select(getIsSavedMessagesLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.isLoaded = loaded;
    });

    const upcomingCombined = Observable.merge(
      this.store.select(getSavedMessages),
      this.store.select(getIsSavedMessagesLoading),
      this.store.select(getIsSavedMessagesLoaded),
      ((tasks, loading, loaded) => {
      })
    );

    upcomingCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.isLoaded && !this.isLoading) {
          this.service.getSavedMessages().subscribe();
        }
      }
    );
  }

  openNotes() {
    const dialogRef = this.dialog.open(BookingNotesPopupComponent, {
      data: this.selectedThread.getBooking()
    });
    dialogRef.updateSize('100%');
  }


  ngOnDestroy(): void {
    this.isAlive = false;
  }

}
