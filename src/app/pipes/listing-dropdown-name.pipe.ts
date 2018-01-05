/**
 * Created by piyushkantm on 19/06/17.
 */
import { Pipe, PipeTransform } from '@angular/core';
import {Listing} from '../models/listing';

@Pipe({
  name: 'listingDropdown'
})
export class ListingDropDownPipe implements PipeTransform {

  transform(value: Listing): any {
    if (value == null) {
      return 'Select a property';
    }

    return 'Listing: ' + value.title;
  }
}
