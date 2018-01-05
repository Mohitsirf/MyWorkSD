
import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {LastMinuteDiscount} from '../../models/last-minute-discount';
import {StayDuvetService} from '../../services/stayduvet';
import {Store} from '@ngrx/store';
import {getDiscounts, getIsDiscountsLoaded, getIsDiscountsLoading, State} from '../../reducers/index';
import {Router} from '@angular/router';
import {MatDialogRef} from '@angular/material';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'sd-last-min-discount-template',
  template: `
    <sd-modal-popup-layout title="Last Min. Discount Templates">
      <div fxLayout="row" fxLayoutAlign="center center">
        <mat-spinner [color]="'accent'" *ngIf="isDiscountLoading" [diameter]="30" [strokeWidth]="4"></mat-spinner>
        <div *ngIf="isDiscountLoaded" style="width: 100%">
          <mat-form-field style="width: 100%">
            <mat-select
              placeholder="Select Template"
              [(ngModel)]="selectedDiscount"
              color="accent"
              floatPlaceholder="never"
              [ngModelOptions]="{standalone: true}">
              <mat-option *ngFor="let discount of discounts" [value]="discount">
                {{ discount.title }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <div *ngIf="!selectedDiscount" fxLayout="column" fxLayoutAlign="center center" fxLayoutGap="20px">
            <mat-icon>error_outline</mat-icon>
            <span>No Template Selected</span>
          </div>
          
          <div *ngIf="selectedDiscount" fxLayout="column" fxLayoutAlign="center center">
            <p class="multi-line-content">{{ selectedDiscount.description }}</p>

            <table>
              <tr>
                <th>Days</th>
                <th>Discount</th>
              </tr>

              <tr>
                <td>Last 3 Days</td>
                <td>{{selectedDiscount.last_3_days}}%</td>
              </tr>

              <tr>
                <td>Last 7 Days</td>
                <td>{{selectedDiscount.last_7_days}}%</td>
              </tr>

              <tr>
                <td>Last 14 Days</td>
                <td>{{selectedDiscount.last_14_days}}%</td>
              </tr>

              <tr>
                <td>Last 21 Days</td>
                <td>{{selectedDiscount.last_21_days}}%</td>
              </tr>

              <tr>
                <td>Last 28 Days</td>
                <td>{{selectedDiscount.last_28_days}}%</td>
              </tr>
            </table>
          </div>
          
          
          <div fxLayout="row" fxLayoutAlign="end center" fxLayoutGap="10px">
            <!--<mat-spinner *ngIf="isDiscountsSaving" [color]="'accent'" [diameter]="30" [strokeWidth]="4"></mat-spinner>-->
            <button mat-raised-button color="accent" [disabled]="!selectedDiscount" (click)="selectDiscount()">Apply
            </button>
          </div>
        </div>
      </div>
    </sd-modal-popup-layout>
  `,
  styles: [`
    mat-spinner {
      margin-right: 20px;
    }

    .multi-line-content {
      font-family: 'Roboto', sans-serif;
      white-space: pre-line;
    }
    
    th, td {
      padding: 15px;
      text-align: left;
    }

    tr:hover {background-color: #d1d1d1d1;}

    tr:nth-child(even) {background-color: #f1f1f1f1;}

    th {
      background-color: #4CAF50;
      color: white;
    }
  `]
})
export class LastMinDiscountTemplatePopupComponent implements OnInit, OnDestroy {

  @Output() discountSelected = new EventEmitter<LastMinuteDiscount>();

  discounts: LastMinuteDiscount[];
  selectedDiscount: LastMinuteDiscount;

  isDiscountLoading = false;
  isDiscountLoaded = false;

  private isAlive = true;

  ngOnInit() {
    console.log('onInit sd-last-min-discount-template');

    this.loadDiscounts();
  }

  constructor(private service: StayDuvetService,
              private store: Store<State>,
              private router: Router,
              private dialogRef: MatDialogRef<LastMinDiscountTemplatePopupComponent>) {
  }


  private loadDiscounts() {
    this.store.select(getIsDiscountsLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.isDiscountLoading = loading;
    });
    this.store.select(getIsDiscountsLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.isDiscountLoaded = loaded;
    });
    this.store.select(getDiscounts).takeWhile(() => this.isAlive).subscribe((discounts) => {
      this.discounts = discounts;
    });

    const threadsCombined = Observable.merge(
      this.store.select(getIsDiscountsLoading),
      this.store.select(getIsDiscountsLoaded),
      this.store.select(getDiscounts),
      ((loading, loaded, threads) => {
      })
    );

    threadsCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.isDiscountLoading && !this.isDiscountLoaded) {
          this.service.fetchSpecialDiscounts().subscribe();
        }
      }
    );
  }

  selectDiscount() {
    console.log(this.selectedDiscount);
    this.discountSelected.emit(this.selectedDiscount);

    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
