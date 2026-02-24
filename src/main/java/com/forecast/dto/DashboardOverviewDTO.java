package com.forecast.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardOverviewDTO {
    private List<KPIValueDTO> kpis;
    private List<TrendDataDTO> trends;
    private List<DepartmentPerformanceDTO> departments;
}
