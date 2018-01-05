/**
 * Created by divyanshu on 14/09/17.
 */
import {Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from '@angular/common';
import {getDateObj} from "../components/calendar/calendar-utils";

@Pipe({
  name: 'dateFormatting'
})
export class DateFormattingPipe implements PipeTransform {

  constructor(private datePipe: DatePipe){
  }

  transform(value: Date): any {
    const today = getDateObj();
    const dateTime = value
    if (dateTime.toDateString() === today.toDateString()) {
      return this.datePipe.transform(dateTime , 'shortTime') ;
    } else {
      return this.datePipe.transform(dateTime , 'dd-MMM');
    }
  }
}
