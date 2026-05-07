@echo off
REM Flyway Quick Start Script for Windows
REM =======================================

echo.
echo ========================================
echo   HIR International - Flyway Setup
echo ========================================
echo.

REM Check if Flyway is installed
flyway -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Flyway is not installed or not in PATH
    echo.
    echo Please install Flyway:
    echo 1. Download from: https://flywaydb.org/download/community
    echo 2. Extract to C:\flyway
    echo 3. Add C:\flyway to your PATH
    echo.
    pause
    exit /b 1
)

echo [OK] Flyway is installed
echo.

REM Check if flyway.conf exists
if not exist "flyway.conf" (
    echo [ERROR] flyway.conf not found
    echo Please create flyway.conf with your database credentials
    echo.
    pause
    exit /b 1
)

echo [OK] flyway.conf found
echo.

REM Show menu
:menu
echo.
echo Select an option:
echo.
echo 1. Show migration status (info)
echo 2. Apply pending migrations (migrate)
echo 3. Validate migrations
echo 4. Baseline existing database
echo 5. Exit
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto info
if "%choice%"=="2" goto migrate
if "%choice%"=="3" goto validate
if "%choice%"=="4" goto baseline
if "%choice%"=="5" goto end

echo Invalid choice. Please try again.
goto menu

:info
echo.
echo ========================================
echo   Migration Status
echo ========================================
echo.
flyway info -configFiles=flyway.conf
echo.
pause
goto menu

:migrate
echo.
echo ========================================
echo   Applying Migrations
echo ========================================
echo.
echo WARNING: This will apply pending migrations to your database.
set /p confirm="Are you sure? (Y/N): "
if /i not "%confirm%"=="Y" goto menu

flyway migrate -configFiles=flyway.conf
echo.
if %errorlevel% equ 0 (
    echo [SUCCESS] Migrations applied successfully
) else (
    echo [ERROR] Migration failed
)
echo.
pause
goto menu

:validate
echo.
echo ========================================
echo   Validating Migrations
echo ========================================
echo.
flyway validate -configFiles=flyway.conf
echo.
if %errorlevel% equ 0 (
    echo [SUCCESS] Validation passed
) else (
    echo [ERROR] Validation failed
)
echo.
pause
goto menu

:baseline
echo.
echo ========================================
echo   Baseline Database
echo ========================================
echo.
echo This will baseline your existing database.
echo Use this only for existing databases that don't have Flyway history.
echo.
set /p confirm="Are you sure? (Y/N): "
if /i not "%confirm%"=="Y" goto menu

flyway baseline -configFiles=flyway.conf
echo.
if %errorlevel% equ 0 (
    echo [SUCCESS] Database baselined successfully
) else (
    echo [ERROR] Baseline failed
)
echo.
pause
goto menu

:end
echo.
echo Goodbye!
echo.
exit /b 0
