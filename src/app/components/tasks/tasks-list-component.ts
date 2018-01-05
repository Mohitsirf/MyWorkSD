import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Task} from '../../models/task';
import {StayDuvetService} from '../../services/stayduvet';
import {getAssigness, getIsAssgineesLoaded, getIsAssigneesLoading, State} from '../../reducers/index';
import {
  getAllTaskTypes, getTaskFilterType, getTaskFilterTypes, getTaskStatusType,
  getTaskType
} from '../../utils';
import {Listing} from '../../models/listing';
import {isNullOrUndefined} from 'util';
import {DetailsMagnifyComponent} from './details-magnify';
import {MatDialog, MatDialogRef} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {User} from 'app/models/user';


@Component({
  selector: 'sd-tasks-list-component',
  template: `
    <mat-card fxFlex="100%" id="container">
      <div fxLayout="column">
        <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px" id="heading">
          <span class="cellWidth title-text">Task Title</span>
          <span class="cellWidth title-text">Listing</span>
          <span class="cellWidth title-text">Assignee</span>
          <span class="halfcellWidth title-text">Due On</span>
          <span class="cellWidth title-text">Category</span>
          <span class="cellWidth title-text">Status</span>
          <span class="halfcellWidth title-text">Price</span>
          <span class="halfcellWidth title-text">Details</span>
          <span class="halfcellWidth"></span>

        </div>
        <div>
          <hr>
        </div>
        <div *ngFor="let task of tasks">
          <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px">
            
            <span (click)="opendialog(task)" style="cursor: pointer" class="cellWidth">{{task?.title | truncate}}</span>
            <span (click)="opendialog(task)" style="cursor: pointer" class="cellWidth">{{getListing(task.property_id).title}}</span>
            <span (click)="opendialog(task)" style="cursor: pointer" class="cellWidth">{{getAssigneeName(task.assignee_id)}}</span>
            <span (click)="opendialog(task)" style="cursor: pointer" class="halfcellWidth">{{task.due_date | date:'dd-MMM'}}</span>
            <span (click)="opendialog(task)" style="cursor: pointer" class="cellWidth">{{getTaskType(task?.type).title}}</span>
            <span (click)="opendialog(task)" style="cursor: pointer" class="cellWidth">
              <mat-chip-list>
                <mat-chip selected="true"
                        matTooltip="{{getTaskStatusType(task?.status).tooltipText}}"
                        [matTooltipPosition]="'above'"
                        [ngStyle]="{
                                 'background': getTaskStatusType(task?.status).color,
                                 'text-align':'center',
                                 'color': task.status === 'scheduled' ? 'black' : 'white'
                               }">
                        <span style="width: 100%;text-align: center">
                          {{getTaskStatusType(task?.status).title}}
                        </span>
                </mat-chip>
              </mat-chip-list>
            </span>
            <span (click)="opendialog(task)" style="cursor: pointer" class="halfcellWidth">{{'$' + getAmount(task?.amount) }}</span>
            <div class="halfcellWidth">
              <button mat-icon-button (click)="opendialog(task)">
                <mat-icon matTooltip="Overview"
                          [matTooltipPosition]="'above'">
                  search
                </mat-icon>
              </button>
            </div>
            <div class="halfcellWidth">
              <mat-spinner *ngIf="isArchiving[task.id]" style="height:30px;width:30px" color="accent" [diameter]="30" [strokeWidth]="4"></mat-spinner>
              <button mat-icon-button *ngIf="!isArchiving[task.id] && !task.is_archived" color="accent"
                      [disabled]="task.status !== 'completed'" (click)="archiveStatusChanged(task)">
                <mat-icon [matTooltip]="task.status === 'completed' ? 'Archive' : 'Task should be complete to archive'" 
                          [matTooltipPosition]="'above'">archive
                </mat-icon>
              </button>
              <button mat-icon-button *ngIf="!isArchiving[task.id] && task.is_archived" color="danger" (click)="archiveStatusChanged(task)">
                <mat-icon matTooltip="Unarchive" [matTooltipPosition]="'above'">unarchive
                </mat-icon>
              </button>
            </div>
          </div>
          <hr>
        </div>

        <div fxLayout="row" *ngIf="tasks.length === 0" fxLayoutAlign="center center">
          <p> No Tasks</p>
        </div>
      </div>

    </mat-card>
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

    .main-container {
      margin: 30px;
      margin-top: 10px;
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
      background-color: yello;
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
      width: 14%;
      text-align: center;
    }

    .halfcellWidth {
      width: 9%;
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

    b {
      font-size: 18px;
    }

  `]
})
export class TasksListComponent implements OnInit, OnDestroy {


  isAlive: boolean = true;
  isArchiving: {[id: number]: boolean} = {};
  @Input() tasks: Task[] = [];
  @Input() listings: Listing[];
  private dialogRef: MatDialogRef<any>;


  selectedAssigneeId: number;


  getTaskType = getTaskType;
  getTaskStatusType = getTaskStatusType;
  isAssigneeLoading: boolean = false;
  isAssigneeLoaded: boolean = false;
  assignees: User[] = [];

  constructor(private service: StayDuvetService,
              private dialog: MatDialog,
              private store: Store<State>) {
  }

  ngOnInit(): void {
    console.log('OnInit tasks-list-component');

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
          this.service.getTaskAssignees().subscribe();
        }
      }
    );

  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }


  getAmount(amount) {
    if (isNullOrUndefined(amount)) {
      return 0;
    }
    else {
      return amount;
    }
  }

  archiveStatusChanged(task) {
    this.isArchiving[task.id] = true;
    this.service.updateTask(task.id, {is_archived: !task.is_archived}).subscribe(task => {
      this.isArchiving[task.id] = false;
    });
  }


  getListing(propertyId: number) {
    return this.listings.find(listing => listing.id === propertyId);
  }

  opendialog(task: Task) {
    this.dialogRef = this.dialog.open(DetailsMagnifyComponent);
    const instance = this.dialogRef.componentInstance;
    instance.listingName = this.getListing(task.property_id).title;
    instance.task = task;
    this.dialogRef.updateSize('100%','100%');
  }

  getAssigneeName(id) {
    const assignee = this.assignees.find(data => data.id == id);

    if (isNullOrUndefined(assignee))
      return;

    let name = assignee.first_name;
    if (!isNullOrUndefined(assignee.last_name)) {
      name = name + ' ' + assignee.last_name;
    }

    return name;
  }


}
