import {Component, OnDestroy, OnInit} from '@angular/core';
import {StayDuvetService} from '../../services/stayduvet';
import {Message} from '../../models/message';
import {Store} from '@ngrx/store';
import {
  getArchivedThreads, getIsArchivedThreadLoaded, getIsArchivedThreadLoading
  , getIsUnreadThreadLoaded, getIsUnreadThreadLoading,
  State, getUnreadThreads, getFollowupThreads, getIsFollowupThreadLoaded, getIsFollowupThreadLoading, getBookedThreads,
  getIsBookedThreadLoaded,
  getIsBookedThreadLoading, getIsOngoingThreadLoading, getOngoingThreads, getIsOngoingThreadLoaded, getRequestsThreads,
  getIsRequestsThreadLoaded,
  getIsRequestsThreadLoading, getAdmins, getIsMessagesLoadingByThreadId, getIsMessagesLoadedByThreadId,
  getMessagesByThreadId, getThreads, getUnreadTotalPage, getUnreadCurrentPage,
  getFollowupTotalPage,
  getFollowupCurrentPage, getBookedCurrentPage, getBookedTotalPage,
  getOngoingThreadsCurrentPage, getOngoingThreadsTotalPage, getRequestsCurrentPage,
  getRequestsTotalPage, getArchivedCurrentPage, getArchivedTotalPage, getThreadById, getIsOtherThreadLoading,
  getIsOtherThreadLoaded, getOtherThreads, getOtherCurrentPage, getOtherTotalPage, getSidebarSelectedOption
} from '../../reducers/index';
import {ActivatedRoute, Router} from '@angular/router';
import {Thread} from '../../models/thread';
import {Observable} from 'rxjs/Observable';
import {User} from '../../models/user';
import {getDateObj} from '../calendar/calendar-utils';
import * as moment from 'moment';
import {ThreadSidebarUpdateSuccess, ThreadUpdateSuccessAction} from '../../actions/message';
import {isNullOrUndefined} from "util";
import Utils from "app/utils";
import ObjectUtils from "../../utils/object";

@Component({
  selector: 'sd-inbox-screen-content',
  template: `

    <sd-owner-main-layout-generic>

      <div fxFlex="100%" *ngIf="currentThreadLoading && !threadNotFoundError" fxLayout="column" id="spinner"
           fxLayoutAlign="center center">
        <mat-spinner [diameter]="60" [strokeWidth]="5" color="accent"></mat-spinner>
        <span style="margin-top: 20px;">Loading messages...</span>
      </div>

      <div fxFlex="100%" id="spinner" *ngIf="threadNotFoundError" fxLayout="column" id="spinner"
           fxLayoutAlign="center center">
        <mat-icon style="font-size: 60px; height: 60px;  width: 60px;">error_outline</mat-icon>
        <span style="margin-top: 20px;">The requested thread doesn't exist.</span>
      </div>

      <div fxFlex="99%" fxLayoutAlign="space-between start" class="frame"
           *ngIf="!currentThreadLoading && !threadNotFoundError">
        <div  fxFlex="26%" class="left-column requiredHeight">
          <div *ngIf="threadLoaded" style="width: 100%">
            <sd-inbox-list
              (loadMore)="loadMoreClicked()"
              [sections]="sections"
              [currentPage]="currentLoadedPage"
              [totalPage]="totalPage"
              [moreDataLoading]="loadingMoreData"
              [selectedThread]="selectedThread">
            </sd-inbox-list>
          </div>
          <div *ngIf="threadLoading" fxLayoutAlign="center center" style="height: 100%">
            <mat-spinner color="accent" [diameter]="40" [strokeWidth]="4"></mat-spinner>
          </div>
        </div>
        <div fxFlex="51%" fxLayout="column" fxLayoutAlign="center stretch"
             class="chat-section test-card requiredHeight">
          <div *ngIf="messagesLoading && !messageLoadingFailed" fxLayoutAlign="center center" fxFlex="80%">
            <mat-spinner color="accent" [diameter]="40" [strokeWidth]="4"></mat-spinner>
          </div>
          <div *ngIf="messageLoadingFailed" fxLayoutAlign="center center" fxFlex="80%">
            <mat-icon>error_outline</mat-icon>
            <span>The thread doesn't exist.</span>
          </div>
          <div id="chat" *ngIf="messagesLoaded" fxFlex="80%">
            <sd-message [messages]="messages" [thread]="selectedThread"></sd-message>
          </div>
          <div class="dynamicHeight">
            <sd-response-card
              *ngIf="selectedThread"
              [selectedThread]="selectedThread">
            </sd-response-card>
          </div>
        </div>
        <div fxFlex="23%" fxLayout="column" fxLayoutAlign="start stretch" fxLayoutGap="20px"
             class="right-column margin-top test-card">
          <div *ngIf="!currentThreadLoading" fxLayout="column">
            <div style="margin-top: 40px; margin-bottom: 30px;" class="requiredHeight" fxLayout="row"
                 fxLayoutAlign="space-around center">
              <mat-spinner *ngIf="adminLoading || adminUpdating" [diameter]="30" [strokeWidth]="4"></mat-spinner>
              <mat-form-field class="full-width" *ngIf="!adminLoading && !adminUpdating">
                <mat-select placeholder="Assignee"
                            style="padding: 5px"
                            [(ngModel)]="assignee"
                            color="accent"
                            (ngModelChange)="assignAdminToCurrentThread()">
                  <mat-option *ngFor="let admin of admins" [value]="admin.getAdmin().id">
                    {{ admin.first_name }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
              <button *ngIf="!favouriteRequestLoading" mat-icon-button (click)="alterFavourite()">
                <mat-icon matTooltip="Dislike" style="color:red" class="toDislike" *ngIf="selectedThread.is_favourite">
                  favorite
                </mat-icon>
                <mat-icon matTooltip="Like" *ngIf="!selectedThread.is_favourite">favorite_border</mat-icon>
              </button>
              <mat-spinner *ngIf="favouriteRequestLoading" color="accent" style="width: 35px;height:35px;"
                           [diameter]="30" [strokeWidth]="4"></mat-spinner>

              <button *ngIf="!unreadRequestLoading" mat-icon-button (click)="unreadThread()">
                <mat-icon matTooltip="Mark Unread" *ngIf="!selectedThread.is_opened">visibility_off</mat-icon>
                <mat-icon matTooltip="Mark Read" *ngIf="selectedThread.is_opened">visibility</mat-icon>
              </button>
              <mat-spinner *ngIf="unreadRequestLoading" color="accent" style="width: 35px;height:35px;" [diameter]="30"
                           [strokeWidth]="4"></mat-spinner>
            </div>
            <div fxFlex="25%" style="margin-bottom: 10px;margin-top: 10px;">
              <sd-user-info-card [guest]="selectedThread.getGuest()"></sd-user-info-card>
            </div>
            <div style="margin-bottom: 10px;margin-top: 10px;">
              <sd-booking-detail-card [booking]="selectedThread.getBooking()"
                                      [listingId]="selectedThread.getBooking().property_id"
                                      [thread]="selectedThread"></sd-booking-detail-card>
            </div>
            <div style="margin-bottom: 20px;margin-top: 10px;">
              <sd-guest-type-card [booking]="selectedThread.getBooking()"></sd-guest-type-card>
            </div>
          </div>
          <div *ngIf="currentThreadLoading" fxLayoutAlign="center center" fxFlex="80%">
            <mat-spinner color="accent" [diameter]="40" [strokeWidth]="4"></mat-spinner>
          </div>
        </div>
      </div>


    </sd-owner-main-layout-generic>
  `,
  styles: [`

    .toDislike:hover {
      opacity: 0.5;
      color: gray;
    }

    #spinner {
      position: fixed;
      top: 45%;
      right: 35%
    }

    #center {
      position: fixed;
      top: 40%;
      left: 50%;
    }

    #chat {
      margin-top: 15%;
      display: flex;
      height: auto;
      flex-direction: column-reverse;
      overflow: scroll;
      overflow-x: hidden !important;
    }

    .dynamicHeight {
      display: table-cell;
      height: auto;
    }

    ::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
      background-color: #fff;
      border-radius: 10px;
    }

    ::-webkit-scrollbar {
      width: 6px;
      background-color: #F5F5F5;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-image: -webkit-gradient(linear,
      left bottom,
      left top,
      color-stop(0.44, #1e507b),
      color-stop(0.72, #235d90),
      color-stop(0.86, #286aa4));
    }

    .frame {
      max-height: 100vh;
      overflow: hidden;
      min-width: -webkit-calc(100% - 220px);
      min-width: -moz-calc(100% - 220px);
      min-width: calc(100% - 220px);
      display: table;
    }

    .right-column {
      max-height: 100vh;
      overflow-y: scroll;
      overflow-x: hidden;
      padding-left: 10px;
      padding-right: 10px;
    }

    .left-column {
      height: 100%;
      overflow-y: scroll;
      overflow-x: hidden;
      padding: 5px;
    }

    sd-inbox-list {
      max-height: 100vh;
      overflow: scroll;
      padding-left: 10px;
      padding-right: 10px;
    }

    .chat-section {
      height: 100%;
    }

    .margin-top {
      margin-top: 10px;
    }
  `]
})
export class InboxScreenContentComponent implements OnInit, OnDestroy {

  threads: Thread[];
  threadLoading = false;
  threadLoaded = false;
  selectedThread: Thread;
  selectedThreadId: number;
  sections: { title: string, threads: Thread[] }[] = [];

  favouriteRequestLoading = false;
  unreadRequestLoading = false;

  messagesLoading = false;
  messagesLoaded = false;
  messageLoadingFailed = false;
  messages: Message[];

  admins: User[];
  adminLoading = true;
  adminUpdating = false;
  assignee;

  currentThreadLoading = false;

  private isAlive: boolean = true;

  threadNotFoundError = false;

  currentLoadedPage: number = 0;
  totalPage: number = 0;

  loadingMoreData = false;
  private filter;

  constructor(private service: StayDuvetService,
              private store: Store<State>,
              private route: ActivatedRoute,
              private router: Router) {

  }

  ngOnInit() {
    console.log('onInit sd-inbox-screen-content');

    this.route.params.subscribe(params => {
      this.selectedThreadId = +params['thread_id'];
      this.currentThreadLoading = true;
      this.checkThread();
    });

    this.loadAdmins();
  }

  checkThread() {
    console.log('inside check thread');

    this.store.select((state) => {
      return getThreadById(state, this.selectedThreadId);
    }).takeWhile(() => this.isAlive).subscribe((thread) => {
      if (!isNullOrUndefined(thread) && thread.showFull) {
        this.selectFilter(thread);
      }
      if ((isNullOrUndefined(thread) || !thread.showFull)) {
        this.service.getThread(this.selectedThreadId).subscribe(res => {
        }, err => {
          this.threadNotFoundError = true;
        });
      }
    });

  }


  private selectFilter(thread: Thread) {
    this.store.select(getSidebarSelectedOption).takeWhile(() => this.isAlive).subscribe(filter => {
      this.filter = filter;
      if (isNullOrUndefined(this.filter)) {
        this.filter = Utils.getThreadType(thread);
        this.store.dispatch(new ThreadSidebarUpdateSuccess(this.filter));
      } else {
        let url = null;
        switch (this.filter) {
          case 'unread': {
            if (!Utils.isUnreadThread(thread)) {
              url = 'unread';
            }
            break;
          }
          case 'followup': {
            if (!Utils.isFollowUpThread(thread)) {
              url = 'follow-up';
            }
            break;
          }
          case 'booked': {
            if (!Utils.isBookedThread(thread)) {
              url = 'booked';
            }
            break;
          }
          case 'ongoing': {
            if (!Utils.isOngoingThread(thread)) {
              url = 'ongoing';
            }
            break;
          }
          case 'requests': {
            if (!Utils.isRequestThread(thread)) {
              url = 'requests';
            }
            break;
          }
          case 'archived': {
            if (!Utils.isArchivedThread(thread)) {
              url = 'archived';
            }
            break;
          }
          case 'other': {
            if (!Utils.isOtherThread(thread)) {
              url = 'other';
            }
            break;
          }
        }
        if (!isNullOrUndefined(url)) {
          this.router.navigate(['/inbox', url]);
          return;
        } else {
          this.selectedThread = thread;
          this.currentThreadLoading = false;
          this.currentThreadLoaded();
        }
      }
    });

  }

  private currentThreadLoaded() {
    console.log('inside threads loading');
    this.assignee = this.selectedThread.assignee_id;

    if (this.filter == null) {
      this.router.navigate(['/inbox']);
      return;
    }

    switch (this.filter) {
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
      this.threadLoading = loading;
    });
    this.store.select(getIsUnreadThreadLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.threadLoaded = loaded;
    });
    this.store.select(getUnreadCurrentPage).takeWhile(() => this.isAlive).subscribe((currentPage) => {
      this.currentLoadedPage = currentPage;
    });

    this.store.select(getUnreadTotalPage).takeWhile(() => this.isAlive).subscribe((totalPage) => {
      this.totalPage = totalPage;
    });

    this.store.select(getUnreadThreads).takeWhile(() => this.isAlive).subscribe((threads) => {
      this.threads = threads;
      this.afterThreadLoaded('Unread');
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
        if (!this.threadLoading && !this.threadLoaded) {
          this.service.getUnreadThreads(this.currentLoadedPage + 1).subscribe();
        }
      }
    );
  }

  private loadFollowupThreads() {
    this.store.select(getIsFollowupThreadLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.threadLoading = loading;
    });
    this.store.select(getIsFollowupThreadLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.threadLoaded = loaded;

    });

    this.store.select(getFollowupThreads).takeWhile(() => this.isAlive).subscribe((threads) => {
      this.threads = threads;
      this.afterThreadLoaded('Follow Up');
    });

    this.store.select(getFollowupCurrentPage).takeWhile(() => this.isAlive).subscribe((currentPage) => {
      this.currentLoadedPage = currentPage;
    });

    this.store.select(getFollowupTotalPage).takeWhile(() => this.isAlive).subscribe((totalPage) => {
      this.totalPage = totalPage;
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
        if (!this.threadLoading && !this.threadLoaded) {
          this.service.getFollowupThreads(this.currentLoadedPage + 1).subscribe();
        }
      }
    );
  }

  private loadBookedThreads() {
    this.store.select(getIsBookedThreadLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.threadLoading = loading;
    });
    this.store.select(getIsBookedThreadLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.threadLoaded = loaded;
    });
    this.store.select(getBookedThreads).takeWhile(() => this.isAlive).subscribe((threads) => {
      this.threads = threads;
      this.afterThreadLoaded('Booked');
    });
    this.store.select(getBookedCurrentPage).takeWhile(() => this.isAlive).subscribe((currentPage) => {
      this.currentLoadedPage = currentPage;
    });

    this.store.select(getBookedTotalPage).takeWhile(() => this.isAlive).subscribe((totalPage) => {
      this.totalPage = totalPage;
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
        if (!this.threadLoading && !this.threadLoaded) {
          this.service.getBookedThreads(this.currentLoadedPage + 1).subscribe();
        }
      }
    );
  }

  private loadOngoingThreads() {
    this.store.select(getIsOngoingThreadLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.threadLoading = loading;
    });
    this.store.select(getIsOngoingThreadLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.threadLoaded = loaded;
    });
    this.store.select(getOngoingThreads).takeWhile(() => this.isAlive).subscribe((threads) => {
      this.threads = threads;
      this.afterThreadLoaded('Ongoing');
    });
    this.store.select(getOngoingThreadsCurrentPage).takeWhile(() => this.isAlive).subscribe((currentPage) => {
      this.currentLoadedPage = currentPage;
    });

    this.store.select(getOngoingThreadsTotalPage).takeWhile(() => this.isAlive).subscribe((totalPage) => {
      this.totalPage = totalPage;
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
        if (!this.threadLoading && !this.threadLoaded) {
          this.service.getOngoingThreads(this.currentLoadedPage + 1).subscribe();
        }
      }
    );
  }

  private loadRequestsThreads() {
    this.store.select(getIsRequestsThreadLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.threadLoading = loading;
    });
    this.store.select(getIsRequestsThreadLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.threadLoaded = loaded;
    });
    this.store.select(getRequestsThreads).takeWhile(() => this.isAlive).subscribe((threads) => {
      this.threads = threads;
      this.afterThreadLoaded('Requests');
    });
    this.store.select(getRequestsCurrentPage).takeWhile(() => this.isAlive).subscribe((currentPage) => {
      this.currentLoadedPage = currentPage;
    });

    this.store.select(getRequestsTotalPage).takeWhile(() => this.isAlive).subscribe((totalPage) => {
      this.totalPage = totalPage;
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
        if (!this.threadLoading && !this.threadLoaded) {
          this.service.getRequestsThreads(this.currentLoadedPage + 1).subscribe();
        }
      }
    );
  }

  private loadArchivedThreads() {
    this.store.select(getIsArchivedThreadLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.threadLoading = loading;
    });
    this.store.select(getIsArchivedThreadLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.threadLoaded = loaded;
    });
    this.store.select(getArchivedThreads).takeWhile(() => this.isAlive).subscribe((threads) => {
      this.threads = threads;
      this.afterThreadLoaded('Archived');
    });
    this.store.select(getArchivedCurrentPage).takeWhile(() => this.isAlive).subscribe((currentPage) => {
      this.currentLoadedPage = currentPage;
    });

    this.store.select(getArchivedTotalPage).takeWhile(() => this.isAlive).subscribe((totalPage) => {
      this.totalPage = totalPage;
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
        if (!this.threadLoading && !this.threadLoaded) {
          this.service.getArchivedThreads(this.currentLoadedPage + 1).subscribe();
        }
      }
    );
  }

  private loadOtherThreads() {
    this.store.select(getIsOtherThreadLoading).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.threadLoading = loading;
    });
    this.store.select(getIsOtherThreadLoaded).takeWhile(() => this.isAlive).subscribe((loaded) => {
      this.threadLoaded = loaded;
    });
    this.store.select(getOtherThreads).takeWhile(() => this.isAlive).subscribe((threads) => {
      this.threads = threads;
      this.afterThreadLoaded('Others');
    });
    this.store.select(getOtherCurrentPage).takeWhile(() => this.isAlive).subscribe((currentPage) => {
      this.currentLoadedPage = currentPage;
    });

    this.store.select(getOtherTotalPage).takeWhile(() => this.isAlive).subscribe((totalPage) => {
      this.totalPage = totalPage;
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
        if (!this.threadLoading && !this.threadLoaded) {
          this.service.getOtherThreads(this.currentLoadedPage + 1).subscribe();
        }
      }
    );
  }

  loadAdmins() {
    this.adminLoading = true;
    this.store.select(getAdmins).takeWhile(() => this.isAlive).subscribe((admins) => {
      this.adminLoading = false;
      this.admins = admins;
    });
  }

  loadMessages() {
    this.store.select((state) => {
      return getIsMessagesLoadingByThreadId(state, this.selectedThreadId);
    }).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.messagesLoading = loading;
    });

    this.store.select((state) => {
      return getIsMessagesLoadedByThreadId(state, this.selectedThreadId);
    }).takeWhile(() => this.isAlive).subscribe((loading) => {
      this.messagesLoaded = loading;
    });

    this.store.select((state) => {
      return getMessagesByThreadId(state, this.selectedThreadId);
    }).takeWhile(() => this.isAlive).subscribe((messages) => {
      this.messages = messages;

    });

    const messagesCombined = Observable.merge(
      this.store.select((state) => {
        return getIsMessagesLoadingByThreadId(state, this.selectedThreadId);
      }),
      this.store.select((state) => {
        return getIsMessagesLoadedByThreadId(state, this.selectedThreadId);
      }),
      this.store.select((state) => {
        return getMessagesByThreadId(state, this.selectedThreadId);
      }),
      ((loading, loaded, threads) => {
      })
    );

    messagesCombined.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (!this.messagesLoading && !this.messagesLoaded) {
          this.service.getMessagesForThread(this.selectedThreadId).subscribe();
        }
      }
    );
  }


  private afterThreadLoaded(title) {

    this.threads = ObjectUtils.sortByKey(this.threads, 'last_message_on', 'desc');
    this.sections = [
      {
        title: title,
        threads: this.threads
      }
    ];


    if (this.threads.map(thread => thread.id).indexOf(this.selectedThreadId) > -1) {
      this.loadMessages();
    }

  }


  alterFavourite() {
    this.favouriteRequestLoading = true;
    this.service.updateThread(this.selectedThread, {is_favourite: !this.selectedThread.is_favourite})
      .subscribe((thread) => {
        this.favouriteRequestLoading = false;
      });
  }

  unreadThread() {
    this.unreadRequestLoading = true;
    this.service.unreadThread(this.selectedThread).subscribe((thread) => {
      this.unreadRequestLoading = false;
    });
  }

  assignAdminToCurrentThread() {
    this.adminUpdating = true;
    this.service.assignToThread(this.selectedThread, this.assignee)
      .subscribe((thread) => {
        this.adminUpdating = false;
      });
  }

  loadMoreClicked() {


    if ((this.currentLoadedPage >= this.totalPage) || this.loadingMoreData) {
      return;
    }
    this.loadingMoreData = true;


    switch (this.filter) {
      case 'unread': {
        this.service.getUnreadThreads(this.currentLoadedPage + 1).subscribe(res => this.loadingMoreData = false);
        break;
      }
      case 'followup': {
        this.service.getFollowupThreads(this.currentLoadedPage + 1).subscribe(res => this.loadingMoreData = false);
        break;
      }
      case 'booked': {
        this.service.getBookedThreads(this.currentLoadedPage + 1).subscribe(res => this.loadingMoreData = false);
        break;
      }
      case 'ongoing': {
        this.service.getOngoingThreads(this.currentLoadedPage + 1).subscribe(res => this.loadingMoreData = false);
        break;
      }
      case 'requests': {
        this.service.getRequestsThreads(this.currentLoadedPage + 1).subscribe(res => this.loadingMoreData = false);
        break;
      }
      case 'archived': {
        this.service.getArchivedThreads(this.currentLoadedPage + 1).subscribe(res => this.loadingMoreData = false);
        break;
      }
      case 'other': {
        this.service.getOtherThreads(this.currentLoadedPage + 1).subscribe(res => this.loadingMoreData = false);
        break;
      }
    }
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
