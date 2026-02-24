package com.forecast.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "spending", indexes = {
    @Index(name = "idx_dept_expense", columnList = "department"),
    @Index(name = "idx_category_expense", columnList = "category"),
    @Index(name = "idx_year_expense", columnList = "\"year\"")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    @NotBlank(message = "Department is required")
    private String department;

    @Column(nullable = false, length = 100)
    @NotBlank(message = "Category is required")
    private String category;

    @Column(name = "\"year\"", nullable = false)
    @NotNull(message = "Year is required")
    @Min(2000)
    @Max(2099)
    private Integer year;

    @Column(name = "\"month\"", nullable = false)
    @NotNull(message = "Month is required")
    @Min(1)
    @Max(12)
    private Integer month;

    @Column(nullable = false)
    @NotNull(message = "Amount is required")
    @PositiveOrZero(message = "Amount must be positive or zero")
    private Double amount;

    @Version
    @Column(nullable = false)
    private Long version;
}
