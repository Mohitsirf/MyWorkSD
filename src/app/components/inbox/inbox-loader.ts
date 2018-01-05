import {Component, OnDestroy, OnInit} from '@angular/core';
import {StayDuvetService} from '../../services/stayduvet';
import {Message} from '../../models/message';
import {Store} from '@ngrx/store';
import {
  getArchivedThreads,
  getIsArchivedThreadLoaded,
  getIsArchivedThreadLoading,
  getIsUnreadThreadLoaded,
  getIsUnreadThreadLoading,
  getThreads,
  State,
  getUnreadThreads,
  getFollowupThreads,
  getIsFollowupThreadLoaded,
  getIsFollowupThreadLoading,
  getBookedThreads,
  getIsBookedThreadLoaded,
  getIsBookedThreadLoading,
  getIsOngoingThreadLoading,
  getOngoingThreads,
  getIsOngoingThreadLoaded,
  getRequestsThreads,
  getIsRequestsThreadLoaded,
  getIsRequestsThreadLoading,
  getIsOtherThreadLoaded,
  getIsOtherThreadLoading,
  getOtherThreads,
} from '../../reducers/index';
import {ActivatedRoute, Router} from '@angular/router';
import {Thread} from '../../models/thread';
import {Observable} from 'rxjs/Observable';
import {Subscription} from "rxjs/Subscription";
import Utils from "../../utils";
import ObjectUtils from "../../utils/object";
import {ThreadSidebarUpdateSuccess} from "../../actions/message";

@Component({
  selector: 'sd-inbox-loader',
  template: `
    <sd-owner-main-layout>

      <div fxFlex="100%" *ngIf="loading" fxLayout="column" id="spinner" fxLayoutAlign="center center">
        <mat-spinner [diameter]="60" [strokeWidth]="5" color="accent"></mat-spinner>
        <span style="margin-top: 20px;">Loading threads...</span>
      </div>

      <div fxFlex="100%" *ngIf="noThreads" fxLayout="column" id="spinner" fxLayoutAlign="center center"
           fxLayoutGap="20px">
        <mat-icon>error_outline</mat-icon>
        <span>No threads found.</span>
      </div>
    </sd-owner-main-layout>
  `,
  styles: [`
    #spinner {
      position: fixed;
      top: 45%;
      right: 35%
    }

    mat-icon {
      font-size: 60px;
      height: 60px;
      width: 60px;
    }
  `]
})
export class InboxLoaderComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  loaded: boolean = false;
  noThreads: boolean = false;
  private isAlive: boolean = true;

  threads: Thread[];

  private threadFilter;


  constructor(private service: StayDuvetService,
              private store: Store<State>,
              private route: ActivatedRoute,
              private router: Router) {

  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.threadFilter = data['filter'];
      if (this.threadFilter != null) {
        this.loadThreads();
      }
    });
  }

  private loadThreads() {
    this.loading = true;

    // This is to unsub from old observables
    this.isAlive = false;
    this.isAlive = true;

    this.store.dispatch(new ThreadSidebarUpdateSuccess(this.threadFilter));

    switch (this.threadFilter) {
      case 'unread': {
        this.loadUnreadThreads();
        break;
      }
      case 'followup': {
        this.loadFollowupThreads();
        break;
      }
      case 'booked': {
        this.loadBookedThreads();
        break;
      }
      case 'ongoing': {
        this.loadOngoingThreads();
        break;
      }
      case 'requests': {
        this.loadRequestsThreads();
        break;
      }
      case 'archived': {
        this.loadArchivedThreads();
        break;
      }
      case 'other': {
        this.loadOtherThreads();
        break;
      }
      default:
        // Never Happens
        this.threads = [];
        break;
    }
  }

  private loadUnreadThreads() {
    this.store.select(getIsUnreadThreadLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.loading = loading;
    });
    this.store.select(getIsUnreadThreadLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.loaded = loaded;
    });
    this.store.select(getUnreadThreads).takeWhile(() => this.isAlive).subscribe((threads) => {
      this.threads = threads;
      if (this.loaded) {
        this.threadsLoaded();
      }
    });

    const threadsCombined = Observable.merge(
      this.store.select(getIsUnreadThreadLoading),
      this.store.select(getIsUnreadThreadLoaded),
      this.store.select(getUnreadThreads),
      ((loading, loaded, threads) => {
      })
    );

    threadsCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.loading && !this.loaded) {
          this.service.getUnreadThreads(1).subscribe();
        }
      }
    );
  }

  private loadFollowupThreads() {
    this.store.select(getIsFollowupThreadLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.loading = loading;
    });
    this.store.select(getIsFollowupThreadLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.loaded = loaded;
    });
    this.store.select(getFollowupThreads).takeWhile(() => this.isAlive).subscribe((threads) => {
      this.threads = threads;
      if (this.loaded) {
        this.threadsLoaded();
      }
    });

    const threadsCombined = Observable.merge(
      this.store.select(getIsFollowupThreadLoading),
      this.store.select(getIsFollowupThreadLoaded),
      this.store.select(getFollowupThreads),
      ((loading, loaded, threads) => {
      })
    );

    threadsCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.loading && !this.loaded) {
          this.service.getFollowupThreads(1).subscribe();
        }
      }
    );
  }

  private loadBookedThreads() {
    this.store.select(getIsBookedThreadLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.loading = loading;
    });
    this.store.select(getIsBookedThreadLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.loaded = loaded;
    });
    this.store.select(getBookedThreads).takeWhile(() => this.isAlive).subscribe((threads) => {
      this.threads = threads;
      if (this.loaded) {
        this.threadsLoaded();
      }
    });

    const threadsCombined = Observable.merge(
      this.store.select(getIsBookedThreadLoading),
      this.store.select(getIsBookedThreadLoaded),
      this.store.select(getBookedThreads),
      ((loading, loaded, threads) => {
      })
    );

    threadsCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.loading && !this.loaded) {
          this.service.getBookedThreads(1).subscribe();
        }
      }
    );
  }

  private loadOngoingThreads() {
    this.store.select(getIsOngoingThreadLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.loading = loading;
    });
    this.store.select(getIsOngoingThreadLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.loaded = loaded;
    });
    this.store.select(getOngoingThreads).takeWhile(() => this.isAlive).subscribe((threads) => {
      this.threads = threads;
      if (this.loaded) {
        this.threadsLoaded();
      }
    });

    const threadsCombined = Observable.merge(
      this.store.select(getIsOngoingThreadLoading),
      this.store.select(getIsOngoingThreadLoaded),
      this.store.select(getOngoingThreads),
      ((loading, loaded, threads) => {
      })
    );

    threadsCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.loading && !this.loaded) {
          this.service.getOngoingThreads(1).subscribe();
        }
      }
    );
  }

  private loadRequestsThreads() {
    this.store.select(getIsRequestsThreadLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.loading = loading;
    });
    this.store.select(getIsRequestsThreadLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.loaded = loaded;
    });
    this.store.select(getRequestsThreads).takeWhile(() => this.isAlive).subscribe((threads) => {
      this.threads = threads;
      if (this.loaded) {
        this.threadsLoaded();
      }
    });

    const threadsCombined = Observable.merge(
      this.store.select(getIsRequestsThreadLoading),
      this.store.select(getIsRequestsThreadLoaded),
      this.store.select(getRequestsThreads),
      ((loading, loaded, threads) => {
      })
    );

    threadsCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.loading && !this.loaded) {
          this.service.getRequestsThreads(1).subscribe();
        }
      }
    );
  }

  private loadArchivedThreads() {
    this.store.select(getIsArchivedThreadLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.loading = loading;
    });
    this.store.select(getIsArchivedThreadLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.loaded = loaded;
    });
    this.store.select(getArchivedThreads).takeWhile(() => this.isAlive).subscribe((threads) => {
      this.threads = threads;
      if (this.loaded) {
        this.threadsLoaded();
      }
    });

    const threadsCombined = Observable.merge(
      this.store.select(getIsArchivedThreadLoading),
      this.store.select(getIsArchivedThreadLoaded),
      this.store.select(getArchivedThreads),
      ((loading, loaded, threads) => {
      })
    );

    threadsCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.loading && !this.loaded) {
          this.service.getArchivedThreads(1).subscribe();
        }
      }
    );
  }

  private loadOtherThreads() {
    this.store.select(getIsOtherThreadLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.loading = loading;
    });
    this.store.select(getIsOtherThreadLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.loaded = loaded;
    });
    this.store.select(getOtherThreads).takeWhile(() => this.isAlive).subscribe((threads) => {
      this.threads = threads;
      if (this.loaded) {
        this.threadsLoaded();
      }
    });

    const threadsCombined = Observable.merge(
      this.store.select(getIsOtherThreadLoading),
      this.store.select(getIsOtherThreadLoaded),
      this.store.select(getOtherThreads),
      ((loading, loaded, threads) => {
      })
    );

    threadsCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.loading && !this.loaded) {
          this.service.getOtherThreads(1).subscribe();
        }
      }
    );
  }

  private threadsLoaded() {
    console.log(this.threads);
    if (this.threads.length === 0) {
      this.noThreads = true;
    } else {
      this.threads = ObjectUtils.sortByKey(this.threads, 'last_message_on', 'desc');
      this.router.navigate(['/inbox/' + this.threads[0].id]);
    }
  }


  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
