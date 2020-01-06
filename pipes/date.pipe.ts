import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 |  exponentialStrength:10}}
 *   formats to: 1024
*/
@Pipe({ name: 'date' })

export class DatePipe implements PipeTransform {

  transform(value: any, str: any): any {
    // return moment(value).format(str);
    if (value == null) {
      return "时间出错";
    }
    return value.substring(0, 4) + "." + value.substring(5, 7) + "." + value.substring(8, 10);
  }
}
