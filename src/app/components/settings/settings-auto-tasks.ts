/**
 * Created by divyanshu on 01/09/17.
 */

import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog, MatDialogRef} from '@angular/material';
import {SettingsAutoTaskPopupComponent} from './auto-task-popups/auto-task-popup';
import {StayDuvetService} from '../../services/stayduvet';
import {AutoTask} from '../../models/auto-task';
import {Store} from '@ngrx/store';
import {getAutoTasks, getIsAutoTasksLoaded, getIsAutoTasksLoading, State} from '../../reducers/index';
import {getAllAutoTasks, getIsAutoTaskLoaded, getIsAutoTaskLoading} from '../../reducers/task';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'sd-setting-auto-tasks', template: `    
    <div fxLayout="column" fxLayoutGap="30px" style="margin-top: 10px; margin-bottom: 50px" fxFlex="100%">

      <div fxLayoutAlign="start center" *ngIf="!listingId">
        <button mat-raised-button color="primary" (click)="openTools()">
          <mat-icon>arrow_back</mat-icon>
          Back
        </button>
      </div>

      <div fxLayout="column" fxLayoutGap="5px">
        <div fxLayoutAlign="space-between center">
          <span class="heading">Auto Tasks</span>
          <button mat-raised-button color="accent" (click)="addTemplate()">Create Auto Task</button>
        </div>
        <span class="hint">You can create tasks based on actions.</span>
      </div>

      <div id="spinner" *ngIf="loading" fxLayout="row" fxLayoutAlign="center center" fxFlex="100%">
        <mat-spinner color="accent" [diameter]="30" [strokeWidth]="4"></mat-spinner>
      </div>

      <div fxLayout="column" fxLayoutGap="20px" *ngIf="loaded">
        <h3 style="text-align: center" *ngIf="tasks.length === 0">
          No Auto Tasks Found
        </h3>
        <mat-card *ngFor="let task of tasks" fxLayout="column" fxLayoutGap="5px" class="padding" style="cursor: pointer" (click)="openAutoTaskEditModal(task)">
          <h3>{{task.title}}</h3>
          <span class="content">{{task.description}}</span>
        </mat-card>
      </div>
    </div>
  `, styles: [`
    

    .content {
      font-size: 10px;
    }

    .heading {
      font-weight: bolder;
      font-size: 22px;
    }

    .content {
      font-size: 12px;
      line-height: 130%;
    }
    .padding {
      padding: -10px -10px -10px -10px;
      background: -webkit-linear-gradient(top, #ffffff 0%, #ffffff 100%);
    }
    .mat-card {
      border: 1px solid lightgrey !important;
      box-shadow: none !important;
    }


    h3 {
      font-weight: bolder !important;
      letter-spacing: 1px !important;
      font-size: 20px !important;
      font-family: 'Montserrat', sans-serif !important;
    }

    
    .hint {
      font-size: 12px;
      margin-left: 2px;
    }

    #spinner {
      position: fixed;
      top: 45%;
      right: 40%
    }


  `]
})
export class SettingsAddTaskComponent implements OnInit {
  dialogRef: MatDialogRef<any>;
  @Input() tasks: AutoTask[] = [];
  loading: boolean;
  loaded: boolean;

  @Input() listingId;


  constructor(private dialog: MatDialog, private router: Router, private service: StayDuvetService, private store: Store<State>) {
  }

  ngOnInit() {
    if(!this.listingId)
    {
      this.getTasks();

    }
    else {
      this.loading=false;
      this.loaded=true;
    }
  }

  private getTasks() {
    this.store.select(getIsAutoTasksLoading).subscribe((loading) => {
      this.loading = loading;
    });
    this.store.select(getIsAutoTasksLoaded).subscribe((loaded) => {
      this.loaded = loaded;
    });
    this.store.select(getAutoTasks).subscribe((tasks) => {
      this.tasks = tasks;
    });

    const observables = Observable.merge(this.store.select(getIsAutoTasksLoading), this.store.select(getIsAutoTasksLoaded), this.store.select(getAutoTasks), (loading, loaded, data) => {
    });

    observables.subscribe(() => {
      if (!this.loading && !this.loaded) {
        this.service.getAutoTasks().subscribe();
      }
    });
  }

  openAutoTaskEditModal(autoTask: AutoTask) {
    this.dialogRef = this.dialog.open(SettingsAutoTaskPopupComponent);
    this.dialogRef.componentInstance.autoTask = autoTask;
    this.dialogRef.updateSize('100%','100%');
  }

  addTemplate() {
    this.dialogRef = this.dialog.open(SettingsAutoTaskPopupComponent);
    this.dialogRef.componentInstance.listingId = this.listingId;
    this.dialogRef.updateSize('100%','100%');
  }

  openTools() {
    this.router.navigate(['/settings/tools']);
  }
}
