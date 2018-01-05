/**
 * Created by aditya on 24/8/17.
 */
import {Component, OnDestroy, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormGroup, Validators, FormControl} from "@angular/forms";
import {ActivatedRoute, Router} from '@angular/router';
import {
  getActiveContacts, getContactById, getIsActiveContactLoaded, getIsActiveContactLoading, getListings,
  State
} from '../../reducers/index';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {StayDuvetService} from '../../services/stayduvet';
import {Subscription} from 'rxjs/Subscription';
import {getContactMaintenanceCatagoryTypes, getContactMethodType, getContactMethodTypes} from '../../utils';
import {isNullOrUndefined} from "util";
import {Listing} from "../../models/listing";
import {User} from '../../models/user';

@Component({
  selector: 'sd-contact-info',
  template: `    
    <form fxLayout="column" fxFlex="100%" [formGroup]="userProfileForm" (ngSubmit)="userProfileForm.valid && userUpdate()">
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


                  <mat-select style="width:98%" placeholder="Preferred Contact Method"
                             formControlName='preferred_contact_method'>
                    <mat-option *ngFor="let contactMethod of contactMethods" [value]="contactMethod.slug">
                      {{contactMethod.title}}
                    </mat-option>
                  </mat-select>

                  <mat-form-field dividerColor="accent" class="textArea">
                            <textarea matInput placeholder="Your Notes" rows="4" formControlName='description'>
                            </textarea>
                  </mat-form-field>
          </div>
                
          <div fxLayout="row" style="margin-left: 10px;">
                
                <div fxLayout="row" fxLayoutGap="10px" fxLayoutAlign="space-between center" style="margin:30px; ">
                  <div fxLayout="row" fxLayoutGap="10px">
                    <button mat-raised-button [disabled]="isUpdating"
                            class="dangerButton" type="submit"><span
                      class="successSpan"><b>UPDATE USER DETAILS</b></span>
                    </button>
                    <mat-spinner *ngIf="isUpdating" [diameter]="30" [strokeWidth]="4"></mat-spinner>
                  </div>
                  <!--<button mat-raised-button [disabled]="isDeleting" color="accent" type="button" (click)="deleteContact()"><b>DELETE USER</b></button>-->
                  <!--<mat-spinner *ngIf="isDeleting" [diameter]="30" [strokeWidth]="4"></mat-spinner>-->
                </div>
            
          </div>
    </form>
           
  `,
  styles: [`

    .textArea {
      width: 98%;
      min-height: 100px;
      box-sizing: border-box;
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      border-color: darkgray;
      padding: 5px;
      border-style: solid;
      border-width: 1px;
      border-radius: 5px;
    }

 
  `]

})

export class ContactInfoComponent implements OnInit, OnDestroy {


  userProfileForm: FormGroup;
  firstName: FormControl;
  lastName: FormControl;
  userEmail: FormControl;
  userSecondaryEmail: FormControl;
  userPhoneNumber: FormControl;
  userSecondaryPhoneNumber: FormControl;
  preferredContactMethod: FormControl;
  userNotes: FormControl;
  @Input() contact: User;
  private isAlive: boolean = true;


  contactMethods;

  isUpdating = false;
  isDeleting = false;

  ngOnInit() {
    this.contactMethods = getContactMethodTypes();

    this.firstName = new FormControl(this.contact.first_name, [Validators.required]);
    this.lastName = new FormControl(this.contact.last_name);
    this.userEmail = new FormControl(this.contact.email, [Validators.required, Validators.email]);
    this.userSecondaryEmail = new FormControl(this.contact.secondary_email);
    this.userPhoneNumber = new FormControl(this.contact.phone_number, [Validators.required]);
    this.userSecondaryPhoneNumber = new FormControl(this.contact.secondary_phone_number);
    this.preferredContactMethod = new FormControl(this.contact.preferred_contact_method, [Validators.required]);
    this.userNotes = new FormControl(this.contact.description);

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

    this.route.params.subscribe(params => {
      const contactId = +params['id'];
      this.store.select((state) => {
        return getContactById(state,contactId);
      }).takeWhile(() => this.isAlive).subscribe((contact) => {
        this.contact = contact;
       if (this.contact)
       {
         this.firstName.setValue(this.contact.first_name);
         this.lastName.setValue(this.contact.last_name);
         this.userEmail.setValue(this.contact.email);
         this.userSecondaryEmail.setValue(this.contact.secondary_email);
         this.userSecondaryPhoneNumber.setValue(this.contact.secondary_phone_number);
         this.userPhoneNumber.setValue(this.contact.phone_number);
         this.preferredContactMethod.setValue(this.contact.preferred_contact_method);
         this.userNotes.setValue(this.contact.description);
       }
      });
    });




  }


  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<State>,
              private service: StayDuvetService) {

  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  deleteContact() {
    console.log(this.contact);
  }

  userUpdate() {
    this.isUpdating = true;
    const data = this.userProfileForm.value;
    if(this.userEmail.value === this.contact.email)
    {
      delete data['email'];
    }
    if(this.firstName.value === this.contact.first_name)
    {
      delete data['first_name'];
    }
    if(this.lastName.value === this.contact.last_name)
    {
      delete data['last_name'];
    }
    if(this.userSecondaryEmail.value === this.contact.secondary_email)
    {
      delete data['secondary_email'];
    }
    if(this.userPhoneNumber.value === this.contact.phone_number)
    {
      delete data['phone_number'];
    }
    if(this.userSecondaryPhoneNumber.value === this.contact.secondary_phone_number)
    {
      delete data['secondary_phone_number'];
    }
    if(this.userNotes.value === this.contact.description)
    {
      delete data['description'];
    }
    if(this.preferredContactMethod.value === this.contact.preferred_contact_method)
    {
      delete data['preferred_contact_method'];
    }
    console.log(data);
    this.service.updateContact(this.contact.id, data).subscribe(contact => {
        this.isUpdating = false;
      },
      (error) => {
        this.isUpdating = false;
      });
  }

}


