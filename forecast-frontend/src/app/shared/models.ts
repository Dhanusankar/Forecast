// Shared layer models index
export type ChartData = {
  labels: string[];
  datasets: ChartDataset[];
};

export type ChartDataset = {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  fill?: boolean;
  tension?: number;
};

export type ChartConfig = {
  type: 'line' | 'bar' | 'pie' | 'doughnut';
  data: ChartData;
  options?: any;
};

export type AlertNotification = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
};
