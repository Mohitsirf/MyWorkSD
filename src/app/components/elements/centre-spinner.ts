import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'sd-center-spinner',
    template: `        
        <div style="position: absolute;height: 100%;width: 100%;" fxLayoutAlign="center center">
            <mat-spinner color="accent" [diameter]="70" [strokeWidth]="6"></mat-spinner>
        </div>
    `,
    styles: []
})

export class CentreSpinnerComponent {
  //
}
