package com.forecast.mapper;

import com.forecast.dto.ExpenseDTO;
import com.forecast.entity.Expense;
import org.springframework.stereotype.Component;

@Component
public class ExpenseMapper {

    public ExpenseDTO toDTO(Expense expense) {
        if (expense == null) {
            return null;
        }
        ExpenseDTO dto = new ExpenseDTO();
        dto.setId(expense.getId());
        dto.setDepartment(expense.getDepartment());
        dto.setYear(expense.getYear());
        dto.setMonth(expense.getMonth());
        dto.setCategory(expense.getCategory());
        dto.setAmount(expense.getAmount());
        dto.setVersion(expense.getVersion());
        return dto;
    }

    public Expense toEntity(ExpenseDTO dto) {
        if (dto == null) {
            return null;
        }
        Expense expense = new Expense();
        expense.setId(dto.getId());
        expense.setDepartment(dto.getDepartment());
        expense.setYear(dto.getYear());
        expense.setMonth(dto.getMonth());
        expense.setCategory(dto.getCategory());
        expense.setAmount(dto.getAmount());
        expense.setVersion(dto.getVersion());
        return expense;
    }
}
