import {Component, EventEmitter, Input, Output} from '@angular/core';
@Component({
  selector: 'sd-quantity-input',
  template: `
    <div  fxLayout="row" fxLayoutAlign="space-between center" id="quantity">
      <button mat-mini-fab [color]="'warn'" (click)="minusClicked()">—</button>
      <h2>{{quantity}}</h2>
      <button mat-mini-fab (click)="plusClicked()">
        <mat-icon>add</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    :host {
      cursor: pointer;
      min-width: 60px;
      min-height: 30px;
    }

    #quantity {
      width: 150px;
      height: 50px;
    }

  `]
})

export class QuantityInputComponent {
  @Output() valueUpdate = new EventEmitter<this>();
  @Input() quantity = 0;
  @Input() tag: string = '';
  @Input() index: number;
  @Input() step = 1;


  minusClicked() {
    if (this.quantity > 0){
      this.quantity -= this.step;
    }
    return this.valueUpdate.emit(this);
  }

  plusClicked() {
    this.quantity += this.step;
    return this.valueUpdate.emit(this);
  }
}
