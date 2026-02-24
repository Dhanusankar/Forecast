import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Forecast, PageResponse, ForecastFilter } from '../models/forecast.model';

@Injectable({
  providedIn: 'root'
})
export class ForecastService {
  private readonly API_URL = 'http://localhost:8080/api/forecasts';
  private readonly DEFAULT_PAGE_SIZE = 10;

  private loading$ = new BehaviorSubject<boolean>(false);
  private error$ = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {}

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

  getForecastsWithFilters(
    filter: ForecastFilter,
    page: number = 0,
    size: number = this.DEFAULT_PAGE_SIZE
  ): Observable<PageResponse<Forecast>> {
    this.setLoading(true);
    this.setError(null);

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filter.department) {
      params = params.set('department', filter.department);
    }
    if (filter.category) {
      params = params.set('category', filter.category);
    }
    if (filter.scenario) {
      params = params.set('scenario', filter.scenario);
    }
    if (filter.year) {
      params = params.set('year', filter.year.toString());
    }
    if (filter.monthName) {
      params = params.set('monthName', filter.monthName);
    }

    return this.http.get<PageResponse<Forecast>>(this.API_URL, { params }).pipe(
      tap({
        next: () => this.setLoading(false),
        error: (err: any) => {
          const errorMessage = err.error?.error || 'Failed to fetch forecasts';
          this.setError(errorMessage);
          this.setLoading(false);
        }
      })
    );
  }

  getForecastById(id: number): Observable<Forecast> {
    this.setLoading(true);
    this.setError(null);

    return this.http.get<Forecast>(`${this.API_URL}/${id}`).pipe(
      tap({
        next: () => this.setLoading(false),
        error: (err: any) => {
          const errorMessage = err.error?.error || 'Failed to fetch forecast';
          this.setError(errorMessage);
          this.setLoading(false);
        }
      })
    );
  }

  createForecast(forecast: Forecast): Observable<Forecast> {
    this.setLoading(true);
    this.setError(null);

    return this.http.post<Forecast>(this.API_URL, forecast).pipe(
      tap({
        next: () => this.setLoading(false),
        error: (err: any) => {
          const errorMessage = err.error?.error || 'Failed to create forecast';
          this.setError(errorMessage);
          this.setLoading(false);
        }
      })
    );
  }

  updateForecast(id: number, forecast: Forecast): Observable<Forecast> {
    this.setLoading(true);
    this.setError(null);

    return this.http.put<Forecast>(`${this.API_URL}/${id}`, forecast).pipe(
      tap({
        next: () => this.setLoading(false),
        error: (err: any) => {
          const errorMessage = err.error?.error || 'Failed to update forecast';
          this.setError(errorMessage);
          this.setLoading(false);
        }
      })
    );
  }

  deleteForecast(id: number): Observable<void> {
    this.setLoading(true);
    this.setError(null);

    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      tap({
        next: () => this.setLoading(false),
        error: (err: any) => {
          const errorMessage = err.error?.error || 'Failed to delete forecast';
          this.setError(errorMessage);
          this.setLoading(false);
        }
      })
    );
  }
}
