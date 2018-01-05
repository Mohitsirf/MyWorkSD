import {AfterViewInit, animate, Component, OnDestroy, OnInit, state, style, transition, trigger} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ListingCommonTextPopupComponent} from './popups/listing-common-text-popup';
import {ListingAmenitiesPopupComponent} from './popups/listing-amenities-popup';
import {ListingBasicDetailsPopupComponent} from './popups/listing-basic-details-popup';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {getListingById, State} from '../../reducers/index';
import {Listing} from '../../models/listing';
import {Image} from '../../models/image';
import {getApartmentType, getApartmentTypes} from '../../utils';
import {ListingImagesPopupComponent} from './popups/listing-images-popup';
import {ListingNamePopupComponent} from './popups/listing-listing-name-popup';
import {amenitiesObject} from '../../utils/constants';

/**
 * Created by ubuntu on 9/7/17.
 */

@Component({
  selector: 'sd-listing-listing-tab',
  animations: [
    trigger('slideIn', [
      state('*', style({'overflow-y': 'hidden'})),
      state('void', style({'overflow-y': 'hidden'})),
      transition('* => void', [
        style({height: '*'}),
        animate(250, style({height: 0}))
      ]),
      transition('void => *', [
        style({height: '0'}),
        animate(250, style({height: '*'}))
      ])
    ])],
  template: `
    <div fxLayout="column" fxLayoutAlign="start stretch" fxLayoutGap="15px" class="bottom-padding">
      <mat-card class="primary" fxLayout="column" fxLayoutAlign="start stretch">
        <img mat-card-image style="margin-top:-20%" src="{{currentImage.original_url}}" *ngIf="currentImage">
        <div fxFlexAlign="center" class="image-bottom-dots">
          <span class="dots" *ngFor="let img of images;  let index = index" (click)="dotsClicked(index)">
            <span *ngIf="index == imageIndex" style="font-size: 40px;color: black;">•</span>
            <span *ngIf="index != imageIndex" style="font-size: 30px">•</span>
          </span>
        </div>

        <a class="prev" (click)="backwardImage()">&#10094;</a>
        <a class="next" (click)="forwardImage()">&#10095;</a>
        <button class="image-bottom-button" mat-raised-button color="accent" fxFlexAlign="end"
                (click)="openEditImagesDialog()">Edit Photos
        </button>
      </mat-card>

      <div id="content" fxLayout="column" fxLayoutAlign="start stretch" fxLayoutGap="30px">

        <div fxLayout="column" fxLayoutAlign="center stretch" fxLayoutGap="10px">
          <div fxLayout="column" fxLayoutAlign="center start" fxLayoutGap="10px">
            <div fxLayoutAlign=" center" fxLayoutGap="20px">
              <span style="font-size: 34px;font-weight: bolder">{{ listing.title | titlecase }}</span>
              <mat-icon (click)="editListingNamePopup()" style="cursor: pointer">border_color</mat-icon>
            </div>
            
            <div fxLayoutAlign=" center" fxLayoutGap="20px">
              <span style="font-size: 30px;font-weight: bold">{{ listing.headline | titlecase }}</span>
            </div>

            <div fxLayoutAlign="space-between center" style="width: 100%">
              <span>{{listing?.getFullAddress() }}</span>
              <button mat-raised-button color="accent" (click)="openLocationPopup()">Edit Section</button>
            </div>
          </div>
          <div fxLayout="row">
            <div fxLayout="row" fxLayoutGap="10px" fxLayoutWrap>
              <mat-chip-list *ngFor="let tag of listing.getTags()">
                <mat-chip>
                  <span style="width: 100%;text-align: center">
                    {{tag.title}}
                  </span>
                </mat-chip>
              </mat-chip-list>
            </div>
          </div>
          <div fxLayoutAlign="start center" fxLayoutWrap>
            <sd-listing-round-image-card imgPath="../../assets/images/house.jpg">
              {{getApartmentType(listing.property_info).title}}
            </sd-listing-round-image-card>
            <sd-listing-round-image-card imgPath="../../assets/images/guest.png">
              {{listing.maximum_guest_number}} guests
            </sd-listing-round-image-card>
            <sd-listing-round-image-card imgPath="../../assets/images/bed.png">
              {{listing.getNumberOfRooms()}} bedroom
            </sd-listing-round-image-card>
            <sd-listing-round-image-card imgPath="../../assets/images/bed.png">
              {{listing.getNumberOfBeds()}} beds
            </sd-listing-round-image-card>
            <sd-listing-round-image-card imgPath="../../assets/images/bathroom.png">
              {{listing.bathrooms}} Bathrooms
            </sd-listing-round-image-card>
          </div>
        </div>

        <hr>

        <div fxLayout="column" fxLayoutGap="4px">
          <mat-card  class="header">
            <div fxLayout="row" style="margin-top: -10px" fxLayoutAlign="space-between center">
              <div fxLayout="row" fxLayoutGap="20px" fxLayoutAlign="center center">
                <span class="section-header">Amenities</span>
                <span style="font-size: 14px;color: #2d7cff;font-style: italic; cursor: pointer;"
                      (click)="showAminitiesPanelClicked()">
                ( {{showAminitiesPanelText}} )
              </span>
              </div>
              <button mat-fab color="accent" (click)="openEditAmenitiesDialog()">
                <mat-icon>border_color</mat-icon>
              </button>
            </div>
          </mat-card>


          <mat-card class="padding" *ngIf="showAminitiesPanel" [@slideIn] fxLayoutAlign="start center" fxLayoutWrap>
              <div fxLayoutAlign="stretch center" fxFlex="30%" *ngFor="let amenity of amenities"
                   style="font-size: 14px">
                <div *ngIf="amenitiesObject[amenity].exists" fxLayoutAlign=" center">
                  <mat-icon>{{amenitiesObject[amenity].icon}}</mat-icon>
                  <p>{{' ' + amenitiesObject[amenity].title}}</p>
                </div>
                <div *ngIf="!amenitiesObject[amenity].exists" fxLayoutAlign=" center">
                  <mat-icon style="color: #c8c8c8">{{amenitiesObject[amenity].icon}}</mat-icon>
                  <p style="text-decoration: line-through; color: #c8c8c8">
                    {{' ' + amenitiesObject[amenity].title}}</p>
                </div>
              </div>
              <span style="height: 0px" fxFlex="30%" *vaFlexAlignmentHack="2"></span>
          </mat-card>
        </div>

        

        <div fxLayout="column" fxLayoutGap="4px">
          <mat-card  class="header">
            <div fxLayout="row" style="margin-top: -10px" fxLayoutAlign="space-between center">
              <span class="section-header">Summary About this listing:</span>
              <button mat-fab color="accent" (click)="openDialog('Summary About this listing', 'summary')">
                <mat-icon>border_color</mat-icon>
              </button>
            </div>
          </mat-card>
         

          <mat-card class="padding">
            <div style="margin-top: -10px">
              <p class="multi-line-content">
                {{listing.summary}}
              </p>
            </div>
          </mat-card>
        </div>


        <div fxLayout="column" fxLayoutGap="4px">
          <mat-card  class="header">
            <div fxLayout="row" style="margin-top: -10px" fxLayoutAlign="space-between center">
              <span class="section-header">The Space:</span>
              <button mat-fab color="accent" (click)="openDialog('The Space', 'the_space')">
                <mat-icon>border_color</mat-icon>
              </button>
            </div>
          </mat-card>


          <mat-card class="padding">
            <div style="margin-top: -10px">
              <p class="multi-line-content">
                {{ listing.the_space }}
              </p>
            </div>
          </mat-card>
        </div>


        <div fxLayout="column" fxLayoutGap="4px">
          <mat-card  class="header">
            <div fxLayout="row" style="margin-top: -10px" fxLayoutAlign="space-between center">
              <span class="section-header">Guest Access:</span>
              <button mat-fab color="accent" (click)="openDialog('Guest Access', 'guest_access')">
                <mat-icon>border_color</mat-icon>
              </button>
            </div>
          </mat-card>


          <mat-card class="padding">
            <div style="margin-top: -10px">
              <p class="multi-line-content">
                {{ listing.guest_access }}
              </p>
            </div>
          </mat-card>
        </div>


        <div fxLayout="column" fxLayoutGap="4px">
          <mat-card  class="header">
            <div fxLayout="row" style="margin-top: -10px" fxLayoutAlign="space-between center">
              <span class="section-header">The Neighbourhood:</span>
              <button mat-fab color="accent" (click)="openDialog('The Neighbourhood', 'the_neighbourhood')">
                <mat-icon>border_color</mat-icon>
              </button>
            </div>
          </mat-card>


          <mat-card class="padding">
            <div style="margin-top: -10px">
              <p class="multi-line-content">
                {{ listing.the_neighbourhood }}
              </p>
            </div>
          </mat-card>
        </div>

        <div fxLayout="column" fxLayoutGap="4px">
          <mat-card  class="header">
            <div fxLayout="row" style="margin-top: -10px" fxLayoutAlign="space-between center">
              <span class="section-header">Interaction With Guests:</span>
              <button mat-fab color="accent" (click)="openDialog('Interaction With Guests', 'interaction_with_guests')">
                <mat-icon>border_color</mat-icon>
              </button>
            </div>
          </mat-card>


          <mat-card class="padding">
            <div style="margin-top: -10px">
              <p class="multi-line-content">
                {{ listing.interaction_with_guests }}
              </p>
            </div>
          </mat-card>
        </div>


        <div fxLayout="column" fxLayoutGap="4px">
          <mat-card  class="header">
            <div fxLayout="row" style="margin-top: -10px" fxLayoutAlign="space-between center">
              <span class="section-header">Getting Around:</span>
              <button mat-fab color="accent" (click)="openDialog('Getting Around', 'getting_around')">
                <mat-icon>border_color</mat-icon>
              </button>
            </div>
          </mat-card>


          <mat-card class="padding">
            <div style="margin-top: -10px">
              <p class="multi-line-content">
                {{ listing.getting_around }}
              </p>
            </div>
          </mat-card>
        </div>


        <div fxLayout="column" fxLayoutGap="4px">
          <mat-card  class="header">
            <div fxLayout="row" style="margin-top: -10px" fxLayoutAlign="space-between center">
              <span class="section-header">Owner Story:</span>
              <button mat-fab color="accent" (click)="openDialog('Story about the Owner', 'owner_story')">
                <mat-icon>border_color</mat-icon>
              </button>
            </div>
          </mat-card>


          <mat-card class="padding">
            <div style="margin-top: -10px">
              <p class="multi-line-content">
                {{ listing.owner_story }}
              </p>
            </div>
          </mat-card>
        </div>


        <div fxLayout="column" fxLayoutGap="4px">
          <mat-card  class="header">
            <div fxLayout="row" style="margin-top: -10px" fxLayoutAlign="space-between center">
              <span class="section-header">Other Things to Note:</span>
              <button mat-fab color="accent" (click)="openDialog('Other Things to Note', 'other_notes')">
                <mat-icon>border_color</mat-icon>
              </button>
            </div>
          </mat-card>


          <mat-card class="padding">
            <div style="margin-top: -10px">
              <p class="multi-line-content">
                {{listing.other_notes}}
              </p>
            </div>
          </mat-card>
        </div>

      </div>
    </div>
  `,
  styles: [`

    .section-header {
      font-size: 28px;
      font-family: 'Montserrat', sans-serif;
      font-weight: bolder;
      color: dimgray;
    }

    .multi-line-content {
      font-family: 'Roboto', sans-serif;
      white-space: pre-line;
      padding-left: 15px;
      color: gray;
    }

    .padding {
      cursor: pointer;
      padding: -10px -10px -10px -10px;
      background: -webkit-linear-gradient(top, #ffffff 0%, #ffffff 100%);
    }

    mat-card.primary {
      width: 100%;
      height: 400px;
      overflow: hidden;
    }

    .prev, .next {
      cursor: pointer;
      position: absolute;
      top: 40%;
      width: auto;
      padding: 16px;
      color: white;
      font-weight: bold;
      font-size: 18px;
      transition: 0.6s ease;
      border-radius: 0 3px 3px 0;
    }

    .next {
      right: 0;
      border-radius: 3px 0 0 3px;
    }

    .prev {
      left: 0;
      border-radius: 3px 0 0 3px;
    }

    .prev:hover, .next:hover {
      background-color: rgba(0, 0, 0, 0.8);
    }

    .slideshow-container {
      width: 100%;
    }

    .image-bottom-dots, .image-bottom-button {
      position: absolute;
      z-index: 1;
      bottom: 30px;
    }

    .header {
      cursor: pointer;
      padding: -10px -10px -10px -10px;
      background: whitesmoke;
    }

    .dots {
      text-align: center;
      color: white;
      cursor: pointer;
      padding-left: 2px;
      padding-right: 2px;
    }

    #content {
      padding-right: 20px;
      padding-left: 20px;
    }

    span {
      font-size: 20px;
    }

    sd-listing-round-image-card {
      height: 200px;
    }

    .para {
      width: 70%;
    }

    .bottom-padding {
      padding-bottom: 100px;
    }

    hr {
      width: 100%;
    }
    
    /*Tabs*/
    
      ::ng-deep
    .mat-ink-bar {
      background-color: #194267 !important;
      height: 5px !important;
    }
  `]
})
export class ListingListingTabComponent implements OnInit, AfterViewInit, OnDestroy {

  currentImage: Image;
  images: Image[];
  imageIndex: number;
  listing: Listing;
  amenities: string[];
  amenitiesObject = {... amenitiesObject};
  private dialogRef: MatDialogRef<any>;
  private isAlive: boolean = true;
  showAminitiesPanel = false;
  showAminitiesPanelText = 'show all';
  getApartmentType = getApartmentType;
  ngAfterViewInit() {
    window.scrollTo(0, 0);
  }

  constructor(private dialog: MatDialog,
              private route: ActivatedRoute,
              private router: Router,
              private store: Store<State>) {
  }

  ngOnInit(): void {
    console.log('onInit sd-listing-listing-tab');
    this.amenities = Object.keys(this.amenitiesObject);
    this.route.parent.params.subscribe(params => {
      const listingId = +params['id'];

      this.store.select((state) => {
        return getListingById(state, listingId);
      }).takeWhile(() => this.isAlive).subscribe((listing) => {
        this.amenitiesObject = {...amenitiesObject};
        this.amenities = Object.keys(this.amenitiesObject);
        this.listing = listing;
        this.images = this.listing.getThumbnails();
        this.imageIndex = 0;
        if (this.images !== null) {
          this.currentImage = this.images[this.imageIndex];
        } else {
          this.currentImage = null;
        }
        if (this.listing.amenities) {
          for (const amenity of listing.amenities) {
            if (this.amenitiesObject[amenity]) {
              this.amenitiesObject[amenity].exists = true;
            }
          }
        }
      });

    });
  }

  showAminitiesPanelClicked() {
    this.showAminitiesPanel = !this.showAminitiesPanel;
    if (this.showAminitiesPanel) {
      this.showAminitiesPanelText = 'hide all';
    } else {
      this.showAminitiesPanelText = 'show all';
    }
  }

  openDialog(title: String, key: String, placeholder?: String) {
    this.dialogRef = this.dialog.open(ListingCommonTextPopupComponent);
    const instance = this.dialogRef.componentInstance;
    instance.listing = this.listing;
    instance.title = title;
    instance.key = key;
    instance.placeholder = placeholder;
    this.dialogRef.updateSize('100%');
  }

  openEditAmenitiesDialog() {
    this.dialogRef = this.dialog.open(ListingAmenitiesPopupComponent);
    const instance = this.dialogRef.componentInstance;
    instance.listing = this.listing;
    this.dialogRef.updateSize('100%', '100%');

  }

  openEditImagesDialog() {
    this.dialogRef = this.dialog.open(ListingImagesPopupComponent);
    const instance = this.dialogRef.componentInstance;
    instance.listingId = this.listing.id;
    this.dialogRef.updateSize('100%', '100%');

  }

  openLocationPopup() {
    this.dialogRef = this.dialog.open(ListingBasicDetailsPopupComponent);
    const instance = this.dialogRef.componentInstance;
    instance.listing = this.listing;
    this.dialogRef.updateSize('100%', '100%');

  }

  editListingNamePopup() {
    this.dialogRef = this.dialog.open(ListingNamePopupComponent);
    const instance = this.dialogRef.componentInstance;
    instance.listing = this.listing;
    this.dialogRef.updateSize('100%', '100%');

  }

  dotsClicked(index: number) {
    this.imageIndex = index;
    this.currentImage = this.images[this.imageIndex];
  }

  forwardImage() {
    if (this.imageIndex < this.images.length - 1) {
      this.imageIndex += 1;
      this.currentImage = this.images[this.imageIndex];
    }
  }

  backwardImage() {
    if (this.imageIndex > 0) {
      this.imageIndex -= 1;
      this.currentImage = this.images[this.imageIndex];
    }
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
