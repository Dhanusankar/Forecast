package com.forecast.controller;

import com.forecast.dto.*;
import com.forecast.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/overview")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'VIEWER')")
    public ResponseEntity<DashboardOverviewDTO> getOverview(
            @RequestParam(defaultValue = "2024") Integer year) {
        return ResponseEntity.ok(dashboardService.getOverview(year));
    }
}
