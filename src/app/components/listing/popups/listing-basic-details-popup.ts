import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {StayDuvetService} from '../../../services/stayduvet';
import {Listing} from '../../../models/listing';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {Store} from '@ngrx/store';
import {getIsTagsLoaded, getIsTagsLoading, getTags, State} from '../../../reducers/index';
import {UpdateSuccessAction} from '../../../actions/listing';
import {getApartmentTypes, getBedTypes, default as Utils} from '../../../utils';
import {QuantityInputComponent} from '../../elements/quantity-input';
import {Room} from '../../../models/room';
import {Observable} from "rxjs/Observable";
import {isNullOrUndefined} from "util";
import {Tag} from "../../../models/tag";
import {Subscription} from "rxjs/Subscription";
import {ControlPosition, MapTypeControlOptions} from '../../../../../node_modules/@agm/core/services/google-maps-types';

/**
 * Created by piyushkantm on 30/06/17.
 */
@Component({
  selector: 'sd-listing-basic-detials-popup',
  template: `
    <sd-modal-popup-layout title="Basic Details">
      <div fxLayout="column" style="width: 98%; padding-bottom: 20px;" fxLayoutGap="20px">
        <mat-tab-group (selectChange)='onSelectChange($event)'>
          <mat-tab label="Property Details">
            <form fxLayout="column" fxLayoutGap="20px">

              <div fxLayout="row" fxLayoutAlign="space-between center">
                <mat-form-field class="width30">
                  <mat-select placeholder="Apartment Type" floatPlaceholder="never" 
                             [(ngModel)]="propertyInfo"
                             [ngModelOptions]="{standalone: true}">
                    <mat-option *ngFor="let apartmentType of apartmentTypes" [value]="apartmentType.slug">
                      {{ apartmentType.title }}
                    </mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
              <div fxLayout="row" fxLayoutAlign="space-between center">

                <div fxLayoutAlign="center center" fxLayoutGap="30px" class="width30">
                  <span>No of Guests:</span>
                  <sd-quantity-input tag="numberOfGuests" [quantity]="noOfGuests"
                                     (valueUpdate)="quantityInputValueChanged($event)"></sd-quantity-input>
                </div>

                <div fxLayoutAlign="center center" fxLayoutGap="30px" class="width30">
                  <span>No of Bathrooms:</span>
                  <sd-quantity-input tag="numberOfBathrooms" [quantity]="noOfBathrooms" [step]="0.5"
                                     (valueUpdate)="quantityInputValueChanged($event)"></sd-quantity-input>
                </div>

                <div fxLayoutAlign="center center" fxLayoutGap="30px" class="width30">
                  <span>No of Rooms:</span>
                  <sd-quantity-input tag="numberOfRooms" [quantity]="noOfRooms"
                                     (valueUpdate)="quantityInputValueChanged($event)"></sd-quantity-input>
                </div>
              </div>
              <div fxLayout="column">
                <div *ngFor="let room of rooms; let index = index" fxLayoutAlign="start center" fxLayoutGap="40px">
                  <h4>Room {{index + 1}}:</h4>

                  <mat-form-field class="width20">
                    <mat-select placeholder="Bed Type" floatPlaceholder="never" 
                               [(ngModel)]="rooms[index].bed_type"
                               [ngModelOptions]="{standalone: true}">
                      <mat-option *ngFor="let bedType of bedTypes" [value]="bedType.slug">
                        {{ bedType.title }}
                      </mat-option>
                    </mat-select>
                  </mat-form-field>

                  <div fxLayoutAlign="start center" fxLayoutGap="30px" class="width30">
                    <span>No of Beds:</span>
                    <sd-quantity-input
                      tag="numberOfBeds"
                      [index]="index"
                      [quantity]="room.no_of_beds"
                      (valueUpdate)="quantityInputValueChanged($event)">
                    </sd-quantity-input>
                  </div>

                  <!--<div fxLayoutAlign="start center" fxLayoutGap="20px" class="width30">-->
                  <!--<span>No of Beds:</span>-->
                  <!--<sd-quantity-input -->
                  <!--tag="numberOfBeds"-->
                  <!--[(ngModel)]="rooms[index].bed_type"-->
                  <!--[ngModelOptions]="{standalone: true}"-->
                  <!--(valueUpdate)="quantityInputValueChanged($event)">-->
                  <!--</sd-quantity-input>-->
                  <!--</div>-->

                </div>
              </div>

              <div fxLayout="row" fxLayoutAlign="end center">
                <div fxFlex="20%" fxLayoutAlign="end center">
                  <mat-spinner color="accent" *ngIf="isHomeSaving" [diameter]="30" [strokeWidth]="4"></mat-spinner>
                  <button mat-raised-button [disabled]="isHomeSaving" color="accent" (click)="homeSaveButtonCLicked()">
                    Save
                  </button>
                </div>
              </div>
            </form>
          </mat-tab>

          <mat-tab label="Location Details">
            <div fxLayoutAlign="center">
              <form style="width: 100%;" [formGroup]="formGroup" (ngSubmit)="locationSaveButtonCLicked()">
                <div fxLayout="row" fxLayoutAlign="space-around stretch" fxLayoutGap="15px">
                  <mat-form-field fxFlex="50%">
                    <input matInput placeholder="Street Number & Name" formControlName='street'>
                  </mat-form-field>
                  <mat-form-field fxFlex="50%">
                    <input matInput placeholder="Unit, Suite, Floor, Building etc." formControlName='building'>
                  </mat-form-field>
                </div>
                <div fxLayout="row" fxLayoutAlign="space-around stretch" fxLayoutGap="15px">
                  <mat-form-field fxFlex="50%">
                    <input matInput placeholder="City" formControlName='city'>
                  </mat-form-field>
                  <mat-form-field fxFlex="50%">
                    <input matInput placeholder="State/Province" formControlName='state'>
                  </mat-form-field>
                </div>
                <div fxLayout="row" fxLayoutAlign="space-around stretch" fxLayoutGap="15px">
                  <mat-form-field fxFlex="50%">
                    <input matInput placeholder="Postal/Zipcode" formControlName='pincode'>
                  </mat-form-field>
                  <mat-form-field fxFlex="50%">
                    <input matInput placeholder="Country" formControlName='country_code'>
                  </mat-form-field>
                </div>
                <div fxLayout="row" fxLayoutAlign="end center">
                  <div fxFlex="20%" fxLayoutAlign="end center">
                    <mat-spinner color="accent" *ngIf="isLocationSaving" [diameter]="30" [strokeWidth]="4"></mat-spinner>
                    <button mat-raised-button fxFlexAlign="end" [disabled]="isLocationSaving" color="accent"
                            type="submit">
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </mat-tab>
          <mat-tab label="Tags">

            <div fxLayout="column" fxLayoutGap="10px" *ngIf="!isCreateTagUIVisible">

              <div>


                <div fxLayout="row" fxLayoutAlign="space-between center" fxLayoutGap="10px">

                  <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="10px">
                    <mat-form-field>
                      <mat-select
                        placeholder="Select Tag"
                        [(ngModel)]="selectedTag"
                        color="accent">
                        <mat-option *ngFor="let tag of filteredtags" [value]="tag">
                          {{tag}}
                        </mat-option>
                      </mat-select>
                    </mat-form-field>

                    <button mat-raised-button color="accent" [disabled]="loading" (click)="attachTag()">Add Tag</button>
                    <mat-spinner color="accent" *ngIf="loading" [diameter]="30" [strokeWidth]="4"></mat-spinner>
                  </div>
                  <button mat-raised-button color="accent" (click)="showCreateTagUI()">Create New Tag</button>

                </div>

                <mat-error style="font-size:x-small; margin-bottom: 10px;">{{error}}</mat-error>
              </div>

              <div fxLayout="row" fxLayoutAlign="start center" fxLayoutWrap>
                <mat-chip-list>
                  <mat-chip style=" padding: 0px; margin-top: 0px; margin-bottom: 0px; " *ngFor="let tag of allTags">
                    <span style="font-weight: bold;">&nbsp; &nbsp; {{tag.title}}</span>
                    <button mat-icon-button (click)="removeTag(tag)">
                      <mat-icon>close</mat-icon>
                    </button>
                  </mat-chip>
                </mat-chip-list>
              </div>
            </div>

            <div fxLayout="column" fxLayoutGap="10px" *ngIf="isCreateTagUIVisible">
              <div fxLayout="row" fxLayoutAlign="start start">
                <button mat-raised-button color="accent" (click)="hideCreateTagUI()">
                  <mat-icon>arrow_back</mat-icon>
                  Back
                </button>
              </div>

              <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="10px">
                <mat-form-field>
                  <input matInput placeholder="Enter tag" [(ngModel)]="inputTag">
                </mat-form-field>

                <button mat-raised-button color="accent" [disabled]="creatingTag" (click)="createNewTag()">Create Tag
                </button>
                <mat-spinner color="accent" *ngIf="creatingTag" [diameter]="30" [strokeWidth]="4"></mat-spinner>

              </div>
              <mat-error style="font-size:x-small; margin-bottom: 10px;">{{tagError}}</mat-error>

            </div>
          </mat-tab>

          <mat-tab label="Location on Map">
            <div fxLayout="column" fxLayoutGap="10px">

              <button mat-raised-button
                      fxFlexAlign="end"
                      (click)="!isEditingMap && editLocationOnMap()"
                      color="{{editButtonColor}}">
                Edit Location
              </button>
              <agm-map *ngIf="isMapVisible"
                       [latitude]="latitude"
                       [longitude]="longitude"
                       (centerChange)="isEditingMap && changeLocation($event)"
                       [zoom]="17">
                <agm-marker [latitude]="latitude" [longitude]="longitude"></agm-marker>
              </agm-map>

              <div fxFlexAlign="end" fxLayoutAlign=" center" *ngIf="isEditingMap" fxLayoutGap="10px">
                <button mat-raised-button (click)="cancelEditLocation()" color="primary">Cancel</button>
                <mat-spinner *ngIf="isEditLocationSaving" [diameter]="30" [strokeWidth]="4"></mat-spinner>
                <button mat-raised-button (click)="saveEditLocation()" color="accent">Save</button>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </sd-modal-popup-layout>
  `,
  styles: [`
    mat-spinner {
      width: 24px;
      height: 24px;
      margin-right: 20px;
    }

    .width20 {
      width: 24%;
    }

    .width30 {
      width: 32%;
    }

    .width80 {
      width: 80%;
    }

    .width50 {
      width: 48%;
    }

    mat-spinner {
      width: 30px;
      height: 30px;
    }

    agm-map {
      height: 300px;
      width: 100%;
    }

    /*Tabs*/

    ::ng-deep
    .mat-ink-bar {
      background-color: #194267 !important;
      height: 5px !important;
    }

    ::ng-deep
    .mat-tab-label {
      opacity: 1 !important;
      font-weight: bold;
    }

    ::ng-deep
    .mat-tab-body {
      margin-top: 20px !important;
    }
  `]
})
export class ListingBasicDetailsPopupComponent implements OnInit, OnDestroy {

  formGroup: FormGroup;
  street: FormControl;
  building: FormControl;
  city: FormControl;
  state: FormControl;
  pincode: FormControl;
  country: FormControl;

  @Input() listing: Listing;


  mapTypeControlOption = {position: ControlPosition.TOP_RIGHT}
  isMapVisible: boolean = false;
  editButtonColor = 'primary';
  isEditingMap: boolean = false;

  latitude: number;
  longitude: number;
  isEditLocationSaving: boolean = false;
  isLocationSaving: Boolean = false;
  isHomeSaving: Boolean = false;

  rooms: Room[];
  noOfGuests;
  propertyInfo;
  noOfRooms;
  noOfBathrooms;

  apartmentTypes;
  bedTypes;

  tags = [];
  filteredtags = [];
  tagsLoading = false;
  tagsLoaded = false;
  inputString;
  error;
  tagError;
  loading = false;
  creatingTag = false;
  allTags: Tag[];
  selectedTag;

  inputTag;

  isCreateTagUIVisible = false;

  private isAlive: boolean = true;

  constructor(private service: StayDuvetService, private dialog: MatDialog, private store: Store<State>) {
    this.setUpTags();
    this.apartmentTypes = getApartmentTypes();
    this.bedTypes = getBedTypes();
    this.street = new FormControl(null, []);
    this.building = new FormControl(null, []);
    this.city = new FormControl(null, []);
    this.state = new FormControl(null, []);
    this.pincode = new FormControl(null, []);
    this.country = new FormControl(null, []);

    this.formGroup = new FormGroup({
      street: this.street,
      building: this.building,
      city: this.city,
      state: this.state,
      pincode: this.pincode,
      country_code: this.country,
    });
  }

  ngOnInit() {
    this.latitude = this.listing.lat;
    this.longitude = this.listing.lng;
    this.allTags = this.listing.getTags() || [];
    this.street.setValue(this.listing.street);
    this.building.setValue(this.listing.building);
    this.city.setValue(this.listing.city);
    this.state.setValue(this.listing.state);
    this.pincode.setValue(this.listing.pincode);
    this.country.setValue(this.listing.country_code);
    this.rooms = this.listing.getRooms() != null ? this.listing.getRooms() : [];
    this.noOfRooms = this.listing.getRooms() != null ? this.listing.getRooms().length : 0;
    this.noOfBathrooms = this.listing.bathrooms;
    this.noOfGuests = this.listing.maximum_guest_number != null ? this.listing.maximum_guest_number : 0;
    this.propertyInfo = this.listing.property_info != null ? this.listing.property_info : '';
  }

  locationSaveButtonCLicked() {
    this.isLocationSaving = true;
    const data = this.formGroup.value;
    this.service.updateListingDetails(data, String(this.listing.id)).subscribe((listing) => {
      this.isLocationSaving = false;
      this.dialog.closeAll();
    },  () => {
      this.isLocationSaving = false;
    });
  }

  editLocationOnMap() {
    this.isEditingMap = true;
    this.editButtonColor = 'accent';
  }

  cancelEditLocation() {
    this.isEditingMap = false;
    this.editButtonColor = 'primary';
    this.longitude = this.listing.lng;
    this.latitude = this.listing.lat;
  }

  saveEditLocation() {
    this.isEditLocationSaving = true;
    const data = {};
    data['lat'] = this.latitude;
    data['lng'] = this.longitude;
    console.log(data);
    this.service.updateListingDetails(data, String(this.listing.id)).subscribe((listing) => {
      this.isEditLocationSaving = false;
      this.isEditingMap = false;
      this.editButtonColor = 'primary';
    }, () => {
      this.isEditLocationSaving = false;
      this.isEditingMap = false;
      this.editButtonColor = 'primary';
    });
  }

  changeLocation(event) {
    this.latitude = event.lat
    this.longitude = event.lng
  }


  homeSaveButtonCLicked() {
    this.isHomeSaving = true;
    const data = {
      'property_info': this.propertyInfo,
      'maximum_guest_number': this.noOfGuests,
      'rooms': this.rooms,
      'bathrooms': this.noOfBathrooms,
    };

    this.service.updateListingDetails(data, String(this.listing.id)).subscribe((listing) => {
      this.isHomeSaving = false;
      this.dialog.closeAll();
    }, () => {
      this.isHomeSaving = false;
    });
  }

  onSelectChange(event) {
    console.log(event)
    if (event.index === 3) {
      this.isMapVisible = true;
    }
  }

  quantityInputValueChanged(quantityObject: QuantityInputComponent) {
    if (quantityObject.tag === 'numberOfRooms') {
      if (quantityObject.quantity > this.noOfRooms) {
        this.rooms.push(Object.assign(new Room(), {no_of_beds: 1, bed_type: 'twin'}));
        this.noOfRooms = quantityObject.quantity;
      } else if (quantityObject.quantity < this.noOfRooms) {
        this.rooms.pop();
        this.noOfRooms = quantityObject.quantity;
      }
    } else if (quantityObject.tag === 'numberOfGuests') {
      this.noOfGuests = quantityObject.quantity;
    } else if (quantityObject.tag === 'numberOfBeds') {
      this.rooms[quantityObject.index].no_of_beds = quantityObject.quantity;
    } else if (quantityObject.tag === 'numberOfBathrooms') {
      this.noOfBathrooms = quantityObject.quantity;
    }
  }

  private setUpTags() {
    this.store.select(getIsTagsLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.tagsLoading = loading;
    });
    this.store.select(getIsTagsLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.tagsLoaded = loaded;
    });
    this.store.select(getTags).takeWhile(() => this.isAlive).subscribe((tags) => {
      this.tags = tags;
      this.filteredtags = this.tags;
    });

    const combinedObservable = Observable.merge(
      this.store.select(getIsTagsLoading),
      this.store.select(getIsTagsLoaded),
      this.store.select(getTags),
      ((tags, loading, loaded) => {
      })
    );

    combinedObservable.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.tagsLoaded && !this.tagsLoading) {
          this.service.getTags().subscribe();
        }
      });
  }

  filterTags($event) {
    const val = $event.target.value;
    if (val !== '' || val !== null) {
      this.error = null;
    }
    this.filteredtags = this.tags.filter(tag => tag.includes(this.titleCase(val)));
  }


  removeTag(tag) {
    this.service.removeTag(String(this.listing.id), tag).subscribe(res => {
      this.allTags = this.allTags.filter(data => data.id !== tag.id);
    });
  }

  attachTag() {
    if (isNullOrUndefined(this.selectedTag)) {
      this.error = 'This field is required';
      return;
    }
    this.error = null;
    this.loading = true;
    this.service.attachTag({tag_string: this.selectedTag}, String(this.listing.id)).subscribe((res: Tag) => {
      if (res) {
        this.loading = false;
        const tag = this.allTags.find(data => data.title == res.title);
        if (isNullOrUndefined(tag)) {
          this.allTags = [...this.allTags, res];
        }
        this.selectedTag = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  private titleCase(str) {
    return str
      .toLowerCase()
      .split(' ')
      .map(function (word) {
        return word[0].toUpperCase() + word.substr(1);
      })
      .join(' ');
  }


  showCreateTagUI() {

    this.isCreateTagUIVisible = true;
  }

  hideCreateTagUI() {

    this.isCreateTagUIVisible = false;
  }

  createNewTag() {
    if (isNullOrUndefined(this.inputTag) || this.inputTag == '') {
      this.tagError = 'This field is required';
      return;
    }
    this.tagError = null;
    this.creatingTag = true;
    this.service.createTag({tag_string: this.inputTag}).subscribe((res: Tag) => {
      if (res) {
        this.creatingTag = false;
        this.inputTag = null;
        this.isCreateTagUIVisible = false;
      }
    }, () => {
      this.creatingTag = false;
      this.inputTag = null;
      this.isCreateTagUIVisible = false;
    });
  }
}
