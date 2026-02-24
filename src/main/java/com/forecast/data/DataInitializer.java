package com.forecast.data;

import com.forecast.entity.Forecast;
import com.forecast.entity.Forecast.ScenarioType;
import com.forecast.entity.Expense;
import com.forecast.entity.User;
import com.forecast.repository.ForecastRepository;
import com.forecast.repository.ExpenseRepository;
import com.forecast.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {
    private final ForecastRepository forecastRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void initializeData() {
        initializeUsers();
        if (forecastRepository.count() > 0 && expenseRepository.count() > 0) {
            log.info("Database already populated");
            return;
        }
        log.info("Initializing database...");
        forecastRepository.saveAll(generateForecastData());
        expenseRepository.saveAll(generateExpenseData());
    }

    private void initializeUsers() {
        if (userRepository.count() > 0) {
            log.info("Users already initialized. Count: {}", userRepository.count());
            return;
        }
        List<User> users = List.of(
            User.builder().username("admin").password(passwordEncoder.encode("admin123"))
                .email("admin@forecast.com").role(User.UserRole.ADMIN).active(true).build(),
            User.builder().username("manager").password(passwordEncoder.encode("manager123"))
                .email("manager@forecast.com").role(User.UserRole.MANAGER).active(true).build(),
            User.builder().username("viewer").password(passwordEncoder.encode("viewer123"))
                .email("viewer@forecast.com").role(User.UserRole.VIEWER).active(true).build()
        );
        userRepository.saveAll(users);
        log.info("Initialized 3 users. Total count: {}", userRepository.count());
        
        // Verify users were saved
        User admin = userRepository.findByUsername("admin").orElse(null);
        if (admin != null) {
            log.info("Admin user verified in DB with role: {}", admin.getRole());
        } else {
            log.error("Admin user NOT found in DB after save!");
        }
    }

    private List<Forecast> generateForecastData() {
        String[] depts = {"Sales", "Marketing", "Operations", "Engineering", "Finance", "HR", "Legal", "Support", "Product", "Strategy"};
        String[] cats = {"CapEx", "R&D", "Marketing", "Operations", "Admin"};
        ScenarioType[] scenarios = {ScenarioType.ACTUAL, ScenarioType.FORECAST, ScenarioType.BUDGET};
        String[] months = {"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"};
        int[] years = {2024, 2025, 2026, 2027, 2028};

        List<Forecast> forecasts = new ArrayList<>();
        Random rand = new Random(42);

        for (String dept : depts) {
            for (String cat : cats) {
                for (ScenarioType scenario : scenarios) {
                    for (int year : years) {
                        for (String month : months) {
                            double baseRev = 100000 + rand.nextDouble() * 500000;
                            double baseExp = baseRev * (0.3 + rand.nextDouble() * 0.4);
                            double revFactor = scenario == ScenarioType.ACTUAL ? 1.0 : scenario == ScenarioType.FORECAST ? 1.05 : 1.02;
                            double expFactor = scenario == ScenarioType.ACTUAL ? 1.0 : scenario == ScenarioType.FORECAST ? 0.98 : 1.01;

                            forecasts.add(Forecast.builder()
                                .department(dept).category(cat).scenario(scenario).year(year).monthName(month)
                                .revenue(baseRev * revFactor).expense(baseExp * expFactor).version(0L).build());
                        }
                    }
                }
            }
        }
        return forecasts;
    }

    private List<Expense> generateExpenseData() {
        String[] depts = {"Sales", "Marketing", "Operations", "Engineering", "Finance", "HR", "Legal", "Support", "Product", "Strategy"};
        String[] cats = {"CapEx", "R&D", "Marketing", "Operations", "Admin"};
        int[] years = {2024, 2025, 2026, 2027, 2028};
        int[] months = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12};

        List<Expense> expenses = new ArrayList<>();
        Random rand = new Random(42);

        for (String dept : depts) {
            for (String cat : cats) {
                for (int year : years) {
                    for (int month : months) {
                        expenses.add(Expense.builder()
                            .department(dept).category(cat).year(year).month(month)
                            .amount(50000 + rand.nextDouble() * 300000).version(0L).build());
                    }
                }
            }
        }
        return expenses;
    }
}
