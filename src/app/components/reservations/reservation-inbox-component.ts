import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BookingGuest} from "../../models/booking-guest";
import {ReservationAddGuestCardComponent} from "./reservation-add-guest-card";
import {StayDuvetService} from "../../services/stayduvet";
import {MatDialog, MatDialogRef} from "@angular/material";
import {Booking} from "../../models/booking";
import {
  getBookingById,
  getBookings, getIsMessagesLoadedByThreadId, getIsMessagesLoadingByThreadId, getIsShowingById, getMessagesByThreadId,
  State
} from "../../reducers/index";
import {Store} from "@ngrx/store";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {Message} from "app/models/message";
import {Observable} from "rxjs/Observable";
import {isNullOrUndefined} from 'util';
import {Thread} from "app/models/thread";


@Component({
  selector: 'sd-reservation-inbox',
  template: `

    <div id="chat" *ngIf="messagesLoaded" fxLayout="row" fxLayoutAlign="end end">
      <button mat-button (click)="openInbox()">Go to Inbox
        <mat-icon>
          arrow_forward
        </mat-icon>
      </button>

    </div>
    <div fxLayout="column" fxLayoutAlign="center stretch"
         class="chat-section test-card requiredHeight frame">
      <div *ngIf="messagesLoading && !messageLoadingFailed" fxLayoutAlign="center center" fxFlex="80%">
        <mat-spinner color="accent" [diameter]="30" [strokeWidth]="4"></mat-spinner>
      </div>
      <div *ngIf="messageLoadingFailed" fxLayoutAlign="center center" fxFlex="80%">
        <mat-icon>error_outline</mat-icon>
        <span>The thread doesn't exist.</span>
      </div>
      <div id="chat" *ngIf="messagesLoaded" fxFlex="100%">

        <sd-message [messages]="messages" [thread]="thread"></sd-message>
      </div>
    </div>
  `,
  styles: [`
    .chat-section {
      height: 100%;
    }

    .frame {
      max-height: 100vh;
      overflow: hidden;
      min-width: -webkit-calc(100% - 220px);
      min-width: -moz-calc(100% - 220px);
      min-width: calc(100% - 220px);
      display: table;
    }

    .dynamicHeight {
      display: table-cell;
      height: auto;
    }

  `]
})

export class ReservationInboxComponent implements OnInit, OnDestroy {


  reservation: Booking;
  private isAlive: boolean = true;
  messagesLoading = false;
  messagesLoaded = false;
  messageLoadingFailed = false;
  messages: Message[] = [];
  thread: Thread;

  constructor(private service: StayDuvetService, private store: Store<State>, private dialog: MatDialog, private router: ActivatedRoute, private route: Router) {

  }

  ngOnInit(): void {
    this.router.parent.params.subscribe(params => {
      const reservationId = +params['id'];
      this.store.select((state) => {
        return getBookingById(state, reservationId);
      }).takeWhile(() => this.isAlive).subscribe((booking) => {
        console.log(booking);
        if (!isNullOrUndefined(booking) ) {
          this.reservation = booking;
          this.loadThread();
        }
      });

    });
  }


  ngOnDestroy(): void {
    this.isAlive = false;
  }

  loadThread() {
    this.service.getThreadBetweenGuestAndOwner({
      guest_id: this.reservation.guest_id,
      owner_id: this.reservation.owner_id
    }).subscribe(thread => {
      this.thread = thread;
      if (!isNullOrUndefined(this.thread)) {
        this.loadMessages();
      }else{
        this.messageLoadingFailed = true;
      }
    });
  }

  loadMessages() {
    this.messageLoadingFailed = false;

    this.store.select((state) => {
      return getIsMessagesLoadingByThreadId(state, this.thread.id);
    }).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.messagesLoading = loading;
    });

    this.store.select((state) => {
      return getIsMessagesLoadedByThreadId(state, this.thread.id);
    }).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.messagesLoaded = loaded;
    });

    this.store.select((state) => {
      return getMessagesByThreadId(state, this.thread.id);
    }).takeWhile(() => this.isAlive).subscribe((messages) => {
      this.messages = messages;


    });

    const messagesCombined = Observable.merge(
      this.store.select((state) => {
        return getIsMessagesLoadingByThreadId(state, this.thread.id);
      }),
      this.store.select((state) => {
        return getIsMessagesLoadedByThreadId(state, this.thread.id);
      }),
      this.store.select((state) => {
        return getMessagesByThreadId(state, this.thread.id);
      }),
      ((loading, loaded, threads) => {
      })
    );

    messagesCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.messagesLoading && !this.messagesLoaded) {
          this.service.getMessagesForThread(this.thread.id).subscribe();
        }
      }
    );
  }

  openInbox() {

    this.route.navigate(['/inbox/', this.thread.id]);

  }
}
