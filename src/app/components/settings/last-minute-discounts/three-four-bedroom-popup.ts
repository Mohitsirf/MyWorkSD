/**
 * Created by divyanshu on 04/09/17.
 */

import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'sd-setting-three-four-bedroom-popup',
  template: `
    <sd-modal-popup-layout title="3 - 4 Bedrooms">      
        <div fxLayout="column" fxLayoutGap="20px" class="main-container">
          <!--<div fxLayout="column">-->
            <!--<span class="title">3 - 4 Bedrooms</span>-->
            <!--<span style="font-size: 13px">When last minute discounts is turned on all properties selected will follow these rules to last minutes</span>-->
            <!--<hr class="fullWidth">-->
          <!--</div>-->

          <div fxLayout="column" fxLayoutAlign="start stretch" fxLayoutGap="20px" class="Q3Width">
            <div fxLayout="column">
              <span>Discount for last 3 days</span>
              <div fxLayoutAlign="space-between center">
                <mat-slider value="50" #day3slider fxFlex="70%"></mat-slider>
                <span>{{day3slider.value}}%</span>
              </div>
            </div>
            <div fxLayout="column">
              <span>Discount for last 7 days</span>
              <div fxLayoutAlign="space-between center">
                <mat-slider value="50" #day7slider fxFlex="70%"></mat-slider>
                <span>{{day7slider.value}}%</span>
              </div>
            </div>
            <div fxLayout="column">
              <span>Discount for last 14 days</span>
              <div fxLayoutAlign="space-between center">
                <mat-slider value="50" #day14slider fxFlex="70%"></mat-slider>
                <span>{{day14slider.value}}%</span>
              </div>
            </div>
            <div fxLayout="column">
              <span>Discount for last 21 days</span>
              <div fxLayoutAlign="space-between center">
                <mat-slider value="50" #day21slider fxFlex="70%"></mat-slider>
                <span>{{day21slider.value}}%</span>
              </div>
            </div>
          </div>
          <button mat-raised-button color="accent" fxFlexAlign="end" (click)="closePopupClicked()">Close</button>
        </div>      
    </sd-modal-popup-layout>

  `,
  styles: [`

    .fullWidth {
      width: 100%;
    }

    .tenwidth {
      width: 10%;
    }

    textarea {
      resize: none;
    }

    .Q3Width {
      width: 60%
    }

    .colorLight {
      color: #c8c8c8;
    }

    .title {
      font-size: 20px;
    }

    .bolder {
      font-style: italic;
      font-weight: bolder;
    }

    .container-box {
      border-style: solid;
      border-width: 0.1px;
      padding: 20px;
      border-color: #c8c8c8
    }

    .main-container {
      padding-top: 10px;
    }

  `]
})
export class SettingsThreeFourBedroomPopupComponent {
  constructor(private router: Router, private dialog: MatDialog) {
  }

  closePopupClicked() {
    this.dialog.closeAll();
  }
}
