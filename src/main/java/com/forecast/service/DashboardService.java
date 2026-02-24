package com.forecast.service;

import com.forecast.dto.*;
import com.forecast.entity.Forecast;
import com.forecast.entity.Expense;
import com.forecast.repository.ForecastRepository;
import com.forecast.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ForecastRepository forecastRepository;
    private final ExpenseRepository expenseRepository;

    public DashboardOverviewDTO getOverview(Integer year) {
        DashboardOverviewDTO overview = new DashboardOverviewDTO();
        overview.setKpis(getKPIValues(year));
        overview.setTrends(getTrendData(year));
        overview.setDepartments(getDepartmentPerformance(year));
        return overview;
    }

    private List<KPIValueDTO> getKPIValues(Integer year) {
        List<KPIValueDTO> kpis = new ArrayList<>();

        List<Expense> yearlyExpenses = expenseRepository.findAll()
                .stream()
                .filter(s -> s.getYear().equals(year))
                .collect(Collectors.toList());

        List<Forecast> yearlyForecasts = forecastRepository.findAll()
                .stream()
                .filter(f -> f.getYear().equals(year))
                .collect(Collectors.toList());

        Double totalExpense = yearlyExpenses.stream()
                .mapToDouble(Expense::getAmount)
                .sum();

        Double totalRevenue = yearlyForecasts.stream()
                .mapToDouble(Forecast::getRevenue)
                .sum();

        Double profit = totalRevenue - totalExpense;
        Double profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

        // Total Revenue KPI
        kpis.add(new KPIValueDTO(
                "Total Revenue",
                totalRevenue,
                "USD",
                profitMargin,
                profitMargin > 0 ? "up" : "down",
                "trending_up",
                profitMargin > 0 ? "#51cf66" : "#ff6b6b"
        ));

        // Total Profit KPI
        kpis.add(new KPIValueDTO(
                "Total Profit",
                profit,
                "USD",
                profitMargin,
                profit > 0 ? "up" : "down",
                "savings",
                profit > 0 ? "#51cf66" : "#ff6b6b"
        ));

        // Profit Margin KPI
        kpis.add(new KPIValueDTO(
                "Profit Margin",
                profitMargin,
                "%",
                0.0,
                "stable",
                "percent",
                profitMargin > 0 ? "#51cf66" : "#ff6b6b"
        ));

        long departmentCount = yearlyExpenses.stream()
                .map(Expense::getDepartment)
                .distinct()
                .count();

        kpis.add(new KPIValueDTO(
                "Active Departments",
                (double) departmentCount,
                "Count",
                0.0,
                "stable",
                "business",
                "#15aabf"
        ));

        long categoryCount = yearlyExpenses.stream()
                .map(Expense::getCategory)
                .distinct()
                .count();

        kpis.add(new KPIValueDTO(
                "Categories",
                (double) categoryCount,
                "Count",
                0.0,
                "stable",
                "category",
                "#fd7e14"
        ));

        return kpis;
    }

    private List<TrendDataDTO> getTrendData(Integer year) {
        List<TrendDataDTO> trends = new ArrayList<>();
        
        Map<Integer, Double> expenseByMonth = new HashMap<>();
        Map<Integer, Double> revenueByMonth = new HashMap<>();

        expenseRepository.findAll()
                .stream()
                .filter(s -> s.getYear().equals(year))
                .forEach(s -> expenseByMonth.merge(s.getMonth(), s.getAmount(), Double::sum));

        forecastRepository.findAll()
                .stream()
                .filter(f -> f.getYear().equals(year))
                .forEach(f -> revenueByMonth.merge(monthNameToNumber(f.getMonthName()), f.getRevenue(), Double::sum));

        String[] monthNames = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};

        for (int i = 1; i <= 12; i++) {
            Double revenue = revenueByMonth.getOrDefault(i, 0.0);
            Double expense = expenseByMonth.getOrDefault(i, 0.0);
            Double profit = revenue - expense;

            trends.add(new TrendDataDTO(
                    monthNames[i - 1],
                    revenue,
                    expense,
                    profit
            ));
        }

        return trends;
    }

    private Integer monthNameToNumber(String monthName) {
        return switch(monthName.toLowerCase()) {
            case "january" -> 1;
            case "february" -> 2;
            case "march" -> 3;
            case "april" -> 4;
            case "may" -> 5;
            case "june" -> 6;
            case "july" -> 7;
            case "august" -> 8;
            case "september" -> 9;
            case "october" -> 10;
            case "november" -> 11;
            case "december" -> 12;
            default -> 1;
        };
    }

    private List<DepartmentPerformanceDTO> getDepartmentPerformance(Integer year) {
        List<DepartmentPerformanceDTO> performances = new ArrayList<>();
        Map<String, Double> deptExpense = new HashMap<>();
        Map<String, Double> deptRevenue = new HashMap<>();

        expenseRepository.findAll()
                .stream()
                .filter(s -> s.getYear().equals(year))
                .forEach(s -> deptExpense.merge(s.getDepartment(), s.getAmount(), Double::sum));

        forecastRepository.findAll()
                .stream()
                .filter(f -> f.getYear().equals(year))
                .forEach(f -> deptRevenue.merge(f.getDepartment(), f.getRevenue(), Double::sum));

        Set<String> allDepts = new HashSet<>();
        allDepts.addAll(deptExpense.keySet());
        allDepts.addAll(deptRevenue.keySet());

        for (String dept : allDepts) {
            Double expense = deptExpense.getOrDefault(dept, 0.0);
            Double revenue = deptRevenue.getOrDefault(dept, 0.0);
            Double profit = revenue - expense;
            Double profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;

            performances.add(new DepartmentPerformanceDTO(
                    dept,
                    revenue,
                    expense,
                    profit,
                    profitMargin
            ));
        }

        return performances;
    }
}
