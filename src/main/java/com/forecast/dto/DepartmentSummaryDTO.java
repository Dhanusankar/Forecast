package com.forecast.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentSummaryDTO {
    private String department;
    private Double totalSpending;
    private Double avgSpending;
    private Long monthCount;
    private Integer year;
}
