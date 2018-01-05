import {Pipe, PipeTransform} from '@angular/core';
/**
 * Created by piyushkantm on 28/08/17.
 */

@Pipe({
  name: 'roundOff'
})
export class RoundOffPipe implements PipeTransform {
  transform (input:number) {
    return Math.floor(input);
  }
}
