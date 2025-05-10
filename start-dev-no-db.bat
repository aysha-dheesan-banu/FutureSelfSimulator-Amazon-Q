@echo off
echo Starting FutureStimulus Development Environment (No DynamoDB)...

rem Set environment variables
set PORT=4000
set NODE_ENV=development
set SKIP_DYNAMODB=true

rem Kill any processes using port 4000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4000') do (
    echo Killing process %%a on port 4000
    taskkill /F /PID %%a 2>nul
)

rem Start the server
echo Starting server on port %PORT% with mock data...
npm run dev

pause