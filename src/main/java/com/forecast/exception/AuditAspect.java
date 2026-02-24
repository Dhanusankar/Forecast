package com.forecast.exception;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Aspect
@Component
@Slf4j
public class AuditAspect {

    @After("@annotation(auditLog)")
    public void auditLog(JoinPoint joinPoint, AuditLog auditLog) {
        String username = "ANONYMOUS";
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            username = authentication.getName();
        }

        String action = auditLog.action();
        String entity = auditLog.entity();
        String method = joinPoint.getSignature().getName();

        log.info("AUDIT [{}] User: {} | Entity: {} | Action: {} | Method: {} | Timestamp: {}",
                entity, username, entity, action, method, LocalDateTime.now());
    }
}
