import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
/**
 * Created by ubuntu on 9/7/17.
 */
@Component({
  selector: 'sd-listing-calendar-tab',
  template: `
    <sd-calendar [listingId]="listingId"></sd-calendar>
  `,
  styles: []
})
export class ListingCalendarTabComponent implements OnInit, OnDestroy {
  listingId;

  private isAlive = true;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    console.log('onInit sd-listing-calendar-tab');

    this.listingId = this.route.parent.snapshot['id'];

    this.route.parent.params.subscribe((params) => {
      this.listingId = +params['id'];
    });
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
