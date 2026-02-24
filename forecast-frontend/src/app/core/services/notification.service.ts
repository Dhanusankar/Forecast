import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private defaultConfig: MatSnackBarConfig = {
    duration: 4000,
    horizontalPosition: 'end',
    verticalPosition: 'bottom'
  };

  constructor(private snackBar: MatSnackBar) { }

  success(message: string, config?: MatSnackBarConfig): void {
    this.snackBar.open(message, 'Close', {
      ...this.defaultConfig,
      ...config,
      panelClass: ['notification-success']
    });
  }

  error(message: string, config?: MatSnackBarConfig): void {
    this.snackBar.open(message, 'Close', {
      ...this.defaultConfig,
      duration: 6000,
      ...config,
      panelClass: ['notification-error']
    });
  }

  info(message: string, config?: MatSnackBarConfig): void {
    this.snackBar.open(message, 'Close', {
      ...this.defaultConfig,
      ...config,
      panelClass: ['notification-info']
    });
  }

  warning(message: string, config?: MatSnackBarConfig): void {
    this.snackBar.open(message, 'Close', {
      ...this.defaultConfig,
      duration: 5000,
      ...config,
      panelClass: ['notification-warning']
    });
  }

  clearAll(): void {
    this.snackBar.dismiss();
  }
}
