import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateDifference',
  standalone: true
})
export class DateDifferencePipe implements PipeTransform {

  transform(startDate: Date | string, endDate: Date | string, unit: 'days' | 'months' | 'years' = 'days'): string {
    if (!startDate || !endDate) return '';

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const diffTime = Math.abs(end.getTime() - start.getTime());
    let diff;

    switch (unit) {
      case 'days':
        diff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        break;
      case 'months':
        diff = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();
        break;
      case 'years':
        diff = end.getFullYear() - start.getFullYear();
        break;
      default:
        diff = 0;
    }

    return `${diff}`;
  }

}
