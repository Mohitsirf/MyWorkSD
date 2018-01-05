import {Component, OnDestroy, OnInit} from '@angular/core';
import {Listing} from '../../models/listing';
import {MatDialog, MatDialogRef} from '@angular/material';
import {getListingById, State} from '../../reducers/index';
import {StayDuvetService} from '../../services/stayduvet';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {getDateObj} from '../calendar/calendar-utils';
import {LastMinDiscountTemplatePopupComponent} from './last-min-discount-template-popup';
import {MinimumStay} from '../../models/minimum-stay';

/**
 * Created by ubuntu on 9/7/17.
 */
@Component({
  selector: 'sd-listing-pricing-tab',
  template: `
    <div fxLayout="column" fxLayoutGap="20px" class="top-padding">
      <div fxLayout="column" fxLayoutGap="15px">
        <span class="title">{{ selectedListing.title }}</span>
        <span class="heading">{{ selectedListing?.getFullAddress() }}</span>
      </div>
      <hr>
      <div fxLayout="column" fxLayoutGap="20px">
        <span class="bolder heading"><b>Global Stays</b></span>
        <div fxLayout="column" fxLayoutGap="20px" class="padding10-left">

          <div fxLayout="row" fxLayoutAlign="space-around center">
            <div fxFlex="50%" fxLayout="column" fxLayoutGap="10px">
              <span class="heading">Global Minimum Stay</span>
            </div>

            <div fxFlex="50%" fxFlexAlign="end">
              <mat-form-field [color]="'accent'" style="width: 80%;">
                <input matInput [(ngModel)]="minimumNights" type="number" min="0" placeholder="Minimum stay in days">
              </mat-form-field>
            </div>
          </div>

          <div fxLayout="row" fxLayoutAlign="space-around center">
            <div fxFlex="50%" fxLayout="column" fxLayoutGap="10px">
              <span class="heading">Global Maximum Stay</span>
            </div>

            <div fxFlex="50%" fxFlexAlign="end">
              <mat-form-field [color]="'accent'" style="width: 80%;">
                <input matInput [(ngModel)]="maximumNights" type="number" min="1" placeholder="Maximum stay in days">
              </mat-form-field>
            </div>
          </div>

          <div fxLayout="row" fxLayoutAlign="end center" fxLayoutGap="10px">
            <mat-spinner *ngIf="isGLobalStaysSaving" [color]="'accent'" [diameter]="30" [strokeWidth]="4"></mat-spinner>
            <button mat-raised-button color="accent" [disabled]="isGLobalStaysSaving" (click)="saveGlobalStays()">SAVE
            </button>
          </div>
        </div>
      </div>
      <hr>
      <div fxLayout="column" fxLayoutGap="20px" class="padding10-left">
        <div fxLayout="row" fxLayoutAlign="start start" fxLayoutGap="30px">
          <div fxLayout="column" fxLayoutGap="10px">
            <span class="heading">Would you like to turn on dymamic pricing?</span>
            <span>Fun fact : host who allow pets typically receive 20% more bookings.</span>
          </div>
          <div>
            <mat-slide-toggle #dynamicPricingToggle [(ngModel)]="isDynamic"></mat-slide-toggle>
          </div>
        </div>

        <div fxLayout="row" *ngIf="dynamicPricingToggle.checked" fxLayoutAlign="space-around center">
          <div fxFlex="50%" fxLayout="column" fxLayoutGap="10px">
            <span class="heading">Minimum Price</span>
            <span>The minimum price you'd like to set for the dynamic pricing.</span>
          </div>

          <div fxFlex="50%" fxFlexAlign="end">
            <mat-form-field [color]="'accent'" style="width: 80%;">
              <input matInput [(ngModel)]="minDynamicPrice" placeholder="Base Price in $">
            </mat-form-field>
          </div>
        </div>

        <div fxLayout="row" *ngIf="!dynamicPricingToggle.checked" fxLayoutAlign="space-around center">
          <div fxFlex="50%" fxLayout="column" fxLayoutGap="10px">
            <span class="heading">Base Price</span>
            <span>The base amount you'd like for normal days.</span>
          </div>

          <div fxFlex="50%" fxFlexAlign="end">
            <mat-form-field [color]="'accent'" style="width: 80%;">
              <input matInput [(ngModel)]="basePrice" placeholder="Base Price in $">
            </mat-form-field>
          </div>
        </div>

        <div fxLayout="row" *ngIf="!dynamicPricingToggle.checked" fxLayoutAlign="space-around center">
          <div fxFlex="50%" fxLayout="column" fxLayoutGap="10px">
            <span class="heading">Base Weekend Price</span>
            <span>The base amount you'd like for Weekends<br/>(Friday, Saturday and Sunday nights).</span>
          </div>
          <div fxFlex="50%" fxFlexAlign="end">
            <mat-form-field [color]="'accent'" style="width: 80%;">
              <input matInput [(ngModel)]="baseWeekendPrice" placeholder="Base Weekend Price in $">
            </mat-form-field>
          </div>
        </div>
      </div>
      <div fxLayout="row" fxLayoutAlign="end center" fxLayoutGap="10px">
        <mat-spinner *ngIf="isPricingSaving" [color]="'accent'" [diameter]="30" [strokeWidth]="4"></mat-spinner>
        <button mat-raised-button color="accent" [disabled]="isPricingSaving" (click)="savePricing()">SAVE</button>
      </div>
      <hr *ngIf="!dynamicPricingToggle.checked">
      <div fxLayout="column" fxLayoutGap="20px" *ngIf="!dynamicPricingToggle.checked">
        <span class="bolder heading"><b>Minimum Stays</b></span>
        <div fxLayout="column" fxLayoutGap="20px" class="padding10-left">
          <span class="heading">Your minimum stay is set 2 nights</span>
          <div fxLayout="column" fxLayoutGap="10px">
            <span class="heading">Do you have seasonal minimum stays?</span>
            <span>if a property is not booked within a month the minimum stay to 2 nights. </span>
          </div>
      <sd-minimum-stay
      [minimumStays] = "minimumStays"
      [selectedListing]="selectedListing">
      </sd-minimum-stay>
        </div>
      </div>
      <hr *ngIf="!dynamicPricingToggle.checked">
      <div fxLayout="column" fxLayoutGap="20px" *ngIf="!dynamicPricingToggle.checked">
        <div fxLayoutAlign="space-between center" style="width: 100%">
          <span class="bolder heading">Discounts</span>
          <button mat-raised-button 
                  color="accent" 
                  *ngIf="lastMinuteDiscountToggle.checked"
                  [disabled]="isDiscountsSaving" 
                  (click)="openTemplates()">
            Load Template
          </button>
        </div>
        <div fxLayout="column" fxLayoutGap="20px" class="padding10-left">
          <div fxLayout="column" fxLayoutGap="10px">
            <span class="heading">Would you like to offer discounts for longer stays?</span>
            <span>we require a net fix account or a basic cable TV subscription.</span>
          </div>


          <div fxLayout="row" fxLayoutAlign="space-around center">
            <div fxFlex="50%" fxLayout="column" fxLayoutGap="10px">
              <span class="heading">Weekly</span>
              <span>Fun Fact:</span>
            </div>

            <div fxFlex="50%" fxFlexAlign="end">
              <mat-form-field [color]="'accent'" style="width: 80%;">
                <input matInput [(ngModel)]="weeklyDiscount" placeholder="Weekly Discount in %">
              </mat-form-field>
            </div>
          </div>

          <div fxLayout="row" *ngIf="!dynamicPricingToggle.checked" fxLayoutAlign="space-around center">
            <div fxFlex="50%" fxLayout="column" fxLayoutGap="10px">
              <span class="heading">Monthly</span>
              <span>Fun Fact:</span>
            </div>
            <div fxFlex="50%" fxFlexAlign="end">
              <mat-form-field [color]="'accent'" style="width: 80%;">
                <input matInput [(ngModel)]="monthlyDiscount" placeholder="Monthly Discount in %">
              </mat-form-field>
            </div>
          </div>
          <div fxLayout="column" fxLayoutGap="20px">
            <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="30px">
              <span class="heading">Would you like to offer last minute discounts?</span>
              <mat-slide-toggle #lastMinuteDiscountToggle [(ngModel)]="lastMinuteDiscount"></mat-slide-toggle>
            </div>
            <div *ngIf="lastMinuteDiscountToggle.checked" fxLayout="column" fxLayoutAlign="start stretch"
                 fxLayoutGap="20px" class="Q3Width">
              <div fxLayout="column">
                <span>Discount for last 3 days</span>
                <div fxLayoutAlign="space-between center">
                  <mat-slider [(ngModel)]="last3dayDiscount" #day3slider fxFlex="70%"></mat-slider>
                  <span>{{ day3slider.value }}%</span>
                </div>
              </div>
              <div fxLayout="column">
                <span>Discount for last 7 days</span>
                <div fxLayoutAlign="space-between center">
                  <mat-slider [(ngModel)]="last7dayDiscount" #day7slider fxFlex="70%"></mat-slider>
                  <span>{{ day7slider.value }}%</span>
                </div>
              </div>
              <div fxLayout="column">
                <span>Discount for last 14 days</span>
                <div fxLayoutAlign="space-between center">
                  <mat-slider [(ngModel)]="last14dayDiscount" #day14slider fxFlex="70%"></mat-slider>
                  <span>{{ day14slider.value }}%</span>
                </div>
              </div>
              <div fxLayout="column">
                <span>Discount for last 21 days</span>
                <div fxLayoutAlign="space-between center">
                  <mat-slider [(ngModel)]="last21dayDiscount" #day21slider fxFlex="70%"></mat-slider>
                  <span>{{ day21slider.value }}%</span>
                </div>
              </div>
              <div fxLayout="column">
                <span>Discount for last 28 days</span>
                <div fxLayoutAlign="space-between center">
                  <mat-slider [(ngModel)]="last28dayDiscount" #day28slider fxFlex="70%"></mat-slider>
                  <span>{{ day28slider.value }}%</span>
                </div>
              </div>
            </div>
            <div fxLayout="row" fxLayoutAlign="end center" fxLayoutGap="10px">
              <mat-spinner *ngIf="isDiscountsSaving" [color]="'accent'" [diameter]="30" [strokeWidth]="4"></mat-spinner>
              <button mat-raised-button color="accent" [disabled]="isDiscountsSaving" (click)="saveDiscounts()">SAVE
              </button>
            </div>
          </div>
        </div>
      </div>
      <hr>
      <div fxLayout="column" fxLayoutGap="20px">
        <span class="bolder heading"><b>Charges</b></span>
        <div fxLayout="column" fxLayoutGap="20px" class="padding10-left">

          <div fxLayout="row" fxLayoutAlign="space-around center">
            <div fxFlex="50%" fxLayout="column" fxLayoutGap="10px">
              <span class="heading">Cleaning Fee</span>
              <span>Fun Fact:</span>
            </div>

            <div fxFlex="50%" fxFlexAlign="end">
              <mat-form-field [color]="'accent'" style="width: 80%;">
                <input matInput [(ngModel)]="cleaningFee" placeholder="Cleaning Fee in $">
              </mat-form-field>
            </div>
          </div>

          <div fxLayout="row" fxLayoutAlign="space-around center">
            <div fxFlex="50%" fxLayout="column" fxLayoutGap="10px">
              <span class="heading">Security Deposit</span>
              <span>Fun Fact:</span>
            </div>

            <div fxFlex="50%" fxFlexAlign="end">
              <mat-form-field [color]="'accent'" style="width: 80%;">
                <input matInput [(ngModel)]="securityDeposit" placeholder="Security Deposit in $">
              </mat-form-field>
            </div>
          </div>

          <div fxLayout="row" fxLayoutAlign="space-around center">
            <div fxFlex="50%" fxLayout="column" fxLayoutGap="10px">
              <span class="heading">Extra Guest Fee</span>
              <span>Fun Fact:</span>
            </div>

            <div fxFlex="50%" fxFlexAlign="end">
              <mat-form-field [color]="'accent'" style="width: 80%;">
                <input matInput [(ngModel)]="extraGuestFee" placeholder="Extra Guest Fee in $">
              </mat-form-field>
            </div>
          </div>

          <div fxLayout="row" fxLayoutAlign="space-around center">
            <div fxFlex="50%" fxLayout="column" fxLayoutGap="10px">
              <span class="heading">Pet Fee</span>
              <span>Fun Fact:</span>
            </div>

            <div fxFlex="50%" fxFlexAlign="end">
              <mat-form-field [color]="'accent'" style="width: 80%;">
                <input matInput [(ngModel)]="petFee" placeholder="Pet Fee in $">
              </mat-form-field>
            </div>
          </div>

          <div fxLayout="row" fxLayoutAlign="space-around center">
            <div fxFlex="50%" fxLayout="column" fxLayoutGap="10px">
              <span class="heading">State Tax</span>
              <span>Percentage tax applicable to all bookings for this listings</span>
            </div>

            <div fxFlex="50%" fxFlexAlign="end">
              <mat-form-field [color]="'accent'" style="width: 80%;">
                <input matInput [(ngModel)]="percentTax" placeholder="% Tax">
              </mat-form-field>
            </div>
          </div>

          <div fxLayout="row" fxLayoutAlign="space-around center">
            <div fxFlex="50%" fxLayout="column" fxLayoutGap="10px">
              <span class="heading">Commission Percent</span>
              <span>Percentage commission applicable to all bookings that are done after changes for this listing</span>
            </div>

            <div fxFlex="50%" fxFlexAlign="end">
              <mat-form-field [color]="'accent'" style="width: 80%;">
                <input matInput [(ngModel)]="percentCommission" placeholder="% Commission">
              </mat-form-field>
            </div>
          </div>

          <div fxLayout="row" fxLayoutAlign="end center" fxLayoutGap="10px">
            <mat-spinner *ngIf="isExtraChargesSaving" [color]="'accent'" [diameter]="30" [strokeWidth]="4"></mat-spinner>
            <button mat-raised-button color="accent" [disabled]="isExtraChargesSaving" (click)="saveExtraCharges()">SAVE
            </button>
          </div>
        </div>
      </div>
      <hr>
    </div>
  `,
  styles: [`
    mat-spinner {
      height: 36px;
      width: 36px;
    }

    .title {
      font-size: 30px;
      font-weight: bolder;
    }

    .heading {
      font-size: 25px;
    }

    .top-padding {
      padding-top: 20px;
    }

    .bottom-padding {
      padding-bottom: 20px;
    }

    hr {
      width: 100%;
    }

    .bolder {
      font-weight: bolder;
    }

    .percContainer {
      width: 50%;
    }

    .Q3Width {
      width: 70%;
    }

    .cellWidth {
      width: 250px;
    }

    .padding40-left {
      padding-left: 40px;
    }

    .padding10-left {
      padding-left: 10px;
    }

    .margin200-left {
      margin-left: 200px;
    }

    .padding-bottom {
      padding-bottom: 200px;
    }
  `]
})
export class ListingPricingTabComponent implements OnInit, OnDestroy {

  isPricingSaving = false;
  isStaysSaving = false;
  isDiscountsSaving = false;
  isExtraChargesSaving = false;
  isGLobalStaysSaving = false;

  // Pricing
  isDynamic;
  minDynamicPrice;
  basePrice;
  baseWeekendPrice;

  // Stays
  minimumStays: MinimumStay[] = [];

  // Discounts
  weeklyDiscount;
  monthlyDiscount;
  lastMinuteDiscount;
  last3dayDiscount;
  last7dayDiscount;
  last14dayDiscount;
  last21dayDiscount;
  last28dayDiscount;

  // Extra Charges
  cleaningFee;
  securityDeposit;
  extraGuestFee;
  petFee;
  percentTax;
  percentCommission;

  // GLobal Stays
  minimumNights: number;
  maximumNights: number;


  selectedListing: Listing;
  private dialogRef: MatDialogRef<any>;
  private isAlive: boolean = true;

  ngOnInit(): void {
    console.log('onInit sd-listing-pricing-tab');
    this.route.parent.params.subscribe((params) => {
      const listingId = +params['id'];
      this.store.select((state) => {
        return getListingById(state, listingId);
      }).takeWhile(() => this.isAlive).subscribe((listing) => {
        this.selectedListing = listing;

        // Pricing
        this.isDynamic = listing.dynamic_pricing;
        this.minDynamicPrice = listing.min_dynamic_price;
        this.basePrice = listing.base_price;
        this.baseWeekendPrice = listing.base_weekend_price;

        // Stays
        this.minimumStays = [];
        listing.seasonal_min_stays.slice().forEach( minStay =>{
          this.minimumStays = [...this.minimumStays , Object.assign(new MinimumStay() , minStay) ];
        });

        // DiscountsweeklyDiscount;
        this.weeklyDiscount = listing.weekly_discount;
        this.monthlyDiscount = listing.monthly_discount;
        this.lastMinuteDiscount = listing.last_minute_discount;
        this.last3dayDiscount = listing.discount_for_last_3_days;
        this.last7dayDiscount = listing.discount_for_last_7_days;
        this.last14dayDiscount = listing.discount_for_last_14_days;
        this.last21dayDiscount = listing.discount_for_last_21_days;
        this.last28dayDiscount = listing.discount_for_last_28_days;

        // Extra Charges
        this.cleaningFee = listing.cleaning_fee;
        this.securityDeposit = listing.security_deposit;
        this.extraGuestFee = listing.extra_guest_price;
        this.petFee = listing.pet_fee;
        this.percentTax = listing.tax_percent;
        this.percentCommission = listing.commission_rate;

        // Global Stays
        this.minimumNights = listing.min_nights;
        this.maximumNights = listing.max_nights;
      });
    });
  }


  constructor(private route: ActivatedRoute,
              private store: Store<State>,
              private service: StayDuvetService,
              private dialog: MatDialog) {
  }



  removeButtonClicked(index: number) {
    this.minimumStays = [ ...this.minimumStays.slice(0, index),
      ...this.minimumStays.slice(index+1)
    ];
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  openTemplates() {
    const dilaogRef = this.dialog.open(LastMinDiscountTemplatePopupComponent, {
      width: '60%',
      height: '80%'
    });

    const instance = dilaogRef.componentInstance;
    instance.discountSelected.subscribe((res) => {
      const selectedDiscount = res;

      this.last3dayDiscount = selectedDiscount.last_3_days;
      this.last7dayDiscount = selectedDiscount.last_7_days;
      this.last14dayDiscount = selectedDiscount.last_14_days;
      this.last21dayDiscount = selectedDiscount.last_21_days;
      this.last28dayDiscount = selectedDiscount.last_28_days;
    });
  }

  savePricing() {
    this.isPricingSaving = true;
    this.service.updateListingDetails({
      dynamic_pricing: this.isDynamic,
      min_dynamic_price: this.minDynamicPrice,
      base_price: this.basePrice,
      base_weekend_price: this.baseWeekendPrice}, String(this.selectedListing.id)).subscribe((success) => {
      this.isPricingSaving = false;
    }, () => {
      this.isPricingSaving = false;
    });
  }


  saveDiscounts() {
    this.isDiscountsSaving = true;
    this.service.updateListingDetails({
      weekly_discount: this.weeklyDiscount,
      monthly_discount: this.monthlyDiscount,
      last_minute_discount: this.lastMinuteDiscount,
      discount_for_last_3_days: this.last3dayDiscount,
      discount_for_last_7_days: this.last7dayDiscount,
      discount_for_last_14_days: this.last14dayDiscount,
      discount_for_last_21_days: this.last21dayDiscount,
      discount_for_last_28_days: this.last28dayDiscount}, String(this.selectedListing.id)).subscribe((success) => {
      this.isDiscountsSaving = false;
    }, () => {
      this.isDiscountsSaving = false;
    });
  }

  saveExtraCharges() {
    this.isExtraChargesSaving = true;
    this.service.updateListingDetails({
      cleaning_fee: this.cleaningFee,
      security_deposit: this.securityDeposit,
      extra_guest_price: this.extraGuestFee,
      pet_fee: this.petFee,
      tax_percent: this.percentTax,
      commission_rate: this.percentCommission}, String(this.selectedListing.id)).subscribe((success) => {
      this.isExtraChargesSaving = false;
    }, () => {
      this.isExtraChargesSaving = false;
    });
  }

  saveGlobalStays() {
    this.isGLobalStaysSaving = true;
    this.service.updateListingDetails({
      max_nights: this.maximumNights,
      min_nights: this.minimumNights
    }, String(this.selectedListing.id)).subscribe(() => {
      this.isGLobalStaysSaving = false;
    }, err => {
      this.isGLobalStaysSaving = false;
    });
  }
}
