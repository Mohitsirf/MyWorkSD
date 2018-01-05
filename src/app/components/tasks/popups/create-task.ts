import {Component, Input, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {StayDuvetService} from '../../../services/stayduvet';
import {MatDialog} from '@angular/material';
import {Store} from '@ngrx/store';
import {
  State,
  getListings,
  getActiveContacts,
  getIsActiveContactLoading,
  getIsActiveContactLoaded,
  getAdmins,
  getIsBookingLoaded,
  getBookings,
  getIsBookingLoading,
  getAssigness,
  getIsAssigneesLoading,
  getIsAssgineesLoaded, getUser
} from '../../../reducers/index';
import {Listing} from '../../../models/listing';
import {
  getAllTasksStatsTypes, getAllTaskTypes, getPaymentByOptions, getTaskStatusType,
  getTaskType
} from '../../../utils';
import {Expense} from '../../../models/expense';
import {HttpEventType, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Booking} from '../../../models/booking';
import {TaskImage} from '../../../models/task-image';
import {User} from '../../../models/user';
import {getDateObj} from '../../calendar/calendar-utils';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'sd-create-task-popup', template: `
    <sd-modal-popup-layout title="Create a Task" [print]="true" (printAction)="printButtonClicked()">
      <form fxLayout="column" [formGroup]="formGroup" (ngSubmit)="formGroup.valid && saveButtonCLicked()">
        <div fxLayout="column" fxLayoutGap="15px">
          <mat-form-field>
            <input matInput placeholder="Title" formControlName='title'>
          </mat-form-field>
          <div fxLayout="row" fxLayoutAlign="space-between center">
            <mat-form-field [color]="'accent'" fxFlex="45%">
              <mat-select placeholder="Listing" formControlName='property_id'
                          (change)="selectedValueChanged()">
               
                <mat-option *ngFor="let listing of listings" [value]="listing.id">
                  {{ listing.title }}
                </mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field [color]="'accent'" fxFlex="45%">
              <mat-select placeholder="Category*" formControlName='type'>
                <mat-option *ngFor="let category of categories" [value]="category.slug">
                  {{ category.title }}
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div fxLayout="row" fxLayoutAlign="space-between center">
            <mat-form-field [color]="'accent'" fxFlex="45%">
              <mat-select placeholder="Assign*" formControlName='assignee_id'>
                <mat-option *ngFor="let assignee of assignees" [value]="assignee.id">
                  {{assignee.first_name}} {{assignee.last_name}}
                </mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field *ngIf="!isUserHomeowner" [color]="'accent'" fxFlex="45%">
              <mat-select placeholder="Status"
                          formControlName='status'
                          (change)="selectedStatusChanged()">
                <mat-option *ngFor="let status of statusTypes"
                            [value]="status.slug"
                            [ngStyle]="{'background-color': getStatusColor(status.slug), 'color': status.slug == 'waiting_for_approval' ? 'white' : 'black'}">
                  {{ status.title }}
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <mat-checkbox #checkTaskComplete class="width50" [checked]="isTaskComplete"
                        (change)="taskCompleteCheckBoxAltered(checkTaskComplete.checked)">
            Task Complete
          </mat-checkbox>
          <textarea formControlName='description' class="textArea" placeholder="Notes" rows="5">
              </textarea>


          <div fxLayoutAlign="space-between center" style="width: 120px">
            <span fxFlex="70%">All Day</span>
            <mat-slide-toggle [checked]="!showTime" (change)="timeToggleChange($event)">
            </mat-slide-toggle>
          </div>

          <div fxLayoutAlign="space-between center">
            <mat-form-field [color]="'accent'" fxFlex="45%">
              <input matInput [matDatepicker]="picker" placeholder="Choose a date" formControlName='due_date'>
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>

            <div *ngIf="showTime" fxLayoutAlign="center center" fxLayoutGap="5px" fxFlex="45%">
              <mat-form-field [color]="'accent'" fxFlex="45%">
                <mat-select placeholder="HH"
                            [(ngModel)]="hourSelected"
                            [ngModelOptions]="{standalone: true}">
                  <mat-option *ngFor="let hour of hours" [value]="hour">{{hour}}</mat-option>
                </mat-select>
              </mat-form-field>
              <span>:</span>

              <mat-form-field [color]="'accent'" fxFlex="45%">
                <mat-select placeholder="MM"
                            [(ngModel)]="minuteSelected"
                            [ngModelOptions]="{standalone: true}">
                  <mat-option *ngFor="let minute of minutes" [value]="minute">{{minute}}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </div>


          <div fxLayoutAlign="space-between center" style="width: 380px">
            <span fxFlex="80%">Does this task involve a reservation?</span>
            <mat-slide-toggle (change)="reservationToggleChange($event)" [checked]="showGuest"
                              [disabled]="!selectedListingId">
            </mat-slide-toggle>
          </div>

          <div *ngIf="showGuest && selectedListingId ">
            
            <mat-form-field *ngIf=" !loadingGuest" class="width50" color="accent">
              <input matInput placeholder="Search guest name" [matAutocomplete]="auto" formControlName="booking_id">
              <mat-autocomplete #auto="matAutocomplete" [displayWith]="getGuestName.bind(this)">
                <mat-option *ngFor="let booking of filteredBookings | async"
                            [ngStyle]="{'color': 'white'}"
                            [value]="booking.id">
                  {{booking.getGuest().first_name}} {{ booking.getGuest().last_name}}

                </mat-option>
              </mat-autocomplete>
            </mat-form-field>

            <mat-spinner *ngIf="loadingGuest" color="accent" [diameter]="30" [strokeWidth]="4"></mat-spinner>
          </div>
          <div *ngIf="!isUserHomeowner" fxLayoutAlign="space-between center" style="width: 380px">
            <span fxFlex="80%">Does this task have expenses?</span>
            <mat-slide-toggle (change)="expenseToggleChange($event)">
            </mat-slide-toggle>
          </div>
          <div *ngIf="showExpense" fxLayout="column">
            <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="10px" class="heading">
              <span style="width: 55%">Product</span>
              <span style="width: 10%">Quantity</span>
              <span style="width: 10%">Price</span>
              <span style="width: 15%">Amount</span>
            </div>
            <hr>
            <div fxLayout="column" *ngFor="let expense of expenses; let index = index">
              <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="10px">
                <div style="width: 55%" fxLayout="row" fxLayoutGap="1%">
                  <mat-form-field style="width: 38%">
                    <input matInput
                           [(ngModel)]="expense.title"
                           [ngModelOptions]="{standalone: true}"
                           placeholder="Enter item name"
                           [value]="expense.title">
                  </mat-form-field>
                  <mat-form-field style="width: 60%">
                    <input matInput
                           [(ngModel)]="expense.desc"
                           [ngModelOptions]="{standalone: true}"
                           placeholder="Enter item description"
                           [value]="expense.desc">
                  </mat-form-field>
                </div>

                <mat-form-field style="width: 10%">
                  <input matInput
                         [(ngModel)]="expense.quantity"
                         [ngModelOptions]="{standalone: true}"
                         placeholder="Quantity"
                         [value]="expense.quantity">
                </mat-form-field>

                <mat-form-field style="width: 10%">
                  <span matPrefix>$ &nbsp;</span>
                  <input matInput
                         [(ngModel)]="expense.price"
                         [ngModelOptions]="{standalone: true}"
                         placeholder="Price"
                         [value]="expense.price">
                </mat-form-field>

                <span style="width: 15%">$ {{amountCalculatePerItem(expense.quantity, expense.price)}}</span>
                <button mat-icon-button color="'accent'" *ngIf="expenses.length > 1" (click)="removeItem(index)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
            <div style="margin-top: 10px; margin-bottom: 10px" fxLayoutAlign="center center">
              <button mat-button fxLayoutAlign="center" style="color: #2d7cff"
                      fxLayoutGap="10px" (click)="addItem()" type="button">
                <mat-icon>add_circle</mat-icon>
                <span style="font-size: medium"> Add an item</span>
              </button>
            </div>
            <hr>
          </div>

          <mat-form-field *ngIf="!isUserHomeowner" [color]="'accent'" style="width:40%;">
            <mat-select placeholder="Who Will Pay?*" formControlName='payment_by'>
              <mat-option *ngFor="let item of paymentByOptions" [value]="item.slug">{{item.title}}</mat-option>
            </mat-select>
          </mat-form-field>

          <div fxLayoutAlign="space-between center">
            <div fxLayout="column" fxLayoutGap="10px">
              <button mat-raised-button color="accent" style="width: 200px" (click)="openUploadPopup()" type="button">
                UPLOAD PHOTOS
              </button>
              <span style="font-size: 10px">Upload any recipient or any photos taken from this task*</span>
            </div>
            <div fxLayout="row">
              <mat-spinner *ngIf="isSaving" color="accent" [diameter]="30" [strokeWidth]="4"></mat-spinner>
              <button type="submit" mat-raised-button color="accent" [disabled]="isSaving">SAVE</button>
            </div>
          </div>
          <input type="file" accept="image/*" style="visibility: hidden" #addImageWrapper multiple>
        </div>
      </form>
      <mat-progress-bar *ngIf="uploading" [value]="uploadProgress" [color]="'accent'"></mat-progress-bar>
      <div style="padding: 20px; min-height: 25%"
           *ngIf="images.length<1"
           fxLayout="row"
           fxLayoutWrap
           fxLayoutGap="10px"
           fxLayoutAlign="start none">
      </div>
      <div *ngIf="images.length > 0"
           class="UploadedPhoto"
           fxLayout="row"
           fxLayoutWrap
           fxLayoutGap="10px"
           fxLayoutAlign="start none">
        <div class="parent" *ngFor="let image of images">
          <img src="{{image.url}}">
        </div>
      </div>
    </sd-modal-popup-layout>
  `, styles: [`
    .textArea {
      width: 100%;
      min-height: 100px;
      box-sizing: border-box;
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      border-color: #194267;
      padding: 10px;
      border-style: solid;
      margin: 2px;
      border-width: 1px;
      border-color: #194267;
      border-radius: 3px;
    }


    .parent {
      width: 150px;
    }

    .width50 {
      width: 48%;
    }

    textarea {
      resize: none;
    }

    .UploadedPhoto {
      /*min-height: 50vh;*/
      padding: 10px;
    }

    .main-container {
      padding: 0px;
    }

    #titleBar {
      padding: 5px;
      background-color: dodgerblue;
    }

    hr {
      width: 100%;
    }

    mat-card {
      margin-top: 10px;
      width: 1in;
      height: 1in;
    }

    .icon {
      background: transparent;
      border: none !important;
      font-size: 0;
    }

    .example-spacer {
      flex: 1 1 auto;
    }

    img {
      width: 100%;
      height: auto;
      border-radius: 2px;
      box-shadow: 1px 1px 5px gray;
    }
  `]
})

export class CreateTaskPopupComponent implements OnInit, OnDestroy {

  private isAlive: boolean = true;

  formGroup: FormGroup;
  title: FormControl;
  propertyId: FormControl;
  assigneeId: FormControl;
  type: FormControl;
  status: FormControl;
  dueDate: FormControl;
  description: FormControl;
  paymentBy: FormControl;
  booking: FormControl;
  filteredBookings: Observable<any[]>;

  listings: Listing[] = [];
  categories;
  statusTypes;
  paymentByOptions;
  isTaskComplete;
  bookingId;

  user: User;

  bookings: Booking[] = [];


  expenses: Expense[] = [];
  images: TaskImage[] = [];

  hourSelected;
  minuteSelected;
  uploading = false;
  uploadProgress = 0;

  contacts: User[] = [];
  assignees: User[] = [];

  guests: User[] = [];

  selectBookings: Booking[] = [];
  isSaving = false;

  assigneesLoaded = false;
  assigneesLoading = false;


  isUserHomeowner = false;

  @Input() property_id: number;


  hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09'];
  minutes = ['00', '15', '30', '45'];
  showTime = false;
  showExpense = false;
  showGuest = false;
  loadingGuest = false;
  selectedListingId;
  @ViewChild('addImageWrapper', {read: ElementRef}) addImageWrapper: ElementRef;

  constructor(private service: StayDuvetService, private dialog: MatDialog, private store: Store<State>) {
    this.title = new FormControl(null, [Validators.required]);
    this.propertyId = new FormControl(null, [Validators.required]);
    this.assigneeId = new FormControl(null, [Validators.required]);
    this.type = new FormControl('reminder', [Validators.required]);
    this.status = new FormControl(null, [Validators.required]);
    this.booking = new FormControl();
    this.dueDate = new FormControl(getDateObj(), [Validators.required]);
    this.description = new FormControl();
    this.paymentBy = new FormControl(null, [Validators.required]);

    this.formGroup = new FormGroup({
      title: this.title,
      property_id: this.propertyId,
      assignee_id: this.assigneeId,
      type: this.type,
      status: this.status,
      booking_id: this.booking,
      due_date: this.dueDate,
      description: this.description,
      payment_by: this.paymentBy,
    });

    this.categories = getAllTaskTypes();
    this.statusTypes = getAllTasksStatsTypes();
    this.paymentByOptions = getPaymentByOptions();

    this.paymentBy.setValue('owner_charge');
    this.status.setValue('scheduled');

    this.store.select(getUser).subscribe((user) => {
      this.user = user;
      this.assigneeId.setValue(user.id);
      if (user.type == 'management' && user.getManagementContact().category == 'homeowner') {
        this.isUserHomeowner = true;
        console.log(this.isUserHomeowner);
        this.paymentBy.setValue('owner_charge');
      }
    });

    for (let i = 10; i < 24; i++) {
      this.hours.push(String(i));
    }
  }

  ngOnInit() {
    this.store.select(getListings).takeWhile(() => this.isAlive).subscribe((listings) => {
      this.listings = listings.sort((a: Listing, b: Listing) => {
        if (a.title > b.title) {
          return 1;
        }
        if (a.title < b.title) {
          return -1;
        }
        return 0;
      });
      this.propertyId.setValue(this.property_id);
      if (!isNullOrUndefined(this.listings) && this.isUserHomeowner) {
        const listing = this.listings.find((listing: Listing) => {
          if (listing.owner_id == this.user.id) {
            this.propertyId.setValue(listing.id);
            return true;
          }
        })
      }
    });

    this.setUpAdmins();

    this.addImageWrapper.nativeElement.onchange = (event) => {
      this.uploading = true;
      this.uploadProgress = 0;
      const images = [];
      for (let i = 0; i < event.target.files.length; i++) {
        images.push(event.target.files[i]);
      }
      this.service.addTaskImages({images: images}).subscribe(eventImage => {
        if (eventImage.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * eventImage.loaded / eventImage.total);
        } else if (eventImage instanceof HttpResponse) {
          this.uploading = false;
          this.uploadProgress = 0;
          eventImage.body.data.map((image) => {
            this.images.push(image);
          });
        }
      }, () => {
        this.uploading = false;
      });
    };

    this.filteredBookings = this.booking.valueChanges.startWith(null).map(name => {
      return name ? this.filterGuests(name) : this.selectBookings.slice(0, 10);
    });

  }

  getGuestName(id) {

    if (isNullOrUndefined(id)) {
      return '';
    }

    const booking = this.selectBookings.find(booking => booking.id === id);

    return booking.getGuest().first_name + this.checkNullString(booking.getGuest().last_name);
  }



  filterGuests(name) {

    const fullResults = this.selectBookings.filter(booking => {
      return (booking.getGuest().first_name + this.checkNullString(booking.getGuest().last_name)).toLowerCase().indexOf(String(name).toLowerCase()) === 0;
    });

    const length = fullResults.length;

    return fullResults.slice(0, length > 10 ? 10 : length);
  }

  saveButtonCLicked() {
    this.dueDate.setValue(this.getDateInDateFormat(getDateObj(this.dueDate.value)));
    const data = this.formGroup.value;

    if (this.images.length > 0) {
      data['images'] = this.images.map((image) => image.id);
    }

    if (this.showExpense) {
      const expenses = this.expenses.map((expense) => {
        // if (expense.title && expense.desc && expense.price !== null && expense.quantity !== null) {
        if (expense.title && expense.price !== null && expense.quantity !== null) {
          expense.quantity = Number(expense.quantity);
          expense.price = Number(expense.price * 100) / 100;
        }

        return expense;
      });

      if (expenses.length > 0) {
        data['expenses'] = expenses;
        data['amount'] = this.totalAmount();
      } else {
        data['expenses'] = [];
        data['amount'] = 0;

      }
    }

    if (this.showTime) {
      data['due_time'] = this.getTimeInDateFormat(this.hourSelected, this.minuteSelected);
    }

    if (!this.showGuest) {
      delete data['booking_id'];
    }

    console.log(data);
    this.isSaving = true;
    this.service.createTask(data).subscribe(() => {
      this.isSaving = false;
      this.dialog.closeAll();
    }, () => {
      this.isSaving = false;
    });
  }

  selectedGuestOption(booking: Booking) {
    this.bookingId = booking.id;
    console.log(booking);
  }

  selectedValueChanged() {
    const listingId = this.propertyId.value;
    this.selectedListingId = this.propertyId.value;

    this.loadingGuest = true;
    this.service.getBookingWithPropertyId(listingId).subscribe((res: Booking[]) => {
      this.selectBookings = res;
      this.loadingGuest = false;

    }, () => {
      this.loadingGuest = false;
    });

  }

  selectedStatusChanged() {
    this.isTaskComplete = this.status.value === 'completed';
  }

  taskCompleteCheckBoxAltered(value: boolean) {
    if (value) {
      this.status.setValue('completed');
    } else {
      this.status.setValue('scheduled');
    }
  }


  getTimeInDateFormat(hours: string, minutes: string) {
    if (hours && minutes) {
      return hours + ':' + minutes;
    }
    return '00:00';
  }

  getDateInDateFormat(date: Date) {
    if ((typeof date) === 'string') {
      return date;
    }

    const month = date.getMonth();
    const dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    return dateString;
  }

  timeToggleChange($event) {
    this.showTime = !$event.checked;
  }

  reservationToggleChange($event) {
    this.showGuest = $event.checked;
  }

  expenseToggleChange($event) {
    this.showExpense = $event.checked;
    if (this.showExpense) {
      this.expenses.push(Object.assign(new Expense(), {title: '', desc: '', quantity: 0, price: 0}));
    } else {
      this.expenses = [];
    }
  }

  amountCalculatePerItem(quant, price) {
    const quantity = Number(quant);
    const prices = Number(price);
    if (prices && quantity) {
      let amount = prices * quantity;
      if (amount % 1000 !== amount) {
        amount = amount / 1000;
        return (amount).toFixed(2) + 'K';
      } else {
        return (amount).toFixed(2);
      }
    } else {
      return '0.00';
    }
  }

  totalAmount() {
    let amount = 0;
    this.expenses.map((expense) => {
      amount += (Number(expense.price) * Number(expense.quantity));
    });
    console.log(amount)
    return amount;
  }

  addItem() {
    this.expenses.push(Object.assign(new Expense(), {title: '', desc: '', quantity: 0, price: 0}));
  }

  removeItem(index) {
    this.expenses.splice(index, 1);
  }

  checkNullString(string: string): string {
    if (string != null) {
      return ' '.concat(string);
    } else {
      return '';
    }
  }

  openUploadPopup() {
    this.addImageWrapper.nativeElement.click();
  }

  printButtonClicked() {
  }

  private setUpAdmins() {
    this.store.select(getAssigness).takeWhile(() => this.isAlive).subscribe((assignees) => {
      this.assignees = assignees;
    });

    this.store.select(getIsAssigneesLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.assigneesLoading = loading;
    });

    this.store.select(getIsAssgineesLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.assigneesLoaded = loaded;
    });

    const combined = Observable.merge(this.store.select(getIsAssigneesLoading), this.store.select(getIsAssgineesLoaded), this.store.select(getAssigness), ((loading, loaded, assignees) => {
    }));

    combined.takeWhile(() => this.isAlive).subscribe((data) => {
      if (!this.assigneesLoading && !this.assigneesLoaded) {
        this.service.getTaskAssignees().subscribe();
      }
    });
  }



  getStatusColor(status): string {
    return getTaskStatusType(status).color
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}

