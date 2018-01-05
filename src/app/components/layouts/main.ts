import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'sd-layout',
    template: `
        <sd-header></sd-header>
        <ng-content></ng-content>
    `,
    styles: []
})
export class LayoutMainComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }
}
