package com.forecast.service;

import com.forecast.dto.ForecastDTO;
import com.forecast.dto.ForecastFilterDTO;
import com.forecast.dto.PageResponseDTO;
import com.forecast.entity.Forecast;
import com.forecast.entity.Forecast.ScenarioType;
import com.forecast.repository.ForecastRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ForecastService {

    private final ForecastRepository forecastRepository;

    public PageResponseDTO<ForecastDTO> getForecastsWithFilters(ForecastFilterDTO filter, Pageable pageable) {
        Page<Forecast> result = forecastRepository.findWithFilters(
            filter.getDepartment(),
            filter.getCategory(),
            filter.getScenario(),
            filter.getYear(),
            filter.getMonthName(),
            pageable
        );

        return new PageResponseDTO<>(
            result.getContent().stream().map(this::toDTO).collect(Collectors.toList()),
            result.getNumber(),
            result.getSize(),
            result.getTotalElements(),
            result.getTotalPages(),
            result.hasNext(),
            result.hasPrevious(),
            result.isFirst(),
            result.isLast()
        );
    }

    public ForecastDTO getForecastById(Long id) {
        return forecastRepository.findById(id)
            .map(this::toDTO)
            .orElseThrow(() -> new RuntimeException("Forecast not found"));
    }

    public ForecastDTO createForecast(ForecastDTO dto) {
        Forecast forecast = toEntity(dto);
        Forecast saved = forecastRepository.save(forecast);
        return toDTO(saved);
    }

    public ForecastDTO updateForecast(Long id, ForecastDTO dto) {
        Forecast forecast = forecastRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Forecast not found"));
        
        forecast.setDepartment(dto.getDepartment());
        forecast.setCategory(dto.getCategory());
        forecast.setScenario(dto.getScenario());
        forecast.setYear(dto.getYear());
        forecast.setMonthName(dto.getMonthName());
        forecast.setRevenue(dto.getRevenue());
        forecast.setExpense(dto.getExpense());
        
        Forecast updated = forecastRepository.save(forecast);
        return toDTO(updated);
    }

    public void deleteForecast(Long id) {
        forecastRepository.deleteById(id);
    }

    private ForecastDTO toDTO(Forecast forecast) {
        Double profit = (forecast.getRevenue() != null && forecast.getExpense() != null) 
            ? forecast.getRevenue() - forecast.getExpense() 
            : null;
        
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

    private Forecast toEntity(ForecastDTO dto) {
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
}
