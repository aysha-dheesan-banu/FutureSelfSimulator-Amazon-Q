@echo off
echo Starting local DynamoDB...

rem Check if Docker is installed
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Docker is not installed or not in PATH. Please install Docker to use local DynamoDB.
    pause
    exit /b 1
)

rem Check if the container is already running
docker ps | findstr "dynamodb-local" >nul
if %ERRORLEVEL% EQU 0 (
    echo DynamoDB Local is already running.
) else (
    rem Check if the container exists but is stopped
    docker ps -a | findstr "dynamodb-local" >nul
    if %ERRORLEVEL% EQU 0 (
        echo Starting existing DynamoDB Local container...
        docker start dynamodb-local
    ) else (
        echo Creating and starting DynamoDB Local container...
        docker run -d --name dynamodb-local -p 8000:8000 amazon/dynamodb-local
    )
)

echo.
echo DynamoDB Local is running on http://localhost:8000
echo.
echo You can access the DynamoDB shell at: http://localhost:8000/shell/
echo.
echo Press any key to set up tables and sample data...
pause >nul

echo Setting up tables and sample data...
call npm run setup-local-db

echo.
echo Setup complete! Press any key to exit...
pause >nul