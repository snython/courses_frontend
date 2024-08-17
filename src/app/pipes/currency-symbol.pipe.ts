import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencySymbol',
  standalone: true
})
export class CurrencySymbolPipe implements PipeTransform {

  constructor(private currencyPipe: CurrencyPipe) {}

  transform(currencyCode: string): string | null {
    // Extract the symbol from the formatted result
    const formatted = this.currencyPipe.transform(0, currencyCode, 'symbol');
    return formatted ? formatted.replace(/[\d\s.,]/g, '').trim() : null;
  }

}
