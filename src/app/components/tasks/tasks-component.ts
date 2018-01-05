import {Component, OnInit} from '@angular/core';

/**
 * Created by ubuntu on 9/7/17.
 */
@Component({
  selector: 'sd-tasks-component',
  template: `
    <sd-owner-main-layout>
      <div class="main-container" fxFlex="95%">
        <sd-tasks-page [showListingsFilter]="true"></sd-tasks-page>
      </div>
    </sd-owner-main-layout>
  `,
  styles: [`
    .main-container {
      margin: 10px 30px 30px;
    }


  `]
})
export class TasksComponent implements OnInit {


  ngOnInit(): void {
    console.log('onInit tasks-component');


  }
}
