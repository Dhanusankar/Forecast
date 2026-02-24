import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

/**
 * KPI Card Component - Reusable across all features
 * Displays a key performance indicator with value, trend, and icon
 * 
 * Usage:
 * <app-kpi-card
 *   [title]="'Total Revenue'"
 *   [value]="1000000"
 *   [label]="'This Month'"
 *   [icon]="'trending_up'"
 *   [trend]="5.2"
 *   [color]="'primary'">
 * </app-kpi-card>
 */
@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './kpi-card.component.html',
  styleUrls: ['./kpi-card.component.scss']
})
export class KpiCardComponent {
  @Input() title: string = '';
  @Input() value: number = 0;
  @Input() label: string = '';
  @Input() icon: string = 'trending_up';
  @Input() trend: number = 0;
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
}
