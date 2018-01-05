import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {DataSource} from '@angular/cdk/table';
import {StayDuvetService} from '../../services/stayduvet';
import {MatDialog, MatDialogRef, MatPaginator, MatSort} from '@angular/material';
import {CreateContactPopupComponent} from './popups/create-contact-popup';
import {Store} from '@ngrx/store';
import {
  getAdmins, getActiveContacts, getIsActiveContactLoaded, getIsActiveContactLoading, State,
  getIsInActiveContactLoading, getIsInActiveContactLoaded, getInActiveContacts
} from '../../reducers/index';
import {async} from 'rxjs/scheduler/async';
import {ContactDetailsMagnifyComponent} from './popups/detail-magnify-popup';
import {Subscription} from 'rxjs/Subscription';
import {isNullOrUndefined} from 'util';
import {getContactMaintenanceCatagoryType} from '../../utils';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../models/user';

@Component({
  selector: 'sd-contacts-task',
  template: `
    <sd-owner-main-layout>
      <div fxLayout="column" fxLayoutGap="10px" class="main-container requiredMinHeight">
        <div style="font-size:x-small;" fxLayoutAlign="space-between center">
          <div fxLayout="column" fxLayoutAlign="center start" fxLayoutGap="10px" fxFlex="100%">
            <span *ngIf="showActive" style="font-size: 25px; font-weight: bolder">Contacts</span>
            <span *ngIf="!showActive" style="font-size: 25px; font-weight: bolder">InActive Contacts</span>

            <mat-select style="width:25%;"
                        placeholder="All Contacts"
                        color="accent"
                        [(ngModel)]="selectedFilter"
                        (ngModelChange)="selectedFilterChanged()"
                        floatPlaceholder="never">
              <mat-option *ngFor="let filter of filters" [value]="filter">
                {{ filter.title }}
              </mat-option>
            </mat-select>
          </div>
          <div *ngIf="showActive">
            <button mat-raised-button color="accent" [matMenuTriggerFor]="menu" class="my-menu">
              NEW CONTACT &nbsp; &nbsp;
              <mat-icon>arrow_drop_down</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
              <button mat-menu-item color="accent">
                NEW EMPLOYEE
              </button>
              <button mat-menu-item color="accent" (click)="openCreateContactPopup()">
                NEW VENDOR
              </button>
            </mat-menu>
          </div>
        </div>
        <hr id="line">
        <div fxLayout="column" fxLayoutGap="5px">
          <p class="pHeading">You have {{this.length}} {{showActive ? 'Active ' : 'Inactive '}} {{selectedFilter.text}}
            in your address book.</p>
          <span class="spanSubHeading" style="width: 80%;">
            These contacts are pulled from reservation data,entered in by clients
            and a directory of all your vendors and employees. The source of the
            contact will say the channel, user entered or if a owners name if they
            put in the contact.
          </span>
        </div>

        <div class="example-container mat-elevation-z8">
          <mat-table [dataSource]="contactDatasource" matSort>
            <ng-container cdkColumnDef="first_name">
              <mat-header-cell class="TableHeadTitle" *cdkHeaderCellDef mat-sort-header [style.flex]="'0 0 14%'"> First
                Name
              </mat-header-cell>
              <mat-cell *cdkCellDef="let row" [style.flex]="'0 0 14%'">
                <span style="cursor: pointer" (click)="rowSelected(row)">{{row.first_name}}</span>
              </mat-cell>
            </ng-container>
            <ng-container cdkColumnDef="last_name">
              <mat-header-cell class="TableHeadTitle" *cdkHeaderCellDef mat-sort-header [style.flex]="'0 0 14%'"> Last
                Name
              </mat-header-cell>
              <mat-cell *cdkCellDef="let row" [style.flex]="'0 0 14%'">
                <span style="cursor: pointer" (click)="rowSelected(row)">{{row.last_name}}</span>
              </mat-cell>
            </ng-container>
            <ng-container cdkColumnDef="email">
              <mat-header-cell class="TableHeadTitle" *cdkHeaderCellDef mat-sort-header style="padding-right:15px"
                               [style.flex]="'0 0 20%'"> Email
              </mat-header-cell>
              <mat-cell *cdkCellDef="let row" style="padding-right:15px ; word-wrap:break-word ;width: 20%;"
                        [style.flex]="'0 0 20%'">
                <span style="cursor: pointer" (click)="rowSelected(row)">{{row.email}}</span>
              </mat-cell>
            </ng-container>
            <ng-container cdkColumnDef="phone">
              <mat-header-cell class="TableHeadTitle" *cdkHeaderCellDef mat-sort-header style="padding-right:10px"
                               [style.flex]="'0 0 15%'"> Phone
              </mat-header-cell>
              <mat-cell *cdkCellDef="let row" style="padding-right:10px;word-wrap:break-word ;width: 15%;"
                        [style.flex]="'0 0 15%'"> {{row.phone_number}}
              </mat-cell>
            </ng-container>
            <ng-container cdkColumnDef="type">
              <mat-header-cell class="TableHeadTitle" *cdkHeaderCellDef mat-sort-header style="margin-right:10px"
                               [style.flex]="'0 0 15%'"> Type
              </mat-header-cell>
              <mat-cell *cdkCellDef="let row" style="margin-right:10px" [style.flex]="'0 0 15%'"> {{getType(row)}}
              </mat-cell>
            </ng-container>
            <ng-container cdkColumnDef="source">
              <mat-header-cell class="TableHeadTitle" *cdkHeaderCellDef mat-sort-header [style.flex]="'0 0 10%'"> Source
              </mat-header-cell>
              <mat-cell *cdkCellDef="let row" [style.flex]="'0 0 10%'"> {{getSource(row)}}</mat-cell>
            </ng-container>
            <ng-container cdkColumnDef="details">
              <mat-header-cell *cdkHeaderCellDef [ngClass]="'detailWidthClass'"></mat-header-cell>
              <mat-cell *cdkCellDef="let row" [ngClass]="'detailWidthClass alignend'">
                <mat-icon (click)="detailMagnifyContact(row)" style="cursor: pointer">search</mat-icon>
              </mat-cell>
            </ng-container>

            <mat-header-row *cdkHeaderRowDef="displayedColumns"></mat-header-row>
            <mat-row *cdkRowDef="let row; columns: displayedColumns;"></mat-row>
          </mat-table>
          <ng-container *ngIf="isLoading">
            <div fxLayoutAlign="center center">
              <mat-spinner color="accent" [diameter]="60" [strokeWidth]="5"></mat-spinner>
            </div>
          </ng-container>
          <mat-paginator #paginator
                         [length]="contactdatabase.data.length"
                         [pageIndex]="0"
                         [pageSize]="15"
                         [pageSizeOptions]="[5, 15, 25, 100]" class="mat-elevation-z8">
          </mat-paginator>
        </div>
      </div>
    </sd-owner-main-layout>
  `,
  styles: [`
    .main-container {
      margin: 30px;
      margin-top: 50px;
      margin-bottom: 100px;
    }

    /deep/
    .mat-menu-content {
      -webkit-text-fill-color: white;
      background: #13304b !important;
      color: white;
    }

    #title {
      font-weight: bolder;
      font-size: 25px;
    }

    #heading {
      font-size: x-large;
    }

    #line {
      border: none;
      width: 100%;
      height: 5px;
      /* Set the hr color */
      color: lightgrey; /* old IE */
      background-color: lightgrey; /* Modern Browsers */
    }

    .alignend {
      text-align: end;
    }

    hr {
      margin-top: 0.3in;
      width: 100%;
    }

    .mat-column-last_name {
      width: 100px;
    }

    .mat-column-details {
      width: 50px;
    }

    .detailWidthClass {
      flex: 0 0 50px;
    }

    .customWidthClass {
      flex: 1 1 300px;
    }

    /*.emailWidthClass {*/
    /*flex: 0 0 30%;*/
    /*}*/

    .example-container {
      display: flex;
      flex-direction: column;
      max-height: 600px;
      min-width: 300px;
    }

    .customWidthClass {
      flex: 0 0 75px;
    }

    .example-header {
      min-height: 64px;
      display: flex;
      align-items: center;
      padding-left: 24px;
      font-size: 20px;
    }

    .mat-table {
      overflow: auto;
    }

    /deep/ .mat-sort-header-button {
      font-weight: bold !important;
    }

    .mat-icon {
      font-size: 15px;
    }

    .mat-cell {
      font-size: 12.5px;
    }

  `]
})

export class ContactsTaskComponent implements OnInit, OnDestroy {

  filters = [
    {
      title: 'All Contacts',
      slug: 'all_contacts',
      text: 'Contacts',
    },
    {
      title: 'Guests',
      slug: 'guest',
      text: 'Guests',
    },
    {
      title: 'Admin',
      slug: 'admin',
      text: 'Admins',
    },
    {
      title: 'Vendors',
      slug: 'management',
      text: 'Vendors',
    },
    {
      title: 'Owners',
      slug: 'owner',
      text: 'Owners',
    }
  ];

  showActive;

  displayedColumns = ['first_name', 'last_name', 'email', 'phone', 'type', 'source', 'details'];
  contactdatabase;
  contactDatasource: ContactDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private dialogRef: MatDialogRef<any>;
  isLoading: Boolean = false;

  isContactLoading: Boolean = false;
  isContactLoaded: Boolean = false;

  selectedFilter: any;
  length = 0;

  admins;

  private isAlive: boolean = true;


  constructor(private service: StayDuvetService, private dialog: MatDialog, private store: Store<State>, private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.selectedFilter = this.filters[0];
    this.isLoading = true;

    this.route.data.subscribe(data => {
      this.showActive = data['showActive'];
      if (this.showActive != null) {

        this.store.select(getAdmins).takeWhile(() => this.isAlive).subscribe((admins) => {
          this.admins = admins;
        });

        this.contactdatabase = new ContactDatabase(this.service, this.store, this.showActive);

        if (this.showActive) {
          this.setUpActiveContacts();
        }
        else {
          this.setUpInActiveContacts();
        }
      }
    });

  }

  setUpActiveContacts() {

    this.store.select(getActiveContacts).takeWhile(() => this.isAlive).subscribe((contacts) => {
      console.log('Component');
      this.length = contacts.length;
      this.contactDatasource = new ContactDataSource(this.contactdatabase, this.paginator, this.sort);

    });


    this.store.select(getIsActiveContactLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.isContactLoading = loading;
    });

    this.store.select(getIsActiveContactLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.isContactLoaded = loaded;
    });

    const upcomingCombined = Observable.merge(
      this.store.select(getActiveContacts),
      this.store.select(getIsActiveContactLoading),
      this.store.select(getIsActiveContactLoaded),
      ((tasks, loading, loaded) => {
      })
    );

    upcomingCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.isContactLoading && !this.isContactLoaded) {
          this.service.getActiveContacts().subscribe();
        }
        else if (!this.isContactLoading && this.isContactLoaded) {
          this.isLoading = false;
        }
      }
    );

  }

  setUpInActiveContacts() {

    this.store.select(getInActiveContacts).takeWhile(() => this.isAlive).subscribe((contacts) => {
      console.log('Component');
      this.length = contacts.length;
      this.contactDatasource = new ContactDataSource(this.contactdatabase, this.paginator, this.sort);

    });


    this.store.select(getIsInActiveContactLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.isContactLoading = loading;
    });

    this.store.select(getIsInActiveContactLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.isContactLoaded = loaded;
    });

    const upcomingCombined = Observable.merge(
      this.store.select(getInActiveContacts),
      this.store.select(getIsInActiveContactLoading),
      this.store.select(getIsInActiveContactLoaded),
      ((tasks, loading, loaded) => {
      })
    );

    upcomingCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.isContactLoading && !this.isContactLoaded) {
          this.service.getInActiveContacts().subscribe();
        }
        else if (!this.isContactLoading && this.isContactLoaded) {
          this.isLoading = false;
        }
      }
    );

  }

  openCreateContactPopup() {
    this.dialogRef = this.dialog.open(CreateContactPopupComponent);
    this.dialogRef.updateSize('100%','100%');
  }

  checkNullString(string: string): string {
    if (string != null) {
      return ' '.concat(string);
    } else {
      return '';
    }
  }

  selectedFilterChanged() {
    this.contactdatabase.setFilter(this.selectedFilter.slug);
    this.length = length;
  }

  rowSelected(row) {
    this.router.navigate(['/contacts/' + row.id]);
  }

  detailMagnifyContact(contact: User) {
    this.dialogRef = this.dialog.open(ContactDetailsMagnifyComponent);
    const instance = this.dialogRef.componentInstance;
    instance.contact = contact;
    this.dialogRef.updateSize('100%');
  }

  getSource(contact: User) {
    if (contact.type === 'admin') {
      return 'Admin';
    }

    if (contact.type === 'owner') {
      return 'Owner';
    }

    if (contact.type === 'guest') {
      return contact.getGuest().source;
    }

    if (contact.type === 'management') {
      const admin = this.admins.find(admin => admin.id === contact.getManagementContact().creator_id);
      if (!isNullOrUndefined(admin)) {
        return admin.first_name;
      }
    }

    return 'unknown';
  }

  getType(contact: User) {
    if (contact.type === 'admin') {
      return 'Admin';
    }

    if (contact.type === 'owner') {
      return 'Owner';
    }

    if (contact.type === 'guest') {
      return 'Guest'
    }

    if (contact.type === 'management') {
      return getContactMaintenanceCatagoryType(contact.getManagementContact().category).title;
    }

    return 'unknown';
  }


  ngOnDestroy(): void {
    this.isAlive = false;
  }

}

let length = 0;


export class ContactDatabase {
  dataChange: BehaviorSubject<User[]>;
  contacts: User[] = [];

  showActive;
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  setFilter(filter: string) {
    this._filterChange.next(filter);
  }

  get data(): User[] {
    return this.dataChange.value;
  }

  constructor(private service: StayDuvetService, private store: Store<State>, showActive: boolean) {
    console.log('Databse');
    this.showActive = showActive;
    this.loadcontacts();
    this._filterChange.subscribe(filter => {

      let data;


      if (this.filter === '' || this.filter === 'all_contacts') {
        data = this.contacts;
      } else if (this.filter === 'owner') {
        data = this.contacts.filter(contact => {
          const isOwner = contact.type === this.filter;
          const isHomeOwner = contact.type === 'management' && contact.getManagementContact().category === 'homeowner';

          return isOwner || isHomeOwner;
        });
      } else {
        data = this.contacts.filter(contact => contact.type === this.filter);
      }

      this.data.splice(0, this.data.length);

      for (let i = 0; i < data.length; i++) {
        this.addContacts(data[i]);
      }

      if (data.length == 0) {
        this.dataChange.next([]);
      }
    });
  }


  loadcontacts() {
    if (this.showActive) {
      this.store.select(getActiveContacts).subscribe((contacts) => {
        this.contacts = contacts;
        if (!this.dataChange) {
          this.dataChange = new BehaviorSubject<User[]>([]);
        } else {
          this.data.splice(0, this.data.length);
        }
        for (let i = 0; i < contacts.length; i++) {
          this.addContacts(contacts[i]);
        }
      });
    }
    else {
      this.store.select(getInActiveContacts).subscribe((contacts) => {
        this.contacts = contacts;
        if (!this.dataChange) {
          this.dataChange = new BehaviorSubject<User[]>([]);
        } else {
          this.data.splice(0, this.data.length);
        }
        for (let i = 0; i < contacts.length; i++) {
          this.addContacts(contacts[i]);
        }
      })
    }

  }

  addContacts(contact: User) {
    const a = this.data.slice();
    a.push(this.createNewContact(contact));
    this.dataChange.next(a);
  }

  private createNewContact(contact: User) {
    return Object.assign(new User(), contact);
  }


}

export class ContactDataSource extends DataSource<any> {


  constructor(private contactDatabase: ContactDatabase, private paginator: MatPaginator, private sort: MatSort) {
    super();
  }

  connect(): Observable<User[]> {
    const displayDataChanges = [
      this.contactDatabase.dataChange,
      this.paginator.page,
      this.sort.sortChange,
    ];


    return Observable.merge(...displayDataChanges).map(() => {
      const data = this.getSortedData();
      length = data.length;
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    });
  }

  disconnect() {
  }

  getSortedData(): User[] {
    const data = this.contactDatabase.data.slice();

    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this.sort.active) {
        case 'first_name':
          [propertyA, propertyB] = [a.first_name, b.first_name];
          break;
        case 'last_name':
          [propertyA, propertyB] = [a.last_name, b.last_name];
          break;
        case 'email':
          [propertyA, propertyB] = [a.email, b.email];
          break;
        case 'phone':
          [propertyA, propertyB] = [a.phone_number, b.phone_number];
          break;
        case 'type':
          [propertyA, propertyB] = [a.type, b.type];
          break;
        case 'source':
          [propertyA, propertyB] = [a.source, b.source];
          break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
    });
  }


}
