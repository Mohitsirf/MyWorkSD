import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Store} from '@ngrx/store';
import {Router} from '@angular/router';
import {MatDialogRef} from '@angular/material';
import {StayDuvetService} from '../../services/stayduvet';
import {
  getIsMinStayTemplatesLoaded, getIsMinStayTemplatesLoading, getMinStayTemplates,
  State
} from '../../reducers/index';
import {Observable} from 'rxjs/Observable';
import {MinimumStay} from "../../models/minimum-stay";

@Component({
  selector: 'sd-min-stay-template',
  template: `
    <sd-modal-popup-layout title="Minimum Stay Templates">
      <div fxLayout="column"  style="margin: 10px" fxLayoutGap="10px">

        <div fxLayoutAlign="center center" *ngIf="isMinimumStayLoading">
          <mat-spinner color="accent" [diameter]="50" [strokeWidth]="4"></mat-spinner>
        </div>
        
        <div fxLayout="column" *ngIf="isMinimumStayLoaded" fxLayoutGap="10px" fxFlex="100%">
          <h3 style="text-align: center; font-size: x-small;" *ngIf="data.length === 0">
            No Minimum Stays Template Found
          </h3>

          <div fxLayout="column" fxLayoutGap="10px" *ngIf="data.length > 0">
            <div *ngFor="let item of data" style="padding: 10px;">
                <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="20px">
  
                  <mat-checkbox  [(ngModel)]="item.selected"></mat-checkbox>
                  
                  <div >
                    <span style="font-weight: bold">Start Date : </span>
                    <span>{{item.minimumStay.start | date:'mediumDate'}}</span>
                  </div>
  
                  <div >
                    <span style="font-weight: bold">End Date : </span>
                    <span>{{item.minimumStay.end | date:'mediumDate'}}</span>
                  </div>
  
                  <div>
                    <span style="font-weight: bold">Length : </span>
                    <span>{{item.minimumStay.length}}</span>
                  </div>
  
                </div>
            </div>
            
            <div fxLayoutAlign="end center">
              <button mat-raised-button color="accent" (click)="onAddClicked()">Add Minimum Stays</button>
            </div>
          </div>
        </div>  
        
      </div>
    </sd-modal-popup-layout>
  `,
  styles: [`
    mat-spinner {
      width: 24px;
      height: 24px;
      margin-right: 20px;
    }
  `]
})
export class MinStayTemplatePopupComponent implements OnInit, OnDestroy {


  isMinimumStayLoading = false;
  isMinimumStayLoaded = false;

  private isAlive = true;

  @Output() selectedStays = new EventEmitter<any>();

  data : {
    selected : boolean,
    minimumStay:MinimumStay
  }[] = [];

  ngOnInit() {
    console.log('onInit sd-min-stay-template');

    this.loadMinimumStays();
  }

  constructor(private service: StayDuvetService,
              private store: Store<State>,
              private router: Router,
              private dialogRef: MatDialogRef<MinStayTemplatePopupComponent>) {
  }


  private loadMinimumStays() {
    this.store.select(getIsMinStayTemplatesLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.isMinimumStayLoading = loading;
    });
    this.store.select(getIsMinStayTemplatesLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.isMinimumStayLoaded = loaded;
    });
    this.store.select(getMinStayTemplates).takeWhile(() => this.isAlive).subscribe((minimumstays) => {
      if(minimumstays)
      {
        this.data = [];
        minimumstays.forEach(stays => {
          this.data.push(
            {
             selected:false,
             minimumStay:stays
            }
          );
        });
      }
    });

    const threadsCombined = Observable.merge(
      this.store.select(getIsMinStayTemplatesLoading),
      this.store.select(getIsMinStayTemplatesLoaded),
      this.store.select(getMinStayTemplates),
      ((loading, loaded, threads) => {
      })
    );

    threadsCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.isMinimumStayLoading && !this.isMinimumStayLoaded) {
          this.service.getMinStayTemplates().subscribe();
        }
      }
    );
  }

  onAddClicked()
  {
    let selectedStays = [];

    this.data.forEach(item => {
      if(item.selected)
      {
        selectedStays.push(item.minimumStay);
      }
    });
    this.selectedStays.next(selectedStays);
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
