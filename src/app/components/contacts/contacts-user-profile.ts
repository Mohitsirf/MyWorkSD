/**
 * Created by aditya on 24/8/17.
 */
import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormGroup, Validators, FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {
   getActiveContacts, getContactById, getContacts, getInActiveContacts, getIsActiveContactLoaded,
  getIsActiveContactLoading, getIsInActiveContactLoaded, getIsInActiveContactLoading,
  getListings,
  State
} from '../../reducers/index';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {StayDuvetService} from '../../services/stayduvet';
import {isNullOrUndefined} from 'util';
import {Listing} from '../../models/listing';
import {User} from '../../models/user';
import {HttpEventType, HttpResponse} from '@angular/common/http';
import {ContactUpdateSuccessAction} from '../../actions/contact';

@Component({
  selector: 'sd-contacts-user-profile',
  template: `
    <sd-owner-main-layout-fullwidth>
      <div id="spinner" *ngIf="!isContactLoaded" fxLayout="row" fxLayoutAlign="center center" fxFlex="100%">
        <mat-spinner color="accent" [diameter]="60" [strokeWidth]="5"></mat-spinner>
      </div>
      
      <div *ngIf="isContactLoaded" class="requiredHeight" fxFlex="100%" fxLayout="column" fxLayoutAlign="start">
        <div class="pre1" fxFlex="100%" >
          <section style="height: 230px" >
            <div fxLayout="column" style="margin-top: 5%" fxLayoutAlign="center center">
              <img *ngIf="uploadProgress == 0" (click)="updateImage()" class="profileImage" src="{{getProfilePic(selectedContact?.pic_thumb_url)}}">
              <input type="file" accept="image/*" style="visibility: hidden" #addImageWrapper>
              <span *vaFlexAlignmentHack></span>
              <div  fxLayoutAlign="center center" *ngIf="uploadProgress != 0">
                <span style="color: white; font-size: large">{{uploadProgress}} %</span>
              </div>
              <p style="color: white;font-size:26px" align="center"><b>{{selectedContact?.getFullName()}}</b></p>
            </div>
          </section>
          
          <section>
          
            <div fxFlex="100%" style="margin: 20px; color: white" fxLayoutAlign="end center">
              <mat-slide-toggle
                *ngIf="!spinning"
                (change)="onActiveStatusChanged($event)"
                [checked]="selectedContact?.is_active">
                Active
              </mat-slide-toggle>
              
              <mat-spinner *ngIf="spinning" [diameter]="30" [strokeWidth]="4"></mat-spinner>
            </div>
            
          </section>
        </div>

        <div fxFlex="90%" style="overflow-y: hidden;">

          <mat-tab-group style="margin-left: 30px; margin-bottom: 30px;margin-right: 30px;">
            <mat-tab label="USER PROFILE">
              <sd-contact-info [contact]="selectedContact"  ></sd-contact-info>
            </mat-tab>
            
             <mat-tab *ngIf="showBankInfoTab" label="BANK INFO">
              <sd-contact-bank-info [contact]="selectedContact"  ></sd-contact-bank-info>
              </mat-tab>

            <mat-tab *ngIf="showUserTypeTab" label="USER TYPE">
            <sd-contact-type-info [contact]="selectedContact" ></sd-contact-type-info >
            </mat-tab>

            <mat-tab  *ngIf="showReservationInfoTab" label="RESERVATIONS">
              <sd-contact-reservations-info [contact]="selectedContact"  ></sd-contact-reservations-info>
            </mat-tab>
            
            <mat-tab  *ngIf="showListingInfoTab" label="LISTINGS">
            <sd-contact-listing-info [contact]="selectedContact"  ></sd-contact-listing-info >
             </mat-tab>
            
             <mat-tab label="LOG">
            <sd-contact-log-info [contact]="selectedContact" ></sd-contact-log-info >
            </mat-tab>
          </mat-tab-group>

          <div style="margin-top:10px"></div>
        </div>
      </div>
    </sd-owner-main-layout-fullwidth>
  `,
  styles: [`

    #spinner {
      position: fixed;
      top: 45%;
      right: 40%;
    }

    .profileImage {
      width: 150px;
      height: 150px;
      background-repeat: no-repeat;
      -webkit-border-radius: 99em;
      -moz-border-radius: 99em;
      border-radius: 99em;
      border: 5px solid #eee;
      box-shadow: 0 3px 2px rgba(0, 0, 0, 0.3);
    }

    .pre1 {
      width: 100%;
      padding-left: 1.5%;
      flex: 0 0 0% !important;
      display: table;
      background-image: url(http://cssslider.com/sliders/demo-10/data1/images/3.jpg);
      background-size: cover;
      background-repeat: no-repeat;
      background-color: #464646;
    }

   

    /*Tabs*/

    /deep/
    .mat-ink-bar {
      background-color: #194267 !important;
      height: 5px !important;
    }

    /deep/
    .mat-tab-label {
      opacity: 1 !important;
      font-weight: bold;
    }
  `]

})

export class ContactsUserProfileComponent implements OnInit, OnDestroy {



  private isAlive: boolean = true;

  isContactLoaded: boolean = false;
  contacts=[];
  contactId: number;
  selectedContact:User = {} as User;

  showBankInfoTab:boolean = false;
  showListingInfoTab:boolean = false;
  showUserTypeTab:boolean = false;
  showReservationInfoTab:boolean = false;

  spinning = false;

  uploadProgress = 0;
  @ViewChild('addImageWrapper', {read: ElementRef}) addImageWrapper: ElementRef;



  ngOnInit() {

    this.setUp();

  }

  setUp() {

    this.route.params.subscribe(params => {
      this.contactId = +params['id'];
      this.isContactLoaded = false;
      this.store.select((state) => {
        return getContactById(state, this.contactId);
      }).takeWhile(() => this.isAlive).subscribe((contact) => {
        this.selectedContact = contact;
        this.updateContact();
      });
    });

  }

  onActiveStatusChanged($event)
  {
    this.spinning = true;
   if($event.checked)
   {
     this.service.activeContact(this.selectedContact.id).subscribe(res => {
       this.spinning = false;
     });
   }
   else {
     this.service.inActiveContact(this.selectedContact.id).subscribe(res => {
       this.spinning = false;
     });
   }
  }


  userUpdate() {
  }

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<State>,
              private service: StayDuvetService) {
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }


  getProfilePic(image: string) {
    if (isNullOrUndefined(image)){
      return 'https://farm9.static.flickr.com/8086/8466271529_dc5c0a958f.jpg';
    }
    else{
      return image;
    }
  }

  updateContact() {

    if(isNullOrUndefined(this.selectedContact))
    {
      this.service.getContactById(this.contactId).subscribe();
      return;

    }
    this.isContactLoaded=true;

    if(this.selectedContact.type == 'management')
    {
      this.showBankInfoTab=true;
      this.showListingInfoTab =true;
      this.showUserTypeTab = true;
      this.showReservationInfoTab = false;

    }
    else if(this.selectedContact.type == 'owner')
    {
      this.showBankInfoTab=true;
      this.showListingInfoTab =true;
      this.showUserTypeTab = false;
      this.showReservationInfoTab = false;

    }
    else if(this.selectedContact.type == 'guest')
    {
      this.showReservationInfoTab = true;
      this.showBankInfoTab=false;
      this.showListingInfoTab =false;
      this.showUserTypeTab = false;
    }
    else{
      this.showReservationInfoTab = false;
      this.showBankInfoTab=false;
      this.showListingInfoTab =false;
      this.showUserTypeTab = false;
    }
  }

  updateImage()
  {
    this.addImageWrapper.nativeElement.click();

    this.addImageWrapper.nativeElement.onchange = (event) => {
      if(event.target.files.length > 0)
      {

      this.service.updateContactPic(this.contactId,{image: event.target.files[0]}).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.uploadProgress = 0;
          const dataObj = event.body.data;
          const newContact = Object.assign(new User(), dataObj);
          this.store.dispatch(new ContactUpdateSuccessAction(newContact));

        }
      });
      }
    };

  }


}


