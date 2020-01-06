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
@Pipe({ name: 'currency' })

export class CurrencyPipe implements PipeTransform {

  transform(value: any, num: any, nostr: any): any {

    if (value === undefined) {
      return "抱歉,价格出错";
    }
    num = num === undefined ? 2 : num;
    value = parseFloat(value);
    let str = nostr ? "" : "¥";
    let negative;
    if (value < 0) {
      negative = true
      value = value * (-1);
    }

    let text = str + value.toFixed(num);
    if (negative) {
      text = "-" + text;
    }
    return text;
  }
}
