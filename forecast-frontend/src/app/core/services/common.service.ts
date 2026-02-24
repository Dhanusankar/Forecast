import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: any;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  groupBy<T>(array: T[], key: keyof T): { [key: string]: T[] } {
    return array.reduce((result, item) => {
      const group = String(item[key]);
      if (!result[group]) {
        result[group] = [];
      }
      result[group].push(item);
      return result;
    }, {} as { [key: string]: T[] });
  }

  sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
    return [...array].sort((a, b) => {
      if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  filterBy<T>(array: T[], key: keyof T, value: any): T[] {
    return array.filter(item => item[key] === value);
  }

  sumBy<T>(array: T[], key: keyof T): number {
    return array.reduce((sum, item) => {
      const val = item[key];
      return sum + (typeof val === 'number' ? val : 0);
    }, 0);
  }

  averageBy<T>(array: T[], key: keyof T): number {
    if (array.length === 0) return 0;
    return this.sumBy(array, key) / array.length;
  }

  maxBy<T>(array: T[], key: keyof T): T | null {
    if (array.length === 0) return null;
    return array.reduce((max, item) => (item[key] > max[key] ? item : max));
  }

  minBy<T>(array: T[], key: keyof T): T | null {
    if (array.length === 0) return null;
    return array.reduce((min, item) => (item[key] < min[key] ? item : min));
  }
}
