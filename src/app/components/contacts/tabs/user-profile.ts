import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'sd-user-profile-tab',
  template: `
    <div fxFlex="100%" fxLayout="column">
    <mat-form-field>
      <input matInput placeholder="Name *">
    </mat-form-field>
    <mat-form-field>
      <input matInput placeholder="Email *">
    </mat-form-field>
    <mat-form-field>  
    <mat-select placeholder="Preferred Contact Method">
      <mat-option *ngFor="let contact of contacts" [value]="contact">
        {{contact}}
      </mat-option>
    </mat-select>
    </mat-form-field>
    <mat-form-field>
      <input matInput placeholder="Notes">
    </mat-form-field>
    </div>
  `,
  styles: [`
    
  `]
})

export class UserProfileTabComponent {
  contacts= ['SMS', 'EMAIL', 'PHONE'];

}



