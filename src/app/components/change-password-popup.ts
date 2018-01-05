import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {StayDuvetService} from '../services/stayduvet';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'sd-change-password',
  template: `
  <sd-modal-popup-layout [title]="'Password Settings'" [print]="false">
    <form fxLayout="column" fxLayoutGap="10px"
          [formGroup]="changePasswordForm" (ngSubmit)="changePasswordForm.valid && passwordChange()" >
      <mat-form-field >
        <input matInput placeholder="Old Password" formControlName='old_password'>
        <mat-error>Enter the Old Password</mat-error>
      </mat-form-field>
      <mat-form-field >
        <input matInput placeholder="New Password" formControlName='password'>
        <mat-error>Enter the New Password</mat-error>
      </mat-form-field>
      <mat-form-field >
        <input matInput placeholder="Confirm Password" formControlName='password_confirmation'>
        <mat-error>Confirm the New Password</mat-error>
      </mat-form-field>
      <div fxLayout="row" fxLayoutAlign="space-between center" style="margin:30px; ">
        <div fxLayout="row" fxLayoutGap="10px">
          <mat-spinner *ngIf="isUpdating"></mat-spinner>
          <button mat-raised-button [disabled]="isUpdating"
                  class="dangerButton" type="submit">
            <span class="successSpan"><b>CHANGE PASSWORD</b></span>
          </button>
        </div>
      </div>

    </form>
  </sd-modal-popup-layout>
  `,
  styles: [`
    mat-spinner {
      width: 24px;
      height: 24px;
    }
  `]
})

export class ChangePasswordPopupComponent implements OnInit{

  changePasswordForm: FormGroup;
  oldPassword: FormControl;
  newPassword: FormControl;
  confirmPassword: FormControl;

  isUpdating = false;

  constructor( private service: StayDuvetService,  private dialogRef: MatDialogRef<ChangePasswordPopupComponent>) {

  }


  ngOnInit() {
    this.oldPassword = new FormControl(null, [Validators.required]);
    this.newPassword = new FormControl(null, [Validators.required]);
    this.confirmPassword = new FormControl(null, [Validators.required]);

    this.changePasswordForm = new FormGroup({
      old_password: this.oldPassword,
      password: this.newPassword,
      password_confirmation: this.confirmPassword,
    });
  }


  passwordChange() {
    this.isUpdating = true;
    this.service.changePassword(this.changePasswordForm.value).subscribe(() => {
      this.isUpdating = false;
      this.dialogRef.close();
    }, () => {
      this.isUpdating = false;
      this.dialogRef.close();
    });
  }
}
