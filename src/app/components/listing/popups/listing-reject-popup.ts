import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'sd-listing-reject-popup',
  template: `
    <sd-modal-popup-layout title="{{title}}">
      <div fxLayout="column" fxLayoutAlign="center stretch" fxLayoutGap="10px">
        <mat-form-field class="detailField">
          <textarea color="accent" matInput placeholder="{{placeholder}}" rows="2" [(ngModel)]="reason"></textarea>
        </mat-form-field>
        <div fxLayout="row" fxLayoutAlign="end center" fxLayoutGap="10px">
          <mat-spinner *ngIf="isLoading" [diameter]="30" [strokeWidth]="4"></mat-spinner>
          <button mat-raised-button color="accent" [disabled]="isLoading" (click)="onRejectButtonClicked()">Reject</button>
        </div>
      </div>
    </sd-modal-popup-layout>
  `,
  styles: [`

    .title {
      font-weight: bolder;
      font-size: 22px;
      padding-left: 10px;
      padding-right: 10px;
      height: 30px;
      width: 100%;
    }

    .detailField {
      padding-left: 10px;
      padding-right: 10px;
      width: 95%;
    }

    textarea {
      resize: vertical;
    }

    mat-spinner {
      width: 30px;
      height: 30px;
    }
  `]
})

export class ListingRejectPopupComponent implements OnInit {
  @Input() title = 'Title';
  @Input() placeholder: string = '';


  @Input() isLoading: Boolean = false;
  @Output() rejectButtonClicked = new EventEmitter<string>();
  reason:string='';

  constructor() {
  }

  ngOnInit() {

  }

  onRejectButtonClicked() {
    this.rejectButtonClicked.emit(this.reason);
  }
}
