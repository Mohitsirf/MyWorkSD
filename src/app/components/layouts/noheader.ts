import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'sd-layout-no-header',
    template: `
        <div class="page-container">
            <router-outlet></router-outlet>
        </div>
    `,
    styles: []
})
export class LayoutNoHeaderComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }
}
