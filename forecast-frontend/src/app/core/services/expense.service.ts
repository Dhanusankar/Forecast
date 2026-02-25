import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://forecast-1-tpoj.onrender.com/api/spending';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(private http: HttpClient) { }

  getExpenses(filters: any, page: number = 0, size: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters.department) {
      params = params.set('department', filters.department);
    }
    if (filters.category) {
      params = params.set('category', filters.category);
    }
    if (filters.year) {
      params = params.set('year', filters.year);
    }

    return this.http.get<any>(API_URL, { params });
  }

  createExpense(expense: any): Observable<any> {
    return this.http.post<any>(API_URL, expense);
  }

  updateExpense(id: number, expense: any): Observable<any> {
    return this.http.put<any>(`${API_URL}/${id}`, expense);
  }

  deleteExpense(id: number): Observable<any> {
    return this.http.delete<any>(`${API_URL}/${id}`);
  }
}
