import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the HighlightSearchPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'highlightSearch',
})
export class HighlightSearchPipe implements PipeTransform {
  /**
   * Highlight the value if found within a string.
   */
  transform(value: string, arg: string) {
    if (value && arg) {
      let re = new RegExp(arg, 'gi');
      return value.replace(re, `<mark>${arg}</mark>`);
    }
    return value;
  }
}
