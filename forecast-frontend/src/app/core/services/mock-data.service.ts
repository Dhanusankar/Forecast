import { Injectable } from '@angular/core';

export interface ExpenseRecord {
  id: number;
  department: string;
  category: string;
  year: number;
  month: number;
  amount: number;
  username?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private expenses: ExpenseRecord[] = [
    // Admin - can see all
    { id: 1, department: 'Sales', category: 'CapEx', year: 2024, month: 1, amount: 150000, username: 'admin' },
    { id: 2, department: 'Sales', category: 'Marketing', year: 2024, month: 1, amount: 50000, username: 'admin' },
    { id: 3, department: 'Marketing', category: 'Marketing', year: 2024, month: 1, amount: 75000, username: 'admin' },
    { id: 4, department: 'Operations', category: 'Operations', year: 2024, month: 1, amount: 120000, username: 'admin' },
    { id: 5, department: 'Engineering', category: 'R&D', year: 2024, month: 1, amount: 200000, username: 'admin' },
    { id: 6, department: 'Finance', category: 'Admin', year: 2024, month: 1, amount: 30000, username: 'admin' },
    
    // Manager - can see own department
    { id: 7, department: 'Sales', category: 'CapEx', year: 2024, month: 2, amount: 160000, username: 'manager' },
    { id: 8, department: 'Sales', category: 'Marketing', year: 2024, month: 2, amount: 55000, username: 'manager' },
    { id: 9, department: 'Sales', category: 'Operations', year: 2024, month: 2, amount: 45000, username: 'manager' },
    
    // Viewer - can only view
    { id: 10, department: 'Engineering', category: 'R&D', year: 2024, month: 3, amount: 210000, username: 'viewer' },
    { id: 11, department: 'Engineering', category: 'CapEx', year: 2024, month: 3, amount: 85000, username: 'viewer' },
  ];

  getExpenses(page: number = 0, size: number = 10, userRole: string, filters: any = {}) {
    let filtered = this.expenses;

    // Filter by role
    if (userRole === 'manager') {
      filtered = filtered.filter(e => e.department === 'Sales');
    } else if (userRole === 'viewer') {
      filtered = filtered.filter(e => e.department === 'Engineering');
    }

    // Apply department filter
    if (filters.department) {
      filtered = filtered.filter(e => e.department === filters.department);
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(e => e.category === filters.category);
    }

    // Apply year filter
    if (filters.year) {
      filtered = filtered.filter(e => e.year === filters.year);
    }

    const total = filtered.length;
    const start = page * size;
    const content = filtered.slice(start, start + size);

    return {
      content,
      totalElements: total,
      totalPages: Math.ceil(total / size),
      currentPage: page,
      pageSize: size
    };
  }

  updateExpense(id: number, data: ExpenseRecord) {
    const index = this.expenses.findIndex(e => e.id === id);
    if (index !== -1) {
      this.expenses[index] = { ...this.expenses[index], ...data };
      this.saveToLocalStorage();
      return true;
    }
    return false;
  }

  deleteExpense(id: number) {
    const index = this.expenses.findIndex(e => e.id === id);
    if (index !== -1) {
      this.expenses.splice(index, 1);
      this.saveToLocalStorage();
      return true;
    }
    return false;
  }

  private saveToLocalStorage() {
    localStorage.setItem('mock_expenses', JSON.stringify(this.expenses));
  }

  loadFromLocalStorage() {
    const saved = localStorage.getItem('mock_expenses');
    if (saved) {
      this.expenses = JSON.parse(saved);
    }
  }
}
