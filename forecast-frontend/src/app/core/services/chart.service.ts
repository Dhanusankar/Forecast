import { Injectable } from '@angular/core';

/**
 * Chart Service - Generate chart configurations and data
 * Reusable across all features for chart generation
 */
@Injectable({
  providedIn: 'root'
})
export class ChartService {
  /**
   * Generate line chart configuration for trend data
   */
  generateLineChartConfig(labels: string[], datasets: any[]): any {
    return {
      type: 'line',
      data: {
        labels,
        datasets: datasets.map(ds => ({
          label: ds.label,
          data: ds.data,
          borderColor: ds.borderColor || '#1976d2',
          backgroundColor: ds.backgroundColor || 'rgba(25, 118, 210, 0.1)',
          tension: 0.4,
          fill: false,
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: ds.borderColor || '#1976d2'
        }))
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value: any) => '$' + value.toLocaleString()
            }
          }
        }
      }
    };
  }

  /**
   * Generate bar chart configuration
   */
  generateBarChartConfig(labels: string[], datasets: any[]): any {
    return {
      type: 'bar',
      data: {
        labels,
        datasets: datasets.map(ds => ({
          label: ds.label,
          data: ds.data,
          backgroundColor: ds.backgroundColor || '#1976d2',
          borderColor: ds.borderColor || '#1565c0',
          borderWidth: 1
        }))
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value: any) => '$' + value.toLocaleString()
            }
          }
        }
      }
    };
  }

  /**
   * Generate pie chart configuration
   */
  generatePieChartConfig(labels: string[], data: number[], colors?: string[]): any {
    return {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors || this.getDefaultColors(labels.length),
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'right'
          }
        }
      }
    };
  }

  /**
   * Get default color palette
   */
  private getDefaultColors(count: number): string[] {
    const colors = [
      '#1976d2', '#f57c00', '#388e3c', '#d32f2f',
      '#7b1fa2', '#00796b', '#c2185b', '#0097a7'
    ];
    return Array(count).fill(null).map((_, i) => colors[i % colors.length]);
  }
}
