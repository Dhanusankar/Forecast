import { Injectable } from '@angular/core';

/**
 * Format Service - Centralized formatting utilities
 * Format numbers, dates, currencies across the application
 */
@Injectable({
  providedIn: 'root'
})
export class FormatService {
  /**
   * Format number as currency
   */
  formatCurrency(value: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  /**
   * Format number with thousand separators
   */
  formatNumber(value: number, decimals: number = 0): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  }

  /**
   * Format percentage
   */
  formatPercentage(value: number, decimals: number = 1): string {
    return (value).toFixed(decimals) + '%';
  }

  /**
   * Format date to readable format
   */
  formatDate(date: Date | string, format: string = 'short'): string {
    const d = typeof date === 'string' ? new Date(date) : date;

    switch (format) {
      case 'short':
        return d.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      case 'long':
        return d.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
      case 'time':
        return d.toLocaleTimeString('en-US');
      case 'datetime':
        return d.toLocaleString('en-US');
      default:
        return d.toLocaleDateString('en-US');
    }
  }

  /**
   * Format large numbers with abbreviations
   * 1000 -> 1K, 1000000 -> 1M, etc.
   */
  formatCompact(value: number): string {
    const absValue = Math.abs(value);

    if (absValue >= 1e9) {
      return (value / 1e9).toFixed(1) + 'B';
    } else if (absValue >= 1e6) {
      return (value / 1e6).toFixed(1) + 'M';
    } else if (absValue >= 1e3) {
      return (value / 1e3).toFixed(1) + 'K';
    }

    return value.toString();
  }

  /**
   * Capitalize first letter
   */
  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Convert to title case
   */
  toTitleCase(str: string): string {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Format department name (e.g., HR -> Human Resources)
   */
  getDepartmentLabel(department: string): string {
    const labels: { [key: string]: string } = {
      'HR': 'Human Resources',
      'IT': 'Information Technology',
      'SALES': 'Sales',
      'MARKETING': 'Marketing',
      'FINANCE': 'Finance',
      'OPERATIONS': 'Operations',
      'PRODUCT': 'Product'
    };
    return labels[department.toUpperCase()] || this.toTitleCase(department);
  }

  /**
   * Format category name
   */
  getCategoryLabel(category: string): string {
    const labels: { [key: string]: string } = {
      'SALARY': 'Salary',
      'BENEFITS': 'Benefits',
      'TRAVEL': 'Travel',
      'EQUIPMENT': 'Equipment',
      'MARKETING': 'Marketing',
      'OPERATIONS': 'Operations',
      'OTHER': 'Other'
    };
    return labels[category.toUpperCase()] || this.toTitleCase(category);
  }
}
