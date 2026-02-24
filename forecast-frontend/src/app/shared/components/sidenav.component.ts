import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, RouterLink, MatListModule, MatIconModule],
  template: `
    <nav class="sidenav">
      <ul class="nav-menu">
        <li *ngFor="let item of navItems" class="nav-item">
          <a [routerLink]="item.path" class="nav-link">
            <mat-icon>{{ item.icon }}</mat-icon>
            <span>{{ item.label }}</span>
          </a>
        </li>
      </ul>
    </nav>
  `,
  styles: [`
    .sidenav {
      height: 100%;
      padding: 1rem 0;
    }

    .nav-menu {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .nav-item {
      margin: 0;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      color: #333;
      text-decoration: none;
      transition: background-color 0.3s;
    }

    .nav-link:hover {
      background-color: #f5f5f5;
    }

    .nav-link mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
  `]
})
export class SidenavComponent {
  @Input() navItems = [
    { label: 'Dashboard', path: '/home', icon: 'dashboard' },
    { label: 'Forecasts', path: '/forecasts', icon: 'assessment' },
    { label: 'Expenses', path: '/expenses', icon: 'money' }
  ];
}
