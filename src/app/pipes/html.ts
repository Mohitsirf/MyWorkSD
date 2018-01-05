import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'html'
})
export class HTMLPipe implements PipeTransform {
  transform(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/>/g, '&gt;')
      .replace(/</g, '&lt;');
  }
}
