/**
 * Created by divyanshu on 06/09/17.
 */

import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {StayDuvetService} from '../../../services/stayduvet';
import {MatDialog} from '@angular/material';
import {Store} from '@ngrx/store';
import {
  getActiveContacts,
  getIsBookingLoading,
  getIsActiveContactLoaded,
  getIsActiveContactLoading,
  getListings,
  State,
  getIsBookingLoaded,
  getBookings,
  getAssigness,
  getIsAssigneesLoading,
  getIsAssgineesLoaded
} from '../../../reducers/index';
import {Listing} from '../../../models/listing';
import {getAllTaskTypes, getContactMaintenanceCatagoryTypes, getPaymentByOptions} from '../../../utils';
import {Expense} from '../../../models/expense';
import {HttpEventType, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Booking} from '../../../models/booking';
import {User} from '../../../models/user';
import {AutoTask} from '../../../models/auto-task';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'sd-settings-auto-task-popup', template: `
    <sd-modal-popup-layout title="Auto Schedule HouseKeeper" [print]="true" (printAction)="printButtonClicked()">
      <form fxLayout="column" [formGroup]="formGroup" (ngSubmit)="formGroup.valid && saveButtonCLicked()">
        <div fxLayout="column" fxLayoutGap="15px">
          <mat-form-field>
            <input matInput placeholder="Title" formControlName='title'>
          </mat-form-field>
          <div fxLayout="row" fxLayoutAlign="space-between center">
            <mat-form-field class="width50">
              <mat-select placeholder="Listing" formControlName='property_ids'
                          (change)="selectedValueChanged()" multiple>
                <div fxLayout="column">
                  <button class="select-button" mat-button (click)="onSelectAll()">Select All</button>
                  <button class="select-button" mat-button (click)="onSelectNone()">Select None</button>
                </div>
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

          <mat-form-field class="width50">
            <mat-select placeholder="Assign*" formControlName='assignee_type'>
              <mat-option *ngFor="let assignee of assigneeCategories" [value]="assignee.slug">
                {{assignee.title}}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <textarea formControlName='description' class="textArea" placeholder="Description" rows="5">
              </textarea>

          <div fxLayout="column" style="width: 100%">
            <div fxLayout="column" fxLayoutAlign="space-between center" fxLayoutGap="10px">
              <span>Can Start</span>
              <div fxLayout="row" fxLayoutAlign="space-between center">
                <mat-form-field style="width: 24%">
                  <mat-select placeholder="Hours"
                              [(ngModel)]="hourSelected"
                              [ngModelOptions]="{standalone: true}">
                    <mat-option [value]="2">2 hours</mat-option>
                    <mat-option [value]="3">3 hours</mat-option>
                    <mat-option [value]="6">6 hours</mat-option>
                    <mat-option [value]="12">12 hours</mat-option>
                  </mat-select>
                </mat-form-field>
                <mat-form-field style="width: 24%">
                  <mat-select placeholder="Minutes"
                              [(ngModel)]="minuteSelected"
                              [ngModelOptions]="{standalone: true}">
                    <mat-option [value]="00">00 minutes</mat-option>
                    <mat-option [value]="15">15 minutes</mat-option>
                    <mat-option [value]="30">30 minutes</mat-option>
                    <mat-option [value]="45">45 minutes</mat-option>
                  </mat-select>
                </mat-form-field>
                <mat-form-field style="width: 24%">
                  <mat-select placeholder="Position"
                              [(ngModel)]="offset_position"
                              [ngModelOptions]="{standalone: true}">
                    <mat-option [value]='0'>After</mat-option>
                    <mat-option [value]='1'>Before</mat-option>
                  </mat-select>
                </mat-form-field>
                <mat-form-field style="width: 24%">
                  <mat-select placeholder="Preference"
                              [(ngModel)]="offset_reference"
                              [ngModelOptions]="{standalone: true}">
                    <mat-option [value]='0'>Check In</mat-option>
                    <mat-option [value]="1">Check Out</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
            </div>
          </div>

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
                <div style="width: 55%" fxLayout="row">
                  <mat-form-field style="width: 38%">
                    <input matInput
                           [(ngModel)]="expense.title"
                           [ngModelOptions]="{standalone: true}"
                           placeholder="Name">
                  </mat-form-field>
                  <mat-form-field style="width: 60%">
                    <input matInput
                           [(ngModel)]="expense.desc"
                           [ngModelOptions]="{standalone: true}"
                           placeholder="Description">
                  </mat-form-field>
                </div>

                <mat-form-field style="width: 10%">
                  <input matInput
                         [(ngModel)]="expense.quantity"
                         [ngModelOptions]="{standalone: true}"
                         placeholder="Quantity">
                </mat-form-field>

                <mat-form-field style="width: 10%">
                  <span matPrefix>$ &nbsp;</span>
                  <input matInput
                         [(ngModel)]="expense.price"
                         [ngModelOptions]="{standalone: true}"
                         placeholder="Price">
                </mat-form-field>

                <span style="width: 15%">$ {{amountCalculatePerItem(expense.quantity, expense.price)}}</span>
                <mat-icon *ngIf="expenses.length > 0" (click)="removeItem(index)">delete</mat-icon>
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
        </div>

        <div fxLayoutGap="10px" fxLayoutAlign=" center" fxFlexAlign="end">
          <mat-spinner color="accent" *ngIf="isSaving" [diameter]="30" [strokeWidth]="4"></mat-spinner>
          <button mat-raised-button color="warn" *ngIf="autoTask" [disabled]="isSaving" (click)="deleteTask()">Delete
          </button>
          <button mat-raised-button fxFlexAlign="end" [disabled]="isSaving" color="accent" type="submit">
            {{buttonTitle}}
          </button>
        </div>

      </form>
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

    .select-button {
      padding: 6px;
      text-align: left;
      font-size: 17px;
      padding-left: 10px;
      font-weight: bolder;
    }

    .width50 {
      width: 48%;
      margin-top: -20px;
    }

    textarea {
      resize: none;
    }

    .UploadedPhoto {
      min-height: 50vh;
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

    mat-spinner {
      height: 30px;
      width: 30px;
    }
  `]
})

export class SettingsAutoTaskPopupComponent implements OnInit, OnDestroy {

  private isAlive: boolean = true;

  @Input() autoTask: AutoTask;
  @Input() listingId;

  formGroup: FormGroup;
  title: FormControl;
  propertyIds: FormControl;
  assigneeType: FormControl;
  type: FormControl;
  dueDate: FormControl;
  description: FormControl;
  paymentBy: FormControl;

  listings: Listing[];

  assigneeCategories = [
    ...getContactMaintenanceCatagoryTypes(),
    {
      title: 'Owner',
      slug: 'owner'
    },
    {
      title: 'Guest',
      slug: 'guest'
    }
  ];
  categories = getAllTaskTypes();

  expenses: Expense[] = [];

  hourSelected = 0;
  minuteSelected = 0;

  offset_reference = 0;
  offset_position = 0;

  assignees: User[] = [];
  bookings: Booking[] = [];

  assigneesLoading = false;
  assigneesLoaded = false;

  showTime = true;
  showExpense = false;
  isSaving: boolean = false;
  buttonTitle = 'Create';

  constructor(private service: StayDuvetService, private dialog: MatDialog, private store: Store<State>) {
    this.title = new FormControl(null, [Validators.required]);
    this.propertyIds = new FormControl(null, [Validators.required]);
    this.assigneeType = new FormControl(null, [Validators.required]);
    this.type = new FormControl(null, [Validators.required]);
    this.dueDate = new FormControl(null, [Validators.required]);
    this.description = new FormControl();
    this.paymentBy = new FormControl(null, [Validators.required]);

    this.formGroup = new FormGroup({
      title: this.title,
      property_ids: this.propertyIds,
      assignee_type: this.assigneeType,
      type: this.type,
      description: this.description
    });
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
    });

    this.setupForEdit();
  }

  onSelectAll() {
    const listingIds = this.listings.map(listing => listing.id)
    this.propertyIds.setValue(listingIds);
  }

  onSelectNone() {
    this.propertyIds.setValue([]);
  }

  setupForEdit() {
    if (!isNullOrUndefined(this.autoTask) && !isNullOrUndefined(this.autoTask.id)) {
      this.title.setValue(this.autoTask.title);
      this.description.setValue(this.autoTask.description);
      this.type.setValue(this.autoTask.is_complete);
      this.offset_position = this.autoTask.offset_position === 'before' ? 0 : 1;
      this.offset_reference = this.autoTask.offset_reference === 'check_in' ? 0 : 1;

      const ids = this.autoTask.property_ids.map(id => {
        return Number(id);
      });

      this.propertyIds.setValue(ids);

      const minutes = this.autoTask.offset / 60;

      this.hourSelected = minutes / 60;
      this.minuteSelected = minutes % 60;

      if (this.autoTask.expenses !== null) {
        this.showExpense = this.autoTask.expenses.length > 0;
        for (const expense of this.autoTask.expenses) {
          let e = new Expense();
          e.title = expense.title;
          e.desc = expense.desc;
          e.quantity = Number(expense.quantity);
          e.price = Number(expense.price * 100) / 100;

          this.expenses.push(e);
        }
      }

      if (this.autoTask.assignee_type !== null) {
        this.assigneeType.setValue(this.autoTask.assignee_type);
      }

      this.buttonTitle = 'Save';
    }
    else {
      this.propertyIds.setValue([this.listingId]);
    }
  }

  saveButtonCLicked() {
    this.isSaving = true;


    const data = this.formGroup.value;

    if (this.showExpense) {
      const expensesArray = [];

      for (const expense of this.expenses) {
        expense.quantity = Number(expense.quantity);
        expense.price = Number(expense.price * 100) / 100;

        expensesArray.push(expense);
      }

      if (expensesArray.length > 0) {
        data['expenses'] = expensesArray;
      } else {
        data['expenses'] = [];

      }
    }

    data['offset'] = this.hourSelected * 60 * 60 + this.minuteSelected * 60;
    data['offset_reference'] = this.offset_reference === 0 ? 'check_in' : 'check_out';
    data['offset_position'] = this.offset_position === 0 ? 'before' : 'after';

    if (isNullOrUndefined(this.autoTask)) {
      this.service.createAutoTask(data).subscribe(result => {
        this.isSaving = false;
        this.dialog.closeAll();
      }, () => {
        this.isSaving = false;
      });
    } else {
      this.service.updateAutoTask(this.autoTask.id, data).subscribe(result => {
        this.isSaving = false;
        this.dialog.closeAll();
      }, () => {
        this.isSaving = false;
      });
    }
  }

  deleteTask() {
    this.isSaving = true;
    this.service.deleteAutoTask(this.autoTask.id).subscribe(result => {
      this.isSaving = false;
      this.dialog.closeAll();
    }, () => {
      this.isSaving = false;
    });
  }

  selectedValueChanged() {
    const listingIds = this.propertyIds.value;
  }

  getTimeInDateFormat(hours: string, minutes: string) {
    if (hours && minutes) {
      return hours + ':' + minutes + ':00';
    }
    return '00:00:00';
  }

  getDateInDateFormat(date: Date) {
    const dateString = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
    return dateString;
  }

  timeToggleChange($event) {
    this.showTime = !$event.checked;
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

  printButtonClicked() {
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}

