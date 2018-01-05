import {Component, Input, OnInit} from '@angular/core';
import {AdminDashStats} from "../models/admin-dash-stats";

@Component({
  selector: 'sd-rental-channel-breakdown-pie-chart',
  template: `
    <ngx-charts-pie-chart
      [view]="view"
      [scheme]="colorScheme"
      [results]="data"
      (select)="onSelect($event)">
      <ng-template #tooltipTemplate let-model="model">
        <p>{{ model.name }} : {{model.value | number:'1.2-2' }}%</p>
      </ng-template>
    </ngx-charts-pie-chart>
  `,
  styles: [`
  `]
})
export class RentalChannelBreakdownPieChartComponent implements OnInit {


  @Input() data: AdminDashStats;

  view: any[] = [300, 300];

  colorScheme = {
    domain: ['#4245A4', '#6f7b83', '#C7B42C', '#848C92']
  };

  onSelect(event) {
  }

  ngOnInit(): void {
  }


}
