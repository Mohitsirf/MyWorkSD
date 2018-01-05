import {Component, Input, OnInit} from '@angular/core';
import {AdminDashStats} from "../models/admin-dash-stats";

@Component({
  selector: 'sd-rental-channel-breakdown-bar-chart',
  template: `
    <ngx-charts-bar-vertical
      [view]="view"
      [scheme]="colorScheme"
      [results]="data"
      [gradient]="gradient"
      [xAxis]="showXAxis"
      [yAxis]="showYAxis"
      barPadding="20"
      showYAxisLabel="true"
      yAxisLabel="Earnings (in $)"
      (select)="onSelect($event)">
      <ng-template #tooltipTemplate let-model="model">
        <p>{{ model.name }} : {{'$' + model.value}}</p>
      </ng-template>
    </ngx-charts-bar-vertical>
  `,
  styles: [`

  `]
})
export class RentalChannelBreakdownBarChartComponent implements OnInit {


  showXAxis = true;
  showYAxis = true;
  gradient = false;

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
