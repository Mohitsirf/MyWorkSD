import {Component, OnInit} from '@angular/core';
/**
 * Created by piyushkantm on 23/06/17.
 */
@Component({
  selector: 'sd-owner-task-card',
  template: `
    <div fxLayout="row">
      <mat-card fxFlex="100%">
        Hey
      </mat-card>
    </div>
`,
  styles: []
})
export class OwnerTaskCardComponent implements OnInit {
  ngOnInit(): void {
    console.log('onInit sd-owner-task-listing-card');
  }
}
