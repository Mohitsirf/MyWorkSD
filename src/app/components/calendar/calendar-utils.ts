/**
 * Created by Piyush on 23-Jul-17.
 */
import * as startOfDay from 'date-fns/start_of_day';
import * as isSameDay from 'date-fns/is_same_day';
import * as getDay from 'date-fns/get_day';
import * as startOfWeek from 'date-fns/start_of_week';
import * as addDays from 'date-fns/add_days';
import * as endOfDay from 'date-fns/end_of_day';
import * as addMinutes from 'date-fns/add_minutes';
import * as differenceInDays from 'date-fns/difference_in_days';
import * as endOfWeek from 'date-fns/end_of_week';
import * as differenceInSeconds from 'date-fns/difference_in_seconds';
import * as startOfMonth from 'date-fns/start_of_month';
import * as endOfMonth from 'date-fns/end_of_month';
import * as isSameMonth from 'date-fns/is_same_month';
import * as isSameSecond from 'date-fns/is_same_second';
import * as setHours from 'date-fns/set_hours';
import * as setMinutes from 'date-fns/set_minutes';
import * as startOfMinute from 'date-fns/start_of_minute';
import * as differenceInMinutes from 'date-fns/difference_in_minutes';
import * as addHours from 'date-fns/add_hours';
import * as addSeconds from 'date-fns/add_seconds';
import * as max from 'date-fns/max';
import {addMonths} from "date-fns";
import * as moment from "moment";


export enum DAYS_OF_WEEK {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6
}

export const DEFAULT_WEEKEND_DAYS: number[] = [DAYS_OF_WEEK.SUNDAY, DAYS_OF_WEEK.SATURDAY];
export const DAYS_IN_WEEK = 7;
export const HOURS_IN_DAY = 24;
export const MINUTES_IN_HOUR = 60;
export const SECONDS_IN_DAY: number = 60 * MINUTES_IN_HOUR * HOURS_IN_DAY;
export const SECONDS_IN_WEEK: number = SECONDS_IN_DAY * DAYS_IN_WEEK;

export class SDDay {
  date: Date;
  inMonth: boolean;
  isPast: boolean;
  isToday: boolean;
  isFuture: boolean;
  isWeekend: boolean;
  cssClass?: string;
}

export function getFirstDayOfMonth(): SDDay {
  return getSDDay({date: getDateObj(), weekendDays: DEFAULT_WEEKEND_DAYS, currentMonth: getDateObj()});
}

export function addMonthToSDDate(date: SDDay, months: number): SDDay {
  let newDate = addMonths(date.date, months);
  return getSDDay({date: newDate, weekendDays: DEFAULT_WEEKEND_DAYS, currentMonth: getDateObj()});
}

export function getSDDayObject(date: number) {
  const dateObj = new Date(date);
  return getSDDay({date: dateObj, weekendDays: DEFAULT_WEEKEND_DAYS, currentMonth: getDateObj()});
}

function getSDDay({date, weekendDays = DEFAULT_WEEKEND_DAYS, currentMonth = getDateObj()}: { date: Date, weekendDays: number[], currentMonth: Date }): SDDay {
  const today: Date = startOfDay(getDateObj());
  return {
    date,
    inMonth: isSameMonth(date, currentMonth),
    isPast: date < today,
    isToday: isSameDay(date, today),
    isFuture: date > today,
    isWeekend: weekendDays.indexOf(getDay(date)) > -1
  };
}

export function getMonthCalendar(start: SDDay): SDDay[] {
  const startDay = startOfMonth(start.date);
  const endDay = endOfMonth(start.date);

  const firstDay = startOfWeek(startDay);
  const lastDay = endOfWeek(endDay);

  const dates = [];
  let date = firstDay;

  while (date <= lastDay) {
    dates.push(getSDDay({date: date, weekendDays: DEFAULT_WEEKEND_DAYS, currentMonth: startDay}));
    date = addDays(date, 1);
  }

  return dates;
}

export interface GetWeekViewHeaderArgs {
  viewDate: Date;
  weekStartsOn: number;
  excluded?: number[];
  weekendDays?: number[];
}

export function getWeekViewHeader(): SDDay[] {
  const start: Date = startOfWeek(getDateObj(), {weekStartsOn: DAYS_OF_WEEK.SUNDAY});
  const days: SDDay[] = [];

  for (let i = 0; i < DAYS_IN_WEEK; i++) {
    const date: Date = addDays(start, i);
    days.push(getSDDay({date, weekendDays: DEFAULT_WEEKEND_DAYS, currentMonth: getDateObj()}));
  }

  return days;
}

export function getDateObj(date: string = '') {
  if (date == '') {
    return moment().toDate();
  }
  return moment(date).toDate();
}

export function dateToDateString(date: Date): string {
  const fullDate = ('0' + date.getDate()).slice(-2);
  const fullMonth = ('0' + (date.getMonth() + 1)).slice(-2);
  const fullYear = date.getFullYear();
  return fullYear + '-' + fullMonth + '-' + fullDate;
}
