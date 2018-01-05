import {AbstractControl} from '@angular/forms';

export default class FormUtils {

  static markAllAsTouched(control: AbstractControl): void {

    control.markAsTouched();

    if (control.hasOwnProperty('controls')) {
      const childControls = (<any>control).controls;
      for (const key of Object.keys(childControls)) {
        FormUtils.markAllAsTouched(childControls[key]);
      }
    }
  }
}
