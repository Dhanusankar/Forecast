export type ScenarioType = 'ACTUAL' | 'FORECAST' | 'BUDGET';

export interface Forecast {
  id?: number;
  department: string;
  category: string;
  scenario: ScenarioType;
  year: number;
  monthName: string;
  revenue: number;
  expense: number;
  profit?: number;
  version?: number;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  first: boolean;
  last: boolean;
}

export interface ForecastFilter {
  department?: string;
  category?: string;
  scenario?: ScenarioType;
  year?: number;
  monthName?: string;
}
