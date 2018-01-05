export default class DateUtils {

  static daysBetweenDates(dateA: Date, dateB: Date): number {
    const one = new Date(dateA.getFullYear(), dateA.getMonth(), dateA.getDate());
    const two = new Date(dateB.getFullYear(), dateB.getMonth(), dateB.getDate());

    return (two.getTime() - one.getTime()) / 86400000;
  }

  // add days to passed date. Except negative numbers as well.
  static addDays(date: Date, days: number): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
  }

  static daysInMonth(month: number, year: number): number {
    return new Date(year, month, 0).getDate();
  }

  static toISODateString(date: Date): string {
    const fullDate = ('0' + date.getDate()).slice(-2);
    const fullMonth = ('0' + (date.getMonth() + 1)).slice(-2);
    const fullYear = date.getFullYear();

    return fullYear + '-' + fullMonth + '-' + fullDate;
  }
}
