import {DataSource} from '@angular/cdk/table';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {MatPaginator, MatSort} from '@angular/material';
import ObjectUtils from './object';

export class TableDataSource extends DataSource<any> {

  constructor(private data$: BehaviorSubject<any[]>, private paginator: MatPaginator, private sort: MatSort) {
    super();
  }

  connect(): Observable<any[]> {
    return this.data$.merge(this.paginator.page, this.sort.sortChange).map(() => {
      const data = this.getSortedData();
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    });
  }

  disconnect() {
  }

  private getSortedData(): any[] {
    const data = this.data$.value.slice();
    return ObjectUtils.sortByKey(data, this.sort.active, this.sort.direction);
  }
}
