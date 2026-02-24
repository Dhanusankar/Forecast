export interface TrendData {
  month: string;
  revenue: number;
  expense: number;
  profit: number;
}

export interface KPIValue {
  title: string;
  value: number;
  unit: string;
  trend: number;
  trendDirection: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
}

export interface DashboardOverview {
  kpis: KPIValue[];
  trendData: TrendData[];
  departmentPerformance: DepartmentPerformance[];
  summaryStats: SummaryStats;
  totalRecords: number;
}

export interface DepartmentPerformance {
  department: string;
  revenue: number;
  expense: number;
  profit: number;
  profitMargin: number;
}

export interface SummaryStats {
  totalRevenue: number;
  totalExpense: number;
  totalProfit: number;
  avgProfitMargin: number;
  totalRecords: number;
  activeYears: number[];
}

export interface DashboardFilter {
  year?: number;
  department?: string;
  category?: string;
  scenario?: string;
}
