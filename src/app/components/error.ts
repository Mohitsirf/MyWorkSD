import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'sd-error',
    template: `
        <div class="container" fxLayout="column" fxLayoutAlign="center center" fxLayoutGap="20px">
            <mat-icon>error_outline</mat-icon>
            <span><ng-content></ng-content></span>
        </div>
    `,
    styles: [`
        .page-container {
            position: absolute;
            height: 100%;
            width: 100%;
        }

        span {
            font-size: x-large;
        }

        mat-icon {
            font-size: 60px;
            height: 60px;
            width: 60px;
        }
    `]
})

export class ErrorComponent {

}
