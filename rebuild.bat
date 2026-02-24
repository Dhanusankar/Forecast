@echo off
cd C:\Users\dhanu_9ntujzt\OneDrive\Desktop\code_angular
echo Stopping any running Java processes...
tasklist | findstr /i java
echo.
echo Building with Maven...
call mvn clean package -DskipTests
echo.
echo Build complete. To run the backend:
echo mvn spring-boot:run
pause
