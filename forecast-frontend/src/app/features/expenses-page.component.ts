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
import { AuthService } from '../core/services/auth.service';

const DEPARTMENTS = ['Sales', 'Marketing', 'Operations', 'Engineering', 'Finance', 'HR', 'Legal', 'Support', 'Product', 'Strategy'];
const YEARS = [2024, 2025, 2026, 2027, 2028];

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatTableModule, MatSortModule, MatButtonModule,
    MatFormFieldModule, MatSelectModule, MatIconModule, MatInputModule, MatPaginatorModule, MatProgressSpinnerModule, MatDialogModule
  ],
  template: `
<div class="forecast-container">

  <!-- HEADER -->
  <div class="page-header">
    <h2>Expenses Tracking</h2>
    <div class="header-actions">
      <button *ngIf="isAdmin()" mat-raised-button color="primary" (click)="openAddDialog()" class="add-btn">
        + Add Expense
      </button>
      <button mat-stroked-button color="accent" (click)="resetFilters()">
        Reset
      </button>
    </div>
  </div>

  <!-- FILTER SECTION -->
  <mat-card class="filter-card">
    <form [formGroup]="filterForm" class="filter-row">
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
        <mat-label>Category</mat-label>
        <mat-select formControlName="category">
          <mat-option value="">All</mat-option>
          <mat-option value="CapEx">CapEx</mat-option>
          <mat-option value="R&D">R&D</mat-option>
          <mat-option value="Marketing">Marketing</mat-option>
          <mat-option value="Operations">Operations</mat-option>
          <mat-option value="Admin">Admin</mat-option>
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

        <!-- Year -->
        <ng-container matColumnDef="year">
          <th mat-header-cell *matHeaderCellDef mat-sort-header sticky> Year </th>
          <td mat-cell *matCellDef="let row"> {{ row.year }} </td>
        </ng-container>

        <!-- Month -->
        <ng-container matColumnDef="month">
          <th mat-header-cell *matHeaderCellDef mat-sort-header sticky> Month </th>
          <td mat-cell *matCellDef="let row"> {{ getMonthName(row.month) }} </td>
        </ng-container>

        <!-- Amount -->
        <ng-container matColumnDef="amount">
          <th mat-header-cell *matHeaderCellDef mat-sort-header sticky class="numeric"> Amount </th>
          <td mat-cell *matCellDef="let row" class="numeric" [ngClass]="{'editable-cell': !isViewer()}" (click)="!isViewer() && editCell(row, 'amount')">
            <div *ngIf="!isEditingCell(row, 'amount')" class="cell-display">{{ row.amount | number }}</div>
            <input *ngIf="isEditingCell(row, 'amount')" matInput type="number" [(ngModel)]="row.amount"
              (blur)="saveCell(row, 'amount')" (keyup.enter)="saveCell(row, 'amount')" class="inline-input" autofocus>
          </td>
        </ng-container>

        <!-- Actions -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef sticky class="actions-header"> Actions </th>
          <td mat-cell *matCellDef="let row" class="actions-cell">
            <button *ngIf="!isViewer()" mat-raised-button color="primary" class="action-btn" (click)="openEditDialog(row)">
              Edit
            </button>
            <button *ngIf="!isViewer()" mat-raised-button color="warn" class="action-btn" (click)="delete(row)">
              Delete
            </button>
            <span *ngIf="isViewer()" class="read-only-badge">Read Only</span>
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
      overflow-x: auto;
      overflow-y: auto;
      max-height: 600px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
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
      padding: 8px 4px;
      min-width: 180px;
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

    .read-only-badge {
      display: inline-block;
      padding: 6px 12px;
      background: #e0e0e0;
      color: #666;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }
  `]
})
export class ExpensesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);

  @ViewChild(MatSort) sort!: MatSort;

  filterForm!: FormGroup;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns = ['department', 'category', 'year', 'month', 'amount', 'actions'];
  departments = DEPARTMENTS;
  years = YEARS;
  
  loading = false;
  pageSize = 10;
  pageIndex = 0;
  totalElements = 0;
  editingCell: { rowId: number; field: string } | null = null;
  userRole = '';

  ngOnInit() {
    this.userRole = this.authService.currentUser()?.role || '';
    // Remove actions column for viewers
    if (this.isViewer()) {
      this.displayedColumns = ['department', 'category', 'year', 'month', 'amount'];
    }
    this.filterForm = this.fb.group({
      department: [''],
      category: [''],
      year: ['']
    });
    this.loadData();
  }

  isViewer(): boolean {
    return (this.userRole || '').toLowerCase() === 'viewer';
  }

  isAdmin(): boolean {
    return (this.userRole || '').toLowerCase() === 'admin';
  }

  loadData() {
    this.loading = true;
    let params = new HttpParams()
      .set('page', this.pageIndex.toString())
      .set('size', this.pageSize.toString());
    
    if (this.filterForm.get('department')?.value) {
      params = params.set('department', this.filterForm.get('department')?.value);
    }
    if (this.filterForm.get('category')?.value) {
      params = params.set('category', this.filterForm.get('category')?.value);
    }
    if (this.filterForm.get('year')?.value) {
      params = params.set('year', this.filterForm.get('year')?.value);
    }

    this.http.get<any>('http://localhost:8080/api/spending', { params }).subscribe({
      next: (data) => {
        const items = (data.content || []).map((item: any) => ({ ...item }));
        this.dataSource.data = items;
        this.totalElements = data.totalElements || 0;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading expenses:', err);
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
      department: '',
      category: '',
      year: new Date().getFullYear()
    });
    this.pageIndex = 0;
    this.loadData();
  }

  isEditingCell(row: any, field: string): boolean {
    return this.editingCell?.rowId === row.id && this.editingCell?.field === field;
  }

  editCell(row: any, field: string) {
    if (this.isViewer()) {
      return; // Prevent editing for viewers
    }
    this.editingCell = { rowId: row.id, field };
  }

  saveCell(row: any, field: string) {
    if (this.isViewer()) {
      alert('Viewers cannot edit data');
      this.editingCell = null;
      return;
    }
    this.editingCell = null;
    this.http.put(`http://localhost:8080/api/spending/${row.id}`, row).subscribe({
      next: () => {
        this.loadData();
      },
      error: (err) => console.error('Error saving:', err)
    });
  }

  openEditDialog(row: any) {
    if (this.isViewer()) {
      alert('Viewers cannot edit data');
      return;
    }
    this.dialog.open(ExpensesEditDialog, {
      width: '500px',
      data: { ...row }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.save(result);
      }
    });
  }

  openAddDialog() {
    if (!this.isAdmin()) {
      alert('Only admins can add data');
      return;
    }
    this.dialog.open(ExpensesEditDialog, {
      width: '500px',
      data: { id: null, department: '', category: '', year: new Date().getFullYear(), month: 1, amount: 0 }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.saveNew(result);
      }
    });
  }

  save(row: any) {
    if (this.isViewer()) {
      alert('Viewers cannot edit data');
      return;
    }
    this.http.put(`http://localhost:8080/api/spending/${row.id}`, row).subscribe({
      next: () => {
        this.loadData();
      },
      error: (err) => console.error('Error saving:', err)
    });
  }

  saveNew(row: any) {
    if (this.isViewer()) {
      alert('Viewers cannot add data');
      return;
    }
    this.http.post(`http://localhost:8080/api/spending`, row).subscribe({
      next: () => {
        this.loadData();
      },
      error: (err) => console.error('Error creating:', err)
    });
  }

  delete(row: any) {
    if (this.isViewer()) {
      alert('Viewers cannot delete data');
      return;
    }
    if (confirm('Are you sure you want to delete this record?')) {
      this.http.delete(`http://localhost:8080/api/spending/${row.id}`).subscribe({
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

  getMonthName(monthNum: number): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthNum - 1] || '';
  }
}

@Component({
  selector: 'app-expenses-edit-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatDialogModule],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>Edit Expense</h2>
      
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
            <mat-label>Year</mat-label>
            <input matInput type="number" [(ngModel)]="data.year" name="year">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Amount</mat-label>
            <input matInput type="number" [(ngModel)]="data.amount" name="amount">
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
export class ExpensesEditDialog {
  data: any;

  constructor(
    public dialogRef: MatDialogRef<ExpensesEditDialog>,
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
