import {Component, Inject, Input, OnInit} from '@angular/core';
import {StayDuvetService} from '../../../services/stayduvet';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Booking} from '../../../models/booking';

@Component({
  selector: 'sd-security-deduction-popup',
  template: `
    <sd-modal-popup-layout title="Security Deduction">
      <form fxLayout="column" fxLayoutGap="10px" [formGroup]="formGroup" (ngSubmit)="submitForm()">
        <mat-form-field class="full-width">
          <input matInput formControlName="amount" placeholder="Amount" type="number">
          <mat-error>Amount is required</mat-error>
        </mat-form-field>
        <mat-form-field class="full-width">
          <textarea matInput style="max-height: 200px" placeholder="Description"
                    formControlName="description"></textarea>
        </mat-form-field>
        <div fxLayout="row" fxLayoutAlign="end center" fxLayoutGap="15px">
          <mat-spinner *ngIf="isSaving" [diameter]="30" [strokeWidth]="4"></mat-spinner>
          <button type="submit" color="accent" [disabled]="isSaving" mat-raised-button>Save</button>
        </div>
      </form>
    </sd-modal-popup-layout>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }

    .half-width {
      width: 48%;
    }
  `]
})

export class DeductSecurityFeeComponent implements OnInit {
  booking: Booking;

  isSaving = false;

  formGroup: FormGroup;

  amount: FormControl;
  description: FormControl;

  constructor(private service: StayDuvetService,
              private dialog: MatDialogRef<DeductSecurityFeeComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    this.booking = data;

    this.amount = new FormControl(null, [Validators.required]);
    this.description = new FormControl();
  }

  ngOnInit() {
    this.formGroup = new FormGroup({
      amount: this.amount,
      description: this.description
    });
  }

  submitForm() {
    if (this.formGroup.invalid) {
      return;
    }

    const data = this.formGroup.getRawValue();
    this.isSaving = true;
    this.service.deductSecurityFee(this.booking.id, data).subscribe(deduction => {
      this.isSaving = false;
      this.dialog.close();
    }, error => {
      this.isSaving = false;
    });
  }
}
