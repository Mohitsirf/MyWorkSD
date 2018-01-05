/**
 * Created by aditya on 24/8/17.
 */
import {Component, OnDestroy, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {FormGroup, Validators, FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {
 getActiveContacts, getIsActiveContactLoaded, getIsActiveContactLoading, getListings,
  State
} from '../../reducers/index';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {StayDuvetService} from '../../services/stayduvet';
import {Subscription} from 'rxjs/Subscription';
import {getContactMaintenanceCatagoryTypes, getContactMethodType, getContactMethodTypes, default as Utils} from '../../utils';
import {isNullOrUndefined} from 'util';
import {Listing} from '../../models/listing';
import {User} from '../../models/user';
import ObjectUtils from 'app/utils/object';

@Component({
  selector: 'sd-contact-listing-info',
  template: `
  <div fxLayout="column" fxLayoutGap="20px" style="margin: 20px">
      <div fxLayout="row" fxLayoutGap="20px" *ngIf="!isContactOwner">

         <div fxFlex="30%" > 
                 
             <mat-card style="font-size: x-small;" class="generalCard" fxLayoutGap="10px" fxLayout="column">
                 <div style="height: 10px;"></div>
                 <mat-form-field style="width:98%;">
                 <mat-select placeholder="Select Listing"  [(ngModel)]="selectedListing">
                    
                     <mat-option *ngFor="let listing of remListings" [value]="listing"  (click)="onSelect()">
                      {{listing.title}}
                    
                    </mat-option>
                 </mat-select> 
                 </mat-form-field> 
                 <mat-error style="font-size: xx-small;" *ngIf="showSelectListingError">Please select listing to assign</mat-error>  
                
                 <div  fxLayout="row" fxLayoutGap="10px" >
                    <button  mat-raised-button color="accent" type="button" (click)="assignToListing()"><b>Add Listing</b></button>
                     <mat-spinner id="spinner" color="accent" *ngIf="isAssigning" [diameter]="30" [strokeWidth]="4"></mat-spinner>
                 </div>
                 <div style="height: 10px;"></div>

             </mat-card> 
         </div> 

          <div fxFlex="70%">
             <mat-card class="generalCard">
                  
                <div *ngFor="let listing of listings">
                  <div fxLayout="row" fxLayoutAlign="space-between center" fxLayoutGap="20px" style=" cursor: pointer; border: 1px solid darkcyan; padding: 5px; margin: 10px; font-size: x-small;">
                    <div fxLayout="row"  fxLayoutAlign="space-between center" fxFlex fxLayoutGap="10px">
                      <div (click)="openListing(listing)" >{{listing.title}}</div>  
                      <div fxFlex="35%" fxLayoutAlign="end center">
                       <span>Commission : </span> 
                      <input #commission style="width: 40px;" min="0" max="99" type="number" [(ngModel)]="listing.commission_rate"> %
                      </div>
                    </div>
                    <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px">
                      <mat-spinner id="spinner" color="accent" *ngIf="isLoading(listing)" [diameter]="30" [strokeWidth]="4"></mat-spinner>
                      <button mat-icon-button  [disabled]="isLoading(listing)" (click)="updaetCommission(listing)"> <mat-icon>done</mat-icon></button>
                      <button mat-icon-button  [disabled]="isLoading(listing)" (click)="detachListing(listing)"> <mat-icon>clear</mat-icon></button>
                    </div>
                  </div>
                </div>
                    
                <div *ngIf="listings.length == 0" fxLayoutAlign="center" >
                   <h5>No Listings Assigned to this Contact</h5>
                </div>
              
              </mat-card>
          </div>
               
      </div>
                
      <div fxLayout="row" fxLayoutGap="20px" *ngIf="isContactOwner">

          <div fxFlex="100%">
              <mat-card class="generalCard">
                  <div *ngFor="let listing of listings" fxLayout="column" >
                       <div fxLayout="row" fxLayoutAlign="space-between center" style=" cursor: pointer; border: 1px solid darkcyan; padding: 8px; margin: 10px; font-size: x-small;">
                          <span (click)="openListing(listing)" >{{listing.title}}</span>
                       </div>
                  </div>
                  
                  <div *ngIf="listings.length == 0" fxLayoutAlign="center" >
                      <h5>No Listings Exist</h5>
                  </div>
              
              </mat-card>
          </div>
               
      </div>
                
      <div style="height: 10px;"></div>
  </div>

                 
          

           
  `,
  styles: [`
     .radio-button {
      margin: 15px;
    }
  `]

})

export class ContactListingInfoComponent implements OnInit, OnDestroy, OnChanges {



  @Input() contact: User;
  private isAlive: boolean = true;

  allListings:Listing[] = [];
  listings:Listing[] =[];
  remListings:Listing[] =[];

  loadingIds = [];


  selectedListing;
  showSelectListingError = false;

  isAssigning = false;

  isContactOwner:boolean = true;




  ngOnInit() {

    this.store.select(getListings).takeWhile(() => this.isAlive).subscribe((listings) => {
      this.allListings = listings;
      this.allListings = ObjectUtils.sortByKey(this.allListings ,'title' );
      this.updateListing();
    });
  }


  updateListing()
  {

    console.log(this.contact);

    if(this.contact.type =='management')
    {
      this.isContactOwner = false;
      const listingIds = this.contact.getManagementContact().properties;
      this.listings = this.allListings.filter(listing => listingIds.includes(listing.id));
      this.remListings = this.allListings.filter(listing => !listingIds.includes(listing.id));

    }
    else if(this.contact.type == 'owner')
    {
      this.isContactOwner = true;
      const listingIds = this.contact.getOwner().properties;
      this.listings = this.allListings.filter(listing => listingIds.includes(listing.id));
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
   this.updateListing();
  }




  constructor( private store: Store<State>,
               private service: StayDuvetService,
               private router:Router) {

  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  assignToListing()
  {
    if(isNullOrUndefined(this.selectedListing))
    {
      this.showSelectListingError = true;
      return;
    }

    this.isAssigning = true;


    this.service.updateVendorContacts(String(this.selectedListing.id),this.contact).subscribe(() => {
      this.isAssigning = false;
      this.selectedListing = null;
    }, ( ) => {
      this.isAssigning = false;
      this.selectedListing = null;
    });

  }

  onSelect()
  {
    this.showSelectListingError = false;
  }

  detachListing(listing)
  {
    this.loadingIds.push(listing.id);
    this.service.removeVendorContacts(String(listing.id), this.contact).subscribe(() => {
    this.loadingIds = this.loadingIds.filter(id => id != listing.id);
    },err => {
      this.loadingIds = this.loadingIds.filter(id => id != listing.id);
    });
  }

  openListing(listing)
  {
    this.router.navigate(['/listings/' + listing.id]);
  }

  isLoading(listing)
  {
    return this.loadingIds.includes(listing.id);
  }


  updaetCommission(listing){
    this.loadingIds.push(listing.id);
    this.service.updateListingDetails({commission_rate:listing.commission_rate},String(listing.id)).subscribe(() => {
      this.loadingIds = this.loadingIds.filter(id => id != listing.id);
    },err => {
      this.loadingIds = this.loadingIds.filter(id => id != listing.id);
    });
  }


}


