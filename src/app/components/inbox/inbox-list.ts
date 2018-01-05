import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {Message} from '../../models/message';
import {Thread} from '../../models/thread';
import {StayDuvetService} from '../../services/stayduvet';

@Component({
  selector: 'sd-inbox-list',
  template: `
<div style="padding:0px !important;border:none !important;margin-top:-8% !important;box-shadow: 1px 1px 1px lightgrey !important; margin-left: 15px;" class="test-card">
    <div *ngFor="let section of sections">
      <h3 matSubheader style="font-size:14px; font-family: 'Montserrat', sans-serif;background-color:#d9d9d9;padding:20px;">{{ section.title }}</h3>
      <div fxLayout="column" *ngFor="let thread of section.threads; let index = index">
        <hr class="full-width" *ngIf="index === 0">
        <div fxLayoutAlign="start center">
        <div class="selected" *ngIf="thread.id === selectedThread.id"></div>
        <button  mat-icon-button *ngIf="isUpdating && !isUpdating[thread.id]" (click)="alterArchived(thread)">
        <mat-icon color="primary" *ngIf="thread.is_archived">unarchive</mat-icon>
        <mat-icon *ngIf="!thread.is_archived">archive</mat-icon>
        </button>
          <mat-spinner *ngIf="isUpdating && isUpdating[thread.id]" color="accent" [diameter]="30" [strokeWidth]="4"></mat-spinner>
          <button mat-button style="width: 100%" [disabled]="thread.id === selectedThread.id"
                  (click)="onSelected(thread)">
            <div fxLayoutAlign="space-between center" fxFlex="100%">
              <div fxLayout="column" fxLayoutAlign="center start">
                <span><b>{{thread.getGuest().first_name}} {{thread.getGuest().last_name}}</b></span>
                <span *ngIf="thread.status" class="subheading">{{ thread.status }}</span>
                <span *ngIf="!thread.status" class="subheading">Inquiry</span>
              </div>
              <div *ngIf="thread.id != selectedThread.id" fxLayout="column" fxLayoutAlign="center center">
                <span>{{thread.last_message_on | utcToLocalTime | dateFormatting}}</span>
                <div fxLayout="row" fxLayoutAlign="center center">
                  <mat-icon *ngIf="thread.is_favourite" [color]="'warn'">favorite</mat-icon>
                  <mat-icon *ngIf="!thread.is_opened && thread.id != selectedThread.id" [color]="'accent'">
                    fiber_manual_record
                  </mat-icon>
                </div>
              </div>
              <div *ngIf="thread.id === selectedThread.id" fxLayout="column" fxLayoutAlign="center center">
                <mat-icon [color]="'accent'">border_color</mat-icon>
              </div>
            </div>
          </button>
        </div>
        <hr class="full-width">
      </div>
      <div fxLayout="row" *ngIf="currentPage < totalPage">
       <button mat-button style="width: 100%;height: 50px;" (click)="onLoadMore()">
         <div fxLayoutAlign="center center">
           <span *ngIf="!moreDataLoading">Load more...</span>
           <mat-spinner [diameter]=30 [strokeWidth]="4" *ngIf="moreDataLoading"></mat-spinner>
           </div>
        </button>
      </div>
    </div>
    </div>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }
    
    mat-icon {
      height: 30px;
      width: 30px;
    }

    hr {
      margin-top: 0px;
      margin-bottom: 0px;
    }

    img {
      width: 50px;
      height: 50px;
      border-radius: 25px;
    }

    .selected {
      height: 75px;
      width: 8px;
      margin-right: 3px;
      background-color: #0A253E;
    }

    .subheading {
      font-size: 15px;
    }

 span{
    font-size: 18px !important;
    font-weight: normal !important;
    color : #364f66 !important;
    }
    
    span {
      font-size: 14px !important;
    }
  `]
})

export class InboxListComponent implements OnInit {
  isUpdating = [];

  @Input() sections: { title: string, threads: Thread[] }[] = [];
  @Input() selectedThread: Thread;
  @Input() moreDataLoading: boolean;
  @Input() currentPage: number;
  @Input() totalPage: number;
  @Output() loadMore =  new EventEmitter();


  constructor(private router: Router,
              private service: StayDuvetService) {
  }

  ngOnInit(): void {
    console.log('onInit sd-inbox-list');
  }

  onSelected(selectedThread: Thread) {
      this.router.navigate(['/inbox/' + selectedThread.id]);
  }

  alterArchived(thread: Thread) {
    this.isUpdating[thread.id] = true;

    this.service.updateThread(thread, {is_archived: !thread.is_archived}).subscribe((thread) => {
      this.isUpdating[thread.id] = false;
    });
  }

  onLoadMore(){
   this.loadMore.next();
  }
}
