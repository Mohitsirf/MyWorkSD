import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {
  getAssigness, getIsAssgineesLoaded, getIsAssigneesLoading,
  getIsTasksLoaded, getIsTasksLoading, getListingById, getListings, getTasks,
  State
} from '../../reducers/index';
import {ActivatedRoute} from '@angular/router';
import {Task} from '../../models/task';
import {Observable} from 'rxjs/Observable';
import {StayDuvetService} from '../../services/stayduvet';
import {MatDialog, MatDialogRef} from '@angular/material';
import {CreateTaskPopupComponent} from '../tasks/popups/create-task';
import {DetailsMagnifyComponent} from '../tasks/details-magnify';
import {Listing} from '../../models/listing';
import {Subscription} from "rxjs/Subscription";
import {User} from "app/models/user";
import {getTaskFilterTypes, getAllTaskTypes} from "app/utils";

/**
 * Created by ubuntu on 9/7/17.
 */
@Component({
  selector: 'sd-listing-tasks-tab',
  template: `
    <div class="main-container">
      <sd-tasks-page [selectedListings]="[selectedListing]"></sd-tasks-page>
    </div>
  `,
  styles: [`

    .main-container {
      margin-top: -90px;
    }


  `]
})
export class ListingTasksTabComponent implements OnInit, OnDestroy {

  selectedListing: Listing;
  private isAlive: boolean = true;


  ngOnInit(): void {
    console.log('onInit sd-listing-tasks-tab');
    this.route.parent.params.subscribe((params) => {
      const listingId = +params['id'];
      this.store.select((state) => {
        return getListingById(state, listingId);
      }).takeWhile(() => this.isAlive).subscribe((listing) => {
        this.selectedListing = listing;
      });

    });

  }


  constructor(private route: ActivatedRoute,
              private store: Store<State>,
              private service: StayDuvetService,
              private dialog: MatDialog) {
  }


  ngOnDestroy(): void {
    this.isAlive = false;
  }

}
