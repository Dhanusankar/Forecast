import { Component, OnInit, ViewChild, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

const DEPARTMENTS = ['Sales', 'Marketing', 'Operations', 'Engineering', 'Finance', 'HR', 'Legal', 'Support', 'Product', 'Strategy'];
const YEARS = [2024, 2025, 2026, 2027, 2028];

@Component({
  selector: 'app-forecast',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatTableModule, MatSortModule, MatButtonModule,
    MatFormFieldModule, MatSelectModule, MatIconModule, MatInputModule, MatPaginatorModule, MatProgressSpinnerModule, MatDialogModule
  ],
  template: `
<div class="forecast-container">

  <!-- HEADER -->
  <div class="page-header">
    <h2>Financial Forecast Planning</h2>
    <div class="header-actions">
      <button mat-stroked-button color="accent" (click)="resetFilters()">
        Reset
      </button>
    </div>
  </div>

  <!-- FILTER SECTION -->
  <mat-card class="filter-card">
    <form [formGroup]="filterForm" class="filter-row">
      <mat-form-field appearance="outline">
        <mat-label>Scenario</mat-label>
        <mat-select formControlName="scenario">
          <mat-option value="">All</mat-option>
          <mat-option value="Actual">Actual</mat-option>
          <mat-option value="Forecast">Forecast</mat-option>
          <mat-option value="Budget">Budget</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Department</mat-label>
        <mat-select formControlName="department">
          <mat-option value="">All</mat-option>
          <mat-option *ngFor="let dept of departments" [value]="dept">
            {{ dept }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Year</mat-label>
        <mat-select formControlName="year">
          <mat-option value="">All</mat-option>
          <mat-option *ngFor="let year of years" [value]="year">
            {{ year }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <div class="filter-buttons">
        <button mat-raised-button color="primary" (click)="applyFilters()">
          Apply
        </button>
      </div>
    </form>
  </mat-card>

  <!-- TABLE SECTION -->
  <mat-card class="table-card">
    <div class="table-wrapper">
      <table mat-table [dataSource]="dataSource" matSort (matSortChange)="sortData($event)" class="mat-elevation-z2">

        <!-- Department -->
        <ng-container matColumnDef="department">
          <th mat-header-cell *matHeaderCellDef mat-sort-header sticky> Department </th>
          <td mat-cell *matCellDef="let row"> {{ row.department }} </td>
        </ng-container>

        <!-- Category -->
        <ng-container matColumnDef="category">
          <th mat-header-cell *matHeaderCellDef mat-sort-header sticky> Category </th>
          <td mat-cell *matCellDef="let row"> {{ row.category }} </td>
        </ng-container>

        <!-- Scenario -->
        <ng-container matColumnDef="scenario">
          <th mat-header-cell *matHeaderCellDef mat-sort-header sticky> Scenario </th>
          <td mat-cell *matCellDef="let row"> {{ row.scenario }} </td>
        </ng-container>

        <!-- Year -->
        <ng-container matColumnDef="year">
          <th mat-header-cell *matHeaderCellDef mat-sort-header sticky> Year </th>
          <td mat-cell *matCellDef="let row"> {{ row.year }} </td>
        </ng-container>

        <!-- Month -->
        <ng-container matColumnDef="monthName">
          <th mat-header-cell *matHeaderCellDef mat-sort-header sticky> Month </th>
          <td mat-cell *matCellDef="let row"> {{ row.monthName }} </td>
        </ng-container>

        <!-- Revenue -->
        <ng-container matColumnDef="revenue">
          <th mat-header-cell *matHeaderCellDef mat-sort-header sticky class="numeric"> Revenue </th>
          <td mat-cell *matCellDef="let row" class="numeric editable-cell" (click)="editCell(row, 'revenue')">
            <div *ngIf="!isEditingCell(row, 'revenue')" class="cell-display">{{ row.revenue | number }}</div>
            <input *ngIf="isEditingCell(row, 'revenue')" matInput type="number" [(ngModel)]="row.revenue" 
              (blur)="saveCell(row, 'revenue')" (keyup.enter)="saveCell(row, 'revenue')" class="inline-input" autofocus>
          </td>
        </ng-container>

        <!-- Expense -->
        <ng-container matColumnDef="expense">
          <th mat-header-cell *matHeaderCellDef mat-sort-header sticky class="numeric"> Expense </th>
          <td mat-cell *matCellDef="let row" class="numeric editable-cell" (click)="editCell(row, 'expense')">
            <div *ngIf="!isEditingCell(row, 'expense')" class="cell-display">{{ row.expense | number }}</div>
            <input *ngIf="isEditingCell(row, 'expense')" matInput type="number" [(ngModel)]="row.expense" 
              (blur)="saveCell(row, 'expense')" (keyup.enter)="saveCell(row, 'expense')" class="inline-input" autofocus>
          </td>
        </ng-container>

        <!-- Profit -->
        <ng-container matColumnDef="profit">
          <th mat-header-cell *matHeaderCellDef mat-sort-header sticky class="numeric"> Profit </th>
          <td mat-cell *matCellDef="let row" class="numeric profit">
            {{ row.revenue - row.expense | number }}
          </td>
        </ng-container>

        <!-- Actions -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef sticky class="actions-header"> Actions </th>
          <td mat-cell *matCellDef="let row" class="actions-cell">
            <button mat-raised-button color="primary" class="action-btn" (click)="openEditDialog(row)">
              Edit
            </button>
            <button mat-raised-button color="warn" class="action-btn" (click)="delete(row)">
              Delete
            </button>
          </td>
        </ng-container>

        <!-- Header & Row -->
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <!-- Loading Overlay -->
      <div class="loading-overlay" *ngIf="loading">
        <mat-spinner></mat-spinner>
      </div>
    </div>

    <!-- PAGINATOR -->
    <mat-paginator
      [length]="totalElements"
      [pageSize]="pageSize"
      [pageSizeOptions]="[10, 25, 50, 100]"
      (page)="onPageChange($event)">
    </mat-paginator>
  </mat-card>

</div>
  `,
  styles: [`
    .forecast-container {
      padding: 24px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .filter-card {
      margin-bottom: 16px;
      padding: 16px;
    }

    .filter-row {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      align-items: center;
    }

    .table-card {
      padding: 0;
    }

    .table-wrapper {
      position: relative;
      overflow: auto;
      max-height: 600px;
    }

    table {
      table-layout: fixed;
    }

    tr.mat-mdc-row {
      height: auto;
    }

    .numeric {
      text-align: right !important;
    }

    ::ng-deep th.mat-mdc-header-cell.numeric {
      text-align: right !important;
    }

    ::ng-deep td.mat-mdc-cell.numeric {
      text-align: right !important;
    }

    .profit {
      font-weight: 600;
      color: #2e7d32;
    }

    .loading-overlay {
      position: absolute;
      inset: 0;
      background: rgba(255,255,255,0.7);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    table {
      width: 100%;
    }

    mat-form-field {
      width: 150px;
    }

    .filter-buttons {
      display: flex;
      gap: 8px;
    }

    ::ng-deep td.mat-mdc-cell {
      border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
    }

    .actions-cell {
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: center;
      padding-top: 10px;
      padding-bottom: 10px;
      height: 100%;
    }

    .actions-header {
      text-align: center;
    }

    .action-btn {
      min-width: 70px;
      border-radius: 4px;
      font-weight: 500;
    }

    .inline-input {
      padding: 4px 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 14px;
    }

    .editable-cell {
      cursor: pointer;
    }

    .cell-display {
      padding: 8px 0;
      min-height: 20px;
    }

    .cell-display:hover {
      background-color: #f0f0f0;
      border-radius: 4px;
      padding: 6px 4px;
    }

    th {
      background-color: #3f51b5 !important;
      color: white !important;
      font-weight: 600;
    }

    th.mat-mdc-header-cell {
      background-color: #3f51b5 !important;
      color: white !important;
    }

    th.mat-mdc-header-cell.numeric {
      text-align: center !important;
    }

    td.mat-mdc-cell.numeric {
      text-align: center !important;
    }

    .numeric {
      text-align: center;
    }

    ::ng-deep .mat-mdc-header-cell.numeric div {
      text-align: center !important;
    }
  `]
})
export class ForecastComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private dialog = inject(MatDialog);

  @ViewChild(MatSort) sort!: MatSort;

  filterForm!: FormGroup;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns = ['department', 'category', 'scenario', 'year', 'monthName', 'revenue', 'expense', 'profit', 'actions'];
  departments = DEPARTMENTS;
  years = YEARS;
  
  loading = false;
  pageSize = 10;
  pageIndex = 0;
  totalElements = 0;
  editingCell: { rowId: number; field: string } | null = null;

  ngOnInit() {
    this.filterForm = this.fb.group({
      scenario: [''],
      department: [''],
      year: ['']
    });
    this.loadData();
  }

  loadData() {
    this.loading = true;
    let params = new HttpParams()
      .set('page', this.pageIndex.toString())
      .set('size', this.pageSize.toString());
    
    if (this.filterForm.get('scenario')?.value) {
      params = params.set('scenario', this.filterForm.get('scenario')?.value);
    }
    if (this.filterForm.get('department')?.value) {
      params = params.set('department', this.filterForm.get('department')?.value);
    }
    if (this.filterForm.get('year')?.value) {
      params = params.set('year', this.filterForm.get('year')?.value);
    }

    this.http.get<any>('https://forecast-1-tpoj.onrender.com/api/forecasts', { params }).subscribe({
      next: (data) => {
        const items = (data.content || []).map((item: any) => ({ ...item }));
        this.dataSource.data = items;
        this.totalElements = data.totalElements || 0;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading forecasts:', err);
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.pageIndex = 0;
    this.loadData();
  }

  resetFilters() {
    this.filterForm.reset({
      scenario: '',
      department: '',
      year: new Date().getFullYear()
    });
    this.pageIndex = 0;
    this.loadData();
  }

  isEditingCell(row: any, field: string): boolean {
    return this.editingCell?.rowId === row.id && this.editingCell?.field === field;
  }

  editCell(row: any, field: string) {
    this.editingCell = { rowId: row.id, field };
  }

  saveCell(row: any, field: string) {
    this.editingCell = null;
    this.http.put(`http://localhost:8080/api/forecasts/${row.id}`, row).subscribe({
      next: () => {
        this.loadData();
      },
      error: (err) => console.error('Error saving:', err)
    });
  }

  openEditDialog(row: any) {
    this.dialog.open(ForecastEditDialog, {
      width: '500px',
      data: { ...row }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.save(result);
      }
    });
  }

  save(row: any) {
    this.http.put(`https://forecast-1-tpoj.onrender.com/api/forecasts/${row.id}`, row).subscribe({
      next: () => {
        this.loadData();
      },
      error: (err) => console.error('Error saving:', err)
    });
  }

  delete(row: any) {
    if (confirm('Are you sure you want to delete this record?')) {
      this.http.delete(`https://forecast-1-tpoj.onrender.com/api/forecasts/${row.id}`).subscribe({
        next: () => {
          this.loadData();
        },
        error: (err) => console.error('Error deleting:', err)
      });
    }
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  sortData(sort: any) {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }
    this.dataSource.data = data.sort((a, b) => {
      const aValue = a[sort.active];
      const bValue = b[sort.active];
      return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
    });
  }
}

@Component({
  selector: 'app-forecast-edit-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatDialogModule],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>Edit Forecast</h2>
      
      <mat-dialog-content>
        <form class="edit-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Department</mat-label>
            <input matInput [(ngModel)]="data.department" name="department">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Category</mat-label>
            <input matInput [(ngModel)]="data.category" name="category">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Scenario</mat-label>
            <mat-select [(ngModel)]="data.scenario" name="scenario">
              <mat-option value="Actual">Actual</mat-option>
              <mat-option value="Forecast">Forecast</mat-option>
              <mat-option value="Budget">Budget</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Year</mat-label>
            <input matInput type="number" [(ngModel)]="data.year" name="year">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Revenue</mat-label>
            <input matInput type="number" [(ngModel)]="data.revenue" name="revenue">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Expense</mat-label>
            <input matInput type="number" [(ngModel)]="data.expense" name="expense">
          </mat-form-field>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end" class="dialog-actions">
        <button mat-button (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" (click)="onSave()">Save</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 16px;
    }

    .edit-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px 0;
    }

    .full-width {
      width: 100%;
    }

    .dialog-actions {
      padding: 16px 0;
    }
  `]
})
export class ForecastEditDialog {
  data: any;

  constructor(
    public dialogRef: MatDialogRef<ForecastEditDialog>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
    this.data = dialogData;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    this.dialogRef.close(this.data);
  }
}
