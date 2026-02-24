package com.forecast.mapper;

import com.forecast.dto.ForecastDTO;
import com.forecast.entity.Forecast;
import org.springframework.stereotype.Component;

@Component
public class ForecastMapper {

    public ForecastDTO toDTO(Forecast forecast) {
        if (forecast == null) {
            return null;
        }
        Double profit = forecast.getRevenue() - forecast.getExpense();
        return ForecastDTO.builder()
            .id(forecast.getId())
            .department(forecast.getDepartment())
            .category(forecast.getCategory())
            .scenario(forecast.getScenario())
            .year(forecast.getYear())
            .monthName(forecast.getMonthName())
            .revenue(forecast.getRevenue())
            .expense(forecast.getExpense())
            .profit(profit)
            .version(forecast.getVersion())
            .build();
    }

    public Forecast toEntity(ForecastDTO dto) {
        if (dto == null) {
            return null;
        }
        return Forecast.builder()
            .id(dto.getId())
            .department(dto.getDepartment())
            .category(dto.getCategory())
            .scenario(dto.getScenario())
            .year(dto.getYear())
            .monthName(dto.getMonthName())
            .revenue(dto.getRevenue())
            .expense(dto.getExpense())
            .version(dto.getVersion())
            .build();
    }

    public Forecast updateEntity(ForecastDTO dto, Forecast existing) {
        existing.setRevenue(dto.getRevenue());
        existing.setExpense(dto.getExpense());
        existing.setCategory(dto.getCategory());
        return existing;
    }
}
