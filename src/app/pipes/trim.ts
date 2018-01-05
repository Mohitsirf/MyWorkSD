import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'trim'
})
export class TrimPipe implements PipeTransform {
  transform(value: string, limit: number = 30): string {

    if (value){
      return value.length > limit ? value.substring(0, limit): value;
    } else {
      return value;
    }
  }
}
