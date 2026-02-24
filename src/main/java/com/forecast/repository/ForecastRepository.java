package com.forecast.repository;

import com.forecast.entity.Forecast;
import com.forecast.entity.Forecast.ScenarioType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ForecastRepository extends JpaRepository<Forecast, Long> {

    @Query("SELECT f FROM Forecast f WHERE " +
           "(:department IS NULL OR LOWER(f.department) = LOWER(:department)) AND " +
           "(:category IS NULL OR LOWER(f.category) = LOWER(:category)) AND " +
           "(:scenario IS NULL OR f.scenario = :scenario) AND " +
           "(:year IS NULL OR f.year = :year) AND " +
           "(:monthName IS NULL OR LOWER(f.monthName) = LOWER(:monthName))")
    Page<Forecast> findWithFilters(
        @Param("department") String department,
        @Param("category") String category,
        @Param("scenario") ScenarioType scenario,
        @Param("year") Integer year,
        @Param("monthName") String monthName,
        Pageable pageable
    );
}
