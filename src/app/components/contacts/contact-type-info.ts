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
  selector: 'sd-contact-type-info',
  template: `
    <div style="margin:20px;" fxLayout="column" fxLayoutGap="20px">

      <div fxLayout="row" fxLayoutGap="20px">

        <div fxFlex="40%">
          <mat-card class="generalCard">
            <mat-radio-group fxLayout="column" class="radio-group" [(ngModel)]='contactType'>
              <mat-radio-button class="radio-button" fxFlex="100%"
                                *ngFor="let option of userTypes"
                                [value]="option.slug">
                          
                        <span style="color:#194267;font-size: small">
                          {{option.title}} 
                          <mat-icon>help</mat-icon>
                        </span>

              </mat-radio-button>
            </mat-radio-group>
          </mat-card>

        </div>

        <div fxFlex="60%">
          <mat-card class="generalCard">

            <span style="color:#194267;font-size: 16px"><b>Super User</b></span>
            <div style="border:0.5px solid gray;margin-top:5px;padding:15px;border-radius: 3px">
              <span style="font-size: small;">User Accesibility will go here</span>
            </div>

            <div style="padding-top: 20px"></div>

            <span style="color:#194267;font-size: 16px"><b>Reports</b></span>
            <div style="font-size:small;border:0.5px solid gray;margin-top:5px;padding:15px;border-radius: 3px">
              <span>- Owner Statements</span>
              <br>
              <span>- Comp Report</span>
            </div>

          </mat-card>
        </div>


      </div>

      <div fxLayout="row" fxLayoutGap="10px">
        <button mat-button [disabled]="isUpdating"
                class="dangerButton" (click)="userUpdate()">
          <span class="successSpan"><b>UPDATE USER DETAILS</b></span>
        </button>
        <mat-spinner *ngIf="isUpdating" [diameter]="30" [strokeWidth]="4"></mat-spinner>

        <!--<button mat-raised-button [disabled]="isDeleting" -->
        <!--color="accent" type="button" (click)="deleteContact()"><b>DELETE USER</b>-->
        <!--</button>-->
        <!--<mat-spinner *ngIf="isDeleting" [diameter]="30" [strokeWidth]="4"></mat-spinner>-->
      </div>
    </div>

  `,
  styles: [`

    .radio-button {
      margin: 5px;
    }

    .radio-group {
      display: inline-flex;
      flex-direction: column;
    }

  `]

})

export class ContactTypeInfoComponent implements OnInit, OnDestroy {


  contactType: string;
  type: string;
  @Input() contact: User;
  private isAlive: boolean = true;
  userTypes = [];

  isUpdating = false;
  isDeleting = false;

  ngOnInit() {

    this.userTypes = getContactMaintenanceCatagoryTypes();

    this.route.params.subscribe(params => {
      const contactId = +params['id'];
      this.store.select((state) => {
        return getContactById(state,contactId);
      }).takeWhile(() => this.isAlive).subscribe((contact) => {
        this.contact = contact;
        if (this.contact)
        {

          if (this.contact.type === 'management') {
            this.contactType = this.type = this.contact.getManagementContact().category;

          }
        }
      });
    });

  }


  deleteContact() {
    console.log(this.contact);
  }


  userUpdate() {
    this.isUpdating = true;
    const data = {};
    if (this.type !== this.contactType) {
      data['management_category'] = this.contactType;
    }
    console.log(data);
    this.service.updateContact(this.contact.id, {management_category: this.contactType}).subscribe(contact => {
        this.isUpdating = false;
      },
      (error) => {
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


