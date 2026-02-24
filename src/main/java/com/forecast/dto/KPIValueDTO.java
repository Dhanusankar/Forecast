package com.forecast.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KPIValueDTO {
    private String title;
    private Double value;
    private String unit;
    private Double trend;
    private String trendDirection;
    private String icon;
    private String color;
}
