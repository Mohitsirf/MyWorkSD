/**
 * Created by divyanshu on 14/09/17.
 */

import {Pipe, PipeTransform} from '@angular/core';
import {getDateObj} from "../components/calendar/calendar-utils";

@Pipe({
  name: 'utcToLocalTime'
})
export class UTCtoLocalTimeZonePipe implements PipeTransform {
  transform(value: string): Date {
    const dateUtc = getDateObj(value);

    return new Date(Date.UTC(
      dateUtc.getFullYear(),
      dateUtc.getMonth(),
      dateUtc.getDate(),
      dateUtc.getHours(),
      dateUtc.getMinutes(),
      dateUtc.getSeconds())
    );
  }
}
