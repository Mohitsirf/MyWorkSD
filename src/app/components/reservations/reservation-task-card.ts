import {Component, OnDestroy, OnInit} from '@angular/core';
import {Booking} from '../../models/booking';
import {StayDuvetService} from '../../services/stayduvet';
import {getBookingById, getIsShowedById, getIsShowingById, State} from '../../reducers/index';
import {Store} from '@ngrx/store';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material';
import {isNullOrUndefined} from 'util';
import {Observable} from 'rxjs/Observable';
import {Task} from '../../models/task';
import {getTaskStatusType, getTaskType} from '../../utils';

@Component({
  selector: 'sd-reservation-task-card',
  template: `
    <mat-card class="generalCard">
      <span style="color:#194267;font-size: 16px"><b>AUTO TASK</b></span>
      <br>
      <span
        style="color:gray;font-weight:100 !important;">These are the tasks that are auto created from auto tasks.</span>
      <div style="padding-top: 30px"></div>
      <div fxLayout="column" style="margin-left:10px" fxLayoutGap="10px">
        <div class="headerSpan" fxLayout="row" fxFlex="100%">
          <span [style.flex]="'0 0 40%'"><b>Title</b></span>
          <span [style.flex]="'0 0 24%'"><b>Category</b></span>
          <span [style.flex]="'0 0 17%'"><b>Status</b></span>
          <span [style.flex]="'0 0 19%'"><b>Price</b></span>
        </div>
        <div fxLayout="row" fxFlex="100%">
          <hr class="sectionBorder">
        </div>
        <div *ngFor="let task of autoTasks" fxLayout="column">
          <div fxLayout="row" fxFlex="100%">
            <div [style.flex]="'0 0 40%'" style="margin-top:8px">
              <span>{{ task.title }}</span>
            </div>
            <div [style.flex]="'0 0 24%'" style="margin-top:8px">
              <span>{{getTaskType(task?.type).title}}</span>
            </div>
            <div [style.flex]="'0 0 17%'">
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
            </div>
            <div [style.flex]="'0 0 19%'" style="margin-top:8px">
              <span>{{task.amount | currency:'USD':true}}</span>
            </div>
          </div>
          <div fxLayout="row" fxFlex="100%">
            <hr style="width: 80%" fxFlexAlign="center" class="contentBorder">
          </div>
        </div>
        <div fxLayoutAlign="center" *ngIf="autoTasks.length === 0">
          <span>No Automated Auto Tasks with this reservation.</span>
        </div>
      </div>
      <div style="padding-top: 20px"></div>
      <span style="color:#194267;font-size: 16px"><b>TASK</b></span>
      <br>
      <span style="color:gray;font-weight:100 !important;">These are the tasks that are auto created after 
   every confirmed reservation for this listing.</span>
      <div style="padding-top: 30px"></div>
      <div fxLayout="column" style="margin-left:10px" fxLayoutGap="10px">
        <div class="headerSpan" fxLayout="row" fxFlex="100%">
          <span [style.flex]="'0 0 40%'"><b>Title</b></span>
          <span [style.flex]="'0 0 24%'"><b>Category</b></span>
          <span [style.flex]="'0 0 17%'"><b>Status</b></span>
          <span [style.flex]="'0 0 19%'"><b>Price</b></span>
        </div>
        <div fxLayout="row" fxFlex="100%">
          <hr class="sectionBorder">
        </div>
        <div *ngFor="let task of tasks" fxLayout="column">
          <div fxLayout="row" fxFlex="100%">
            <div [style.flex]="'0 0 40%'" style="margin-top:8px">
              <span>{{ task.title }}</span>
            </div>
            <div [style.flex]="'0 0 24%'" style="margin-top:8px">
              <span>{{getTaskType(task?.type).title}}</span>
            </div>
            <div [style.flex]="'0 0 17%'">
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
            </div>
            <div [style.flex]="'0 0 19%'" style="margin-top:8px">
              <span>{{task.amount | currency:'USD':true}}</span>
            </div>
          </div>
          <div fxLayout="row" fxFlex="100%">
            <hr style="width: 80%" fxFlexAlign="center" class="contentBorder">
          </div>
        </div>
        <div fxLayoutAlign="center" *ngIf="tasks.length === 0">
          <span>No Automated Tasks with this reservation.</span>
        </div>
      </div>
    </mat-card>
  `,
  styles: [`

    span {
      font-size: 14px;
    }

    .headerSpan > span {
      color: #13304b !important;
      font-size: 16px !important;
    }

    .generalCard {
      background: -webkit-linear-gradient(top, #ffffff 0%, #ffffff 100%); /* Chrome10+,Safari5.1+ */;
      padding: 15px !important;
    }

    .financialsText span {
      font-size: 13px;
    !important;

    }

    .sectionBorder {
      border: none;
      /* Set the hr color */
      color: #cdcdcd; /* old IE */
      background-color: #cdcdcd; /* Modern Browsers */
      height: 1px;
      width: 100%;
    }

    .contentBorder {
      border: none;
      /* Set the hr color */
      color: #cccccc; /* old IE */
      background-color: #cccccc; /* Modern Browsers */
      height: 1px;
      width: 100%;
    }

    /deep/ .mat-chip:not(.mat-basic-chip) {
      padding: 8px 4px 8px 4px !important;
      font-size: 13px !important;
    }

    mat-chip {
      width: 80%;
      text-align: center;
    }

  `]
})
export class ReservationTaskCardComponent implements OnInit,OnDestroy {
  private isAlive: boolean = true;

  autoTasks: Task[] = [];
  tasks: Task[] = [];

  reservationsLoaded = false;
  reservationsLoading = false;

  updating: { [id: number]: boolean } = {};

  getTaskStatusType = getTaskStatusType;
  getTaskType = getTaskType;

  reservation: Booking = {} as Booking;

  constructor(private service: StayDuvetService,
              private store: Store<State>,
              private router: ActivatedRoute,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.router.parent.params.subscribe(params => {
      const reservationId = +params['id'];

      this.store.select((state) => {
        return getIsShowingById(state, reservationId);
      }).takeWhile(() => this.isAlive).subscribe((isShowing) => {
        this.reservationsLoading = isShowing;
      });

      this.store.select((state) => {
        return getIsShowedById(state, reservationId);
      }).takeWhile(() => this.isAlive).subscribe((isShowed) => {
        this.reservationsLoaded = isShowed;
      });

      this.store.select((state) => {
        return getBookingById(state, reservationId);
      }).takeWhile(() => this.isAlive).subscribe((booking) => {
        if (!isNullOrUndefined(booking) && booking.showFull) {
          this.reservation = booking;
          this.filterTasks();
        }
      });

      const combinedObs = Observable.merge(
        this.store.select((state) => {
          return getIsShowingById(state, reservationId);
        }),
        this.store.select((state) => {
          return getIsShowedById(state, reservationId);
        }),
        this.store.select((state) => {
          return getBookingById(state, reservationId);
        }),
        ((isShowing, isShowed, booking) => {
        })
      );

      combinedObs.takeWhile(() => this.isAlive).subscribe(
        (data) => {
          if (!this.reservationsLoading && !this.reservationsLoaded) {
            this.service.getBookingWithId(reservationId).subscribe();
          }
        }
      );
    });
  }

  filterTasks() {
    const allTasks = this.reservation.tasks.data;

    this.tasks = allTasks.filter(task => {
      return task.auto_task_id === null;
    });

    this.autoTasks = allTasks.filter(task => {
      return task.auto_task_id !== null;
    });

    console.log(allTasks);
    console.log(this.tasks);
    console.log(this.autoTasks);
  }

  ngOnDestroy(): void {
    this.isAlive=false;
  }
}
