import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'newline'
})
export class NewLinePipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/\n/g, '<br/>');
  }
}
