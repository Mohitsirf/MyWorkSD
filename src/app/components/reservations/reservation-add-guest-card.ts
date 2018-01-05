import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BookingGuest} from "../../models/booking-guest";
import {StayDuvetService} from "../../services/stayduvet";
import {Booking} from "../../models/booking";
import {MatDialogRef} from "@angular/material";

@Component({
  selector: 'sd-reservation-add-guest-card',
  template: `
    <sd-modal-popup-layout title="{{title}}" [print]="true">
      <form fxLayout="column" fxLayoutGap="20px" [formGroup]="formGroup"
            (ngSubmit)="formGroup.valid && saveButtonClicked()">
        <div fxLayoutAlign="space-between center">
          <mat-form-field class="width45">
            <input matInput placeholder="First Name" formControlName='first_name'>
          </mat-form-field>
          <mat-form-field class="width45">
            <input matInput placeholder="Last Name" formControlName='last_name'>
          </mat-form-field>
        </div>
        <div fxLayoutAlign="space-between center">
          <mat-form-field class="width45">
            <input matInput placeholder="Email" formControlName='email'>
          </mat-form-field>
          <mat-form-field class="width45">
            <input matInput placeholder="Phone" formControlName='phone_number'>
          </mat-form-field>
        </div>
        <div fxLayout="row" fxLayoutAlign="end center" fxLayoutGap="10px">
          <mat-spinner *ngIf="isLoading" [diameter]="30" [strokeWidth]="4"></mat-spinner>
          <button mat-raised-button color="warn" *ngIf="type=='edit'" (click)="delete()" [disabled]="isLoading">Delete</button>
          <button mat-raised-button color="accent" [disabled]="isLoading" type="submit">{{buttonText}}</button>
        </div>
      </form>
    </sd-modal-popup-layout>
  `,
  styles: [`
    .width30 {
      width: 30%;
    }

    .width45 {
      width: 45%;
    }

    mat-spinner {
      width: 30px;
      height: 30px;
    }

  `]
})

export class ReservationAddGuestCardComponent implements OnInit {

  @Input() type: string;
  title: string;
  buttonText: string;
  @Input() guest: BookingGuest;
  isLoading: boolean = false;

  @Input() reservation: Booking;


  formGroup: FormGroup;
  firstName: FormControl;
  lastName: FormControl;
  email: FormControl;
  phoneNumber: FormControl;

  constructor(private stayduvetService: StayDuvetService, private dialogRef: MatDialogRef<ReservationAddGuestCardComponent>) {
    this.firstName = new FormControl(null, [Validators.required]);
    this.lastName = new FormControl(null, []);
    this.email = new FormControl(null, [Validators.pattern('^$|^.*@.*\\..*$')]);
    this.phoneNumber = new FormControl(null, []);
    this.formGroup = new FormGroup({
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      phone_number: this.phoneNumber,
    });

  }

  ngOnInit(): void {
    if (this.type === 'edit') {
      this.title = 'Edit Guest';
      this.buttonText = 'Save';
      this.formGroup.setValue({
        first_name: this.guest.first_name,
        last_name: this.guest.last_name,
        email: this.guest.email,
        phone_number: this.guest.phone_number
      });
    }
    else {
      this.title = 'Add New Guest';
      this.buttonText = 'Add Guest';
    }

  }

  saveButtonClicked() {
    this.isLoading = true;
    if (this.type === 'edit') {
      this.stayduvetService.updateBookingGuest(String(this.guest.id), String(this.reservation.id), this.formGroup.value).subscribe(res => {
        this.isLoading = false;
        this.dialogRef.close();
      });
    }
    else {
      this.stayduvetService.addBookingGuest(String(this.reservation.id), this.formGroup.value).subscribe(res => {
        this.isLoading = false;
        this.dialogRef.close();
      });
    }

  }

  delete()
  {
    this.isLoading=true;
    this.stayduvetService.deleteBookingGuest(String(this.guest.id),String(this.guest.booking_id)).subscribe(res=>{
      this.isLoading=false;
      this.dialogRef.close();
    });
  }


}
