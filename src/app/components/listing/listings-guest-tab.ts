import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {getListingById, State} from '../../reducers/index';
import {StayDuvetService} from '../../services/stayduvet';
import {Listing} from '../../models/listing';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UpdateSuccessAction} from '../../actions/listing';
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'sd-listing-guest-tab',
  template: `
    <form fxLayout="column" fxLayoutGap="60px" style="margin-left: 30px;margin-top: 30px; margin-bottom: 30px"
          [formGroup]="formGroup"
          (ngSubmit)="formGroup.valid && saveButtonCLicked()">
      <div fxLayout="row" fxLayoutAlign="start">
        <div fxLayout="column" fxLayoutGap="30px" fxFlex="60%">
          <div fxLayout="column" fxLayoutGap="10px">
            <span class="heading">How guest can book?</span>
            <span style="width: 800px" class="compact">Fun Fact: Instant book can give your listing an edge.Not only do guest prefer to book instantly.
           we're promoting instant book listings in search results.</span>
            <mat-radio-group class="example-radio-group" formControlName="instant_book">
              <mat-radio-button class="example-radio-button"
                               [value]="false">
                Guest who meet all your requirements can book
                <strong>without</strong>
                requesting
              </mat-radio-button>
              <mat-radio-button class="example-radio-button"
                               [value]="true">
                Instant book
              </mat-radio-button>
            </mat-radio-group>
          </div>

          <div fxLayout="column" fxLayoutGap="10px">
            <span class="heading">House Rules</span>
            <span class="compact">All guest will agree to your House Rules before sending a reservation request</span>
            <div class="margin">
              <mat-form-field style="width: 700px;">
                <textarea matInput rows="4"
                          style="background-color: white" formControlName="house_rules"></textarea>
              </mat-form-field>
            </div>
          </div>

          <div fxLayout="column" fxLayoutGap="10px">
            <span class="heading">House Rules</span>
            <span class="compact">All guest will agree to your House Rules before sending a reservation request</span>

            <div fxLayout="column" fxLayoutGap="10px" class="example-radio-group">
              <mat-checkbox formControlName='suitable_for_children'>Suitable for children (2-12 years)*
              </mat-checkbox>
              <mat-checkbox formControlName='suitable_for_infants'>Suitable for infants (under 2 years)*
              </mat-checkbox>
              <mat-checkbox formControlName='pets_allowed'>Pets allowed</mat-checkbox>
              <mat-checkbox formControlName='smoking_allowed'>Smoking allowed</mat-checkbox>
              <mat-checkbox formControlName='events_allowed'>Events or Filming allowed</mat-checkbox>
            </div>
          </div>

          <div fxLayout="column" fxLayoutGap="10px">
            <span class="heading">Additional Rules</span>
            <span class="compact">Some additional rules that you want to show to your guests.</span>
            <div class="margin">
              <mat-form-field style="width: 700px;">
                <textarea matInput rows="4"
                          style="background-color: white" formControlName="additional_rules"></textarea>
              </mat-form-field>
            </div>
          </div>
          <div fxLayout="column" fxLayoutGap="10px">
            <span class="heading">Details guest must know about your home</span>
            <span class="compact">Set expectations about your home that your must agree to before cooking.</span>
            <div fxLayout="column" fxLayoutGap="10px" class="example-radio-group">
              <mat-checkbox formControlName='must_climb_stairs'>Must Climb stairs</mat-checkbox>
              <mat-checkbox formControlName='potential_for_noise'>Potential for noise</mat-checkbox>
              <mat-checkbox formControlName='pets_live_on_property'>Pets live on property</mat-checkbox>
              <mat-checkbox formControlName='no_parking_on_property'>No parking on property</mat-checkbox>
            </div>
          </div>
          <div fxLayout="column" fxLayoutGap="10px">
            <span class="heading">How far ahead can guests book your home?</span>
            <span class="compact">Set expectations about your home that your must agree to before cooking.</span>
            <mat-radio-group class="example-radio-group" formControlName='future_booking_limit'>
              <mat-radio-button class="example-radio-button" value="{{futureBookingLimit.noLimit}}">As far as they would
                like
              </mat-radio-button>
              <mat-radio-button class="example-radio-button" value="{{futureBookingLimit.threeMonths}}">3 months
              </mat-radio-button>
              <mat-radio-button class="example-radio-button" value="{{futureBookingLimit.sixMonths}}">6 months
              </mat-radio-button>
              <mat-radio-button class="example-radio-button" value="{{futureBookingLimit.nineMonths}}">12 months
              </mat-radio-button>
            </mat-radio-group>
          </div>
          <div fxLayout="column" fxLayoutGap="10px">
            <span class="heading">Policies</span>
            <span>These policies are uneditable and are chosen by your Duvet rep.</span>
            <div fxLayoutGap="15px" fxLayout="column" style="width: 600px;padding-top: 20px">
              <div fxLayout="row">
                <span>Check-in Time</span>
                <span style="flex: 1 1 auto"></span>
                <strong>{{selectedListing.check_in_time}}</strong>
              </div>
              <div fxLayout="row">
                <span>Check-Out Time</span>
                <span style="flex: 1 1 auto"></span>
                <strong>{{selectedListing.check_out_time}}</strong>
              </div>
              <div fxLayout="row">
                <span>Cancellation Policy</span>
                <span style="flex: 1 1 auto"></span>
                <strong>Strict</strong>
              </div>
            </div>
          </div>
        </div>
        <span style="flex: 1 1 auto"></span>
        <div>
          <div fxLayoutAlign="end" style="">
            <button mat-raised-button color="accent">EDIT SECTION</button>
          </div>
        </div>
      </div>
      <div fxLayoutAlign="end">
        <mat-spinner style="position: fixed ; bottom: 5.2%;right:1%" color="accent" *ngIf="isSaving" [diameter]="30" [strokeWidth]="4"></mat-spinner>
        <button style="position: fixed ; bottom:5%"mat-raised-button color="accent" type="submit">SAVE</button>
      </div>
    </form>
  `,
  styles: [`
    .heading {
      font-size: x-large;
      font-weight: bolder;
    }

    .example-radio-group {
      display: inline-flex;
      flex-direction: column;
      margin-left: 20px;
      margin-top: 10px;
    }

    .example-radio-button {
      margin: 5px;
    }

    mat-spinner {
      height: 30px;
      width: 30px;
    }

    .compact {
      font-size: 16px;
      font-weight: lighter;
    }

    .margin {
      margin-left: 20px;
    }
  `]
})

export class ListingsGuestTabComponent implements OnInit, OnDestroy {

  formGroup: FormGroup;
  bookingLimit: FormControl;
  instantBook: FormControl;

  houseRules: FormControl;
  suitableForChildren: FormControl;
  suitableForInfants: FormControl;
  petsAllowed: FormControl;
  smokingAllowed: FormControl;
  eventsAllowed: FormControl;
  additionalRules: FormControl;

  mustClimbStairs: FormControl;
  potentialForNoise: FormControl;
  petsLiveOnProperty: FormControl;
  noParkingOnProperty: FormControl;

  selectedListing: Listing;
  private dialogRef: MatDialogRef<any>;
  isSaving: Boolean = false;
  private isAlive: boolean = true;

  futureBookingLimit = {
    noLimit: 'no_limit',
    threeMonths: 'three_months',
    sixMonths: 'six_months',
    nineMonths: 'nine_months'
  };

  ngOnInit(): void {
    console.log('onInit sd-listing-tasks-tab');
    this.route.parent.params.subscribe((params) => {
      const listingId = +params['id'];
      this.store.select((state) => {
        return getListingById(state, listingId);
      }).takeWhile(()=>this.isAlive).subscribe((listing) => {
        this.selectedListing = listing;
        this.bookingLimit.setValue(listing.future_booking_limit);

        this.houseRules.setValue(listing.house_rules);
        this.instantBook.setValue(listing.instant_book);
        this.suitableForChildren.setValue(listing.suitable_for_children);
        this.suitableForInfants.setValue(listing.suitable_for_infants);
        this.petsAllowed.setValue(listing.pets_allowed);
        this.smokingAllowed.setValue(listing.smoking_allowed);
        this.eventsAllowed.setValue(listing.events_allowed);
        this.additionalRules.setValue(listing.additional_rules);

        this.mustClimbStairs.setValue(listing.must_climb_stairs);
        this.potentialForNoise.setValue(listing.potential_for_noise);
        this.petsLiveOnProperty.setValue(listing.pets_live_on_property);
        this.noParkingOnProperty.setValue(listing.no_parking_on_property);
      });
    });

  }


  constructor(private route: ActivatedRoute,
              private store: Store<State>,
              private service: StayDuvetService,
              private dialog: MatDialog) {
    this.bookingLimit = new FormControl(null, []);

    this.houseRules = new FormControl(null, []);
    this.instantBook = new FormControl(null, []);
    this.suitableForChildren = new FormControl(null, []);
    this.suitableForInfants = new FormControl(null, []);
    this.petsAllowed = new FormControl(null, []);
    this.smokingAllowed = new FormControl(null, []);
    this.eventsAllowed = new FormControl(null, []);
    this.additionalRules = new FormControl(null, []);

    this.mustClimbStairs = new FormControl(null, []);
    this.potentialForNoise = new FormControl(null, []);
    this.petsLiveOnProperty = new FormControl(null, []);
    this.noParkingOnProperty = new FormControl(null, []);

    this.formGroup = new FormGroup({
      future_booking_limit: this.bookingLimit,
      instant_book: this.instantBook,

      house_rules: this.houseRules,
      suitable_for_children: this.suitableForChildren,
      suitable_for_infants: this.suitableForInfants,
      pets_allowed: this.petsAllowed,
      smoking_allowed: this.smokingAllowed,
      events_allowed: this.eventsAllowed,
      additional_rules: this.additionalRules,

      must_climb_stairs: this.mustClimbStairs,
      potential_for_noise: this.potentialForNoise,
      pets_live_on_property: this.petsLiveOnProperty,
      no_parking_on_property: this.noParkingOnProperty,
    });
  }


  saveButtonCLicked() {
    this.isSaving = true;
    const data = this.formGroup.value;
    console.log(data);
    this.service.updateListingDetails(data, String(this.selectedListing.id)).subscribe((listing) => {
      this.isSaving = false;
    }, () => {
      this.isSaving = false;
    });
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
