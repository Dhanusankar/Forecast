import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {
  transform(value: Date | string, format: string = 'short'): string {
    const date = typeof value === 'string' ? new Date(value) : value;

    switch (format) {
      case 'short':
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      case 'long':
        return date.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
      case 'time':
        return date.toLocaleTimeString('en-US');
      case 'datetime':
        return date.toLocaleString('en-US');
      default:
        return date.toLocaleDateString('en-US');
    }
  }
}
