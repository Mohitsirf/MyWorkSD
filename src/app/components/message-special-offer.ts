import {Component, Input, OnInit} from '@angular/core';
import {Thread} from '../models/thread';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {StayDuvetService} from '../services/stayduvet';
import {getDateObj} from "./calendar/calendar-utils";

@Component({
  selector: 'sd-message-special-offer-popup',
  template: `
    <sd-modal-popup-layout title="Send Special Offer to Guest">
      <div fxLayout="column" fxLayoutGap="20px">
        <form fxLayout="column" [formGroup]="formGroup" (ngSubmit)="formGroup.valid && saveButtonCLicked()">
          <div fxLayoutAlign="space-between center">
            <mat-form-field class="equal-width">
              <input matInput [matDatepicker]="checkInPicker" [min]="minStartDate" placeholder="Check In"
                     formControlName='check_in' [(ngModel)]="minEndDate">
              <mat-datepicker-toggle matSuffix [for]="checkInPicker"></mat-datepicker-toggle>
              <mat-datepicker #checkInPicker></mat-datepicker>
            </mat-form-field>

            <mat-icon>arrow_forward</mat-icon>

            <mat-form-field class="equal-width">
              <input matInput [matDatepicker]="checkOutPicker" [min]="minEndDate" placeholder="Check Out"
                     formControlName='check_out'>
              <mat-datepicker-toggle matSuffix [for]="checkOutPicker"></mat-datepicker-toggle>
              <mat-datepicker #checkOutPicker></mat-datepicker>
            </mat-form-field>

            <mat-form-field class="equal-width">
              <input matInput placeholder="Sub-Total" type="number"
                     formControlName='sub_total'>
            </mat-form-field>
          </div>

          <div fxLayoutGap="10px" fxLayoutAlign=" center" fxFlexAlign="end">
            <mat-spinner color="accent" *ngIf="isUpdating" [diameter]="30" [strokeWidth]="4"></mat-spinner>
            <button mat-raised-button fxFlexAlign="end" [disabled]="isUpdating" color="accent" type="submit">
              OK
            </button>
          </div>
        </form>
      </div>
    </sd-modal-popup-layout>
  `,
  styles: [`
    hr {
      width: 100%;
    }

    mat-spinner {
      height: 30px;
      width: 30px;
    }

    .equal-width {
      width: 30%;
    }

    .entryInputs {
      width: 45%
    }
  `]
})
export class MessageSpecialOfferPopupComponent implements OnInit {
  @Input() thread: Thread;

  formGroup: FormGroup;
  checkIn: FormControl;
  checkOut: FormControl;
  subTotal: FormControl;

  minStartDate: Date;
  minEndDate: Date;

  isUpdating = false;

  constructor(private service: StayDuvetService) {
    this.checkIn = new FormControl(null, [Validators.required]);
    this.checkOut = new FormControl(null, [Validators.required]);
    this.subTotal = new FormControl(null, [Validators.required, Validators.min(10)]);

    this.formGroup = new FormGroup({
      check_in: this.checkIn,
      check_out: this.checkOut,
      sub_total: this.subTotal
    });

    this.minStartDate = getDateObj();
    this.minEndDate = getDateObj();
  }

  ngOnInit(): void {
    console.log('onInit sd-message-special-offer-popup');
  }

  saveButtonCLicked() {
    this.isUpdating = true;
    const data = this.formGroup.value;

    // this.service.createOwnerBlock(data, String(this.listing.id)).subscribe((listing) => {
    //   this.isSaving = false;
    //   this.dialog.closeAll();
    // });
  }
}
