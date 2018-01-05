import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'sd-add-card',
  template: `
    <mat-card matRipple fxLayout="column" fxLayoutAlign="center center" fxLayoutGap="20px">
      <button mat-icon-button (click)="addButtonClicked()">
        <mat-icon>add</mat-icon>
      </button>
      <span (click)="addButtonClicked()">
        <ng-content></ng-content>
      </span>
    </mat-card>
  `,
  styles: [`
    :host {
      cursor: pointer;
      min-width: 150px;
      min-height: 150px;
    }

    span {
      font-size: 20px;
      text-align: center;
    }

    mat-icon {
      font-size: 45px;
      height: 45px;
      width: 45px;
    }
  `]
})

export class AddCardComponent {
  @Output() addCardClicked = new EventEmitter<any>();

  addButtonClicked() {
    this.addCardClicked.emit();
  }
}
