import {AfterViewInit, animate, Component, OnDestroy, OnInit, state, style, transition, trigger} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material";
import {StayDuvetService} from "../../services/stayduvet";
import {Store} from "@ngrx/store";
import {
  getAlerts,
  getAutoResponses,
  getAutoTasks, getIsAlertsLoaded, getIsAlertsLoading, getIsAutoResponseLoaded, getIsAutoResponseLoading,
  getIsAutoTasksLoaded,
  getIsAutoTasksLoading,
  getIsSavedMessagesLoaded,
  getIsSavedMessagesLoading,
  getSavedMessages,
  State
} from "../../reducers/index";
import {ActivatedRoute} from "@angular/router";
import {SavedMessage} from "../../models/saved-message";
import {Observable} from "rxjs/Observable";
import {ListingCannedMessagePopupComponent} from "./popups/listing-canned-message-popup";
import {Task} from "../../models/task";
import {AutoTask} from "../../models/auto-task";
import {AutoResponse} from "../../models/auto-response";
import {isNullOrUndefined} from "util";
import {Alert} from "../../models/alert";

/**
 * Created by ubuntu on 9/7/17.
 */
@Component({
  selector: 'sd-listing-channel-tab',
  template: `
    <div>

      <div fxLayoutAlign="center center" style="margin-top: 30px;"
           *ngIf="isAutoTasksLoading || isCannedResponsesLoading || isAutoResponsesLoading || isAutomatedMessagesLoading">
        <mat-spinner color="accent" [diameter]="60" [strokeWidth]="5"></mat-spinner>
      </div>

      <div fxLayout="column" fxLayoutGap="20px"
           *ngIf="isAutoTasksLoaded && isCannedResponsesLoaded && isAutoResponsesLoaded && isAutomatedMessgesLoaded">


        <div>
          
          <mat-card class="header" (click)="autoTasksClicked()">
            <div fxLayout="row" style="margin-top: -10px" fxLayoutAlign="space-between center">
              <div fxLayout="row" fxLayoutGap="20px" fxLayoutAlign="center center">
                <span class="section-header">Auto Tasks</span>
              </div>
              <button mat-fab color="accent">
                <mat-icon *ngIf="showAutoTasks">expand_less</mat-icon>
                <mat-icon *ngIf="!showAutoTasks">expand_more</mat-icon>
              </button>
            </div>
          </mat-card>

          <mat-card class="padding" *ngIf="showAutoTasks">
            <sd-setting-auto-tasks
              [tasks]="tasks"
              [listingId]="listingId">
            </sd-setting-auto-tasks>
          </mat-card>
         

        </div>

        <div>
          
          <mat-card class="header" (click)="autoResponseClicked()">
            <div fxLayout="row" style="margin-top: -10px" fxLayoutAlign="space-between center">
              <div fxLayout="row" fxLayoutGap="20px" fxLayoutAlign="center center">
                <span class="section-header">Auto Responses</span>
              </div>
              <button mat-fab color="accent">
                <mat-icon *ngIf="showAutoResponses">expand_less</mat-icon>
                <mat-icon *ngIf="!showAutoResponses">expand_more</mat-icon>
              </button>
            </div>
          </mat-card>

          <mat-card class="padding" *ngIf="showAutoResponses">
            <sd-settings-auto-response 
              *ngIf="showAutoResponses"
              [confirmedGuestResponses]="confirmedGuestResponses"
              [nonConfirmedGuestResponses]="nonConfirmedGuestResponses"
              [listingId]="listingId">
            </sd-settings-auto-response>
          </mat-card>
          
        </div>

        <div>
          
          <mat-card class="header" (click)="cannedResponsesClicked()">
            <div fxLayout="row" style="margin-top: -10px" fxLayoutAlign="space-between center">
              <div fxLayout="row" fxLayoutGap="20px" fxLayoutAlign="center center">
                <span class="section-header">Canned Responses</span>
              </div>
              <button mat-fab color="accent">
                <mat-icon *ngIf="showCannedResponses">expand_less</mat-icon>
                <mat-icon *ngIf="!showCannedResponses">expand_more</mat-icon>
              </button>
            </div>
          </mat-card>

          <mat-card class="padding" *ngIf="showCannedResponses">
            <sd-settings-canned-responses
              *ngIf="showCannedResponses"
              [messages]="messages" 
              [listingId]="listingId">
            </sd-settings-canned-responses>
          </mat-card>
          
        </div>

        <div>

          <mat-card class="header" (click)="automatedClicked()">
            <div fxLayout="row" style="margin-top: -10px" fxLayoutAlign="space-between center">
              <div fxLayout="row" fxLayoutGap="20px" fxLayoutAlign="center center">
                <span class="section-header">Automated Messages</span>
              </div>
              <button mat-fab color="accent">
                <mat-icon *ngIf="showAutomatedMessages">expand_less</mat-icon>
                <mat-icon *ngIf="!showAutomatedMessages">expand_more</mat-icon>
              </button>
            </div>
          </mat-card>

          <mat-card class="padding" *ngIf="showAutomatedMessages">
            <sd-setting-automated-messages
              *ngIf="showAutomatedMessages"
              [checkInAutomatedMessages]="checkInAutomatedMessages"
              [checkOutAutomatedMessages]="checkOutAutomatedMessages"
              [reservedAutomatedMessages]="reservedAutomatedMessages"
              [listingId]="listingId">
            </sd-setting-automated-messages>
          </mat-card>

        </div>


      </div>

    </div>
  `,
  styles: [
      `
      .section-header {
        font-size: 26px;
        font-family: 'Montserrat', sans-serif;
        font-weight: bolder;
        color: dimgray;
      }

      .header {
        cursor: pointer;
        padding: -10px -10px -10px -10px;
        background: whitesmoke;
      }

      mat-card {
        background: -webkit-linear-gradient(top, #ffffff 0%, #ffffff 100%); /* Chrome10+,Safari5.1+ */;
      }

      .padding {
        cursor: pointer;
        padding: -10px -10px -10px -10px;
        background: -webkit-linear-gradient(top, #ffffff 0%, #ffffff 100%);
      }
    `
  ]
})
export class ListingChannelTabComponent implements OnInit, OnDestroy {


  listingId;

  isAlive = true;
  isCannedResponsesLoading = false;
  isCannedResponsesLoaded = false;
  isAutoTasksLoading = false;
  isAutoTasksLoaded = false;
  isAutoResponsesLoading = false;
  isAutoResponsesLoaded = false;
  isAutomatedMessagesLoading = false;
  isAutomatedMessgesLoaded = false;

  showAutoTasks = false;
  showAutoResponses = false;
  showCannedResponses = false;
  showAutomatedMessages = false;



  messages: SavedMessage[] = [];
  tasks: AutoTask[] = [];
  confirmedGuestResponses: AutoResponse[] = [];
  nonConfirmedGuestResponses: AutoResponse[] = [];

  checkInAutomatedMessages: Alert[] = [];
  checkOutAutomatedMessages: Alert[] = [];
  reservedAutomatedMessages: Alert[] = [];
  alerts: Alert[] = [];



  private dialogRef: MatDialogRef<any>;

  constructor(private route: ActivatedRoute, private service: StayDuvetService, private dialog: MatDialog, private store: Store<State>) {
  }

  ngOnInit(): void {
    console.log('onInit sd-listing-channel-tab');

    this.listingId = this.route.parent.snapshot['id'];

    this.route.parent.params.subscribe((params) => {
      this.messages = [];
      this.listingId = +params['id'];
      this.setUpSavedMessages();
      this.setUpTasks();
      this.setUpAutoResponses();
      this.setUpAutomatedMessages();
    });

  }


  setUpSavedMessages() {

    this.store.select(getSavedMessages).takeWhile(() => this.isAlive).subscribe((messages) => {
      if (messages.length > 0) {

        this.messages = messages.filter(message => {
          if(!isNullOrUndefined(message.property_ids)){
            return message.property_ids.includes(this.listingId)
          }
          else {
            return false;
          }
        });
      }

    });


    this.store.select(getIsSavedMessagesLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.isCannedResponsesLoading = loading;
    });

    this.store.select(getIsSavedMessagesLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.isCannedResponsesLoaded = loaded;
    });

    const upcomingCombined = Observable.merge(
      this.store.select(getSavedMessages),
      this.store.select(getIsSavedMessagesLoading),
      this.store.select(getIsSavedMessagesLoaded),
      ((tasks, loading, loaded) => {
      })
    );

    upcomingCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.isCannedResponsesLoading && !this.isCannedResponsesLoaded) {
          this.service.getSavedMessages().subscribe();
        }
      }
    );
  }

  setUpAutoResponses() {

    this.store.select(getAutoResponses).takeWhile(() => this.isAlive).subscribe((responses) => {
      if (responses) {
        this.confirmedGuestResponses  =  responses.filter( response =>  {
          if(!isNullOrUndefined(response.property_ids)){
            return response.property_ids.includes(this.listingId) && response.type.includes('confirmed')
          }
          else {
            return false;
          }
        });
        this.nonConfirmedGuestResponses  =  responses.filter( response => {
          if(!isNullOrUndefined(response.property_ids)){
            return response.property_ids.includes(this.listingId) && !response.type.includes('confirmed')
          }
          else {
            return false;
          }
        });
      }

    });


    this.store.select(getIsAutoResponseLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.isAutoResponsesLoading = loading;
    });

    this.store.select(getIsAutoResponseLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.isAutoResponsesLoaded = loaded;
    });

    const upcomingCombined = Observable.merge(
      this.store.select(getAutoResponses),
      this.store.select(getIsAutoResponseLoading),
      this.store.select(getIsAutoResponseLoaded),
      ((tasks, loading, loaded) => {
      })
    );

    upcomingCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.isAutoResponsesLoaded && !this.isAutoResponsesLoading) {
          this.service.getAutoResponses().subscribe();
        }
      }
    );
  }

  private setUpTasks() {
    this.store.select(getIsAutoTasksLoading).subscribe((loading) => {
      this.isAutoTasksLoading = loading;
    });
    this.store.select(getIsAutoTasksLoaded).subscribe((loaded) => {
      this.isAutoTasksLoaded = loaded;
    });
    this.store.select(getAutoTasks).subscribe((tasks) => {
      if (tasks.length > 0) {
        this.tasks = tasks.filter(task => {
          if(!isNullOrUndefined(task.property_ids)){
            return task.property_ids.includes(this.listingId)
          }
          else {
            return false;
          }
        });
      }
    });

    const observables = Observable.merge(this.store.select(getIsAutoTasksLoading), this.store.select(getIsAutoTasksLoaded), this.store.select(getAutoTasks), (loading, loaded, data) => {
    });

    observables.subscribe(() => {
      if (!this.isAutoTasksLoaded && !this.isAutoTasksLoading) {
        this.service.getAutoTasks().subscribe();
      }
    });
  }

  private setUpAutomatedMessages()
  {
    this.store.select(getAlerts).takeWhile(() => this.isAlive).subscribe((alerts) => {
      this.alerts = alerts;
      if(this.alerts.length > 0)
      {
        this.filterAlerts();
      }
    });

    this.store.select(getIsAlertsLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.isAutomatedMessagesLoading = loading;
    });

    this.store.select(getIsAlertsLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.isAutomatedMessgesLoaded = loaded;
    });

    const alertsCombined = Observable.merge(
      this.store.select(getAlerts),
      this.store.select(getIsAlertsLoading),
      this.store.select(getIsAlertsLoaded),
      ((discounts, loading, loaded) => {
      })
    );

    alertsCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.isAutomatedMessagesLoading && !this.isAutomatedMessgesLoaded) {
          this.service.getAlerts().subscribe(() => {
          });
        }
      }
    );
  }


  filterAlerts() {

    let includeTypeAlerts =  this.alerts.filter(alert => alert.alert_type == 'include');
    let excludeTypeAlerts =  this.alerts.filter(alert => alert.alert_type == 'exclude');

    includeTypeAlerts = includeTypeAlerts.filter(alert => {
      if(!isNullOrUndefined(alert.property_ids)){
        return alert.property_ids.includes(this.listingId)
      }
      else {
        return false;
      }
    });

    excludeTypeAlerts = excludeTypeAlerts.filter(alert => {
      if(!isNullOrUndefined(alert.property_ids)){
        return !alert.property_ids.includes(this.listingId)
      }
      else {
        return true;
      }
    });

    const checkIn = [];
    const checkOut = [];
    const reservation = [];

    this.alerts = [...includeTypeAlerts, ... excludeTypeAlerts];
    this.alerts.map((alert) => {
      if (alert.offset_reference === 'check_in') {
        checkIn.push(alert);
      } else if (alert.offset_reference === 'check_out') {
        checkOut.push(alert);
      } else {
        reservation.push(alert);
      }
    });

    this.checkInAutomatedMessages = checkIn;
    this.checkOutAutomatedMessages = checkOut;
    this.reservedAutomatedMessages = reservation;

  }

  autoResponseClicked() {
    this.showAutoResponses = !this.showAutoResponses;
    this.showAutoTasks = false;
    this.showCannedResponses = false;
    this.showAutomatedMessages = false;
  }

  autoTasksClicked() {
    this.showAutoResponses = false;
    this.showAutoTasks = !this.showAutoTasks;
    this.showCannedResponses = false;
    this.showAutomatedMessages = false;
  }

  cannedResponsesClicked() {
    this.showAutoResponses = false;
    this.showAutoTasks = false;
    this.showCannedResponses = !this.showCannedResponses;
    this.showAutomatedMessages = false;
  }

  automatedClicked(){
    this.showAutoResponses = false;
    this.showAutoTasks = false;
    this.showCannedResponses = false;
    this.showAutomatedMessages = !this.showAutomatedMessages;
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
