import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store';
import {getUser, isLoggedIn, isLoggingIn, State} from '../reducers/index';
import {StayDuvetService} from '../services/stayduvet';
import {isNullOrUndefined} from 'util';
import {User} from '../models/user';
import {Observable} from 'rxjs/Observable';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {getContactMethodTypes} from '../utils';
import {DialogPosition, MatDialog, MatDialogRef} from '@angular/material';
import {ChangePasswordPopupComponent} from './change-password-popup';
import {HttpEventType, HttpResponse} from "@angular/common/http";
import * as fromUser from '../actions/user';


@Component({
  selector: 'sd-profile-setting',
  template: `
    <sd-owner-main-layout-fullwidth>
      <div id="spinner" *ngIf="userLogging" fxLayout="row" fxLayoutAlign="center center" fxFlex="100%">
        <mat-spinner color="accent" [diameter]="60" [strokeWidth]="5"></mat-spinner>
      </div>
      <div *ngIf="userLogged" class="requiredHeight" fxFlex="100%" fxLayout="column" fxLayoutAlign="start">
        <div class="pre1" fxFlex="100%">
          <section class="content">
            <div fxLayout="column" class="image" style="margin-top:15%" fxLayoutAlign="center center">
              <img *ngIf="uploadProgress == 0" (click)="updateImage()" class="profileImage" src="{{getProfilePic(user?.pic_thumb_url)}}">
              <input type="file" accept="image/*" style="visibility: hidden" #addImageWrapper>
              <span *vaFlexAlignmentHack></span>
              <div class="profileImage" fxLayoutAlign="center center" *ngIf="uploadProgress != 0">
                <span style="color: white; font-size: large">{{uploadProgress}} %</span>
              </div>
              <p style="color:#fff;font-size:26px" align="center"><b>{{user?.getFullName()}}</b></p>
            </div>
          </section>
        </div> 

        <div *ngIf="userLogged" fxLayout="column" fxLayoutGap="10px" fxFlex="90%" style="padding-left: 20px; padding-right: 20px">
          
          <h2 style="=margin-left: 30px;padding-right: 20px">Profile Details:</h2>
          <form fxLayout="column" fxFlex="100%" [formGroup]="userProfileForm" (ngSubmit)="userProfileForm.valid && profileUpdate()">
            <div style="margin-top:20px;padding-left: 20px;padding-right: 20px" fxLayout="column" fxFlex="95%"
                 fxLayoutGap="20px">

              <div fxLayoutAlign="space-between center">
                <mat-form-field style="width:48%" dividerColor="accent">
                  <mat-icon style="color:#194267" matSuffix>contacts</mat-icon>
                  <input matInput placeholder="First Name" formControlName='first_name'>
                  <mat-error> First Name is required</mat-error>
                </mat-form-field>

                <mat-form-field style="width:48%" dividerColor="accent">
                  <mat-icon style="color:#194267" matSuffix>contacts</mat-icon>
                  <input matInput placeholder="Last Name" formControlName='last_name'>
                  <mat-error> Last Name is required</mat-error>
                </mat-form-field>
              </div>
              <div fxLayoutAlign="space-between center">
                <mat-form-field style="width:48%" dividerColor="accent">
                  <mat-icon style="color:#194267" matSuffix>email</mat-icon>
                  <input matInput placeholder="Email" formControlName='email'>
                  <mat-error> Email is required</mat-error>
                </mat-form-field>
                <mat-form-field style="width:48%" dividerColor="accent">
                  <mat-icon style="color:#194267" matSuffix>email</mat-icon>
                  <input matInput placeholder="Secondary Email" formControlName='secondary_email'>
                  <mat-error>Secondary Email is required</mat-error>
                </mat-form-field>
              </div>

              <div fxLayoutAlign="space-between center">
                <mat-form-field style="width:48%" dividerColor="accent">
                  <input matInput placeholder="Phone Number" formControlName='phone_number'>
                  <mat-error> Phone Number is required</mat-error>
                </mat-form-field>
                <mat-form-field style="width:48%" dividerColor="accent">
                  <input matInput placeholder="Secondary Phone Number" formControlName='secondary_phone_number'>
                </mat-form-field>
              </div>


              <mat-form-field style="width:98%">
                <mat-select  placeholder="Preferred Contact Method"
                           formControlName='preferred_contact_method'>
                  <mat-option *ngFor="let contactMethod of contactMethods" [value]="contactMethod.slug">
                    {{contactMethod.title}}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field dividerColor="accent" class="textArea">
                            <textarea matInput placeholder="Your Notes" rows="4" formControlName='description'>
                            </textarea>
              </mat-form-field>
            </div>

            <div fxLayout="row" fxLayoutAlign="space-between center" style="margin:30px; ">
              <div fxLayout="row" fxLayoutGap="10px">
                <button mat-raised-button [disabled]="isProfileUpdating" class="dangerButton" type="submit"><span class="successSpan"><b>UPDATE PROFILE DETAILS</b></span>
                </button>
                <mat-spinner id="primary" [diameter]="30" [strokeWidth]="4" *ngIf="isProfileUpdating"></mat-spinner>
              </div>

              <button *ngIf="!changePassword" mat-raised-button type="button" color="accent" (click)="openchangePassForm()"><b>CHANGE PASSWORD</b>
              </button>
            </div>
          </form>

          <div style="margin-top:10px"></div>
        </div>
      </div>
    </sd-owner-main-layout-fullwidth>
  `,
  styles: [`

    #spinner {
      position: fixed;
      top: 45%;
      right: 50%;
    }

    #primary {
      width: 24px;
      height: 24px;
    }
    
    .profileImage {
      display: block;
      width: 150px;
      height: 150px;
      margin: 1em auto;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
      -webkit-border-radius: 99em;
      -moz-border-radius: 99em;
      border-radius: 99em;
      border: 5px solid #eee;
      box-shadow: 0 3px 2px rgba(0, 0, 0, 0.3);
    }

    .pre1 {
      max-height: 40%;
      width: 100%;
      flex: 0 0 0% !important;
      display: table;
      background-image: url(http://jonvilma.com/images/abstract-13.jpg);
      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;
      background-color: #464646;

    }
  `]
})

export class ProfileSettingComponent implements OnInit, OnDestroy{

  private isAlive: boolean = true;
  user: User;
  userLogging: boolean;
  userLogged: boolean;

  isProfileUpdating = false;


  userProfileForm: FormGroup;
  firstName: FormControl;
  lastName: FormControl;
  userEmail: FormControl;
  userSecondaryEmail: FormControl;
  userPhoneNumber: FormControl;
  userSecondaryPhoneNumber: FormControl;
  preferredContactMethod: FormControl;
  userNotes: FormControl;
  contactMethods;


  uploadProgress = 0;
  @ViewChild('addImageWrapper', {read: ElementRef}) addImageWrapper: ElementRef;



  constructor(private store: Store<State>, private service: StayDuvetService, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.setupUser();
  }

  setupUser() {
    this.contactMethods = getContactMethodTypes();

    this.store.select(isLoggingIn).takeWhile(() => this.isAlive).subscribe((logging) => {
      this.userLogging = logging;
    });
    this.store.select(isLoggedIn).takeWhile(() => this.isAlive).subscribe((logged) => {
      this.userLogged = logged;
      console.log(logged);
    });
    this.store.select(getUser).takeWhile(() => this.isAlive).subscribe((user: User) => {
      this.user = user;
    });


    const breakdownCombined = Observable.merge(
      this.store.select(getUser),
      this.store.select(isLoggingIn),
      this.store.select(isLoggedIn),
      ((user, logging, logged) => {
      })
    );

    breakdownCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.userLogging && !this.userLogged) {
          this.service.me().subscribe();
        }
      }
    );
    if(this.userLogged) {

      this.firstName = new FormControl(this.user.first_name, [Validators.required]);
      this.lastName = new FormControl(this.user.last_name,  [Validators.required]);
      this.userEmail = new FormControl(this.user.email, [Validators.required, Validators.email]);
      this.userSecondaryEmail = new FormControl(this.user.secondary_email,  [Validators.required]);
      this.userPhoneNumber = new FormControl(this.user.phone_number,  [Validators.required]);
      this.userSecondaryPhoneNumber = new FormControl(this.user.secondary_phone_number);
      this.preferredContactMethod = new FormControl(this.user.preferred_contact_method, [Validators.required]);
      this.userNotes = new FormControl(this.user.description);

      this.userProfileForm = new FormGroup({
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.userEmail,
        secondary_email: this.userSecondaryEmail,
        phone_number: this.userPhoneNumber,
        secondary_phone_number: this.userSecondaryPhoneNumber,
        preferred_contact_method: this.preferredContactMethod,
        description: this.userNotes,
      });

    }
  }


  ngOnDestroy() {
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

  profileUpdate() {
    this.isProfileUpdating = true;
    const data = this.userProfileForm.value;
    if(this.userProfileForm.get('email').value === this.user.email) {
      delete data['email'];
      console.log(data);
    }
    this.service.updateProfile(data).subscribe(() => {
      this.isProfileUpdating = false;
    }, () => {
      this.isProfileUpdating = false;
    });
  }


  openchangePassForm() {
   const dialogRef =  this.dialog.open(ChangePasswordPopupComponent);
   dialogRef.updateSize('100%');
  }

  updateImage()
  {
    this.addImageWrapper.nativeElement.click();

    this.addImageWrapper.nativeElement.onchange = (event) => {
      if(event.target.files.length > 0)
      {

        this.service.updateUserPic({image: event.target.files[0]}).subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            this.uploadProgress = 0;
            const user = event.body.data;
            const userObject = Object.assign(new User(), user);
            this.store.dispatch(new fromUser.UpdateSuccessAction(userObject));
          }
        });
      }
    };

  }
}

