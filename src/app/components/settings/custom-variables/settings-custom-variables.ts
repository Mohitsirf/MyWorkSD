/**
 * Created by divyanshu on 01/09/17.
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog, MatDialogRef} from '@angular/material';
import {Store} from '@ngrx/store';
import {StayDuvetService} from '../../../services/stayduvet';
import {Observable} from 'rxjs/Observable';
import {CustomVariable} from "../../../models/custom-variable";
import {
  getCustomVariables, getIsCustomVariablesLoaded, getIsCustomVariablesLoading,
  State
} from "../../../reducers/index";
import {CreateCustomVariablePopup} from "./create-custom-variable-popup";

@Component({
  selector: 'sd-setting-custom-variables',
  template: `
    <div fxLayout="column" fxLayoutGap="30px" style="margin-top: 10px; margin-bottom: 50px" fxFlex="100%">

      <div fxLayoutAlign="start center">
        <button mat-raised-button color="primary" (click)="openTools()">
          <mat-icon>arrow_back</mat-icon>
          Back
        </button>
      </div>

      <div *ngIf="isLoaded" fxLayout="column" fxLayoutGap="10px">
        <div fxLayoutAlign="space-between center">
          <span class="heading">Custom Variables</span>
          <button mat-raised-button color="accent" (click)="addCustomVariable()">Add Custom Variable</button>
        </div>
        <mat-card *ngFor="let customVariable of customVariables" fxLayout="column" fxLayoutGap="5px" class="padding" (click)="editCustomVariable(customVariable)" style="cursor: pointer">
          <div fxLayout="row" style="color: orange;"><h3>{{ </h3> <h3>{{customVariable.key}}</h3> <h3> }}</h3></div>
          <span class="content">{{customVariable.replacement_text}}</span>
        </mat-card>
        
        <div fxLayout="row" *ngIf="customVariables.length === 0" fxLayoutAlign="center center">
        <p> No Custom Variables Exist</p>
      </div>
      </div>
      
      <div *ngIf="isLoading" fxLayoutAlign="center center">
        <mat-spinner [color]="'accent'" [diameter]="30" [strokeWidth]="4"></mat-spinner>
      </div>
    </div>
  `,
  styles: [`
    .padding {
      padding: -10px -10px -10px -10px;
      background: -webkit-linear-gradient(top, #ffffff 0%, #ffffff 100%);
    }

    .content {
      font-size: 10px;
    }

    .heading {
      font-weight: bolder;
      font-size: 22px;
    }

    .hint {
      font-size: 12px;
    }
    
     .content{
      font-size: 14px;
      line-height: 130%;
    }
    
    h3{
     font-weight: bolder !important;
     letter-spacing: 1px !important;
     font-size: 18px !important;
     font-family: 'Montserrat', sans-serif !important;
    }
    
    .mat-card{
    border: 1px solid lightgrey !important;
    box-shadow: none !important;
    }
  `]
})
export class SettingsCustomVariablesComponent implements OnInit, OnDestroy{
  private dialogRef: MatDialogRef<any>;
  isAlive = true;
  isLoading = false;
  isLoaded = false;

  customVariables: CustomVariable[] = [];

  constructor(private router: Router, private dialog: MatDialog, private store: Store<State>, private service: StayDuvetService) {
  }

  ngOnInit() {
    this.setupCustomVariables();
  }

  setupCustomVariables() {
    this.store.select(getCustomVariables).takeWhile(() => this.isAlive).subscribe((variables) => {
      this.customVariables = variables;

    });

    this.store.select(getIsCustomVariablesLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.isLoading = loading;
    });

    this.store.select(getIsCustomVariablesLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.isLoaded = loaded;
    });

    const upcomingCombined = Observable.merge(
      this.store.select(getCustomVariables),
      this.store.select(getIsCustomVariablesLoading),
      this.store.select(getIsCustomVariablesLoaded),
      ((discounts, loading, loaded) => {
      })
    );

    upcomingCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.isLoading && !this.isLoaded) {
          this.service.getCustomVariables().subscribe(() => { });
        }
      }
    );

  }

  addCustomVariable() {
    this.dialogRef = this.dialog.open(CreateCustomVariablePopup);
    this.dialogRef.componentInstance.popUpTitle = 'Add New Custom Variable';
    this.dialogRef.updateSize('100%');
  }

  editCustomVariable(customVariable: CustomVariable) {
    this.dialogRef = this.dialog.open(CreateCustomVariablePopup);
    const instance = this.dialogRef.componentInstance;
    instance.key = customVariable.key;
    instance.replacement_text=customVariable.replacement_text;
    instance.id=customVariable.id;
    instance.isEditType =true;
    instance.popUpTitle= 'Edit Custom Variable';
    this.dialogRef.updateSize('100%');
  }


  openTools() {
    this.router.navigate(['/settings/tools']);
  }

  ngOnDestroy() {
    this.isAlive = false;
  }
}
