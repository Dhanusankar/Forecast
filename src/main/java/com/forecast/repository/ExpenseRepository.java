package com.forecast.repository;

import com.forecast.entity.Expense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    @Query("SELECT e FROM Expense e WHERE " +
            "(:department IS NULL OR e.department = :department) AND " +
            "(:year IS NULL OR e.year = :year) AND " +
            "(:category IS NULL OR e.category = :category)")
    Page<Expense> findWithFilters(
            @Param("department") String department,
            @Param("year") Integer year,
            @Param("category") String category,
            Pageable pageable);

    @Query("SELECT e FROM Expense e WHERE " +
            "(:department IS NULL OR e.department = :department) AND " +
            "(:year IS NULL OR e.year = :year) AND " +
            "(:category IS NULL OR e.category = :category)")
    List<Expense> findWithFilters(
            @Param("department") String department,
            @Param("year") Integer year,
            @Param("category") String category);

    @Query("SELECT e.department, SUM(e.amount) as totalSpending, AVG(e.amount) as avgSpending, COUNT(DISTINCT e.month) as monthCount, e.year " +
            "FROM Expense e WHERE e.year = :year GROUP BY e.department, e.year")
    List<Object[]> getDepartmentSummary(@Param("year") Integer year);
}
