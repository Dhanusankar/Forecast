package com.forecast.service;

import com.forecast.dto.DepartmentSummaryDTO;
import com.forecast.dto.PageResponseDTO;
import com.forecast.dto.ExpenseDTO;
import com.forecast.dto.ExpenseFilterDTO;
import com.forecast.entity.Expense;
import com.forecast.mapper.ExpenseMapper;
import com.forecast.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseMapper expenseMapper;

    public PageResponseDTO<ExpenseDTO> getExpensesWithFilters(ExpenseFilterDTO filter, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Expense> result = expenseRepository.findWithFilters(
                filter.getDepartment(),
                filter.getYear(),
                filter.getCategory(),
                pageable
        );

        List<ExpenseDTO> content = result.getContent()
                .stream()
                .map(expenseMapper::toDTO)
                .collect(Collectors.toList());

        return new PageResponseDTO<>(
                content,
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

    public List<DepartmentSummaryDTO> getDepartmentSummary(Integer year) {
        List<Object[]> results = expenseRepository.getDepartmentSummary(year);
        List<DepartmentSummaryDTO> summaries = new ArrayList<>();

        for (Object[] row : results) {
            DepartmentSummaryDTO summary = new DepartmentSummaryDTO();
            summary.setDepartment((String) row[0]);
            summary.setTotalSpending(((Number) row[1]).doubleValue());
            summary.setAvgSpending(((Number) row[2]).doubleValue());
            summary.setMonthCount(((Number) row[3]).longValue());
            summary.setYear(year);
            summaries.add(summary);
        }

        return summaries;
    }

    public ExpenseDTO createExpense(ExpenseDTO expenseDTO) {
        Expense expense = expenseMapper.toEntity(expenseDTO);
        Expense saved = expenseRepository.save(expense);
        return expenseMapper.toDTO(saved);
    }

    public ExpenseDTO updateExpense(Long id, ExpenseDTO expenseDTO) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        expense.setDepartment(expenseDTO.getDepartment());
        expense.setYear(expenseDTO.getYear());
        expense.setMonth(expenseDTO.getMonth());
        expense.setCategory(expenseDTO.getCategory());
        expense.setAmount(expenseDTO.getAmount());
        Expense updated = expenseRepository.save(expense);
        return expenseMapper.toDTO(updated);
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }

    public ExpenseDTO getExpenseById(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        return expenseMapper.toDTO(expense);
    }
}
