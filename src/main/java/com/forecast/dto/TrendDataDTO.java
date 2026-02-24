package com.forecast.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrendDataDTO {
    private String month;
    private Double revenue;
    private Double expense;
    private Double profit;
}
