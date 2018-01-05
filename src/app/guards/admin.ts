import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {getUser, State} from '../reducers/index';
import {Observable} from 'rxjs/Observable';
import {MatDialog, MatDialogRef} from '@angular/material';
import {GenericConfirmationPopupComponent} from '../components/elements/confirmation-popup';

@Injectable()
export class AdminGuard implements CanActivate {

  private dialogRef: MatDialogRef<any>;

  constructor(private store: Store<State>,
              private dialog: MatDialog,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean | Observable<boolean> {
    const observables = Observable.combineLatest(
      this.store.select(getUser),
      (user) => {
        return {
          user: user
        };
      }
    );

    return observables.map((data) => {

      if (!data.user.is_admin) {
        this.dialogRef = this.dialog.open(GenericConfirmationPopupComponent);
        const instance = this.dialogRef.componentInstance;
        instance.title = 'No Access';
        instance.description = 'You do not have access to this page. You will be redirected to Home page. please click on OK Button.';
        instance.showCloseButton = false;
        instance.showNoButton = false;
        instance.yesButtonText = 'OK';
        instance.yesButtonClicked.subscribe(() => {
          instance.isLoading = true;
          this.router.navigate(['/home']);
          this.dialog.closeAll();
        });
        this.dialogRef.updateSize('100%');
      }

      return data.user.is_admin;
    });
  }
}
