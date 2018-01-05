import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../models/user';
import {Store} from '@ngrx/store';
import {ActivatedRoute, RouterLinkActive} from '@angular/router';

import {getUser, State, getAppIsMenuHidden, getSidebarSelectedOption} from '../reducers/index';
import {MenuHiddenChangeAction} from '../actions/app';
import {isNullOrUndefined} from 'util';
import {ThreadSidebarUpdateSuccess} from "../actions/message";

@Component({
  selector: 'sd-owner-sidebar',
  template: `
    <div style="min-width:265px;overflow-x: hidden !important;" class="requiredSidebarHeight">
      <mat-sidenav-container [ngStyle]="{'right':menuWidth}"
                             style="height: 100%;overflow-x:hidden!important;min-height:100vh !important;">

        <mat-sidenav #sidenav mode="side" opened="true">

          <!--Admin Home-->
          <!--Admin Access Only-->

          <button class="superMenuButton" mat-button *ngIf="user.is_admin" routerLink="/admin-home"
                  routerLinkActive="superMenuActive" #rlaHome="routerLinkActive">
            <div [ngStyle]="{'visibility': hideMainMenu }">
              <mat-icon id="contentIcon">dashboard</mat-icon>
              <span id="contentInfo">Dashboard</span>
              <span
                id="contentIconRight"><mat-icon *ngIf="!is_hidden" matSuffix>keyboard_arrow_right</mat-icon> </span>
            </div>
            <!--Shrink Menu-->
            <span><mat-icon id="childShrinkIcon" *ngIf="is_hidden" matSuffix>dashboard</mat-icon></span>
          </button>

          <!--Owner's Home-->
          <!--Owner Access Only-->

          <button class="superMenuButton" mat-button *ngIf="user.is_owner" routerLink="/home"
                  routerLinkActive="superMenuActive" #rlaHome="routerLinkActive">
            <div [ngStyle]="{'visibility': hideMainMenu }">
              <mat-icon id="contentIcon">dashboard</mat-icon>
              <span id="contentInfo">Dashboard&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span id="contentIconRight"><mat-icon *ngIf="!is_hidden" matSuffix>keyboard_arrow_right</mat-icon></span>
            </div>
            <!--Shrink Menu-->
            <span><mat-icon id="childShrinkIcon" matSuffix *ngIf="is_hidden">dashboard</mat-icon></span>
          </button>


          <!--Home Owner's Home-->
          <!--HomeOwner Access Only-->
          <button class="superMenuButton" mat-button *ngIf="user.type== 'management' && user.getManagementContact().category=='homeowner'" routerLink="/homeowner-home"
                  routerLinkActive="superMenuActive" #rlaHomeOwner="routerLinkActive">
            <div [ngStyle]="{'visibility': hideMainMenu }">
              <mat-icon id="contentIcon">dashboard</mat-icon>
              <span id="contentInfo">Dashboard&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span
                id="contentIconRight"><mat-icon *ngIf="!is_hidden" matSuffix>keyboard_arrow_right</mat-icon></span>
            </div>
            <!--Shrink Menu-->
            <span><mat-icon id="childShrinkIcon" *ngIf="is_hidden" matSuffix>schedule</mat-icon></span>
          </button>

          <!--Inbox-->
          <!--Admin Access Only-->

          <button class="superMenuButton" mat-button *ngIf="user.is_admin" routerLink="/inbox"
                  routerLinkActive="superMenuActive" #rlaInbox="routerLinkActive">
            <div [ngStyle]="{'visibility': hideMainMenu }">
              <span id="contentIcon">
                <mat-icon>forum</mat-icon>
              </span>
              <span id="contentInfo">Inbox</span>
              <span id="contentIconRight">
                <mat-icon *ngIf="!showInboxMenu()" matSuffix>keyboard_arrow_right</mat-icon>
                <mat-icon *ngIf="showInboxMenu()" matSuffix>keyboard_arrow_down</mat-icon>            
              </span>
            </div>

            <!--Shrink Menu-->
            <span><mat-icon id="childShrinkIcon" matSuffix *ngIf="is_hidden">forum</mat-icon></span>
          </button>

          <!--Leads-->
          <button class="superMenuButton" mat-button *ngIf="user.is_admin" routerLink="/leads"
                  routerLinkActive="superMenuActive" #rlaLeads="routerLinkActive">
            <div [ngStyle]="{'visibility': hideMainMenu }">
              <span id="contentIcon">
                              <mat-icon>widgets</mat-icon>
              </span>
              <span id="contentInfo">Leads</span>
              <span id="contentIconRight">
                <mat-icon *ngIf="!this.showLeadsMenu()" matSuffix>keyboard_arrow_right</mat-icon>
                <mat-icon *ngIf="this.showLeadsMenu()" matSuffix>keyboard_arrow_down</mat-icon>
              </span>
            </div>
            <!--Shrink Menu-->
            <span><mat-icon id="childShrinkIcon" *ngIf="is_hidden" matSuffix>widgets</mat-icon></span>
          </button>


          <!--Listings-->
          <!--Both Access-->

          <button class="superMenuButton" mat-button routerLink="/listings" routerLinkActive="superMenuActive"
                  #rlaListings="routerLinkActive">
            <div [ngStyle]="{'visibility': hideMainMenu }">
              <mat-icon id="contentIcon">view_list</mat-icon>
              <span id="contentInfo">Listings</span>
              <span
                id="contentIconRight"><mat-icon *ngIf="!rlaListings.isActive" matSuffix>keyboard_arrow_right</mat-icon>
            <mat-icon *ngIf="rlaListings.isActive" matSuffix>keyboard_arrow_down</mat-icon></span>
            </div>
            <!--Shrink Menu-->
            <span><mat-icon id="childShrinkIcon" *ngIf="is_hidden" matSuffix>view_list</mat-icon></span>
          </button>

          <!--Reservations-->
          <!--Admin Access Only-->
          <button class="superMenuButton" mat-button *ngIf="user.is_admin" routerLink="/reservations"
                  routerLinkActive="superMenuActive" #rlaReservations="routerLinkActive">
            <div [ngStyle]="{'visibility': hideMainMenu }">
              <mat-icon id="contentIcon">schedule</mat-icon>
              <span id="contentInfo">Reservations</span>
              <span
                id="contentIconRight"><mat-icon *ngIf="!is_hidden" matSuffix>keyboard_arrow_right</mat-icon></span>
            </div>
            <!--Shrink Menu-->
            <span><mat-icon id="childShrinkIcon" *ngIf="is_hidden" matSuffix>schedule</mat-icon></span>
          </button>

          <!--Multi-Calendar-->
          <!--Admin Access Only-->
          <button class="superMenuButton" mat-button *ngIf="user.is_admin" routerLink="/multi-calendar"
                  routerLinkActive="superMenuActive" #rlaCalendar="routerLinkActive">
            <div [ngStyle]="{'visibility': hideMainMenu }">
              <mat-icon id="contentIcon">date_range</mat-icon>
              <span id="contentInfo">Multi-Calendar</span>
              <span
                id="contentIconRight"><mat-icon *ngIf="!is_hidden" matSuffix>keyboard_arrow_right</mat-icon></span>
            </div>
            <!--Shrink Menu-->
            <span><mat-icon id="childShrinkIcon" *ngIf="is_hidden" matSuffix>date_range</mat-icon></span>
          </button>

          <!--Tasks-->
          <!--Admin Access Only-->

          <button class="superMenuButton" mat-button *ngIf="user.is_admin" routerLink="/tasks"
                  routerLinkActive="superMenuActive" #rlaTasks="routerLinkActive">
            <div [ngStyle]="{'visibility': hideMainMenu }">
              <mat-icon id="contentIcon">assignment</mat-icon>
              <span id="contentInfo">Tasks</span>
              <span
                id="contentIconRight"><mat-icon *ngIf="!is_hidden" matSuffix>keyboard_arrow_right</mat-icon></span>
            </div>
            <!--Shrink Menu-->
            <span><mat-icon id="childShrinkIcon" *ngIf="is_hidden" matSuffix>assignment</mat-icon></span>
          </button>

          <!--Contacts-->
          <!--Admin Access Only-->

          <button class="superMenuButton" mat-button *ngIf="user.is_admin" routerLink="/contacts/active"
                  routerLinkActive="superMenuActive" #rlaContacts="routerLinkActive">
            <div [ngStyle]="{'visibility': hideMainMenu }">
              <mat-icon id="contentIcon">account_circle</mat-icon>
              <span id="contentInfo">Contacts</span>
              <span id="contentIconRight">
                <mat-icon *ngIf="!this.showContactsMenu()" matSuffix>keyboard_arrow_right</mat-icon>
                <mat-icon *ngIf="this.showContactsMenu()" matSuffix>keyboard_arrow_down</mat-icon>
              </span>
            </div>
            <!--Shrink Menu-->
            <span><mat-icon id="childShrinkIcon" *ngIf="is_hidden" matSuffix>account_circle</mat-icon></span>
          </button>

          <!--Settings-->
          <!--Admin Access Only-->

          <button class="superMenuButton" mat-button *ngIf="user.is_admin" routerLink="/settings"
                  routerLinkActive="superMenuActive" #rlaSettings="routerLinkActive">
            <div [ngStyle]="{'visibility': hideMainMenu }">
              <mat-icon id="contentIcon">build</mat-icon>
              <span id="contentInfo">Settings</span>
              <span
                id="contentIconRight"><mat-icon *ngIf="!rlaSettings.isActive" matSuffix>keyboard_arrow_right</mat-icon>
            <mat-icon *ngIf="rlaSettings.isActive" matSuffix>keyboard_arrow_down</mat-icon> </span>
            </div>
            <!--Shrink Menu-->
            <span><mat-icon id="childShrinkIcon" *ngIf="is_hidden" matSuffix>build</mat-icon></span>
          </button>


          <!--Leads Child Menu-->
          <div *ngIf="this.showLeadsMenu()" style="background-color: #D2D2D2;">
            <mat-button-toggle-group style="width:100%" [vertical]="true">
              <mat-button-toggle [routerLink]="'/leads/prospects'" routerLinkActive #rlaProspects="routerLinkActive"
                                 [checked]="rlaProspects.isActive">
                <mat-icon id="contentChildIcon">event</mat-icon>
                <span id="childContentInfo">Prospects</span>
                <mat-icon *ngIf="is_hidden" id="childShrinkIcon">event</mat-icon>
              </mat-button-toggle>
              <mat-button-toggle [routerLink]="'/leads/quotes'" routerLinkActive #rlaQuotes="routerLinkActive"
                                 [checked]="rlaQuotes.isActive">
                <mat-icon id="contentChildIcon"> note</mat-icon>
                <span id="childContentInfo">Quotes</span>
                <mat-icon *ngIf="is_hidden" id="childShrinkIcon">note</mat-icon>
              </mat-button-toggle>
            </mat-button-toggle-group>
          </div>

          <!--Contacts Child Menu-->
          <div *ngIf="this.showContactsMenu()" style="background-color: #D2D2D2;">
            <mat-button-toggle-group style="width:100%" [vertical]="true">
              <mat-button-toggle [routerLink]="'/contacts/active'" routerLinkActive #rlaActiveContacts="routerLinkActive"
                                 [checked]="rlaActiveContacts.isActive">
                <mat-icon id="contentChildIcon">group</mat-icon>
                <span id="childContentInfo">Active</span>
                <mat-icon *ngIf="is_hidden" id="childShrinkIcon">event</mat-icon>
              </mat-button-toggle>
              <mat-button-toggle [routerLink]="'/contacts/inactive'" routerLinkActive #rlaInActiveContacts="routerLinkActive"
                                 [checked]="rlaInActiveContacts.isActive">
                <mat-icon id="contentChildIcon">highlight_off</mat-icon>
                <span id="childContentInfo">InActive</span>
                <mat-icon *ngIf="is_hidden" id="childShrinkIcon">note</mat-icon>
              </mat-button-toggle>
            </mat-button-toggle-group>
          </div>


          <!--Setting Child Menu-->
          <div style="background-color: #D2D2D2;" *ngIf="showSettingsMenu()">

            <mat-button-toggle-group style="width:100%" [vertical]="true">
              <mat-button-toggle routerLink="/settings/tools" routerLinkActive #rlaSettingsTools="routerLinkActive"
                                 [checked]="rlaSettingsTools.isActive">
                <mat-icon id="contentChildIcon">build</mat-icon>
                <span id="childContentInfo">Tools</span>
                <mat-icon *ngIf="is_hidden" id="childShrinkIcon">build</mat-icon>
              </mat-button-toggle>
              <mat-button-toggle routerLink="/settings/integrations" routerLinkActive #rlaSettingsIn="routerLinkActive"
                                 [checked]="rlaSettingsIn.isActive">
                <mat-icon id="contentChildIcon">library_add</mat-icon>
                <span id="childContentInfo">
                <span style="color: #413f40 !important; font-family: 'Montserrat', sans-serif !important;"
                      *ngIf="!is_hidden">Integrations</span></span>
                <mat-icon *ngIf="is_hidden" id="childShrinkIcon">library_add</mat-icon>
              </mat-button-toggle>
              <mat-button-toggle routerLink="/settings/channels" routerLinkActive #rlaSettingsCh="routerLinkActive"
                                 [checked]="rlaSettingsCh.isActive">
                <mat-icon id="contentChildIcon">theaters</mat-icon>
                <span id="childContentInfo">Channels</span>
                <mat-icon *ngIf="is_hidden" id="childShrinkIcon">theaters</mat-icon>
              </mat-button-toggle>
              <mat-button-toggle routerLink="/settings/clients" routerLinkActive #rlaSettingsCl="routerLinkActive"
                                 [checked]="rlaSettingsCl.isActive">
                <mat-icon id="contentChildIcon">group</mat-icon>
                <span id="childContentInfo">Clients</span>
                <mat-icon *ngIf="is_hidden" id="childShrinkIcon">group</mat-icon>
              </mat-button-toggle>
            </mat-button-toggle-group>
          </div>

          <!--Lisitngs Child Menu-->
          <div style="background-color: #D2D2D2;" *ngIf="rlaListings.isActive">
            <mat-button-toggle-group style="width:100%" [vertical]="true">
              <mat-button-toggle [routerLink]="'/listings/all'" routerLinkActive #rlaListingsA="routerLinkActive"
                                 [checked]="rlaListingsA.isActive">
                <mat-icon id="contentChildIcon">format_align_left</mat-icon>
                <span id="childContentInfo">All</span>
                <mat-icon *ngIf="is_hidden" id="childShrinkIcon">format_align_left</mat-icon>
              </mat-button-toggle>
              <mat-button-toggle [routerLink]="'/listings/drafts'" routerLinkActive #rlaListingsD="routerLinkActive"
                                 [checked]="rlaListingsD.isActive">
                <mat-icon id="contentChildIcon">speaker_notes</mat-icon>
                <span id="childContentInfo">Drafts</span>
                <mat-icon *ngIf="is_hidden" id="childShrinkIcon">speaker_notes</mat-icon>
              </mat-button-toggle>
              <mat-button-toggle [routerLink]="'/listings/waiting'" routerLinkActive #rlaListingsW="routerLinkActive"
                                 [checked]="rlaListingsW.isActive">
                <mat-icon id="contentChildIcon">update</mat-icon>
                <span id="childContentInfo">Waiting</span>
                <mat-icon *ngIf="is_hidden" id="childShrinkIcon">update</mat-icon>
              </mat-button-toggle>
              <mat-button-toggle [routerLink]="'/listings/approved'" routerLinkActive #rlaListingsAP="routerLinkActive"
                                 [checked]="rlaListingsAP.isActive">
                <mat-icon id="contentChildIcon">done_all</mat-icon>
                <span id="childContentInfo">Approved</span>
                <mat-icon *ngIf="is_hidden" id="childShrinkIcon">done_all</mat-icon>
              </mat-button-toggle>
              <mat-button-toggle [routerLink]="'/listings/rejected'" routerLinkActive #rlaListingsR="routerLinkActive"
                                 [checked]="rlaListingsR.isActive">
                <mat-icon id="contentChildIcon">error_outline</mat-icon>
                <span id="childContentInfo">Rejected</span>
                <mat-icon *ngIf="is_hidden" id="childShrinkIcon">error_outline</mat-icon>
              </mat-button-toggle>
            </mat-button-toggle-group>
          </div>


          <!--Inbox Child Menu-->
          <div style="background-color: #D2D2D2;" *ngIf="showInboxMenu()">
            <mat-button-toggle-group style=" width:100%" [vertical]="true">
              <mat-button-toggle [routerLink]="'/inbox/unread'" routerLinkActive #rlaInboxUnread="routerLinkActive"
                                 [checked]="rlaInboxUnread.isActive">
                <mat-icon id="contentChildIcon">markunread</mat-icon>
                <span id="childContentInfo">Unread</span>
                <mat-icon *ngIf="is_hidden" id="childShrinkIcon">markunread</mat-icon>
              </mat-button-toggle>
              <mat-button-toggle [routerLink]="'/inbox/follow-up'" routerLinkActive #rlaInboxFollowup="routerLinkActive"
                                 [checked]="rlaInboxFollowup.isActive">
                <mat-icon id="contentChildIcon">low_priority</mat-icon>
                <span id="childContentInfo">Follow-Up</span>
                <mat-icon *ngIf="is_hidden" id="childShrinkIcon">low_priority</mat-icon>
              </mat-button-toggle>
              <mat-button-toggle [routerLink]="'/inbox/booked'" routerLinkActive #rlaInboxBooked="routerLinkActive"
                                 [checked]="rlaInboxBooked.isActive">
                <mat-icon id="contentChildIcon">query_builder</mat-icon>
                <span id="childContentInfo">Booked</span>
                <mat-icon *ngIf="is_hidden" id="childShrinkIcon">query_builder</mat-icon>
              </mat-button-toggle>
              <mat-button-toggle [routerLink]="'/inbox/ongoing'" routerLinkActive #rlaInboxOngoing="routerLinkActive"
                                 [checked]="rlaInboxOngoing.isActive">
                <mat-icon id="contentChildIcon">alarm</mat-icon>
                <span id="childContentInfo">Ongoing</span>
                <mat-icon *ngIf="is_hidden" id="childShrinkIcon">alarm</mat-icon>
              </mat-button-toggle>
              <mat-button-toggle [routerLink]="'/inbox/requests'" routerLinkActive #rlaInboxRequests="routerLinkActive"
                                 [checked]="rlaInboxRequests.isActive">
                <mat-icon id="contentChildIcon">call_received</mat-icon>
                <span id="childContentInfo">Requests</span>
                <mat-icon *ngIf="is_hidden" id="childShrinkIcon">call_received</mat-icon>
              </mat-button-toggle>
              <mat-button-toggle [routerLink]="'/inbox/archived'" routerLinkActive #rlaInboxArchived="routerLinkActive"
                                 [checked]="rlaInboxArchived.isActive">
                <mat-icon id="contentChildIcon">archive</mat-icon>
                <span id="childContentInfo">Archived</span>
                <mat-icon *ngIf="is_hidden" id="childShrinkIcon">archive</mat-icon>
              </mat-button-toggle>
              <mat-button-toggle [routerLink]="'/inbox/other'" routerLinkActive #rlaInboxOther="routerLinkActive"
                                 [checked]="rlaInboxOther.isActive">
                <mat-icon id="contentChildIcon">drafts</mat-icon>
                <span id="childContentInfo">Other</span>
                <mat-icon *ngIf="is_hidden" id="childShrinkIcon">archive</mat-icon>
              </mat-button-toggle>
            </mat-button-toggle-group>
          </div>

          <div class="sidebarAutoScroll"></div>
          <!--should always be above </mat-sidenav> -->
        </mat-sidenav>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`

    :host {
      top: 0px;
      position: fixed !important;
    }

    #mat-button-toggle-1 > label > div > div {
      color: #CFC6A4 !important;
    }

    .sidebarAutoScroll {
      padding-bottom: 80px;
    }

    span {
      color: #ffffff !important;
      letter-spacing: 1.5px !important;
      font-weight: 600 !important;
      font-family: 'Montserrat', sans-serif !important;
    }

    #contentIcon {
      color: #ffffff;
      margin-top: 2%;
      margin-left: 5%;
      position: absolute !important;
    }

    #contentIconRight {
      margin-top: 2.5%;
      right: 5%;
      position: absolute !important;
    }

    #contentInfo {
      padding-left: 26%;
    }

    #contentChildIcon {
      margin-top: 2%;
      margin-left: 8%;
      position: absolute !important;
    }

    #childContentInfo {
      margin-left: 28%;
      color: #413f40 !important;
      font-family: 'Montserrat', sans-serif !important;
    }

    .superMenuActive {
      background-color: #1e507b;
    }


    .menuActive {
      background-color: #ffff00;
    }
    
    #childShrinkIcon {
      /*color: #ffffff;*/
      position: absolute;
      top: 30%;
      right: 7.5%;
    }

    .superMenuButton {
      width: 100% !important;
      text-align: left !important;
      font-size: 16px !important;
      padding: 8px !important;
    }

    .superMenuButton:hover {
      background-color: #1e507b !important;
    }

  `]
})
export class OwnerSidebarComponent implements OnInit,OnDestroy {

  user: User;
  is_hidden: boolean;
  hideMainMenu: string;
  menuWidth: string;
  option:string;
  isAlive = true;

  constructor(private store: Store<State>, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    // let isHidden = String(localStorage.getItem('side_collapsed'));
    //
    // if (isNullOrUndefined(isHidden)) {
    //   isHidden = 'false';
    // }
    //
    // if (isHidden === 'true') {
    //   this.store.dispatch(new MenuHiddenChangeAction());
    // }

    this.store.select(getUser).subscribe((user) => {
      this.user = user;
    });
    this.store.select(getAppIsMenuHidden).subscribe((value) => {
      if (value) {
        this.hideMainMenu = 'hidden';
        this.is_hidden = true;
        this.menuWidth = '75%';
      } else {
        this.hideMainMenu = 'visible';
        this.is_hidden = false;
        this.menuWidth = '0%';
      }
    });

    this.store.select(getSidebarSelectedOption).takeWhile(() => this.isAlive).subscribe((option) => {
      this.option = option;
      console.log(this.option);
    });

    this.activatedRoute.url.takeWhile(() => this.isAlive).subscribe(url => {
      if(!isNullOrUndefined(url[0]) && url[0].path != 'inbox'){
        this.store.dispatch(new ThreadSidebarUpdateSuccess(null))
      }
    });

  }

  showInboxMenu() {
    return this.activatedRoute.snapshot.toString().includes('inbox');
  }

  showSettingsMenu() {
    return this.activatedRoute.snapshot.toString().includes('settings');
  }

  showLeadsMenu() {
    return this.activatedRoute.snapshot.toString().includes('leads');
  }

  showContactsMenu() {
    return this.activatedRoute.snapshot.toString().includes('contacts');
  }

  ngOnDestroy(): void {
    this.isAlive  =false;
  }

}
