import {Component, OnDestroy, OnInit} from '@angular/core';
import {Listing} from '../../models/listing';
import {Router} from '@angular/router';
import {StayDuvetService} from "../../services/stayduvet";
import {
  getIsMinStayTemplatesLoaded, getIsMinStayTemplatesLoading, getListings, getMinStayTemplates,
  State
} from '../../reducers/index';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {getDateObj} from "../calendar/calendar-utils";
import {MinimumStay} from "../../models/minimum-stay";
import {Observable} from "rxjs/Observable";
import {MatDialog, MatDialogRef} from "@angular/material";
import {CreateMinStayTemplatePopup} from "./create-min-stay-template-popup";

@Component({
  selector: 'sd-setting-minimum-stays-events',
  template: `
    <div fxLayout="column" fxLayoutGap="30px" style="margin: 20px; margin-bottom: 50px" fxFlex="100%">

      <div fxLayoutAlign="start center">
        <button mat-raised-button color="primary" (click)="openTools()">
          <mat-icon>arrow_back</mat-icon>
          Back
        </button>
      </div>

      <div id="content" fxLayout="column" fxLayoutAlign="start stretch" fxLayoutGap="10px">

        <div fxLayoutAlign="space-between start">
          <div fxLayout="column" fxLayoutAlign="center start" class="para">
            <span style="font-size: 30px;font-weight: bolder">Minimum Stays Templates</span>
          </div>
          <button mat-raised-button color="accent" (click)="addMinStayTemplate()">
            Add New Template
          </button>
        </div>

        <hr>

        <div fxLayoutAlign="center center">

          <mat-spinner color="accent" *ngIf="isLoading" [diameter]="60" [strokeWidth]="5"></mat-spinner>
          <div fxLayout="column" *ngIf="isLoaded" fxLayoutGap="10px" fxFlex="100%">
            <h3 style="text-align: center" *ngIf="minimumStays.length === 0">
              No Minimum Stays Template Found
            </h3>
            
            <sd-settings-minimum-stay-template *ngFor="let item of minimumStays"
                                               [item]="item"></sd-settings-minimum-stay-template>
          </div>
        </div>

      </div>
      
    </div>

  `,
  styles: [`    

  `]
})
export class SettingsMinimumStaysEventsComponent implements OnInit, OnDestroy {


  isAlive: boolean = true;
  minimumStays: MinimumStay[]=[];

  isLoading:boolean = false;
  isLoaded:boolean = false;

  private dialogRef:MatDialogRef<any>;


  constructor(private router: Router,
              private route: ActivatedRoute,
              private store: Store<State>,
              private service: StayDuvetService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.loadMinimumStays();

  }


  private loadMinimumStays() {
    this.store.select(getIsMinStayTemplatesLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.isLoading = loading;
    });
    this.store.select(getIsMinStayTemplatesLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.isLoaded = loaded;
    });
    this.store.select(getMinStayTemplates).takeWhile(() => this.isAlive).subscribe((minimumstays) => {
      this.minimumStays = minimumstays;
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
        if (!this.isLoaded && !this.isLoading) {
          this.service.getMinStayTemplates().subscribe();
        }
      }
    );
  }




  addMinStayTemplate() {
    this.dialogRef = this.dialog.open(CreateMinStayTemplatePopup);
    const instance = this.dialogRef.componentInstance;
    instance.popUpTitle = "Add New Template";
    this.dialogRef.updateSize('100%');
  }

  openTools() {
    this.router.navigate(['/settings/tools']);
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }


}
