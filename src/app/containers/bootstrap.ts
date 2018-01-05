import {Component, OnDestroy, OnInit} from '@angular/core';
import {StayDuvetService} from '../services/stayduvet';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {
  getAdmins, getAppLandingUrl, getIsAdminLoaded, getIsListingsLoaded, getUser, isLoggedIn,
  State
} from '../reducers';
import {AppBootstrapSuccessAction} from '../actions/index';
import {Subscription} from 'rxjs/Subscription';
import {User} from '../models/user';

@Component({
  selector: 'sd-bootstrap',
  template: `
    <sd-error *ngIf="failedLoading">Unable to load data</sd-error>
    <sd-center-spinner *ngIf="!failedLoading"></sd-center-spinner>
  `,
  styles: [`
    .page-container {
      position: absolute;
      height: 100%;
      width: 100%;
    }
  `]
})
export class BootstrapComponent implements OnInit, OnDestroy {
  failedLoading = false;
  private isAlive: boolean = true;

  isListingsLoaded: boolean;
  isUserLoaded: boolean;
  isAdminsLoaded: boolean;
  user: User;

  constructor(private service: StayDuvetService,
              private router: Router,
              private store: Store<State>) {
  }

  ngOnInit() {
    console.log('bootstrap component init');
    this.loadBootstrapData();
  }

  private loadBootstrapData() {
    this.service.me().takeWhile(() => this.isAlive).subscribe();
    this.service.getListings().takeWhile(() => this.isAlive).subscribe();
    this.service.getAdmins().takeWhile(() => this.isAlive).subscribe();

    this.store.select(isLoggedIn).takeWhile(() => this.isAlive).subscribe((loggedIn) => {
      this.isUserLoaded = loggedIn;
    });

    this.store.select(getUser).takeWhile(() => this.isAlive).subscribe((user) => {
      this.user = user;
    });

    this.store.select(getIsListingsLoaded).takeWhile(() => this.isAlive).subscribe((listingsLoaded) => {
      this.isListingsLoaded = listingsLoaded;
    });

    this.store.select(getIsAdminLoaded).takeWhile(() => this.isAlive).subscribe((adminsLoaded) => {
      this.isAdminsLoaded = adminsLoaded;
    });

    const bootstrap = Observable.merge(
      this.store.select(isLoggedIn),
      this.store.select(getIsListingsLoaded),
      this.store.select(getIsAdminLoaded),
      (loggedIn, listingsLoaded, adminsLoaded) => ({})
    );

    bootstrap.takeWhile(() => this.isAlive).subscribe(
      (data) => {
        if (this.isListingsLoaded && this.isUserLoaded && this.isAdminsLoaded) {
          return this.store.select(getAppLandingUrl).takeWhile(() => this.isAlive).subscribe((value) => {
            this.store.dispatch(new AppBootstrapSuccessAction());

            this.router.navigate([value]);
          });
        }
      }
    );

  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

}
