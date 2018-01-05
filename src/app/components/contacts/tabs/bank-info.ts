 import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'sd-bank-info-tab',
  template: `
    <div fxFlex="100%" fxLayout="column">
      <mat-form-field>
        <input matInput placeholder="Bank Name *">
      </mat-form-field>
      <mat-form-field>
        <input matInput placeholder="Account Number *">
      </mat-form-field>
      <mat-form-field>
        <input matInput placeholder="Routing Number *">
      </mat-form-field>
    </div>
  `,
  styles: [`

  `]
})

export class BankInfoTabComponent {
  contacts= ['SMS', 'EMAIL', 'PHONE'];

}




