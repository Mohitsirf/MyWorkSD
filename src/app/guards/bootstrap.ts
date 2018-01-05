import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot} from '@angular/router';
import {StayDuvetService} from '../services/stayduvet';
import {Store} from '@ngrx/store';
import {getUserState, isLoggedIn, State, getAppLandingUrl, getAppIsBootstrapped} from '../reducers/index';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class BootstrapGuard implements CanActivate {

  constructor(private router: Router,
              private service: StayDuvetService,
              private store: Store<State>) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean | Observable<boolean> {

    if (!StayDuvetService.hasLoginToken()) {
      this.router.navigate(['/login']);
      return false;
    }

    const observables = Observable.combineLatest(
      this.store.select(isLoggedIn),
      this.store.select(getAppIsBootstrapped),
      (isLoggedIn, isBootstrapped) => {
        return {
          isLoggedIn: isLoggedIn,
          isBootstrapped: isBootstrapped
        };
      }
    );

    return observables.map((data) => {
      if (data.isLoggedIn && data.isBootstrapped) {
        this.store.select(getAppLandingUrl).take(1).subscribe((value) => {
          this.router.navigate([value]);
        });
      }

      return !data.isBootstrapped;
    });
  }
}
