import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

/**
 * Summary Card Component - For displaying summary statistics
 * Used in dashboards and overview pages
 */
@Component({
  selector: 'app-summary-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.scss']
})
export class SummaryCardComponent {
  @Input() title: string = '';
  @Input() value: number = 0;
  @Input() subtitle: string = '';
  @Input() icon: string = 'info';
  @Input() background: string = '#f5f5f5';
  @Input() textColor: string = '#333';
}
