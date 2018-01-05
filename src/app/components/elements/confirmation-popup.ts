import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {isNullOrUndefined} from "util";

@Component({
  selector: 'sd-generic-confirmation-popup',
  template: `
    <sd-modal-popup-layout [allowClose]="false" [title]="title">
      <div fxLayout="column" fxLayoutAlign="center stretch" fxLayoutGap="10px">
        <div fxLayout="row" fxLayoutAlign="space-between center" fxLayoutGap="10px">
          <span>{{ description }}</span>
          <div fxLayout="row" fxLayoutGap="10px">
          <mat-spinner *ngIf="isLoading" [diameter]="30" [strokeWidth]="4"></mat-spinner>
          <button mat-raised-button color="accent" [disabled]="isLoading" (click)="onYesButtonClicked()">
            {{ yesButtonText }}
          </button>
          <button mat-raised-button color="primary" (click)="close()"> No</button>
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

export class GenericConfirmationPopupComponent implements OnInit {
  @Input() title = '';
  @Input() description = '';
  @Input() showCloseButton = true;
  @Input() showNoButton = true;

  @Input() yesButtonText = 'Yes';
  @Input() isLoading = false;

  @Output() yesButtonClicked = new EventEmitter;
  constructor(private dialogRef: MatDialogRef<GenericConfirmationPopupComponent>,
              @Inject(MAT_DIALOG_DATA) private data: GenericConfirmationData) {
    if(!isNullOrUndefined(data))
    {
      this.title = data.title;
      this.description = data.description;
      this.showCloseButton = data.showCloseButton;
      this.showNoButton = data.showNoButton;
    }

  }
  ngOnInit() {
    console.log('onInit sd-confirmation-popup');
  }

  onYesButtonClicked() {
    this.yesButtonClicked.emit();
  }

  close() {
    this.dialogRef.close();
  }
}


export interface GenericConfirmationData {
  title: string;
  description: string;
  showCloseButton: boolean;
  showNoButton: boolean;
}
