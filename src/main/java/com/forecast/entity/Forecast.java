package com.forecast.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "forecast", indexes = {
    @Index(name = "idx_department", columnList = "department"),
    @Index(name = "idx_scenario", columnList = "scenario"),
    @Index(name = "idx_year", columnList = "\"forecast_year\"")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Forecast {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    @NotBlank(message = "Department is required")
    private String department;

    @Column(nullable = false, length = 100)
    @NotBlank(message = "Category is required")
    private String category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull(message = "Scenario is required")
    private ScenarioType scenario;

    @Column(nullable = false, name = "\"forecast_year\"")
    @NotNull(message = "Year is required")
    @Min(2000)
    @Max(2099)
    private Integer year;

    @Column(nullable = false, length = 50)
    @NotBlank(message = "Month name is required")
    private String monthName;

    @Column(nullable = false)
    @NotNull(message = "Revenue is required")
    @PositiveOrZero(message = "Revenue must be positive or zero")
    private Double revenue;

    @Column(nullable = false)
    @NotNull(message = "Expense is required")
    @PositiveOrZero(message = "Expense must be positive or zero")
    private Double expense;

    @Version
    @Column(nullable = false)
    private Long version;

    public enum ScenarioType {
        ACTUAL("Actual"),
        FORECAST("Forecast"),
        BUDGET("Budget");

        private final String displayName;

        ScenarioType(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
}
