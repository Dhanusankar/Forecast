import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  DashboardOverview,
  DashboardFilter,
  TrendData,
  DepartmentPerformance,
  SummaryStats
} from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly API_URL = 'http://localhost:8080/api/dashboard';
  private loading$ = new BehaviorSubject<boolean>(false);
  private error$ = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) { }

  getLoading$(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  getError$(): Observable<string | null> {
    return this.error$.asObservable();
  }

  private setLoading(loading: boolean): void {
    this.loading$.next(loading);
  }

  private setError(error: string | null): void {
    this.error$.next(error);
  }

  /**
   * Get complete dashboard overview with all data
   */
  getOverview(filter?: DashboardFilter): Observable<DashboardOverview> {
    this.setLoading(true);
    this.setError(null);

    let params = new HttpParams();

    if (filter) {
      if (filter.year) {
        params = params.set('year', filter.year.toString());
      }
      if (filter.department) {
        params = params.set('department', filter.department);
      }
      if (filter.category) {
        params = params.set('category', filter.category);
      }
      if (filter.scenario) {
        params = params.set('scenario', filter.scenario);
      }
    }

    return this.http.get<DashboardOverview>(
      `${this.API_URL}/overview`,
      { params }
    ).pipe(
      tap({
        next: () => this.setLoading(false),
        error: (err: any) => {
          const errorMessage = err.error?.error || 'Failed to fetch dashboard';
          this.setError(errorMessage);
          this.setLoading(false);
        }
      })
    );
  }

  /**
   * Get KPI values only
   */
  getKPIs(year?: number): Observable<any> {
    let params = new HttpParams();
    if (year) {
      params = params.set('year', year.toString());
    }

    return this.http.get<any>(`${this.API_URL}/kpis`, { params }).pipe(
      tap({
        error: (err: any) => {
          const errorMessage = err.error?.error || 'Failed to fetch KPIs';
          this.setError(errorMessage);
        }
      })
    );
  }

  /**
   * Get trend data for charts
   */
  getTrendData(filter?: DashboardFilter): Observable<TrendData[]> {
    let params = new HttpParams();

    if (filter) {
      if (filter.year) {
        params = params.set('year', filter.year.toString());
      }
      if (filter.department) {
        params = params.set('department', filter.department);
      }
    }

    return this.http.get<TrendData[]>(
      `${this.API_URL}/trends`,
      { params }
    ).pipe(
      tap({
        error: (err: any) => {
          const errorMessage = err.error?.error || 'Failed to fetch trend data';
          this.setError(errorMessage);
        }
      })
    );
  }

  /**
   * Get department performance data
   */
  getDepartmentPerformance(year?: number): Observable<DepartmentPerformance[]> {
    let params = new HttpParams();
    if (year) {
      params = params.set('year', year.toString());
    }

    return this.http.get<DepartmentPerformance[]>(
      `${this.API_URL}/departments`,
      { params }
    ).pipe(
      tap({
        error: (err: any) => {
          const errorMessage = err.error?.error || 'Failed to fetch department data';
          this.setError(errorMessage);
        }
      })
    );
  }

  /**
   * Get summary statistics
   */
  getSummaryStats(filter?: DashboardFilter): Observable<SummaryStats> {
    let params = new HttpParams();

    if (filter) {
      if (filter.year) {
        params = params.set('year', filter.year.toString());
      }
      if (filter.department) {
        params = params.set('department', filter.department);
      }
    }

    return this.http.get<SummaryStats>(
      `${this.API_URL}/summary`,
      { params }
    ).pipe(
      tap({
        error: (err: any) => {
          const errorMessage = err.error?.error || 'Failed to fetch summary';
          this.setError(errorMessage);
        }
      })
    );
  }
}
