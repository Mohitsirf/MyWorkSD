import {Component, OnInit} from '@angular/core';
import {StayDuvetService} from '../services/stayduvet';

@Component({
    selector: 'sd-dashboard',
    template: `
        <router-outlet></router-outlet>
    `,
    styles: []
})
export class DashboardComponent implements OnInit {

    constructor(private service: StayDuvetService) {
    }

    ngOnInit() {
    }

}
