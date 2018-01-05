import {Component, EventEmitter, Input, Output, DoCheck} from '@angular/core';
import {MatDialog} from '@angular/material';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'sd-modal-popup-layout',
  template: `
    <div id="cwidth" fxLayout="column" fxLayoutGap="20px">
      <mat-dialog-content>
        <mat-toolbar style="position: fixed;z-index: 9;" [ngStyle]="{'width':clientWidth + 'px'}" color="accent">
          <h2>{{title}}</h2>
          <span class="example-spacer"></span>
          <button mat-icon-button *ngIf="print" (click)="printButtonClicked()">
            <mat-icon>print</mat-icon>
          </button>
          <button *ngIf="allowClose" mat-icon-button matDialogClose>
            <mat-icon>close</mat-icon>
          </button>
        </mat-toolbar>

      </mat-dialog-content>
      <div style="padding-top:40px"></div>
      <ng-content></ng-content>
    </div>
    <ng-content select="[sd-modal-footer]"></ng-content>
  `,
  styles: [`

    .example-spacer {
      flex: 1 1 auto;
    }

    mat-dialog-content {
      padding: 0px;
    }

    /deep/ mat-dialog-container {
      padding-top: 0px !important;
      /*padding-left: 24px !important;*/
      /*padding-right: 24px !important;*/
      /*padding-bottom: 24px !important;*/
    }

  `]
})

export class ModalPopupLayoutComponent implements DoCheck {
  @Input() title: string;
  @Input() print: false;
  @Input() allowClose = true;
  @Output() printAction = new EventEmitter<any>();
  clientWidth: number;

  constructor(private dialog: MatDialog) {
  }

  printButtonClicked() {
    this.printAction.emit();
  }

  ngDoCheck() {
    if (!isNullOrUndefined(document.getElementById('cwidth')))
      this.clientWidth = document.getElementById('cwidth').offsetWidth + 48;
  }
}



