import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BookingGuest} from "../../models/booking-guest";
import {StayDuvetService} from "../../services/stayduvet";

@Component({
  selector: 'sd-reservation-guest-details',
  template: `
    <mat-card>
      <mat-card-content>
        <h2>{{guest?.first_name}} {{guest?.last_name}}</h2>
        <div fxLayout="row" fxLayoutAlign="space-between center" fxLayoutGap="5%" style="font-size: small;">
          <div fxFlex="45%">
            <span style="font-weight: bold">Email: </span>
            <span>{{guest?.email}}</span>
          </div>

          <div fxFlex="45%">
            <span style="font-weight: bold">Phone Number: </span>
            <span>{{guest?.phone_number}}</span>
          </div>

        </div>
      </mat-card-content>
    </mat-card>

  `,
  styles: [`
    .mat-card {
      border: 1px solid lightgrey !important;
      box-shadow: none !important;
      background: -webkit-linear-gradient(top, #ffffff 0%, #ffffff 100%);
    }

    mat-spinner {
      width: 30px;
      height: 30px;
    }
  `]
})

export class ReservationGuestDetailsCardComponent {
  @Input() guest: BookingGuest;

  deleting: boolean = false;

  constructor(private stayDuvetService: StayDuvetService) {
    //
  }

}
