package com.forecast.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentPerformanceDTO {
    private String department;
    private Double revenue;
    private Double expense;
    private Double profit;
    private Double profitMargin;
}
