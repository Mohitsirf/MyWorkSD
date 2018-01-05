import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {StayDuvetService} from '../../services/stayduvet';
import {Store} from '@ngrx/store';
import {ActivatedRoute} from '@angular/router';
import {
  getAdmins,
  getBookingById,
  getBookings, getIsBookingLoaded, getIsBookingLoading, getIsShowedById, getIsShowingById,
  State
} from '../../reducers/index';
import {Observable} from 'rxjs/Observable';
import {Booking} from '../../models/booking';
import {User} from '../../models/user';
import {Listing} from '../../models/listing';
import {MatDialog, MatDialogRef} from '@angular/material';
import {DeductSecurityFeeComponent} from './popups/deduct-security-fee';
import {SecurityDeduction} from '../../models/security-deduction';
import {isNullOrUndefined} from 'util';
import {getCollectionMethodType, getReservationPaymentType} from '../../utils';
import {GenericConfirmationPopupComponent} from '../elements/confirmation-popup';
import {CollectPaymentComponent} from './popups/collect-payment';

@Component({
  selector: 'sd-reservation-financials-card',
  template: `
    <mat-card fxLayout="column" *ngIf="reservationsLoaded" class="financialsCard">

      <span style="color:#194267;font-size: 16px">
        <b>Pay Out Info ({{ getReservationPaymentType(reservation.payment_method).title}})</b>
      </span>
      <div fxLayout="row" style="padding-top: 20px" fxLayoutAlign="space-between" fxFlex="100%">
        <div class="financialsText" fxFlex="50%" style="margin-left:10px">

          <table style="font-size: 14px;letter-spacing:0.5px;border-collapse:separate;border-spacing:5px;">
            <tr>
              <td>ACCOMMODATION FEE</td>
              <td>..........</td>
              <td><b>$\{{ reservation.base_amount | number : '1.2-2'}}</b></td>
            </tr>
            <tr>
              <td>CLEANING FEE</td>
              <td>..........</td>
              <td><b>$\{{ reservation.cleaning_fee | number : '1.2-2'}}</b></td>
            </tr>
            <tr *ngFor="let otherFee of reservation.other_fee" [matTooltip]="otherFee.description">
              <td *ngIf="otherFee.slug === 'pet_fee'">PET FEE</td>
              <td *ngIf="otherFee.slug === 'extra_guest_fee'">EXTRA GUEST FEE</td>
              <td>..........</td>
              <td><b>$\{{ otherFee.amount | number : '1.2-2'}}</b></td>
            </tr>
            <tr>
              <td>SUBTOTAL</td>
              <td>..........</td>
              <td><b>$\{{ reservation.subtotal_amount | number : '1.2-2'}}</b></td>
            </tr>
            <tr *ngIf="reservation.channel_fee && reservation.channel_fee > 0">
              <td *ngIf="reservation.source === 'airbnb'">AIRBNB HOST FEE</td>
              <td *ngIf="reservation.source === 'homeaway'">HomeAway HOST FEE</td>
              <td *ngIf="reservation.source !== 'airbnb' && reservation.source !== 'homeaway'">HOST FEE</td>
              <td>..........</td>
              <td style="color:red"><b>($\{{ reservation.channel_fee | number : '1.2-2'}})</b></td>
            </tr>
            <tr>
              <td colspan="3">
                <div fxFlex="100%" class="border"></div>
              </td>
            </tr>
            <tr>
              <td>TOTAL PAYOUT</td>
              <td>.........</td>
              <td><b>$\{{ reservation.payout_amount | number : '1.2-2'}}</b></td>
            </tr>
            <tr>
              <td colspan="3">
                <div fxFlex="100%" class="border"></div>
              </td>
            </tr>
            <tr></tr>
            <tr>
              <td *ngIf="reservation.source === 'airbnb'">AIRBNB GUEST FEE</td>
              <td *ngIf="reservation.source === 'homeaway'">HomeAway GUEST FEE</td>
              <td *ngIf="reservation.source !== 'airbnb' && reservation.source !== 'homeaway'">GUEST FEE</td>
              <td>..........</td>
              <td style="color:red"><b>($\{{ reservation.guest_channel_fee | number : '1.2-2'}})</b></td>
            </tr>
            <tr *ngIf="reservation.cc_process_fee && reservation.cc_process_fee !== 0">
              <td>CC Process Fee</td>
              <td>..........</td>
              <td style="color:red"><b>($\{{ reservation.cc_process_fee | number : '1.2-2'}})</b></td>
            </tr>
            <tr>
              <td>TAXES</td>
              <td>.........</td>
              <td><b>$\{{ reservation.total_tax | number : '1.2-2'}}</b></td>
            </tr>
          </table>

        </div>
        <div fxFlex="50%">
          <div style="border:0.5px solid gray;border-radius: 3px">
            <table style="font-size: 14px;letter-spacing:0.5px;border-collapse:separate;border-spacing:5px;">

              <tr>
                <td>MANAGEMENT EARNING</td>
                <td>..........</td>
                <td><b>$\{{ (reservation.payout_amount - reservation.owners_revenue) | number : '1.2-2'}}</b></td>
              </tr>
              <tr>
                <td>CLIENT EARNING</td>
                <td>..........</td>
                <td><b>$\{{ reservation.owners_revenue | number : '1.2-2'}}</b></td>
              </tr>

            </table>
          </div>
        </div>
      </div>
      <div fxLayout="row" style="padding-top: 20px" fxFlex="100%">
        <hr class="contentBorder">

      </div>
      <div style="margin-top:20px"></div>
      <span style="color:#194267;font-size: 16px"><b>Payments</b></span>
      
      <div *ngIf="reservation.payments.data.length > 0" class="row" fxLayoutGap="10px">
        <table style="font-size: 14px;letter-spacing:0.5px;border-collapse:separate;border-spacing:5px;width:100%">
          <tr>
            <th fxFlex="10%">Amount</th>
            <th fxFlex="40%">Description</th>
            <th fxFlex="20%">Method</th>
            <th fxFlex="10%">Paid?</th>
            <th fxFlex="20%">Date</th>
          </tr>
          <tr *ngFor="let payment of reservation.payments.data">
            <td style="text-align: center" fxFlex="10%">$\{{payment.amount | number : '1.2-2'}}</td>
            <td style="text-align: center" *ngIf="payment.description" fxFlex="40%">{{payment.description}}</td>
            <td style="text-align: center" *ngIf="!payment.description" style="font-style: italic;" fxFlex="40%">No Description to show.</td>
            <td style="text-align: center" fxFlex="20%">{{getCollectionMethodType(payment.method).title}}</td>
            <td style="text-align: center" fxFlex="10%">{{payment.is_paid ? 'Yes' : 'No'}}</td>
            <td style="text-align: center" fxFlex="20%">{{payment.paid_on | date:'mediumDate'}}</td>
          </tr>
        </table>
      </div>
      
      <span *ngIf="reservation.payments.data.length == 0" style="font-style: italic;font-size: 14px;">
        No Payment(s) to show
      </span>

      <div fxFlex="100%" class="border"></div>

      <div fxLayout="row" style="padding-top: 20px" fxLayoutAlign="space-between" fxFlex="100%">
        <div class="financialsText" fxFlex="50%" style="margin-left:10px">

          <table style="font-size: 14px;letter-spacing:0.5px;border-collapse:separate;border-spacing:5px;">
            <tr style="margin-bottom: 5px;">
              <td>TOTAL PAID</td>
              <td>..........</td>
              <td><b>$\{{ reservation.total_paid | number : '1.2-2'}}</b></td>
            </tr>
            <tr>
              <td>SECURITY DEPOSIT</td>
              <td>..........</td>
              <td><b>$\{{ reservation.security_deposit_fee | number : '1.2-2' }}</b></td>
            </tr>

          </table>

        </div>
        
        <div fxFlex="50%">

          <table style="font-size: 14px;letter-spacing:0.5px;border-collapse:separate;border-spacing:5px;">

            <tr>
              <td>BALANCE DUE</td>
              <td>..........</td>
              <td><b>$\{{ reservation.total_due | number : '1.2-2'}}</b></td>
            </tr>
            <tr *ngIf="reservation.is_refunded">
              <td>REFUNDED AMOUNT</td>
              <td>..........</td>
              <td><b>$\{{reservation.total_refunded | number : '1.2-2'}}</b></td>
            </tr>
            <tr>
              <td>SECURITY DEDUCTED</td>
              <td>..........</td>
              <td><b>$\{{getDeductedTotal() | number : '1.2-2'}}</b></td>
            </tr>

          </table>

        </div>
      </div>
      <div fxLayout="row" fxLayoutAlign="end" fxLayoutGap="10px" style="padding-top: 20px" fxFlex="100%">

        <button class="successButton"
                (click)="openCollectionPopup()"
                mat-button>
          <span class="successSpan"><b>COLLECT A PAYMENT</b></span>
        </button>
        <button class="mediumButton"
                *ngIf="!reservation.airbnb_booking_id && !reservation.is_refunded"
                (click)="openRefundSecurityPopup()"
                mat-button>
          <span class="successSpan"><b>REFUND SECURITY</b></span>
        </button>

      </div>

      <div *ngIf="!reservation.airbnb_booking_id" fxLayout="row" style="padding-top: 20px" fxFlex="100%">
        <hr class="contentBorder">
      </div>
      <div *ngIf="!reservation.airbnb_booking_id" style="margin-top:20px"></div>
      <span *ngIf="!reservation.airbnb_booking_id"
            style="color:#194267;font-size: 16px"><b>Security Deductions</b></span>

      <div *ngIf="!reservation.airbnb_booking_id" fxLayout="row" style="padding-top: 20px" fxLayoutAlign="space-between"
           fxFlex="100%">
        <div class="financialsText" fxFlex="65%" style="margin-left:10px">

          <table style="font-size: 14px;letter-spacing:0.5px;border-collapse:separate;border-spacing:5px;">
            <tr *ngFor="let deduction of reservation.securityDeductions.data; let i = index">
              <td>({{i + 1}})</td>
              <td>{{deduction.created_at | date:'medium'}}</td>
              <td>.....</td>
              <td><b>{{deduction.amount | currency:'USD':true | number : '1.2-2'}}</b></td>
              <td>
                <img style="height: 30px; width: 45px;" src="/assets/images/info_icon.png" alt="info"
                       [matTooltip]="deduction.description">
              </td>
            </tr>

          </table>

        </div>
        <div fxFlex="35%" fxLayoutAlign="end start">

          <button class="successButton" mat-button (click)="openSecurityDeductionDialog()"><span class="successSpan"><b>CREATE A DEDUCTION</b></span>
          </button>

        </div>
      </div>

    </mat-card>
  `,
  styles: [`
    .successSpan {
      color: white;
      letter-spacing: 0.5px;
    }

    .Heading {
      flex: 1 1 5% !important;
    }

    .financialsCard {
      background: -webkit-linear-gradient(top, #ffffff 0%, #ffffff 100%); /* Chrome10+,Safari5.1+ */;
      padding: 15px !important;
    }

    .financialsText span {
      font-size: 13px;
    !important;

    }

    hr {
      border: none;
      /* Set the hr color */
      color: lightgrey; /* old IE */
      background-color: lightgrey; /* Modern Browsers */
    }

    .ThickBorder {
      height: 7px;
    }

    .ThinBorder {
      height: 5px;
    }

    .contentBorder {
      border: none;
      /* Set the hr color */
      color: #737373; /* old IE */
      background-color: #737373; /* Modern Browsers */
      height: 2px;
    }

    .border {
      border: none;
      /* Set the hr color */
      color: #b89094; /* old IE */
      background-color: #b89094; /* Modern Browsers */
      height: 1px;
    }

    .bnbLogo {
      height: 35px;
      width: 35px;
      margin-top: 20px;
    }

    .successSpan {
      color: white;
      letter-spacing: 0.5px;
    }

    .main-container {
      margin-top: 1.5in;
    }

    #text {
      font-size: small;
    }

    #title {
      font-weight: bolder;
      font-size: xx-large;
    }

    #heading {
      font-size: x-large;
    }

    hr {
      margin-top: 0.3in;
      width: 100%;
    }

    .table-container {
      max-height: 500px;
      min-width: 300px;
    }
  `]
})

export class ReservationFinancialsCardComponent implements OnInit,OnDestroy {

  private isAlive: boolean = true;

  reservationsLoaded = false;
  reservationsLoading = false;

  reservation: Booking = {} as Booking;
  admins: User[];

  getCollectionMethodType = getCollectionMethodType;
  getReservationPaymentType = getReservationPaymentType;

  private dialogRef: MatDialogRef<any>;

  constructor(private service: StayDuvetService,
              private store: Store<State>,
              private router: ActivatedRoute,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.router.parent.params.subscribe(params => {
      const reservationId = +params['id'];

      this.store.select((state) => {
        return getIsShowingById(state, reservationId);
      }).takeWhile(() => this.isAlive).subscribe((isShowing) => {
        this.reservationsLoading = isShowing;
      });

      this.store.select((state) => {
        return getIsShowedById(state, reservationId);
      }).takeWhile(() => this.isAlive).subscribe((isShowed) => {
        this.reservationsLoaded = isShowed;
      });

      this.store.select((state) => {
        return getBookingById(state, reservationId);
      }).takeWhile(() => this.isAlive).subscribe((booking) => {
        if (!isNullOrUndefined(booking) && booking.showFull) {
          this.reservation = booking;
        }
      });

      const combinedObs = Observable.merge(
        this.store.select((state) => {
          return getIsShowingById(state, reservationId);
        }),
        this.store.select((state) => {
          return getIsShowedById(state, reservationId);
        }),
        this.store.select((state) => {
          return getBookingById(state, reservationId);
        }),
        ((isShowing, isShowed, booking) => {
        })
      );

      combinedObs.takeWhile(() => this.isAlive).subscribe(
        (data) => {
          if (!this.reservationsLoading && !this.reservationsLoaded) {
            this.service.getBookingWithId(reservationId).subscribe();
          }
        }
      );
    });

    this.store.select(getAdmins).subscribe((admins) => {
      this.admins = admins;
    });
  }

  getRefundedTooltipText(adminId: number) {
    let message = '';

    message = this.admins.find(user => {
      return isNullOrUndefined(user.is_admin) && user.admin.data.id === adminId;
    }).first_name;

    console.log(message);

    return message;
  }

  getDeductedTotal(): number {
    let deductedAmount = 0;

    for (const deduction of this.reservation.securityDeductions.data) {
      deductedAmount += deduction.amount;
    }

    return deductedAmount;
  }

  openSecurityDeductionDialog() {
    const dialog = this.dialog.open(DeductSecurityFeeComponent, {
      data: this.reservation
    });
    dialog.updateSize('100%');
  }

  openRefundSecurityPopup() {
    const data = {
      title: 'Refund Remaining Security',
      description: 'Are you sure you want to process refund of security money. Action in non-reversible.',
      showCloseButton: false,
      showNoButton: false
    };

    this.dialogRef = this.dialog.open(GenericConfirmationPopupComponent, {
      data: data
    });
    this.dialogRef.updateSize('100%');
    const instance = this.dialogRef.componentInstance;
    instance.yesButtonClicked.subscribe(() => {
      instance.isLoading = true;

      this.service.refundSecurity(this.reservation.id).subscribe((success) => {
        instance.isLoading = false;
        this.dialog.closeAll();
      })
    });
  }

  openCollectionPopup() {
    const dialog = this.dialog.open(CollectPaymentComponent, {
      data: this.reservation
    });
    dialog.updateSize('100%');
  }

  ngOnDestroy(): void {
    this.isAlive=false;
  }
}
