import {Component, OnInit} from '@angular/core';
import {DateAdapter} from '@angular/material';

@Component({
  selector: 'sd-app',
  template: `
      <router-outlet></router-outlet>
  `,
  styles: [],
  providers: []
})
export class AppComponent implements OnInit {

  constructor(dateAdapter: DateAdapter<Date>) {
    // TODO: remove this later. need to do this for now as MatDatePicker has a bug for some locales
    // including Indian locale due to which it interprets 11 Oct as 10 Nov and similar.
    dateAdapter.setLocale('en-us');
  }

  ngOnInit() {

  }

}
