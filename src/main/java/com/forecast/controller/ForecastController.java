package com.forecast.controller;

import com.forecast.dto.ForecastDTO;
import com.forecast.dto.ForecastFilterDTO;
import com.forecast.dto.PageResponseDTO;
import com.forecast.entity.Forecast.ScenarioType;
import com.forecast.exception.AuditLog;
import com.forecast.service.ForecastService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/forecasts")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:3000"})
@Slf4j
public class ForecastController {

    private final ForecastService forecastService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'VIEWER')")
    public ResponseEntity<PageResponseDTO<ForecastDTO>> getForecastsWithFilters(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String scenario,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String monthName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        log.info("GET /api/forecasts - page: {}, size: {}", page, size);

        ForecastFilterDTO filter = ForecastFilterDTO.builder()
            .department(department)
            .category(category)
            .scenario(scenario != null ? ScenarioType.valueOf(scenario.toUpperCase()) : null)
            .year(year)
            .monthName(monthName)
            .build();

        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(forecastService.getForecastsWithFilters(filter, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'VIEWER')")
    public ResponseEntity<ForecastDTO> getForecastById(@PathVariable Long id) {
        log.info("GET /api/forecasts/{}", id);
        return ResponseEntity.ok(forecastService.getForecastById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @AuditLog(action = "CREATE", entity = "Forecast")
    public ResponseEntity<ForecastDTO> createForecast(@RequestBody ForecastDTO dto) {
        log.info("POST /api/forecasts");
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(forecastService.createForecast(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @AuditLog(action = "UPDATE", entity = "Forecast")
    public ResponseEntity<ForecastDTO> updateForecast(
            @PathVariable Long id,
            @RequestBody ForecastDTO dto) {
        log.info("PUT /api/forecasts/{}", id);
        return ResponseEntity.ok(forecastService.updateForecast(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @AuditLog(action = "DELETE", entity = "Forecast")
    public ResponseEntity<Void> deleteForecast(@PathVariable Long id) {
        log.info("DELETE /api/forecasts/{}", id);
        forecastService.deleteForecast(id);
        return ResponseEntity.noContent().build();
    }
}
