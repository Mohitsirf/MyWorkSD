import {Component, OnInit, ViewEncapsulation, HostListener, Inject, OnDestroy} from '@angular/core';
import {Store} from '@ngrx/store';
import {getAdmins, getListingById, getListings, getUser, State} from '../../reducers';
import {ActivatedRoute, Router} from '@angular/router';
import {Listing} from '../../models/listing';
import {getById} from '../../reducers/listing';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ListingOwnerBlockPopupComponent} from '../../components/listing/popups/listing-owner-block-popup';
import {ListingRejectPopupComponent} from '../../components/listing/popups/listing-reject-popup';
import {ApproveListingPopupComponent} from '../../components/contacts/popups/approve-listing-popup';
import {StayDuvetService} from '../../services/stayduvet';
import {DOCUMENT} from "@angular/common";
import {Subscription} from "rxjs/Subscription";
import {User} from "../../models/user";
import * as addDays from 'date-fns/add_days';
import {getDateObj} from "../../components/calendar/calendar-utils";


/**
 * Created by piyushkantm on 03/07/17.
 */

@Component({
  selector: 'sd-listing-page',
  template: `
    <sd-owner-main-layout>
      <div fxLayout="column" class="requiredHeight main-container" fxLayoutAlign="center stretch" fxLayoutGap="20px">
        <div fxLayoutAlign="space-between center">
          <div fxLayout="column" fxLayoutAlign="center start" fxLayoutGap="10px" fxFlex="30%">
            <!--<h3>Listings</h3>-->
            <span style="font-size: 25px; font-weight: bolder">Listings</span>
            <div fxLayout="row" fxLayoutGap="30px" style="width: 100%">
              <mat-form-field  style="width: 60%">
                <mat-select
                  [(ngModel)]="listing"
                  (ngModelChange)="selectedListing()">
                  <mat-option *ngFor="let listing of listings" [value]="listing">
                    {{ listing.title }}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <mat-spinner class="mat-spinner" [color]="'accent'" *ngIf="changingAssignee" [diameter]="30" [strokeWidth]="4"></mat-spinner>
              <mat-form-field style="width: 45%"  *ngIf="!changingAssignee">
                <mat-select
                  placeholder="Assignee"
                  [(ngModel)]="selectedAdminId"
                  color="accent"
                  (ngModelChange)="selectedAssigneeChanged()"
                  [ngModelOptions]="{standalone: true}">
                  <mat-option *ngFor="let admin of admins" [value]="admin.getAdmin().id">
                    {{admin.first_name}} {{admin.last_name}}
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </div>
          <div fxFlex="70%" fxLayoutAlign="end center">
            <div *ngIf="listing.status=='draft' && user.is_owner">
              <button mat-raised-button (click)="submitForApproval(listing)" color="accent">Submit For Approval</button>
            </div>
            <div *ngIf="listing.status=='pending' ">
              <div fxLayout="row" fxLayoutGap="10px">
                <button *ngIf="user.is_admin" color="primary" mat-raised-button (click)="approveListing(listing)">Approve
                </button>
                <button *ngIf="user.is_admin" color="warn" mat-raised-button (click)="rejectListing(listing)">Reject
                </button>
              </div>
              <p *ngIf="user.is_owner">Listing is being reviewed by our team</p>
            </div>
            <div *ngIf="listing.status=='accepted' ">
              <button mat-raised-button (click)="openOwnerBlockPopup()" color="accent">Create owner's block</button>
            </div>
            <div *ngIf="listing.status=='rejected' ">
              <button *ngIf="user.is_owner" color="primary" mat-raised-button (click)="submitForApproval(listing)">
                Re-submit For Approval
              </button>
              <p *ngIf="user.is_admin">Rejected by team.</p>
            </div>
          </div>
        </div>
        <div fxLayout="column">
          <div fxLayout="row" fxFlex="100%">
            <nav color="accent" mat-tab-nav-bar fxFlex="100%">
              <a mat-tab-link
                 *ngFor="let tab of tabs"
                 [routerLink]="tab.url"
                 routerLinkActive #rla="routerLinkActive"
                 [active]="rla.isActive">
                {{tab.title}}
              </a>
            </nav>
          </div>
          <div style="margin-top: 20px;">
            <router-outlet></router-outlet>
          </div>
        </div>
      </div>
    </sd-owner-main-layout>
  `,
  styles: [`

    .mat-spinner {
      height: 24px;
      width: 24px;
    }

    :host /deep/ router-outlet + *:not(nav) {
      width: 100%;
    }

    mat-spinner {
      margin-right: 20px;
    }

    .main-container {
      margin: 30px;
      margin-top: 10px;
    }

    .sd-tab {
      background-color: red;
    }

    .totop {
      position: fixed;
      top: 25%;
    }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class OwnerListingPageComponent implements OnInit, OnDestroy {
  changingAssignee = false;

  private isAlive: boolean = true;
  listing: Listing;
  listings: Listing[];

  admins: User[] = [];
  selectedAdminId;
  user;
  private dialogRef: MatDialogRef<any>;

  tabs = [
    {title: 'LISTING', url: 'details'},
    {title: 'GUEST', url: 'guest'},
    {title: 'MANAGE', url: 'manage'},
    {title: 'HOUSEKEEPING', url: 'housekeeping'},
    {title: 'CONTACTS', url: 'contacts'},
    {title: 'CALENDAR', url: 'calendar'},
    {title: 'TASKS', url: 'tasks'}
  ];

  constructor(private store: Store<State>,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog,
              private stayDuvetService: StayDuvetService,
              @Inject(DOCUMENT) private document: Document) {
  }

  ngOnInit(): void {
    console.log('onInit sd-listing-page');


    this.store.select(getAdmins).takeWhile(() => this.isAlive).subscribe((admins) => {
      this.admins = admins;
    });

    this.store.select(getUser).takeWhile(() => this.isAlive).subscribe((user) => {
      this.user = user;

      if (user.is_admin) {
        this.tabs = [
          {title: 'LISTING', url: 'details'},
          {title: 'GUEST', url: 'guest'},
          {title: 'MANAGE', url: 'manage'},
          {title: 'HOUSEKEEPING', url: 'housekeeping'},
          {title: 'CONTACTS', url: 'contacts'},
          {title: 'PRICING', url: 'pricing'},
          {title: 'CALENDAR', url: 'calendar'},
          {title: 'TASKS', url: 'tasks'},
          {title: 'AUTOMATION', url: 'automation'},
          // {title: 'LAW', url: 'law'},
        ];
      }
    });

    this.route.params.subscribe(params => {
      const listingId = +params['id'];

      this.store.select(getListings).takeWhile(() => this.isAlive).subscribe((listings) => {
        this.listings = listings.sort((a: Listing, b: Listing) => {
          if(a.title > b.title) {
            return 1;
          }
          if(a.title < b.title) {
            return -1;
          }
          return 0;
        });
        this.listing = this.listings.find(data => data.id === listingId);
        this.selectedAdminId = this.listing.assignee_id;
      });

    });
  }

  selectedListing() {
    const subRoute = this.route.firstChild.snapshot.url[0].path;
    this.router.navigate(['/listings/' + this.listing.id + '/' + subRoute]);
  }

  openOwnerBlockPopup() {
    const data = {
      startDate: getDateObj(),
      endDate: addDays(getDateObj() , 1),
      reason: '',
      listingId: this.listing.id
    };
    this.dialogRef = this.dialog.open(ListingOwnerBlockPopupComponent, {
      data: data, width: '80%'
    });
  }

  approveListing(listing: Listing) {
    this.dialogRef = this.dialog.open(ApproveListingPopupComponent);
    const instance = this.dialogRef.componentInstance;
    instance.title = listing.title;
    // TODO : Change User Details
    instance.users = this.admins;
    instance.listing = listing;
    instance.yesButtonClicked.subscribe((data : {assignee_id: number,
      housekeeper_id:number,
      general_maintenance_id:number,
      painter_id: number,
      electrician_id: number,
      plumber_id: number,
      homeowner_id: number,
      cleaner_id: number,
      hvac_id: number}) => {
      instance.isLoading = true;
      this.stayDuvetService.approveListing(String(listing.id), data).subscribe((updatedListing) => {
          instance.isLoading = false;
          this.dialogRef.close();
        },
        () => {
          instance.isLoading = false;
        });

    });
    this.dialogRef.updateSize('100%','100%');
  }

  rejectListing(listing: Listing) {
    this.dialogRef = this.dialog.open(ListingRejectPopupComponent);
    const instance = this.dialogRef.componentInstance;
    instance.title = listing.title;
    instance.placeholder = 'Reason for rejection';
    instance.rejectButtonClicked.subscribe((reason) => {
      instance.isLoading = true;
      this.stayDuvetService.rejectListing(String(listing.id), {reason}).subscribe((updatedListing) => {
          instance.isLoading = false;
          this.dialogRef.close();
        },
        () => {
          instance.isLoading = false;
        });

    });
    this.dialogRef.updateSize('100%');
  }

  submitForApproval(listing: Listing) {
    this.stayDuvetService.sendListingForApproval(String(listing.id)).subscribe();
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  selectedAssigneeChanged() {
    this.changingAssignee = true;
    this.stayDuvetService.updateListingDetails({assignee_id: this.selectedAdminId}, String(this.listing.id)).subscribe((done) => {
      this.changingAssignee = false;
    });
  }

}
