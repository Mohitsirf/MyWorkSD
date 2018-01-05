import {Component, OnDestroy, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import {StayDuvetService} from '../../services/stayduvet';
import {Store} from '@ngrx/store';
import {
  getAdmins, getAssigness, getIsAssgineesLoaded, getIsAssigneesLoading, getIsTasksLoaded, getIsTasksLoading,
  getListingById, getListings,
  getTasks,
  State
} from '../../reducers';
import {Listing} from '../../models/listing';
import {Task} from 'app/models/task';
import {Observable} from 'rxjs/Observable';
import {
  getAllTaskTypes, getTaskFilterType, getTaskFilterTypes, getTaskStatusType,
  getTaskType
} from '../../utils';
import {MatDialog, MatDialogRef} from '@angular/material';
import {CreateTaskPopupComponent} from '../../components/tasks/popups/create-task';
import {DetailsMagnifyComponent} from '../../components/tasks/details-magnify';
import {isNullOrUndefined} from 'util';
import {User} from 'app/models/user';
import * as moment from "moment";
import {getDateObj} from "../../components/calendar/calendar-utils";


/**
 * Created by piyushkantm on 22/06/17.
 */

@Component({
  selector: 'sd-tasks-page',
  template: `
    <div id="spinner" *ngIf="isLoading" fxLayout="row" fxLayoutAlign="center center" fxFlex="100%">
      <mat-spinner color="accent" [diameter]="70" [strokeWidth]="6"></mat-spinner>
    </div>

    <div style="font-size:x-small;" class="requiredHeight" *ngIf="!isLoading" fxFlex="100%">
      <div fxLayout="column">
        <div fxLayoutAlign="space-between center">

          <div fxLayout="column" fxLayoutAlign="center start" fxLayoutGap="10px" fxFlex="100%">
            <span *ngIf="showListingsFilter" style="font-size: 25px; font-weight: bolder">Listings</span>
            <div style="width: 100%" fxLayout="row" fxLayoutAlign="space-between center" fxLayoutGap="5%">
              <div fxFlex="70%" fxLayout="column" fxLayoutAlign="space-between start">
                <mat-form-field style="width: 90%" color="accent" *ngIf="showListingsFilter">
                  <mat-select
                    multiple
                    *ngIf="showListingsFilter"
                    placeholder="Select Listing"
                    [(ngModel)]="selectedListings"
                    floatPlaceholder="never"
                    (ngModelChange)="this.filterTasks()"
                    [ngModelOptions]="{standalone: true}">

                    <div fxLayout="column">
                      <button class="select-button" mat-button (click)="onSelectAll()">Select All</button>
                      <button class="select-button" mat-button (click)="onSelectNone()">Select None</button>
                    </div>

                    <mat-option *ngFor="let listing of listings" [value]="listing">
                      {{ listing.title }}
                    </mat-option>
                  </mat-select>
                </mat-form-field>

                <div fxLayout="row" fxLayoutGap="20px" fxLayoutAlign="start center">
                  <mat-form-field style="width: 28%;">
                    <mat-select
                      [(ngModel)]="selectedFilter"
                      (ngModelChange)="filterTasks()">
                      <mat-option *ngFor="let filter of filters" [value]="filter.slug">
                        {{ filter.title }}
                      </mat-option>
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field style="width: 28%;">
                    <mat-select
                      [(ngModel)]="selectedCategoryFilter"
                      (ngModelChange)="filterTasks()">
                      <mat-option value="show_all">Show All</mat-option>
                      <mat-option *ngFor="let category of categories" [value]="category.slug">
                        {{ category.title }}
                      </mat-option>
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field style="width: 35%" color="accent">
                    <mat-select
                      placeholder="Assignee"
                      floatPlaceholder="never"
                      [(ngModel)]="selectedAssigneeId"
                      (ngModelChange)="filterTasks()">
                      <mat-option *ngFor="let assignee of assignees" [value]="assignee.id">
                        {{assignee.first_name}} {{assignee.last_name}}
                      </mat-option>
                    </mat-select>
                  </mat-form-field>

                  <button mat-icon-button (click)="clearAssignee()">
                    <mat-icon>close</mat-icon>
                  </button>

                </div>
              </div>
              
              <div class="row" fxLayoutAlign="center center" fxFlex="25%" fxHide.lt-md>
                <button mat-raised-button color="accent" (click)="createNewTask()">
                  CREATE NEW TASK
                </button>
              </div>
            </div>

            <div class="row" fxLayoutAlign="center center" fxFlex="25%" fxHide.gt-md>
              <button mat-raised-button color="accent" (click)="createNewTask()">
                CREATE NEW TASK
              </button>
            </div>
          </div>
        </div>
        <hr id="line">
        <div style="overflow-x: scroll;">
          <div fxLayout="column" fxLayoutGap="5px">
            <p class="pHeading">You have {{pendingTasks}} Pending tasks, and <span style="color: red">{{pendingLateTasks}}</span>
              is Late.Get to
              it.</p>
          </div>

          <sd-tasks-list-component style="width: 100%; min-width: 800px;" [tasks]="tasks"
                                   [listings]="listings"></sd-tasks-list-component>

          <br>

          <div fxLayout="row" *ngIf="tasks.length > 0" fxLayoutAlign="end center" style="min-width: 800px;">

            <div fxFlex fxLayoutAlign="start start">
              <mat-form-field [color]="'accent'">
                <mat-select
                  placeholder="Items per page"
                  [(ngModel)]="itemsPerPage"
                  fxFlex="100%"
                  (ngModelChange)="itemsPerPageChanged()"
                  [ngModelOptions]="{standalone: true}">
                  <mat-option [value]="5">5</mat-option>
                  <mat-option [value]="10">10</mat-option>
                  <mat-option [value]="15">15</mat-option>
                  <mat-option [value]="20">20</mat-option>
                  <mat-option [value]="30">30</mat-option>
                  <mat-option [value]="50">50</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <span style="font-size:xx-small; font-style:bolder;">{{start + 1}} - {{end}} of {{total}}</span>
            <button mat-button [disabled]="isPrevDisabled" (click)="onPrev()">
              <mat-icon>navigate_before</mat-icon>
              Prev
            </button>
            <button mat-button [disabled]="isNextDisabled" (click)="onNext()">Next
              <mat-icon>navigate_next</mat-icon>
            </button>
          </div>

        </div>

      </div>
    </div>
  `,
  styles: [`

    #text {
      font-size: x-small;
    }

    .title-text {
      font-size: 15px;
      font-weight: bold;
    }

    /deep/ .mat-chip:not(.mat-basic-chip) {
      padding: 8px 4px 8px 4px !important;
      font-size: 13px !important;
    }

    #description {
      padding-left: 10px;
    }

    #line {
      border: none;
      width: 100%;
      height: 5px;
      /* Set the hr color */
      color: lightgrey; /* old IE */
      background-color: lightgrey; /* Modern Browsers */
    }

    #spinner {
      position: fixed;
      top: 45%;
      right: 40%
    }

    .select-button {
      padding: 6px;
      text-align: left;
      font-size: 17px;
      padding-left: 10px;
      font-weight: bolder;
    }

    mat-chip {
      width: 150px;
      text-align: center;
    }

    hr {
      width: 100%;
    }

    #spinner {
      position: fixed;
      top: 45%;
      right: 40%
    }

    .heading {
      padding-left: 10px;
    }

    .cellWidth {
      width: 130px;
      text-align: center;
    }

    .halfcellWidth {
      width: 70px;
      text-align: center;
    }

    .doublecellWidth {
      width: 170px;
    }

    .textCenterAlign {
      text-align: center;
    }

    #spinner {
      position: fixed;
      top: 45%;
      right: 40%
    }

    #container {
      width: 100%;
      background: -webkit-linear-gradient(top, #ffffff 0%, #ffffff 100%);
      padding: 30px;
      font-size: 13px;
    }

    :host /deep/ router-outlet + *:not(nav) {
      width: 100%;
    }

    b {
      font-size: 18px;
    }
  `]
})
export class OwnerTasksPageComponent implements OnInit, OnDestroy, OnChanges {


  private isAlive: boolean = true;

  filters = getTaskFilterTypes();
  categories = getAllTaskTypes();

  private dialogRef: MatDialogRef<any>;

  tasks: Task[] = [];

  @Input() showListingsFilter: boolean = false;

  isLoading: boolean;
  isLoaded: boolean;
  isAssigneeLoading: boolean;
  isAssigneeLoaded: boolean;
  @Input() selectedListings: Listing[] = [];
  listings: Listing[];

  assignees: User[] = [];
  selectedAssigneeId: number;
  title = this.filters[0].title;
  selectedFilter: any = this.filters[1].slug;
  selectedCategoryFilter: any = 'show_all';
  allTasks: Task[];

  todayTasks: Task[] = [];
  paidTasks: Task[] = [];
  completedTasks: Task[] = [];
  lateTasks: Task[] = [];
  upcomingTasks: Task[] = [];
  filteredTasks: Task[] = [];


  pendingTasks: number = 0;
  pendingLateTasks: number = 0;


  isPrevDisabled: boolean = true;
  isNextDisabled: boolean = false;

  itemsPerPage = 15;
  currentPage: number = -1;

  start: number = 0;
  end: number = 0;
  total: number;


  constructor(private stayDuvetService: StayDuvetService,
              private dialog: MatDialog,
              private store: Store<State>) {
  }

  ngOnInit(): void {
    console.log('onInit sd-owner-tasks');
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
      if (this.selectedListings.length === 0) {
        this.selectedListings = this.listings;
      }
    });

    this.setupTasks();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setupTasks();
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  setupTasks() {
    this.store.select(getTasks).takeWhile(() => this.isAlive).subscribe((tasks) => {
      this.allTasks = tasks;
      this.processTasks();
      console.log(this.allTasks);
    });

    this.store.select(getAssigness).takeWhile(() => this.isAlive).subscribe((assignees) => {
      this.assignees = assignees;
    });

    this.store.select(getIsAssigneesLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.isAssigneeLoading = loading;
    });

    this.store.select(getIsAssgineesLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.isAssigneeLoaded = loaded;
    });

    const combined = Observable.merge(
      this.store.select(getAssigness),
      this.store.select(getIsAssigneesLoading),
      this.store.select(getIsAssgineesLoaded),
      ((assigness, loading, loaded) => {
      })
    );

    combined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.isAssigneeLoaded && !this.isAssigneeLoading) {
          this.stayDuvetService.getTaskAssignees().subscribe();
        }
      }
    );

    this.store.select(getIsTasksLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.isLoading = loading;
    });

    this.store.select(getIsTasksLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.isLoaded = loaded;
    });

    const upcomingCombined = Observable.merge(
      this.store.select(getTasks),
      this.store.select(getIsTasksLoading),
      this.store.select(getIsTasksLoaded),
      ((tasks, loading, loaded) => {
      })
    );

    upcomingCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.isLoading && !this.isLoaded) {
          this.stayDuvetService.getTasks().subscribe();
        }
      }
    );

  }

  processTasks() {
    const temp = getDateObj();
    const currentDateString = temp.getFullYear() + '-' + (temp.getMonth() + 1) + '-' + temp.getDate();
    const currentDateMoment = moment(currentDateString);


    this.allTasks = this.allTasks.filter(data => data.status !== 'cancelled');

    this.lateTasks = this.allTasks.filter(data => data.status === 'late');

    this.lateTasks = [
      ...this.lateTasks,
      ...this.allTasks.filter(data => {
        const dueDateMoment = moment(data.due_date);
        return dueDateMoment.diff(currentDateMoment) < 0 && data.status !== 'completed' && data.status !== 'paid' && data.status !== 'late' && !data.is_archived;
      })
    ];

    this.lateTasks.sort((first: Task, second: Task) => {
      const firstTaskDate = getDateObj(first.due_date);
      const secondTaskDate = getDateObj(second.due_date);

      if (firstTaskDate > secondTaskDate) {
        return -1;
      }
      return 1;
    });

    this.todayTasks = this.allTasks.filter(data => {
      const dueDateMoment = moment(data.due_date);
      return currentDateMoment.diff(dueDateMoment) === 0 && data.status !== 'completed' && data.status !== 'late' && !data.is_archived;
    });

    this.todayTasks = [
      ...this.todayTasks,
      ...this.lateTasks
    ];

    this.upcomingTasks = this.allTasks.filter(data => {
      const dueDateMoment = moment(data.due_date);
      return dueDateMoment.diff(currentDateMoment) > 0 && data.status !== 'completed' && data.status !== 'late' && !data.is_archived;
    });


    this.upcomingTasks.sort((first: Task, second: Task) => {
      const firstTaskDate = getDateObj(first.due_date);
      const secondTaskDate = getDateObj(second.due_date);

      if (firstTaskDate > secondTaskDate) {
        return 1;
      }
      return -1;
    });

    this.pendingTasks = this.upcomingTasks.length;
    this.pendingLateTasks = this.lateTasks.length;

    this.upcomingTasks = [
      ...this.upcomingTasks,
      ...this.lateTasks
    ];

    this.completedTasks = this.allTasks.filter(data => {
      return data.status === 'completed';
    });

    this.paidTasks = this.allTasks.filter(data => {
      return data.status === 'paid' || data.is_archived;
    });

    this.paidTasks.sort((first: Task, second: Task) => {
      const firstTaskDate = getDateObj(first.due_date);
      const secondTaskDate = getDateObj(second.due_date);

      if (firstTaskDate > secondTaskDate) {
        return -1;
      }
      return 1;
    });

    this.completedTasks.sort((first: Task, second: Task) => {
      const firstTaskDate = getDateObj(first.due_date);
      const secondTaskDate = getDateObj(second.due_date);

      if (firstTaskDate > secondTaskDate) {
        return -1;
      }
      return 1;
    });

    this.filterTasks();
  }

  filterTasks() {
    this.title = getTaskFilterType(this.selectedFilter).title;

    this.updateFilteredTasks();

    this.currentPage = -1;
    this.onNext();
  }

  getListing(propertyId: number) {
    return this.listings.find(listing => listing.id === propertyId);
  }


  updateFilteredTasks() {
    switch (this.selectedFilter) {
      case 'upcoming_tasks': {
        this.filteredTasks = this.upcomingTasks
      }
        break;
      case 'today_tasks': {
        this.filteredTasks = this.todayTasks
      }
        break;
      case 'late_tasks': {
        this.filteredTasks = this.lateTasks
      }
        break;
      case 'completed_tasks': {
        this.filteredTasks = this.completedTasks
      }
        break;
      case 'paid_tasks': {
        this.filteredTasks = this.paidTasks
        break;
      }
      case 'all_tasks': {
        this.filteredTasks = this.allTasks
        break;
      }
    }

    this.filteredTasks = this.filteredTasks.filter(
      task => this.selectedListings.some((listing) => String(listing.id) === String(task.property_id))
    );


    if (this.selectedCategoryFilter !== 'show_all') {
      this.filteredTasks = this.filteredTasks.filter(task => task.type === this.selectedCategoryFilter);
    }

    if (this.selectedAssigneeId) {
      this.filteredTasks = this.filteredTasks.filter(task => task.assignee_id === this.selectedAssigneeId);
    }
  }

  // Button Click Actions
  onSelectAll() {
    this.selectedListings = this.listings;
    this.filterTasks();
  }

  onSelectNone() {
    this.selectedListings = [];
    this.filterTasks();
  }

  clearAssignee() {
    this.selectedAssigneeId = null;
    this.filterTasks();
  }

  createNewTask() {
    this.dialogRef = this.dialog.open(CreateTaskPopupComponent);
    if (this.selectedListings.length == 1) {
      this.dialogRef.componentInstance.property_id = this.selectedListings[0].id;
    }
    this.dialogRef.updateSize('100%', '100%');
  }

  // Pagination Related
  itemsPerPageChanged() {
    this.currentPage = -1;
    this.onNext();
  }

  onPrev() {
    this.currentPage--;

    this.start = this.currentPage * this.itemsPerPage;
    this.end = this.itemsPerPage + this.start;

    if (this.currentPage < 0) {
      return;
    }

    this.isPrevDisabled = false;
    this.isNextDisabled = false;

    if (this.currentPage == 0) {
      this.isPrevDisabled = true;
    }
    this.total = this.filteredTasks.length;
    this.tasks = this.filteredTasks.slice(this.start, this.end);
  }

  onNext() {
    this.currentPage++;
    this.start = this.currentPage * this.itemsPerPage;
    this.end = this.itemsPerPage + this.start;

    this.isPrevDisabled = false;
    this.isNextDisabled = false;
    if (this.start == 0) {
      this.isPrevDisabled = true;
    }
    if (this.end >= this.filteredTasks.length) {
      this.isNextDisabled = true;
      this.end = this.filteredTasks.length;
    }
    this.total = this.filteredTasks.length;
    this.tasks = this.filteredTasks.slice(this.start, this.end);
  }

}
