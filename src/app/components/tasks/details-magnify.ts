import {Component, Input, OnDestroy, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Task} from 'app/models/task';
import {StayDuvetService} from '../../services/stayduvet';
import {MatDialog} from '@angular/material';
import {Store} from '@ngrx/store';
import {
  getAdmins,
  getAssigness,
  getBookings,
  getActiveContacts,
  getIsAssgineesLoaded,
  getIsAssigneesLoading,
  getIsBookingLoaded,
  getIsBookingLoading,
  getIsActiveContactLoaded,
  getIsActiveContactLoading,
  getListings,
  State
} from '../../reducers/index';
import {Observable} from 'rxjs/Observable';
import {
  getTaskType, getAllTasksStatsTypes, getAllTaskTypes, getPaymentByOptions, getTaskStatusType, getReservationStatusType
} from '../../utils';
import {Subscription} from 'rxjs/Subscription';
import {Listing} from '../../models/listing';
import {User} from '../../models/user';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Expense} from '../../models/expense';
import {isNullOrUndefined} from 'util';
import {getDateObj} from '../calendar/calendar-utils';
import {Booking} from '../../models/booking';
import {HttpEventType, HttpResponse} from '@angular/common/http';
import {TaskImage} from '../../models/task-image';

@Component({
  selector: 'sd-magnify', template: `
    <div class='table'>
      <div class='row'>
        <div class='cell'>
          <mat-toolbar color="accent">
            <h2>{{task.title}}</h2>
            <span class="example-spacer"></span>
            <button mat-icon-button>
              <mat-icon>print</mat-icon>
            </button>
            <button mat-icon-button matDialogClose>
              <mat-icon>close</mat-icon>
            </button>
          </mat-toolbar>
        </div>
      </div>
      <div class='row'>
        <div class='cell'>
          <div id="main-content">
            <div *ngIf="!isEditable" fxLayout="column" fxLayoutGap="20px">
              <div fxLayout="column" fxLayoutGap="10px">
                <div fxLayoutAlign="space-between center">
                  <span class="widthHalf heading">Start date</span>
                  <span class="widthHalf">{{task.due_date | date}}</span>
                </div>
                <div fxLayoutAlign="space-between center">
                  <span class="widthHalf heading">Listing Name</span>
                  <span class="widthHalf">{{listingName | titlecase}}</span>
                </div>
                <div fxLayoutAlign="space-between center">
                  <span class="widthHalf heading">Assignee</span>
                  <span class="widthHalf">{{getAssignedName(task.assignee_id).name}}</span>
                </div>
                <div fxLayoutAlign="space-between center">
                  <span class="widthHalf heading">Status</span>
                  <span class="widthHalf">{{getTaskStatusTitle(task.status)}}</span>
                </div>
              </div>

              <hr>

              <div fxLayout="column" fxLayoutGap="10px">
                <div fxLayoutAlign="space-between center">
                  <span style="width: 40%" class="heading">Task Title</span>
                  <div style="width: 30%">
                    <span fxLayoutAlign="center" class="heading">Category</span>
                  </div>
                  <div style="width: 30%">
                    <span fxLayoutAlign="end" class="heading">Price</span>
                  </div>
                </div>
                <hr>
                <div fxLayoutAlign="space-between center">
                  <span style="width: 35%">{{task.title}}</span>
                  <div style="width: 35%">
                    <span fxLayoutAlign="center">{{getTypes(task.type).title}}</span>
                  </div>
                  <div style="width: 25%">
                    <span fxLayoutAlign="end"><b>$</b>{{task.amount}}</span>
                  </div>
                </div>
              </div>
              <hr>

              <hr *ngIf="task.getExpenses().length > 0">
              <div *ngIf="task.getExpenses().length > 0" fxLayout="column" fxLayoutGap="10px">
                <div fxLayoutAlign="space-between center">
                  <span style="width: 30%" class="heading">Item</span>
                  <div style="width: 15%">
                    <span fxLayoutAlign="center" class="heading">Quantity</span>
                  </div>
                  <div style="width: 20%">
                    <span fxLayoutAlign="end" class="heading">Price</span>
                  </div>
                  <div style="width: 25%">
                    <span fxLayoutAlign="end" class="heading">Amount</span>
                  </div>
                </div>
                <hr>
                <div fxLayoutAlign="space-between center" *ngFor="let expense of task.getExpenses()">
            <span style="width: 30%">
              {{ expense.title }}
              <mat-icon *ngIf="expense.desc" [matTooltip]="expense.desc">help</mat-icon>
            </span>
                  <div style="width: 15%">
                    <span fxLayoutAlign="center">{{expense.quantity}}</span>
                  </div>
                  <div style="width: 20%">
                    <span fxLayoutAlign="end">{{expense.price}}</span>
                  </div>
                  <div style="width: 25%">
                    <span fxLayoutAlign="end"><b>$</b>{{expense.quantity * expense.price}}</span>
                  </div>
                </div>
                <hr>
              </div>

              <div *ngIf="task.getExpenses().length > 0" fxLayout="column" fxLayoutGap="10px">
                <div fxLayoutAlign="space-between center">
                  <span class="heading">Sub Total</span>
                  <span><b>$</b> {{task.amount}}</span>
                </div>
                <hr>
                <div fxLayoutAlign="space-between center">
                  <span class="heading">Tax</span>
                  <span></span>
                </div>
                <hr>
                <div fxLayoutAlign="space-between center">
                  <span class="heading">Total</span>
                  <span></span>
                </div>
                <hr>
              </div>

              <div fxLayout="column" fxLayoutGap="10px">
                <div fxLayout="column" fxLayoutGap="5px">
                  <span class="heading">Notes:</span>
                  <p *ngIf="description && description != ''" class="multi-line-content">{{ description }}</p>
                  <p *ngIf="!description || description == ''" style="font-style: italic">No Notes entered.</p>
                </div>
              </div>
            </div>
            <div *ngIf="isEditable">
              <form fxLayout="column" [formGroup]="taskForm" (ngSubmit)="this.taskForm.valid && saveButtonClicked()">
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
                    <mat-form-field class="width50">
                      <mat-select placeholder="Category*" formControlName='type'>
                        <mat-option *ngFor="let category of categories" [value]="category.slug">
                          {{ category.title }}
                        </mat-option>
                      </mat-select>
                    </mat-form-field>
                  </div>

                  <div fxLayout="row" fxLayoutAlign="space-between center">
                    <mat-form-field class="width50">
                      <mat-select placeholder="Assign*" [(ngModel)]="this.task.assignee_id"
                                  formControlName='assignee_id'>
                        <mat-option *ngFor="let assignee of assignees" [value]="assignee.id">
                          {{assignee.first_name}} {{assignee.last_name}}
                        </mat-option>
                      </mat-select>
                    </mat-form-field>
                    <mat-form-field class="width50">
                      <mat-select placeholder="Status"
                                  formControlName='status'>
                        <mat-option *ngFor="let status of statusTypes"
                                    [ngStyle]="{'background-color': getStatusColor(status.slug), 'color': status.slug == 'waiting_for_approval' ? 'white' : 'black'}"
                                    [value]="status.slug">
                          {{ status.title }}
                        </mat-option>
                      </mat-select>
                    </mat-form-field>
                  </div>

                  <span class="heading">Notes:</span>

                  <textarea placeholder="Notes" [(ngModel)]="description" [ngModelOptions]="{standalone: true}"
                            class="textArea" rows="5">
              </textarea>

                  <div fxLayoutAlign="space-between center" style="width: 120px">
                    <span fxFlex="70%">All Day</span>
                    <mat-slide-toggle [checked]="!showTime" (change)="timeToggleChange($event)">
                    </mat-slide-toggle>
                  </div>

                  <div fxLayoutAlign="space-between center">
                    <mat-form-field class="width50">
                      <input matInput [matDatepicker]="picker" placeholder="Choose a date" formControlName='due_date'>
                      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                      <mat-datepicker #picker></mat-datepicker>
                    </mat-form-field>

                    <div *ngIf="showTime" fxLayoutAlign="center center" fxLayoutGap="5px" class="width50">
                      <mat-form-field>
                        <mat-select placeholder="HH"
                                    [(ngModel)]="hourSelected"
                                    [ngModelOptions]="{standalone: true}">
                          <mat-option *ngFor="let hour of hours" [value]="hour">{{hour}}</mat-option>
                        </mat-select>
                      </mat-form-field>
                      <span>:</span>
                      <mat-form-field>
                        <mat-select placeholder="MM"
                                    [(ngModel)]="minuteSelected"
                                    [ngModelOptions]="{standalone: true}">
                          <mat-option *ngFor="let minute of minutes" [value]="minute">{{minute}}</mat-option>
                        </mat-select>
                      </mat-form-field>
                    </div>
                  </div>

                  <mat-form-field class="width50">
                    <mat-select placeholder="Who Will Pay?*" formControlName='payment_by'>
                      <mat-option *ngFor="let item of paymentByOptions" [value]="item.slug">{{item.title}}</mat-option>
                    </mat-select>
                  </mat-form-field>

                  <div  fxLayoutAlign="space-between center" style="width: 380px">
                    <span fxFlex="80%">Does this task involve a reservation?</span>
                    <mat-slide-toggle (change)="reservationToggleChange($event)" [checked]="showGuest"
                                      [disabled]="!selectedListingId">
                    </mat-slide-toggle>
                  </div>

                  <div *ngIf="showGuest && selectedListingId && !loadingGuest">
                    <mat-form-field  class="width50" color="accent">
                      <input matInput placeholder="Search guest name" [matAutocomplete]="auto" formControlName="booking_id">
                      <mat-autocomplete #auto="matAutocomplete" [displayWith]="getGuestName.bind(this)">
                        <mat-option *ngFor="let booking of filteredBookings | async"
                                    [ngStyle]="{'color': 'white'}"
                                    [value]="booking.id">
                          {{booking.getGuest().first_name}} {{ booking.getGuest().last_name}}

                        </mat-option>
                      </mat-autocomplete>
                    </mat-form-field>
                  </div>

                    <mat-spinner *ngIf="showGuest && selectedListingId && loadingGuest"  color="accent" [diameter]="30" [strokeWidth]="4"></mat-spinner>


                  <div fxLayoutAlign="space-between center" style="width: 380px">
                    <span fxFlex="80%">Does this task have expenses?</span>
                    <mat-slide-toggle [checked]="showExpense" (change)="expenseToggleChange($event)">
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
                        <button mat-icon-button color="'accent'" *ngIf="expenses.length > 0"
                                (click)="removeItem(index)">
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

                  <div fxLayoutAlign="space-between center">
                    <div fxLayout="column" fxLayoutGap="10px">
                      <button mat-raised-button color="accent" style="width: 200px" (click)="openUploadPopup()"
                              type="button">
                        UPLOAD PHOTOS
                      </button>
                      <span style="font-size: 10px">Upload any recipient or any photos taken from this task*</span>
                    </div>
                  </div>

                  <div fxLayout="row" fxLayoutAlign="end" fxLayoutGap="10px">
                    <mat-spinner [color]="'accent'" *ngIf="isUpdating" [diameter]="30" [strokeWidth]="4"></mat-spinner>
                    <button *ngIf="isEditable" mat-raised-button type="submit" color="accent">SAVE</button>
                  </div>

                </div>
                <input type="file" accept="image/*" style="visibility: hidden" #addImageWrapper multiple>
              </form>
              <mat-progress-bar *ngIf="uploading" [value]="uploadProgress" [color]="'accent'"></mat-progress-bar>
            </div>
            <div *ngIf="images.length > 0"
                 class="UploadedPhoto"
                 fxLayout="row"
                 fxLayoutWrap
                 fxLayoutGap="10px"
                 fxLayoutAlign="start none">
              <div class="parent" *ngFor="let image of images">
                <button mat-icon-button *ngIf="isEditable" (click)="removeImage(image)">
                  <mat-icon>close</mat-icon>
                </button>
                <img src="{{image.url}}">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class='row'>
        <div class='cell'>
          <div *ngIf="!isEditable" fxLayout="row" fxLayoutAlign="end" fxLayoutGap="10px">
            <mat-spinner [color]="'accent'" *ngIf="isUpdating || isCompleting" [diameter]="30" [strokeWidth]="4"></mat-spinner>
            <button mat-raised-button color="warn" [disabled]="isCompleting" (click)="deleteTask()">Delete</button>
            <button  mat-raised-button type="button" color="accent" [disabled]="isCompleting"  (click)="editButtonClicked()">
              EDIT
            </button>
            <button *ngIf="!isEditable" mat-raised-button type="button"
                    style="color: white!important;background-color: #288808 !important;" [disabled]="isCompleting"
                    (click)="completeButtonClicked()">
              COMPLETE
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`

    .example-spacer {
      flex: 1 1 auto;
    }

    .table {
      display: table;
      table-layout: fixed;
      height: 100%;
      width: 100%;
      max-height: 100%;
    }

    .row {
      display: table-row;
    }

    .cell {
      display: table-cell;
    }

    .row:first-of-type > .cell {
      height: 1%;
    }

    #main-content {
      height: 100%;
      overflow-y: auto;
      padding-left: 10px;
      padding-right: 10px;
      padding-top: 10px;
    }

    .row:last-of-type > .cell {
      height: 1%;
      padding-top: 10px;
      padding-left: 10px;
      padding-right: 10px;
    }

    /deep/ mat-dialog-container {
      padding-top: 0px !important;
      /*padding-left: 24px !important;*/
      /*padding-right: 24px !important;*/
      /*padding-bottom: 24px !important;*/
    }

    .multi-line-content {
      font-family: 'Roboto', sans-serif;
      white-space: pre-line;
    }

    hr {
      color: darkgrey;
      width: 100%;
    }

    .width50 {
      width: 48%;
    }

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
      border-radius: 3px;
      resize: none;
    }

    .widthHalf {
      width: 48%;
    }

    .heading {
      font-size: 17px;
      font-weight: bolder;
    }

    mat-spinner {
      height: 24px;
      width: 24px;
    }

    /*.sides {*/
    /*margin-left: 20px;*/
    /*}*/

    .example-spacer {
      flex: 1 1 auto;
    }

    .UploadedPhoto {
      /*min-height: 50vh;*/
      padding: 10px;
    }

    .parent {
      width: 150px;
    }

    img {
      width: 100%;
      height: auto;
      border-radius: 2px;
      box-shadow: 1px 1px 5px gray;
    }
  `]
})

export class DetailsMagnifyComponent implements OnInit, OnDestroy {

  title: FormControl;
  propertyId: FormControl;
  assigneeId: FormControl;
  type: FormControl;
  status: FormControl;
  dueDate: FormControl;
  description;
  paymentBy: FormControl;
  booking: FormControl;
  paymentByOptions;

  expenses: Expense[] = [];
  showExpense = false;

  statusTypes;

  isUpdating = false;
  isEditable = false;
  isCompleting = false;

  private isAlive: boolean = true;
  @Input() task: Task;
  @Input() listingName;
  listings: Listing[];
  assignees: User[];
  selectBookings: Booking[] = [];
  categories = getAllTaskTypes();
  bookingId;

  hourSelected;
  minuteSelected;
  showTime;

  taskForm: FormGroup;
  showGuest = false;

  hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
  minutes = ['00', '15', '30', '45'];

  assigneesLoaded = false;
  assigneesLoading = false;

  filteredBookings: Observable<any[]>;

  assigned;



  contacts = [];
  contactsLoaded: Boolean = false;
  contactsLoading: Boolean = false;

  reservationsLoading: boolean = false;
  reservationsLoaded: boolean = false;

  getTypes  = getTaskType;

  uploading = false;
  uploadProgress = 0;
  images: TaskImage[] = [];
  loadingGuest = false;
  selectedListingId;

  @ViewChild('addImageWrapper', {read: ElementRef}) addImageWrapper: ElementRef;

  constructor(private stayDuvetService: StayDuvetService, private dialog: MatDialog, private store: Store<State>) {

  }

  ngOnInit() {
    console.log(this.task);
    this.title = new FormControl(this.task.title, [Validators.required]);
    this.propertyId = new FormControl(this.task.property_id, [Validators.required]);
    this.assigneeId = new FormControl(this.task.assignee_id, [Validators.required]);
    this.type = new FormControl(this.task.type, [Validators.required]);
    this.status = new FormControl(this.task.status, [Validators.required]);
    this.booking = new FormControl(this.task.booking_id,[]);
    this.dueDate = new FormControl(getDateObj(this.task.due_date).toDateString(), [Validators.required]);
    this.paymentBy = new FormControl(this.task.payment_by, [Validators.required]);
    this.paymentBy = new FormControl(this.task.payment_by, [Validators.required]);
    this.statusTypes = getAllTasksStatsTypes();
    this.paymentByOptions = getPaymentByOptions();
    this.description = this.task.description;

    if (this.task.due_time == 'All Day') {
      this.showTime = false;
    } else {
      this.showTime = true;

      const time = this.task.due_time.split(':');
      this.hourSelected = time[0];
      this.minuteSelected = time[1];
      console.log(time);
    }

    this.setupAssignees();

    this.taskForm = new FormGroup({
      title: this.title,
      property_id: this.propertyId,
      assignee_id: this.assigneeId,
      type: this.type,
      status: this.status,
      due_date: this.dueDate,
      payment_by: this.paymentBy,
      booking_id:this.booking
    });


    this.filteredBookings = this.booking.valueChanges.startWith(null).map(name => {
      return name ? this.filterGuests(name) : this.selectBookings.slice(0, 10);
    });

    this.store.select(getListings).takeWhile(()=> this.isAlive).subscribe(listings => this.listings = listings);


    const listingId = this.propertyId.value;
    this.selectedListingId = this.propertyId.value;

    this.loadingGuest = true;

    this.stayDuvetService.getBookingWithPropertyId(listingId).subscribe((res:Booking[]) =>
    {
      this.selectBookings = res;
      this.loadingGuest = false;
    });

    this.dueDate.setValue(this.task.due_date);


    if ((this.task.booking_id != 0 && this.task.booking_id != null)) {
      this.showGuest = true;
    }


    for (let image of this.task.getImages()) {
      let im = Object.assign(new TaskImage(), image);
      this.images.push(im);
    }

    console.log('images => ' + this.images);

    for (let expense of this.task.getExpenses()) {
      this.showExpense = true;
      let exp = new Expense();
      exp.id = expense.id;
      exp.title = expense.title;
      exp.quantity = expense.quantity;
      exp.price = expense.price;
      exp.desc = expense.desc;

      this.expenses.push(exp);
    }


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

  printButtonClicked() {
  }

  getStatusColor(status): string {
    return getTaskStatusType(status).color
  }

  setupImageWrapper() {
    this.addImageWrapper.nativeElement.onchange = (event) => {
      this.uploading = true;
      this.uploadProgress = 0;
      const images = [];
      for (let i = 0; i < event.target.files.length; i++) {
        images.push(event.target.files[i]);
      }
      this.stayDuvetService.addTaskImages({images: images}).subscribe(eventImage => {
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
  }

  openUploadPopup() {
    this.addImageWrapper.nativeElement.click();
  }

  reservationToggleChange($event) {
    this.showGuest = $event.checked;


  }

  removeImage(image: TaskImage) {
    this.images = this.images.filter(im => {
      return im.id != image.id;
    });

    console.log(this.images);
  }





  selectedGuestOption(booking: Booking) {
    this.bookingId = booking.id;
  }


  getAssignedName(id: number) {
    let assigned;
    this.assignees.map((assignee) => {
      if (assignee.id === id) {
        assigned = assignee.first_name + this.checkNullString(assignee.last_name);
      }
    });
    return {name: assigned};
  }

  deleteTask()
  {
    this.isCompleting = true;
    this.stayDuvetService.deleteTask(this.task.id).subscribe(() => {
      this.isCompleting = false;
      this.dialog.closeAll();
    }, ( ) => {
      this.isCompleting = false;
    });
  }

  saveButtonClicked() {
    this.isUpdating = true;
    this.dueDate.setValue(this.getDateInDateFormat(getDateObj(this.dueDate.value)));
    const data = this.taskForm.value;

    if (this.images.length > 0) {
      data['images'] = this.images.map((image) => image.id);
    }

    if (this.expenses.length > 0) {
      data['expenses'] = this.expenses;
      data['amount'] = this.totalAmount();
    } else {
      data['expenses'] = [];
      data['amount'] = 0;
    }
    data['description'] = this.description;
    data['due_time'] = this.getTimeInDateFormat(this.hourSelected, this.minuteSelected);

    delete data['guestName'];

    console.log(this.taskForm.value);
    console.log(data);
    this.stayDuvetService.updateTask(this.task.id, data)
      .subscribe((task) => {
        console.log('response');
        console.log(task);
        this.dialog.closeAll();
      }, () => {
        this.isUpdating = false;
      });
  }

  checkNullString(string: string): string {
    if (string != null) {
      return ' '.concat(string);
    } else {
      return '';
    }
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  editButtonClicked() {
    this.isEditable = true;
    setTimeout(() => {
      this.setupImageWrapper();
    }, 300);
  }

  completeButtonClicked() {
    this.isCompleting = true;
    this.stayDuvetService.updateTask(this.task.id, {status: 'completed'}).subscribe(() => {
      this.isCompleting = false;
      this.dialog.closeAll();
    }, ( ) => {
      this.isCompleting = false;
    });
  }

  setupAssignees() {

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
        this.stayDuvetService.getTaskAssignees().subscribe();
      }
    });
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

  getDateInDateFormat(date: Date) {
    if ((typeof date) === 'string') {
      return date;
    }
    const month = date.getMonth();
    const dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    return dateString;
  }

  getTimeInDateFormat(hours: string, minutes: string) {
    if (hours && minutes) {
      return hours + ':' + minutes;
    }
    return '00:00';
  }

  getTaskStatusTitle(slug) {
    return getTaskStatusType(slug).title;
  }

  removeItem(index) {
    this.expenses.splice(index, 1);
  }

  addItem() {
    this.expenses.push(Object.assign(new Expense(), {title: '', desc: '', quantity: 0, price: 0}));
  }

  expenseToggleChange($event) {
    this.showExpense = $event.checked;
    if (this.showExpense) {
      this.expenses.push(Object.assign(new Expense(), {title: '', desc: '', quantity: 0, price: 0}));
    } else {
      this.expenses = [];
    }
  }

  timeToggleChange($event) {
    this.showTime = !$event.checked;
  }

  selectedValueChanged() {
    const listingId = this.propertyId.value;
    this.selectedListingId = this.propertyId.value;

    this.loadingGuest = true;

    console.log(this.selectedListingId);

    this.stayDuvetService.getBookingWithPropertyId(listingId).subscribe((res:Booking[]) =>
    {
      this.selectBookings = res;
      console.log(this.selectBookings);

      this.loadingGuest = false;

    }, () => {
      this.loadingGuest = false;
    });

  }

}
