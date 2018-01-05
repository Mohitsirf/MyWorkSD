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
import {Listing} from '../../models/listing';
import {User} from '../../models/user';

@Component({
  selector: 'sd-contact-bank-info',
  template: `
    <form style="margin: 20px;" fxLayoutGap="20px" fxFlex="100%" fxlayout="column" [formGroup]="form" (ngSubmit)="form.valid && userUpdate()">
          <div fxLayout="column" fxLayoutGap="20px">

                  
                    <mat-form-field  dividerColor="accent">
                      <mat-icon style="color:#194267" matSuffix>account_balance</mat-icon>
                      <input matInput placeholder="Bank Name" formControlName='bank_name'>
                    </mat-form-field>

                    <mat-form-field  dividerColor="accent">
                      <mat-icon style="color:#194267" matSuffix>account_balance_wallet</mat-icon>
                      <input matInput placeholder="Account Number" formControlName='account_number'>
                      <mat-error> Account Number is required</mat-error>
                    </mat-form-field>
                    
                    <mat-form-field  dividerColor="accent">
                      <mat-icon style="color:#194267" matSuffix>confirmation_number</mat-icon>
                      <input matInput placeholder="Routing Number" formControlName='routing_number'>
                      <mat-error> Routing Number is required</mat-error>
                    </mat-form-field>
               
          </div>
                
           <div fxLayout="row" fxLayoutGap="10px">
           
                   <button mat-button [disabled]="isUpdating" class="dangerButton" type="submit">
                        <span class="successSpan"><b>UPDATE BANK DETAILS</b></span>
                   </button>
                   <mat-spinner *ngIf="isUpdating" [diameter]="30" [strokeWidth]="4"></mat-spinner>

             <!--<button mat-raised-button [disabled]="isDeleting" color="accent" type="button" (click)="deleteContact()">-->
                        <!--<b>DELETE USER</b>-->
                   <!--</button>-->
                   <!--<mat-spinner *ngIf="isDeleting" [diameter]="30" [strokeWidth]="4"></mat-spinner>-->

          </div>
    </form>
           
  `,
  styles: [``]

})

export class ContactBankInfoComponent implements OnInit, OnDestroy {


  form: FormGroup;
  bankName: FormControl;
  routingNumber: FormControl;
  accountNumber: FormControl;
  @Input() contact: User;
  private isAlive: boolean = true;

  isUpdating = false;
  isDeleting = false;


  ngOnInit() {

    this.bankName = new FormControl(this.contact.bank_name);
    this.accountNumber = new FormControl(this.contact.account_number, [Validators.required]);
    this.routingNumber = new FormControl(this.contact.routing_number, [Validators.required]);


    this.form = new FormGroup({
      bank_name: this.bankName,
      account_number: this.accountNumber,
      routing_number: this.routingNumber,
    });

    this.route.params.subscribe(params => {
      const contactId = +params['id'];
      this.store.select((state) => {
        return getContactById(state,contactId);
      }).takeWhile(() => this.isAlive).subscribe((contact) => {
        this.contact = contact;
        if (this.contact)
        {
          this.bankName.setValue(this.contact.bank_name);
          this.accountNumber.setValue(this.contact.account_number);
          this.routingNumber.setValue(this.contact.routing_number);
        }
      });
    });

  }


  deleteContact() {
    console.log(this.contact);
  }

  userUpdate() {
    this.isUpdating = true;
    const data = this.form.value;
    if(this.bankName.value === this.contact.bank_name)
    {
      delete data['bank_name'];
    }
    if(this.accountNumber.value === this.contact.account_number)
    {
      delete data['account_number'];
    }
    if(this.routingNumber.value === this.contact.routing_number)
    {
      delete data['routing_number'];
    }
    console.log(data);
    this.service.updateContact(this.contact.id, data).subscribe(contact => {
      this.isUpdating = false;
    }, (error) => {
      this.isUpdating = false;
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

}


