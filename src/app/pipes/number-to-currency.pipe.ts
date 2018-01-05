import {Pipe, PipeTransform} from '@angular/core';
import {isNullOrUndefined} from "util";
/**
 * Created by piyushkantm on 28/06/17.
 */

@Pipe({
  name: 'numberToCurrency'
})
export class NumberToCurrencyPipe implements PipeTransform {

  transform(value: number ,
            currencySign: string = '$',
            decimalLength: number = 0,
            chunkDelimiter: string = ',',
            decimalDelimiter: string = '',
            chunkLength: number = 3): string {

    const regex = '\\d(?=(\\d{' + chunkLength + '})+' + (decimalLength > 0 ? '\\D' : '$') + ')';
    let num='';
    if(!isNullOrUndefined(value)){
       num = value.toFixed(Math.max(0, Math.floor(decimalLength)));
    }


    return currencySign +
      (decimalDelimiter ? num.replace('.', decimalDelimiter) : num)
        .replace(new RegExp(regex, 'g'), '$&' + chunkDelimiter);
  }
}
