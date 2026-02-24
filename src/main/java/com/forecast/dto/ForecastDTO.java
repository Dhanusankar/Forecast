package com.forecast.dto;

import com.forecast.entity.Forecast.ScenarioType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ForecastDTO {
    private Long id;
    private String department;
    private String category;
    private ScenarioType scenario;
    private Integer year;
    private String monthName;
    private Double revenue;
    private Double expense;
    private Double profit;
    private Long version;
}
