import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'sd-monthly-breakdown-chart',
  template: `
    <ngx-charts-bar-vertical-stacked
      [results]="statsData"
      [xAxis]="true"
      [yAxis]="true"
      [legend]="true"
      [legendTitle]="'Listings'"
      [showXAxisLabel]="false"
      [showYAxisLabel]="true"
      [yAxisLabel]="'Earnings (in $)'"
      (select)="onSelect($event)">
      <ng-template #tooltipTemplate let-model="model">
        <h2>{{ model.name }}</h2>
        <p>Revenue: {{ model.stats.total_revenue }}</p>
        <p>Expense: {{ model.stats.total_expenses }}</p>
        <p>Earning: {{ model.value }}</p>
      </ng-template>
    </ngx-charts-bar-vertical-stacked>
  `,
  styles: []
})
export class MonthlyBreakdownChartComponent implements OnInit {

  @Input() statsData = [];

  ngOnInit(): void {
  }

  onSelect(event) {
  }
}
